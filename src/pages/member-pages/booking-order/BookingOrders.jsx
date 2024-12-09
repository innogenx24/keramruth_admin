import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Modal, Typography, DialogContent, DialogActions } from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux"; // Import useSelector
import { useLocation } from "react-router-dom";
import AppLogo from "../../../assets/logo/AppLogo";

const BookingOrders = () => {
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [openPopup, setOpenPopup] = useState(false); // To control popup visibility
  const [orderConfirmation, setOrderConfirmation] = useState(false); // To display confirmation message
  const couponCode = "DISCOUNT2024"; // Example coupon code
  const imageBaseURL = "http://88.222.245.236:3002/uploads/";
  const { users } = useSelector((state) => state.users); // Fetch users from Redux store
  const userId = users?.id; // Get the user ID from the state.users object

  useEffect(() => {
    if (orderConfirmation) {
      const timer = setTimeout(() => {
        setOrderConfirmation(false); // Hide the confirmation message after 1 second
      }, 2 * 1000); // 1000ms = 1 second

      // Cleanup the timer when the component unmounts or when the message is hidden manually
      return () => clearTimeout(timer);
    }
  }, [orderConfirmation]);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token not found. Please log in.");
      return;
    }

    try {
      const response = await axios.get(
        "http://88.222.245.236:3002/products/user_product",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, quantity) => {
    setOrderItems((prevOrderItems) => {
      const updatedItems = prevOrderItems.filter(
        (item) => item.product_id !== productId
      );
      if (quantity > 0) {
        updatedItems.push({ product_id: productId, quantity });
      }
      return updatedItems;
    });
  };

  const incrementQuantity = (productId) => {
    setOrderItems((prevOrderItems) => {
      const updatedItems = [...prevOrderItems];
      const existingItem = updatedItems.find(item => item.product_id === productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        updatedItems.push({ product_id: productId, quantity: 1 });
      }
      return updatedItems;
    });
  };
  
  const decrementQuantity = (productId) => {
    setOrderItems((prevOrderItems) => {
      const updatedItems = [...prevOrderItems];
      const existingItem = updatedItems.find(item => item.product_id === productId);
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;  // Decrease quantity
        } else {
          // If quantity is 1, remove the item from the order
          return updatedItems.filter(item => item.product_id !== productId);
        }
      }
      return updatedItems;
    });
  };
  

  const handleConfirmOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token not found. Please log in.");
      return;
    }
  
    if (orderItems.length === 0) {
      alert("Please select products and set quantities before placing an order.");
      return;
    }
  
    // Calculate the total amount based on the order items and product prices
    const totalAmount = orderItems.reduce((total, item) => {
      const product = products.find((p) => p.id === item.product_id);
      if (product) {
        total += item.quantity * (product.super1 ?? product.originalPrice);
      }
      return total;
    }, 0).toFixed(2); // Round to 2 decimal places
  
    const orderData = {
      user_id: userId, // Ensure you're passing the correct user ID here
      items: orderItems,
      coupon_code: couponCode,
      total_amount: totalAmount, // Add the total amount
    };
  
    try {
      await axios.post("http://88.222.245.236:3002/orders/create-order", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrderConfirmation(true); // Show confirmation message
      setOrderItems([]); // Clear the selections after placing an order
      setOpenPopup(false); // Close the Order Summary popup
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to place the order.");
    }
  };
  
  const openOrderSummaryPopup = () => {
    setOpenPopup(true);
  };

  const closeOrderSummaryPopup = () => {
    setOpenPopup(false);
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <h1>Product List</h1>
      <div
        style={{
          overflowY: "scroll",
          height: "calc(100vh - 150px)", // Adjust height to accommodate header and button
          marginBottom: "10px",
        }}
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={`${imageBaseURL}${product.image}`}
                      alt={product.name}
                      style={{ width: "70px", height: "70px" }}
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
  {product.super1 ? (
    <>
      
      <span style={{ textDecoration: "line-through", color: "red", marginLeft: "5px" }}>
        {product.originalPrice} {/* Display original price with line-through */}
      </span>
      <span style={{ color: "green", fontWeight: "bold" }}>
        {product.super1} {/* Display offer price */}
      </span>
    </>
  ) : (
    <span>{product.originalPrice} {/* Only display original price if no offer price */}</span>
  )}
</TableCell>


                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => decrementQuantity(product.id)}
                        style={{ marginRight: "10px" }}
                      >
                        -
                      </Button>
                      <span>{orderItems.find(item => item.product_id === product.id)?.quantity || 0}</span>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => incrementQuantity(product.id)}
                        style={{ marginLeft: "10px" }}
                      >
                        +
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

