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
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_END_POINT_IMG } from "../../../constants/ApiConstant";

const FeedbackTable = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const token = localStorage.getItem("token");
  const { users } = useSelector((state) => state.users);
  const userId = users?.id;
  const userRole = users?.role_name;
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!token) {
        alert("Token not found. Please log in.");
        return;
      }

      try {
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
        setFilteredFeedbacks(response.data.feedbacks);
        setTotalRows(response.data.feedbacks.length);
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };

    fetchFeedbacks();
  }, [token, userId, userRole]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (query) {
      const filteredData = feedbacks.filter((feedback) =>
        feedback.product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredFeedbacks(filteredData);
      setTotalRows(filteredData.length);
    } else {
      setFilteredFeedbacks(feedbacks);
      setTotalRows(feedbacks.length);
    }
  };

  const renderPagination = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "right",
        alignItems: "center",
        gap: "15px",
      }}
    >
      <Button
        onClick={() => setPage(page - 1)}
        disabled={page === 0}
        variant="outlined"
      >
        Previous
      </Button>
      <Typography
        variant="body1"
        style={{ minWidth: "60px", textAlign: "center" }}
      >
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

  const currentFeedbacks = filteredFeedbacks.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  return (
    <Box padding={2}>
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Feedbacks
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <TextField
          label="Search Product Name"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          sx={{
            borderRadius: "20px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
            },
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#DCDCDC" }}>
            <TableRow style={{ whiteSpace: "nowrap" }}>
              <TableCell>No.</TableCell>
              <TableCell>User Details</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Comments</TableCell>
              <TableCell>Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Check if data is available */}
            {currentFeedbacks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  style={{ textAlign: "center", color: "#999" }}
                >
                  No Feedback Data Available
                </TableCell>
              </TableRow>
            ) : (
              currentFeedbacks.map((feedback, index) => (
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
                    <Box display="flex" alignItems="center">
                      {feedback.product.image && (
                        <img
                          src={`${API_END_POINT_IMG}/uploads/${feedback.product.image}`}
                          alt={feedback.product.name}
                          style={{
                            width: "60px",
                            height: "auto",
                            objectFit: "contain",
                            border: "1px solid #ccc",
                            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                            borderRadius: "10px",
                            marginRight: "10px",
                          }}
                        />
                      )}
                      <Typography>{feedback.product.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{feedback.order.order_id}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-IN").format(
                      Number(feedback.order.total_order_quantity)
                    )}
                  </TableCell>
                  <TableCell>
                    Rs{" "}
                    {new Intl.NumberFormat("en-IN").format(
                      feedback.order.total_amount || 0
                    )}
                  </TableCell>

                  <TableCell
                    sx={{
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                      overflow: "visible",
                      maxWidth: "none",
                      minWidth: "250px",
                    }}
                  >
                    {feedback.comments}
                  </TableCell>

                  <TableCell>
                    <Rating value={feedback.rating} precision={0.5} readOnly />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ marginTop: "10px" }}>{renderPagination()}</div>
    </Box>
  );
};

export default FeedbackTable;
