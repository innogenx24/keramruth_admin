import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  IconButton,
  Button, // Import Button from MUI
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import EditButton from "../../assets/actions/EditButton.svg";

const OrderLimitsTable = () => {
  const [orderLimits, setOrderLimits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  useEffect(() => {
    const fetchOrderLimits = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found");

        // const response = await axios.get(`${API_END_POINT}/api/order-limits`, {
        const response = await axios.get(`${API_END_POINT}/order-limits`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrderLimits(response.data.data); // Set the fetched order limits
      } catch (err) {
        setError("Failed to fetch order limits"); // Handle error
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderLimits();
  }, []);
  const handleEditClick = (limit) => {
    // Navigate to the edit form with limit data as state
    navigate("edit-form", { state: { limit } });
  };

  const handleAddTimeClick = () => {
    // Navigate to the add-time route
    navigate("add-time");
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0 }}>Master / Set Order Time</h2>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddTimeClick} // Button click handler for navigating to add-time
          >
            Add Time
          </Button>
        </div>
        <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
          Masters / Set Role Order Timings
        </Typography>
        <Table aria-label="Order Limit Table">
          <TableHead sx={{ backgroundColor: '#DCDCDC' }}>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Days / Hours</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderLimits.map((limit, index) => (
              <TableRow key={limit.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{limit.role}</TableCell>
                <TableCell>
                  {limit.days} {limit.days > 1 ? 'Days' : 'Day'} {limit.hours} {limit.hours > 1 ? 'Hours' : 'Hour'}
                </TableCell>               
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(limit)}
                  >
                    <img
                      src={EditButton}
                      alt="Edit"
                      style={{
                        width: "30px",
                        height: "30px",
                        objectFit: "contain",
                        transform: "scale(1.5)",
                      }}
                    />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default OrderLimitsTable;
