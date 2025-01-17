import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Card, CardContent, Avatar, Rating } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_END_POINT_IMG } from "../../../constants/ApiConstant";
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // For the green circle checkmark icon

const FeedbackComponent = () => {
  const { state } = useLocation(); // Get the passed state
  const { productName, productImage, orderId, productId } = state || {}; // Destructure necessary data
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [errorMessage, setErrorMessage] = useState(""); // To store error messages
  const [isSubmitted, setIsSubmitted] = useState(false); // State to track feedback submission
  const { users } = useSelector((state) => state.users);
  const userId = users?.id; // Assuming the user ID is stored in the state.users object
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;
  const navigate = useNavigate(); // Hook for navigation
  
  const handleSubmit = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token not found. Please log in.");
      return;
    }

    const feedbackData = {
      user_id: userId,
      order_id: orderId,
      product_id: productId,
      rating,
      comments: feedback,
    };

    axios
      .post(`${API_END_POINT}/feedback/create`, feedbackData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Feedback submitted successfully:", response.data);
        setIsSubmitted(true); // Set submitted state to true
        setFeedback(""); // Clear feedback text
        setRating(0); // Reset rating
        
        setTimeout(() => {
          navigate("/dashboard/place-orders");
        }, 3000);
      })
      .catch((error) => {
        console.error("Error submitting feedback:", error);
        if (error.response && error.response.data && error.response.data.message) {
          const message = error.response.data.message;
          if (message === "Feedback already submitted for this order.") {
            setErrorMessage("You have already submitted feedback for this product.");
          } else {
            setErrorMessage("Failed to submit feedback. Please try again.");
          }
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      });
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
      <Card sx={{ width: "100%", maxWidth: 500 }}>
        <CardContent>
          {isSubmitted ? (
            <Box display="flex" flexDirection="column" alignItems="center">
              <CheckCircleIcon sx={{ fontSize: 80, color: "#00b74a", marginBottom: 2 }} />
              <Typography variant="h6" textAlign="center" gutterBottom>
                Thank you for your feedback!
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="h6" textAlign="center" gutterBottom>
                Provide Feedback
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                <Avatar
                  alt={productName || "Product Image"}
                  src={`${API_END_POINT_IMG}/uploads/${productImage}`}
                  sx={{ width: 64, height: 64, marginRight: 2 }}
                />
                <Typography variant="body1" fontWeight="bold">
                  {productName || "Product Name"}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="center" mb={2}>
                <Rating
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                  precision={0.5}
                  required
                />
              </Box>
              <TextField
                multiline
                rows={4}
                placeholder="Provide your feedback"
                fullWidth
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                sx={{ marginBottom: 2 }}
                required
              />
              {errorMessage && (
                <Typography color="error" variant="body2" align="center" sx={{ marginBottom: 2 }}>
                  {errorMessage}
                </Typography>
              )}
              <Button
                variant="contained"
                fullWidth
                sx={{ backgroundColor: "#00b74a", color: "white" }}
                onClick={handleSubmit}
              >
                Submit Review
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default FeedbackComponent;
