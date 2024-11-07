// EditOrderLimit.js
import React, { useState, useEffect } from 'react';
import { TextField, Button, Snackbar, Alert, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const EditOrderLimit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { limit } = location.state || {}; // Get the limit data from navigation state

  const [hours, setHours] = useState(limit ? limit.hours : ''); // Prefill with existing hours
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);

  useEffect(() => {
    if (!limit) {
      // If no limit data is passed, navigate back
      navigate("/orders_time_set");
    }
  }, [limit, navigate]);

  const handleChange = (e) => {
    setHours(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3002/api/order-limits/${limit.id}`, { hours });
      setOpenSnackbar(true); // Show success message
      setTimeout(() => navigate("/dashboard/orders_time_set"), 1500); // Redirect after a short delay
    } catch (error) {
      console.error('Failed to update order limit:', error);
      setErrorSnackbar(true); // Show error message
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorSnackbar(false);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 3, mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Update Order Time Limit
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Time Limit (hours)"
          type="number"
          value={hours}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          margin="normal"
          required
        />
        <Button 
          variant="contained" 
          color="primary" 
          type="submit" 
          fullWidth
          sx={{ mt: 2 }}
        >
          Update Limit
        </Button>
      </form>
      
      {/* Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Order limit updated successfully!
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={errorSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          Failed to update order limit. Please try again.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditOrderLimit;
