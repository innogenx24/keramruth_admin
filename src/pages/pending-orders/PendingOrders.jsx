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
  const [expandedOrders, setExpandedOrders] = useState({}); // Track expanded orders

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
      setPendingOrders(allOrders.filter(order => order.status === 'Pending'));
      setCompletedOrders(
        allOrders.filter(order => order.status === 'Accepted' || order.status === 'Cancelled')
      );
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

      const response = await axios.post(
        apiEndpoint,
        { action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.message);

      // Refresh orders after the action
      fetchOrders();
    } catch (error) {
      console.error(`Error handling ${action}:`, error.response?.data || error.message);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders(prevState => ({
      ...prevState,
      [orderId]: !prevState[orderId], // Toggle expanded state
    }));
  };

  const renderTable = (title, orders, showStatus = false, isActionable = false) => (
    <TableContainer component={Paper} sx={{ marginTop: 4 }}>
      <Typography variant="h6" sx={{ padding: 2 }}>
        {title}
      </Typography>
      <Table aria-label={`${title} Table`}>
      <TableHead>
  <TableRow>
    <TableCell>No.</TableCell>
    <TableCell>Customer Name</TableCell>
    <TableCell>Total Order QTY</TableCell>
    <TableCell>Total Amount</TableCell>
    <TableCell>Product Details</TableCell>
    <TableCell>Order Date</TableCell>

    {showStatus && <TableCell>Status</TableCell>}
    {isActionable && <TableCell>Action</TableCell>}
  </TableRow>
</TableHead>
<TableBody>
  {orders.length === 0 ? (
    <TableRow>
      <TableCell colSpan={isActionable ? 6 : 5} align="center">
        No {title.toLowerCase()} available
      </TableCell>
    </TableRow>
  ) : (
    orders.map((order, index) => (
      <React.Fragment key={order.orderId}>
        <TableRow>
          <TableCell>{index + 1}</TableCell>
          <TableCell>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={order?.customerImage ? `${imageBaseURL}${order.customerImage}` : '/path/to/default-image.jpg'} // Fallback image if not available
              />
              <Typography style={{ marginLeft: "10px" }}>
                {order?.customerName}
              </Typography>
            </div>
          </TableCell>
          <TableCell>
            {/* Calculate total quantity from the OrderItems */}
            {order.OrderItems.reduce((total, item) => total + item.quantity, 0).toLocaleString()}
          </TableCell>
                  <TableCell>${parseFloat(order.totalAmount).toFixed(2)}</TableCell>
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
          year: 'numeric',  // e.g., 2024
          month: 'short',   // e.g., Nov
          day: 'numeric',   // e.g., 25
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
                   <Box sx={{ display: 'flex',}}>
                     <Button
                       variant="contained"
                       color="error"
                       size="small"
                       onClick={() => handleAction(order.orderId, 'reject')}
                       disabled={order.status !== 'Pending'}  // Disable if not pending
                     >
                       Reject
                     </Button>
                 
                     <Button
                       variant="contained"
                       color="success"
                       size="small"
                       onClick={() => handleAction(order.orderId, 'accept')}
                       disabled={order.status !== 'Pending'}  // Disable if not pending
                       sx={{ marginLeft: 1}}
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
                        <TableHead>
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
                              <div style={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={item?.productImage ? `${imageBaseURL}${item.productImage}` : '/path/to/default-image.jpg'} // Fallback image if not available
                      />
                      <Typography style={{ marginLeft: "10px" }}>
                        {item?.productName}
                      </Typography>
                    </div>

                              </TableCell>
                             
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{item.basePrice}</TableCell>

                              <TableCell>${parseFloat(item.finalPrice).toFixed(2)}</TableCell>
                             
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
  );

  return (
    <div>
      {renderTable('Pending Orders', pendingOrders, false, true)}
      {renderTable('Accepted and Cancelled Orders', completedOrders, true)}
    </div>
  );
};

export default OrderManagement;
