import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { users } = useSelector((state) => state.users);
  const userId = users?.id; // Assuming the user ID is stored in the state.users object
  const roleId = users?.role_id; // Assuming the user's role_id is stored in the users object

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token not found. Please log in.");
      return;
    }

    // Fetch orders for the user
    axios
      .get(`http://88.222.245.236:3002/orders/get-order/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const sortedOrders = response.data.orders.sort((a, b) => b.id - a.id); // Sort orders by ID in descending order
        setOrders(sortedOrders);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, [userId]);

  // Handle row click to toggle product details
  const handleRowClick = (orderId) => {
    setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
  };

  const handleFeedbackClick = (order) => {
    const firstProduct = order.OrderItems[0];

    navigate(`/dashboard/place-orders/feedback/${order.id}`, {
      state: {
        productName: firstProduct.product.name,
        productImage: firstProduct.product.image,
        orderId: order.id,
        productId: firstProduct.product.id,
      },
    });
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
              <TableCell>No.</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Total Order Quantity</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Status</TableCell>
              {roleId === 6 && <TableCell>Feedback</TableCell>} {/* Conditional Rendering */}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order, index) => (
                <React.Fragment key={order.id}>
                  <TableRow
                    onClick={() => handleRowClick(order.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>Rs. {parseFloat(order.total_amount).toFixed(2)}</TableCell>
                    <TableCell>
                      {order.OrderItems.reduce(
                        (total, item) => total + item.quantity,
                        0
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell
                      sx={{
                        color:
                          order.status === "Accepted"
                            ? "green"
                            : order.status === "Cancelled"
                              ? "red"
                              : order.status === "Pending"
                                ? "orange"
                                : "black",
                      }}
                    >
                      {order.status}
                    </TableCell>
                    {roleId === 6 && ( // Only show Feedback button if role_id is 6
                      <TableCell>
                        {(order.status === "Accepted" || order.status === "Cancelled") && (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleFeedbackClick(order)}
                          >
                            Feedback
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>

                  {/* Product Details Collapse */}
                  <TableRow>
                    <TableCell colSpan={5} style={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Collapse in={selectedOrderId === order.id} timeout="auto" unmountOnExit>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Product Image</TableCell>
                              <TableCell>Product Name</TableCell>
                              <TableCell>Price</TableCell>
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
                                    style={{
                                      width: "80px",
                                      height: "auto",
                                      objectFit: "contain",
                                      border: "1px solid #ccc",
                                      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                                      borderRadius: "10px",
                                    }}
                                  />
                                </TableCell>
                                <TableCell>{item.product.name}</TableCell>
                                <TableCell>{item.baseprice}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
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
