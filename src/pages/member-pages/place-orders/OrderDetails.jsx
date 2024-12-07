import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Collapse, Box, Typography } from "@mui/material";

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token not found. Please log in.");
      return;
    }
  
    axios
      .get("http://88.222.245.236:3002/orders/get-order/608", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Sort orders by order_id in descending order
        const sortedOrders = response.data.orders.sort((a, b) => b.id - a.id);
        setOrders(sortedOrders);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, []);
  

  // Handle row click to toggle product details
  const handleRowClick = (orderId) => {
    setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Order Details
      </Typography>
      
      <TableContainer sx={{ maxHeight: 440, marginBottom: 2 }}>
        <Table stickyHeader aria-label="Order Details Table">
          <TableHead>
            <TableRow>
              <TableCell>Total Amount</TableCell>
              <TableCell>Total Order Quantity</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <React.Fragment key={order.id}>
                  <TableRow onClick={() => handleRowClick(order.id)} style={{ cursor: "pointer" }}>
                  <TableCell>Rs. {parseFloat(order.total_amount).toFixed(2)}</TableCell>
                  <TableCell>
                    {order.OrderItems.reduce(
                      (total, item) => total + item.quantity,
                      0
                    ).toLocaleString()}
                  </TableCell>                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell
                    sx={{
                      color:
                        order.status === 'Accepted'
                          ? 'green'
                          : order.status === 'Cancelled'
                          ? 'red'
                          : order.status === 'Pending'
                          ? 'orange'
                          : 'black',
                    }}
                  >
                    {order.status}
                  </TableCell>                  </TableRow>

                  {/* Product Details Collapse */}
                  <TableRow>
                    <TableCell colSpan={4} style={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Collapse in={selectedOrderId === order.id} timeout="auto" unmountOnExit>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Product Image</TableCell>
                              <TableCell>Product Name</TableCell>
                              <TableCell>Base Price</TableCell>
                              <TableCell>Quantity</TableCell>
                              <TableCell>Final Price</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {order.OrderItems.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <img
                                    src={`http://88.222.245.236:3002/uploads/${item.product.image}`}
                                    alt={item.product.name}
                                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                  />
                                </TableCell>
                                <TableCell>{item.product.name}</TableCell>
                                <TableCell>{item.baseprice}</TableCell>
                                <TableCell>{item.quantity} </TableCell>
                                <TableCell>{item.final_price}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default OrderDetails;
