import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Box,
  Typography,
  Rating,
} from "@mui/material";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { API_END_POINT_IMG } from "../../../constants/ApiConstant";

const FeedbackTable = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const token = localStorage.getItem("token"); // Retrieve token from localStorage
  const { users } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const userId = users?.id; // Assuming the user ID is stored in the state.users object
  const userRole = users?.role_name;
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;


  // Fetch feedbacks on component mount
  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!token) {
        alert("Token not found. Please log in.");
        return;
      }

      try {
        // Determine API endpoint based on user role
        const apiEndpoint =
          userRole === "Admin"
            ? `${API_END_POINT}/feedback/hierarchy`
            : `${API_END_POINT}/feedback/hierarchy/${userId}`;

        const response = await axios.get(apiEndpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFeedbacks(response.data.feedbacks);
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };

    fetchFeedbacks();
  }, [token, userId, userRole]);


  return (
    <Box padding={2}>
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Feedbacks
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#DCDCDC" }}>
            <TableRow>
              <TableCell>No.</TableCell>

              <TableCell>User Details</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Booked Date</TableCell>
              <TableCell>Delivered Date</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Comments</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedbacks.map((feedback, index) => (
              <TableRow key={feedback.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={
                        feedback.user.image
                          ? `${API_END_POINT_IMG}/uploads/${feedback.user.image}`
                          : undefined
                      }
                      alt={feedback.user.full_name}
                      style={{ marginRight: "10px" }}
                    />
                    <Typography>{feedback.user.full_name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {feedback.order.order_id}
                </TableCell>

                <TableCell>
                  {Number(feedback.order.total_order_quantity).toString()}
                </TableCell>
                <TableCell>
                  {new Date(feedback.order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(feedback.feedback_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  Rs {new Intl.NumberFormat('en-IN').format(feedback.order.total_amount || 0)}
                </TableCell>
                <TableCell>
                  <Rating value={feedback.rating} precision={0.5} readOnly />
                </TableCell>
                <TableCell>{feedback.comments}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FeedbackTable;
