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

  useEffect(() => {
    const fetchOrderLimits = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found");

        const response = await axios.get("http://88.222.245.236:3002/api/order-limits", {
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
          {/* <Button
            variant="contained"
            color="primary"
            onClick={handleAddTimeClick} // Button click handler for navigating to add-time
          >
            Add Time
          </Button> */}
        </div>
        <Table aria-label="Order Limit Table">
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Role</TableCell>

              <TableCell>Hours</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderLimits.map((limit, index) => (
              <TableRow key={limit.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{limit.role}</TableCell>

                <TableCell>{limit.hours}</TableCell>
                <TableCell>
                  {/* Edit Button */}
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