{orderConfirmation && (
  <Box
    position="fixed"
    top="20%"
    left="50%"
    transform="translateX(-50%)"
    bgcolor="green"
    color="white"
    padding="10px 20px"
    borderRadius="5px"
  >
    Order placed successfully! <br />
    
  </Box>
)}


     {/* Order Summary Popup */}
<Modal open={openPopup} onClose={closeOrderSummaryPopup}>
  <Box
    sx={{
      position: "absolute",
      top: "20%",
      left: "50%",
      transform: "translate(-50%, -20%)",
      backgroundColor: "white",
      boxShadow: 24,
      borderRadius: "8px",
      overflow: "hidden",
      width: "500px",
      maxWidth: "95%",
    }}
  >
    <DialogContent>
     
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
          borderBottom: "1px solid #ddd",
        }}
      >
         <Typography
        variant="h6"
        sx={{ textAlign: "center", marginBottom: "20px", fontWeight: "bold" }}
      >
        Order Summary
      </Typography>
        <Box sx={{ height: "60px" }}>
  <AppLogo />
</Box>
      </Box>
      {/* Order Items */}
      {orderItems.map((item) => {
        const product = products.find((p) => p.id === item.product_id);
        return (
          <Box
            key={item.product_id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
              paddingBottom: "10px",
              borderBottom: "1px dashed #ccc",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                component="img"
                src={`${imageBaseURL}${product.image}`}
                alt={product?.name}
                sx={{ height: "50px", width: "50px", marginRight: "10px" }}
              />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {product?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product?.description || "Product details"}
                </Typography>
              </Box>
            </Box>
            <Box>
  <Typography variant="body2">
    ₹ {Number(product?.super1 || product?.originalPrice).toFixed(2)}
  </Typography>
  <Typography variant="body2" color="text.secondary">Qty: {item.quantity}</Typography>
</Box>

          </Box>
        );
      })}
      {/* Total Section */}
      <Box sx={{ marginTop: "20px", borderTop: "1px solid #ddd", paddingTop: "10px" }}>
        
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
           <Typography variant="body1" fontWeight="bold">Total Amount:</Typography>
           <Box
  sx={{
    display: "flex",
    flexDirection: "column", // Stack items vertically
    marginBottom: "10px",
  }}
>
  

  <Typography variant="body1">
    ₹
    {orderItems
      .reduce(
        (total, item) =>
          total +
          item.quantity *
            (products.find((p) => p.id === item.product_id)?.super1 ||
              products.find((p) => p.id === item.product_id)?.originalPrice ||
              0),
        0
      )
      .toFixed(2)}
  </Typography>
  <Typography variant="body1" color="text.secondary" >
    Qty : {orderItems.reduce((totalQty, item) => totalQty + item.quantity, 0)}
  </Typography>
</Box>

        </Box>
      </Box>
    </DialogContent>
    <DialogActions sx={{ justifyContent: "space-between", padding: "20px" }}>
      <Button onClick={closeOrderSummaryPopup} variant="outlined" color="secondary">
        Modify Order
      </Button>
      <Button onClick={handleConfirmOrder} variant="contained" color="primary">
        Confirm Order
      </Button>
    </DialogActions>
  </Box>
</Modal>


      <div
        style={{
          position: "fixed",
          bottom: 20,
          left: "60%",
          transform: "translateX(-50%)",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={openOrderSummaryPopup}
          style={{ width: "200px" }}
        >
          Book Order
        </Button>
      </div>
    </div>
  );
};

export default BookingOrders;
