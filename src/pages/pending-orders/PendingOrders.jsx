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
} from '@mui/material';
import axios from 'axios';

const imageBaseURL = "http://88.222.245.236:3002/uploads/";

const OrderManagement = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [pendingPage, setPendingPage] = useState(0);
  const [completedPage, setCompletedPage] = useState(0);
  const rowsPerPage = 10;

  const API_URL = 'http://88.222.245.236:3002/orders/get-order-request';

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
  
      // Filter and sort pending orders by createdAt in descending order
      const sortedPendingOrders = allOrders
      .filter(order => order.status === 'Pending')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
  
      setPendingOrders(sortedPendingOrders);
  
      // Sort completed orders by updatedAt in descending order
      const sortedCompletedOrders = allOrders
        .filter(order => order.status === 'Accepted' || order.status === 'Cancelled')
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Ensure descending order by updatedAt
      setCompletedOrders(sortedCompletedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  
  

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAction = async (orderId, action) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }

    try {
      const apiEndpoint = `http://88.222.245.236:3002/orders/order/${orderId}`;
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
    } catch (error) {
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
        Page {page + 1}
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
  

  const renderTable = (title, orders, page, setPage, showStatus = false, isActionable = false) => (
    <div>
      <Typography variant="h6" >
        {title}
      </Typography>
      <TableContainer component={Paper} sx={{ marginTop: 4,maxHeight: '500px', overflowY: 'auto' }}>
      
      <Table stickyHeader aria-label={`${title} Table`}>
        <TableHead>
          <TableRow>
            <TableCell>No.</TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell>Total Order QTY</TableCell>
            <TableCell>Total Amount</TableCell>
            <TableCell>Product Details</TableCell>
            <TableCell>Order Date</TableCell>
            {showStatus && <TableCell>Order Status</TableCell>}
            {isActionable && <TableCell>Action</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isActionable ? 7 : 6} align="center">
                No {title.toLowerCase()} available
              </TableCell>
            </TableRow>
          ) : (
            orders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order, index) => (
                <React.Fragment key={order.orderId}>
                  <TableRow>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
  <div style={{ display: "flex", alignItems: "center" }}>
    <Avatar
      src={order?.customer?.image ? `${imageBaseURL}${order.customer.image}` : '/path/to/default-image.jpg'}
      alt={order?.customer?.name}
    />
    <Typography style={{ marginLeft: "10px" }}>
      {order?.customer?.name || 'Unknown'}
    </Typography>
  </div>
</TableCell>
                    <TableCell>
                      {order.OrderItems.reduce((total, item) => total + item.quantity, 0).toLocaleString()}
                    </TableCell>
                    <TableCell>Rs. {parseFloat(order.totalAmount).toFixed(2)}</TableCell>
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
                        <TableHead sx={{backgroundColor: "#D3D3D3" }}>
                          <TableRow>
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
  {order.OrderItems.map((item, idx) => (
    <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
      <Avatar
        src={item.product?.image ? `${imageBaseURL}${item.product.image}` : '/path/to/default-image.jpg'}
        alt={item.product?.name}
        style={{ marginRight: '10px' }}
      />
      <Typography>{item.product?.name || 'Unknown Product'}</Typography>
    </div>
  ))}
</TableCell>
                             
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>Rs. {item.basePrice}</TableCell>

                              <TableCell>Rs. {parseFloat(item.finalPrice).toFixed(2)}</TableCell>
                             
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
    <div style={{marginTop:"10px"}}>
    {renderPagination(page, setPage, orders.length)}

    </div>

    </div>
  );

  return (
    <div>
      {renderTable('Pending Orders', pendingOrders, pendingPage, setPendingPage, false, true)}
      {renderTable('Accepted and Cancelled Orders', completedOrders, completedPage, setCompletedPage, true)}
    </div>
  );
};

export default OrderManagement;
