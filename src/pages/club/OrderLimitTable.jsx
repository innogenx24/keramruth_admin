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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const OrderLimitsTable = () => {
  const [orderLimits, setOrderLimits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchOrderLimits = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/order-limits');
        setOrderLimits(response.data.data);
      } catch (err) {
        setError('Failed to fetch order limits');
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
         
        </div>
        <Table aria-label="Order Limit Table">
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Hours</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderLimits.map((limit, index) => (
              <TableRow key={limit.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{limit.hours}</TableCell>
                <TableCell>
                  <IconButton color="secondary" onClick={() => handleEditClick(limit)}>
                    <EditIcon />
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
