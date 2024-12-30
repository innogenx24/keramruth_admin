import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const CustomerDashboard = () => {
  const { memberID } = useParams();  // Fetch memberID from URL
  const [customer, setCustomer] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [lastOrderDate, setLastOrderDate] = useState("");
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;
  useEffect(() => {
    // Fetch customer details using the memberID
    const fetchCustomerData = async () => {
      try {
        const response = await fetch(`${API_END_POINT}/api/user/customer-deatils/${memberID}`);
        if (!response.ok) {
          throw new Error("Failed to fetch customer data");
        }
        const data = await response.json();
        setCustomer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch order data using the memberID
    const fetchOrdersData = async () => {
      try {
        const response = await fetch(`${API_END_POINT}/orders/get-orders/${memberID}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order data");
        }
        const data = await response.json();

        // Set the recent bookings (last order) and order history
        if (data.orders && data.orders.length > 0) {
          const lastOrder = data.orders[0];  // Assuming the latest order is at index 0
          const orderItems = lastOrder.OrderItems.map(item => ({
            product: item.product.name,
            qty: item.quantity,
            price: item.final_price,
            productImage: item.product.image,
          }));
          setRecentBookings(orderItems);

          const formattedDate = new Date(lastOrder.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).replace(/ /g, "-");
          setHistory(data.orders.map(order => ({
            date: new Date(order.createdAt).toLocaleDateString(),
            product: order.OrderItems.map(item => `${item.quantity} x ${item.product.name}`).join(", "),
          })));

          const totalOrders = data.orders.length;
          setTotalOrders(totalOrders);

          setLastOrderDate(formattedDate);

        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCustomerData();
    fetchOrdersData();
  }, [memberID]);

  if (loading) {
    return (
      <Box p={3} display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!customer) {
    return (
      <Box p={3}>
        <Typography>No customer data available</Typography>
      </Box>
    );
  }

  return (
    <Box p={3} display="flex" flexDirection="column" gap={2}>
      {/* Customer Details */}
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={2} display="flex" justifyContent="center">
                  <Avatar
                    alt={customer.full_name}
                    src={`${API_END_POINT}/uploads/${customer.image}`}
                    sx={{
                      width: 100,
                      height: 100,
                      border: '2px solidrgb(64, 66, 66)',
                      boxShadow: '0px 4px 10px hsla(152, 5.60%, 54.30%, 0.50)',
                    }}
                  />

                </Grid>
                <Grid item xs={12} sm={10}>
                  <Typography variant="h6" style={{ fontWeight: "bold" }}>{customer.full_name}</Typography>
                  <Typography variant="subtitle1">ID: {customer.id}</Typography>
                  <Typography variant="body2">Role: {customer.role_name}</Typography>
                  <Typography variant="body2">
                    Address: {customer.street_name}, {customer.building_no_name}, {customer.city}, {customer.district}, {customer.state},{customer.pincode}.
                  </Typography>

                  <Typography variant="body2">Mobile No: {customer.mobile_number}</Typography>
                  <Typography variant="body2">Email ID: {customer.email}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} textAlign="right">
              <Typography variant="body2">
                Joined: {new Date(customer.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                Total Booked: {totalOrders}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <Card style={{ padding: "16px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
        <CardContent>
          <Typography
            variant="h6"
            style={{ textAlign: "center", color: "#007b55", fontWeight: "bold" }}
          >
            Recent Bookings
          </Typography>

          <Typography style={{ textAlign: "center", fontSize: "15px" }}>
            {lastOrderDate} Last Booking
          </Typography>

          <Grid container spacing={2} style={{ marginTop: "16px" }} justifyContent="center">
            {recentBookings.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card variant="outlined" style={{ backgroundColor: "#ffffff" }}>
                  <CardContent>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img
                        src={`${API_END_POINT}/uploads/${item.productImage || "placeholder.png"}`}
                        style={{
                          width: "80px",
                          height: "auto",
                          objectFit: "contain",
                          border: "1px solid #ccc",
                          boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                          borderRadius: "10px",
                        }}
                        alt="Product"
                      />
                      <div style={{ textAlign: "center" }}>
                        <Typography variant="body1" style={{ fontWeight: "bold" }}>
                          {item.product || "Product Name Not Available"}
                        </Typography>
                        <Typography variant="body2" style={{ color: "#555" }}>
                          Qty: {item.qty}
                        </Typography>
                        <Typography variant="body2" style={{ color: "#007b55", fontWeight: "bold" }}>
                          ₹ {item.qty && item.price ? (parseFloat(item.price) / item.qty).toFixed(2) : "N/A"}
                        </Typography>

                      </div>
                    </div>
                  </CardContent>
                </Card>

              </Grid>
            ))}
          </Grid>
          <Typography
            mt={2}
            variant="h6"
            style={{ textAlign: "center", marginTop: "16px", fontWeight: "bold" }}
          >
            Total Amount: ₹ {recentBookings.reduce((total, item) => total + parseFloat(item.price || 0), 0).toFixed(2)}
          </Typography>
        </CardContent>
      </Card>

      {/* Booking History */}
      <Card>
        <CardContent>
          <Typography variant="h6">Booking History</Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.product}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant="text" sx={{ mt: 2 }}>
            See More
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CustomerDashboard;
