import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
} from "@mui/material";
import axios from "axios";

const BookingOrders = () => {
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const user_id = 608; // Example user ID (can be dynamic)
  const couponCode = "DISCOUNT2024"; // Example coupon code
  const imageBaseURL = "http://88.222.245.236:3002/uploads/";

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
      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      }
      return updatedItems;
    });
  };

  const createOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token not found. Please log in.");
      return;
    }

    if (orderItems.length === 0) {
      alert("Please select products and set quantities before placing an order.");
      return;
    }

    const orderData = {
      user_id: user_id,
      items: orderItems,
      coupon_code: couponCode,
    };

    try {
      await axios.post("http://88.222.245.236:3002/orders/create-order", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Order placed successfully!");
      setOrderItems([]); // Clear the selections after placing an order
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to place the order.");
    }
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
                <TableCell>Price (super1)</TableCell>
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
                  <TableCell>{product.super1}</TableCell>
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
          onClick={createOrder}
          style={{ width: "200px" }}
        >
          Book Order
        </Button>
      </div>
    </div>
  );
};

export default BookingOrders;
