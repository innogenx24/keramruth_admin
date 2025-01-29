import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  TextField
} from '@mui/material';
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import { API_END_POINT_IMG } from '../../../constants/ApiConstant';

const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

const imageBaseURL = `${API_END_POINT_IMG}/uploads/`;

const GetOrderDetailsbasedOnLowhiriracy = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [pendingPage, setPendingPage] = useState(0);
  const [completedPage, setCompletedPage] = useState(0);
  const rowsPerPage = 10;
  const { users } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const userId = users?.id; // Assuming the user ID is stored in the state.users object
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error'); // Default severity
  const [pendingSearch, setPendingSearch] = useState('');
  const [completedSearch, setCompletedSearch] = useState('');


  const API_URL = `${API_END_POINT}/orders/get-order-request/${userId}`;

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }

    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const allOrders = response.data.orders || [];

      // Filter and sort pending orders in descending order by `createdAt`
      const sortedPendingOrders = allOrders
        .filter(order => order.status === 'Pending')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPendingOrders(sortedPendingOrders);

      // Filter and sort completed orders
      const sortedCompletedOrders = allOrders
        .filter(order => order.status === 'Accepted' || order.status === 'Cancelled')
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setCompletedOrders(sortedCompletedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };


  useEffect(() => {
    fetchOrders();
  }, []);


  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSearchPendingOrders = (e) => {
    setPendingSearch(e.target.value);
  };

  const handleSearchCompletedOrders = (e) => {
    setCompletedSearch(e.target.value);
  };



  const handleAction = async (orderId, action) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }

    try {
      const apiEndpoint = `${API_END_POINT}/orders/order/${orderId}`;
      await axios.post(
        apiEndpoint,
        { action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrders();
      setSnackbarMessage('Action completed successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);

      console.error(`Error handling ${action}:`, error.response?.data || error.message);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prevState) => {
      // This ensures only one order can be expanded at a time
      if (prevState[orderId]) {
        // If the order is already expanded, collapse it
        return { ...prevState, [orderId]: false };
      }
      // Collapse all orders and then expand the selected one
      const newExpandedState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = false; // Collapse all orders
        return acc;
      }, {});
      newExpandedState[orderId] = true; // Expand the clicked order
      return newExpandedState;
    });
  };


  const renderPagination = (page, setPage, orders) => {
    const filteredOrders = filterOrders(orders, page === 'pending' ? pendingSearch : completedSearch);
    const totalFilteredRows = filteredOrders.length;

    const canGoNext = totalFilteredRows > rowsPerPage;  // Only allow next if there are more than rowsPerPage
    const canGoPrev = page > 0;  // You can go back if you're not on the first page

    return (
      <div style={{ display: "flex", justifyContent: "right", alignItems: "center", gap: "15px" }}>
        <Button
          onClick={() => setPage(page - 1)}
          disabled={!canGoPrev}
          variant="outlined"
        >
          Previous
        </Button>
        <Typography variant="body1" style={{ minWidth: "60px", textAlign: "center" }}>
          Page {page + 1}
        </Typography>
        <Button
          onClick={() => setPage(page + 1)}
          disabled={!canGoNext || page >= Math.ceil(totalFilteredRows / rowsPerPage) - 1}
          variant="outlined"
        >
          Next
        </Button>
      </div>
    );
  };


  const renderTable = (title, orders, page, setPage, showStatus = false, isActionable = false) => {
    const filteredOrders = filterOrders(orders, title === "Pending Orders" ? pendingSearch : completedSearch);
    const totalFilteredRows = filteredOrders.length;

    return (
      <div>
        <Typography variant="h6">
          {title}
        </Typography>
        <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
          <TextField
            label="Search Name or Order-Id"
            variant="outlined"
            value={title === "Pending Orders" ? pendingSearch : completedSearch}
            onChange={title === "Pending Orders" ? handleSearchPendingOrders : handleSearchCompletedOrders}
            sx={{
              borderRadius: "20px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
            }}
          />
        </Box>

        <TableContainer component={Paper} sx={{ marginTop: 4, maxHeight: '500px', overflowY: 'auto' }}>

          <Table stickyHeader aria-label={`${title} Table`}>
            <TableHead sx={{ backgroundColor: "#DCDCDC" }}>
              <TableRow style={{ whiteSpace: 'nowrap' }}>
                <TableCell sx={{ backgroundColor: "#DCDCDC" }}>No.</TableCell>
                <TableCell sx={{ backgroundColor: "#DCDCDC" }}>Customer Name</TableCell>
                <TableCell sx={{ backgroundColor: "#DCDCDC" }}>Order ID</TableCell>
                <TableCell sx={{ backgroundColor: "#DCDCDC" }}>Total Order QTY</TableCell>
                <TableCell sx={{ backgroundColor: "#DCDCDC" }}>Total Amount</TableCell>
                <TableCell sx={{ backgroundColor: "#DCDCDC" }}>Product Details</TableCell>
                <TableCell sx={{ backgroundColor: "#DCDCDC" }}>Order Date</TableCell>
                {showStatus && <TableCell sx={{ backgroundColor: "#DCDCDC" }}>Order Status</TableCell>}
                {isActionable && <TableCell sx={{ backgroundColor: "#DCDCDC" }}>Action</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {totalFilteredRows === 0 ? (
                <TableRow>
                  <TableCell colSpan={isActionable ? 7 : 6} align="center">
                    No {title.toLowerCase()} available
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order, index) => (
                    <React.Fragment key={order.orderId}>
                      <TableRow>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              src={order?.customerImage ? `${imageBaseURL}${order.customerImage}` : '/path/to/default-image.jpg'}
                            />
                            <Typography style={{ marginLeft: "10px" }}>
                              {order?.customerName}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell>{order.orderUniqueId}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('en-IN').format(order.totalOrderQuantity)}
                        </TableCell>
                        <TableCell>
                          Rs. {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(order.totalAmount)}
                        </TableCell>

                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => toggleOrderDetails(order.orderId)}
                          >
                            {expandedOrders[order.orderId] ? 'Hide Details' : 'Show Details'}
                          </Button>
                        </TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </TableCell>
                        {showStatus && (
                          <TableCell
                            sx={{
                              color: order.status === 'Accepted' ? 'green' : order.status === 'Cancelled' ? 'red' : 'black',
                            }}
                          >
                            {order.status}
                          </TableCell>
                        )}
                        {isActionable && (
                          <TableCell>
                            <Box sx={{ display: 'flex' }}>
                              <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() => handleAction(order.orderId, 'reject')}
                                disabled={order.status !== 'Pending'}
                              >
                                Reject
                              </Button>
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => handleAction(order.orderId, 'accept')}
                                disabled={order.status !== 'Pending'}
                                sx={{ marginLeft: 1 }}
                              >
                                Accept
                              </Button>
                            </Box>
                          </TableCell>
                        )}
                      </TableRow>
                      {expandedOrders[order.orderId] && (
                        <TableRow>
                          <TableCell colSpan={6}>
                            <Table>
                              <TableHead sx={{ backgroundColor: "#D3D3D3" }}>
                                <TableRow style={{ whiteSpace: 'nowrap' }}>
                                  <TableCell>No.</TableCell>

                                  <TableCell>Product Name</TableCell>
                                  <TableCell>Quantity</TableCell>
                                  <TableCell>Base Price</TableCell>
                                  <TableCell>Final Price</TableCell>

                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {order.OrderItems.map((item, itemIndex) => (
                                  <TableRow key={item.itemId}>
                                    <TableCell>{itemIndex + 1}</TableCell>
                                    <TableCell>
                                      <div style={{ display: "flex", alignItems: "center" }}>
                                        <img
                                          src={item?.productImage ? `${imageBaseURL}${item.productImage}` : '/path/to/default-image.jpg'}
                                          alt={item?.productName || "Product Image"}
                                          style={{
                                            width: "80px",
                                            height: "auto",
                                            objectFit: "contain",
                                            border: "1px solid #ccc",
                                            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                                            borderRadius: "10px",
                                          }}
                                        />
                                        <Typography style={{ marginLeft: "10px" }}>
                                          {item?.productName || "No Name Available"}
                                        </Typography>
                                      </div>
                                    </TableCell>


                                    <TableCell>
                                      {new Intl.NumberFormat('en-IN').format(item.quantity)}
                                    </TableCell>
                                    <TableCell>
                                      Rs. {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(item.basePrice)}
                                    </TableCell>
                                    <TableCell>
                                      Rs. {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(parseFloat(item.finalPrice).toFixed(2))}
                                    </TableCell>

                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <div style={{ marginTop: "10px" }}>
          {renderPagination(page, setPage, orders)}

        </div>

      </div>
    );
  };


  const filterOrders = (orders, searchValue) => {
    if (!searchValue) return orders; // Return all orders if there's no search value

    const lowercasedSearchValue = searchValue.toLowerCase();

    return orders.filter((order) => {
      // Convert orderUniqueId to string to avoid type issues and ensure it's a string before calling toLowerCase
      const orderIdMatch = String(order.orderUniqueId).toLowerCase().includes(lowercasedSearchValue);

      const customerNameMatch = order.customerName?.toLowerCase().includes(lowercasedSearchValue);

      return customerNameMatch || orderIdMatch;
    });
  };




  return (
    <div>
      {renderTable('Pending Orders', pendingOrders, pendingPage, setPendingPage, false, true)}
      {renderTable('Accepted and Cancelled Orders', completedOrders, completedPage, setCompletedPage, true)}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default GetOrderDetailsbasedOnLowhiriracy;
