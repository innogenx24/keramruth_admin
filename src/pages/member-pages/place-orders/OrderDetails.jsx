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
import { API_END_POINT_IMG } from "../../../constants/ApiConstant";

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { users } = useSelector((state) => state.users);
  const userId = users?.id; // Assuming the user ID is stored in the state.users object
  const roleId = users?.role_id; // Assuming the user's role_id is stored in the users object
  const [page, setPage] = useState(0); // Current page state
  const [rowsPerPage] = useState(10);
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token not found. Please log in.");
      return;
    }

    // Fetch orders for the user
    axios
      .get(`${API_END_POINT}/orders/get-order/${userId}`, {
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

  const handleFeedbackClick = (order, product) => {
    if (product) {
      navigate(`/dashboard/place-orders/feedback/${order.id}/${product.id}`, {
        state: {
          productName: product.name,
          productImage: product.image,
          orderId: order.id,
          productId: product.id,
        },
      });
    } else {
      // No product found
      console.log("No product found in this order:", order);
      alert("No product found in this order.");
    }
  };




  const renderPagination = (page, setPage, totalRows) => (
    <div style={{ display: "flex", justifyContent: "right", alignItems: "center", gap: "15px" }}>
      <Button
        onClick={() => setPage(page - 1)}
        disabled={page === 0}
        variant="outlined"
      >
        Previous
      </Button>
      <Typography variant="body1" style={{ minWidth: "60px", textAlign: "center" }}>
        Page {page + 1} of {Math.ceil(totalRows / rowsPerPage)}
      </Typography>
      <Button
        onClick={() => setPage(page + 1)}
        disabled={page >= Math.ceil(totalRows / rowsPerPage) - 1}
        variant="outlined"
      >
        Next
      </Button>
    </div>
  );

  const paginatedOrders = orders.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <div>
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Order Details
      </Typography>

      <TableContainer sx={{ maxHeight: 440, marginBottom: 2 }}>
        <Table stickyHeader aria-label="Order Details Table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '	#DCDCDC' }}>No.</TableCell>
              <TableCell sx={{ backgroundColor: '#DCDCDC' }}>Order ID</TableCell>
              <TableCell sx={{ backgroundColor: '#DCDCDC' }}>Total Amount</TableCell>
              <TableCell sx={{ backgroundColor: '#DCDCDC' }}>Total Order Quantity</TableCell>
              <TableCell sx={{ backgroundColor: '#DCDCDC' }}>Order Date</TableCell>
              <TableCell sx={{ backgroundColor: '#DCDCDC' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>


            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              paginatedOrders.map((order, index) => (
                <React.Fragment key={order.id}>
                  <TableRow
                    onClick={() => handleRowClick(order.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{order.order_id}</TableCell>
                    <TableCell>
                      Rs. {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(parseFloat(order.total_amount).toFixed(2))}
                    </TableCell>

                    <TableCell>
                      {new Intl.NumberFormat('en-IN').format(
                        order.OrderItems?.reduce((total, item) => total + item.quantity, 0)
                      ) || "0"}
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
                  </TableRow>

                  {/* Product Details Collapse */}
                  <TableRow>
                    <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Collapse in={selectedOrderId === order.id} timeout="auto" unmountOnExit>
                        <Table size="small">
                          <TableHead
                            sx={{
                              backgroundColor: '	#DCDCDC',
                              position: 'sticky',
                              top: 0,
                              zIndex: 1,
                            }}
                          >
                            <TableRow>
                              <TableCell>Product Image</TableCell>
                              <TableCell>Product Name</TableCell>
                              <TableCell>Price</TableCell>
                              <TableCell>Quantity</TableCell>
                              <TableCell>Final Price</TableCell>
                              {roleId === 6 && order.status !== "Pending" && <TableCell>Feedback</TableCell>}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {order.OrderItems?.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <img
                                    src={`${API_END_POINT_IMG}/uploads/${item.product.image}`}
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
                                <TableCell>{new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.baseprice)}</TableCell>
                                <TableCell>
                                  {new Intl.NumberFormat('en-IN').format(item.quantity)}
                                </TableCell>
                                <TableCell>{new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.baseprice * item.quantity)}</TableCell>
                                {roleId === 6 && (
                                  <TableCell>
                                    {(order.status === "Accepted" || order.status === "Cancelled") && (
                                      <Button
                                        variant="contained"
                                        style={{ backgroundColor: 'green', color: 'white' }}
                                        size="small"
                                        onClick={() => handleFeedbackClick(order, item.product)}
                                      >
                                        Feedback
                                      </Button>
                                    )}
                                  </TableCell>

                                )}
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

      <div style={{ marginTop: "10px" }}>
        {renderPagination(page, setPage, orders.length)}
      </div>
    </div>
  );
};

export default OrderDetails;
