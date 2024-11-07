

import React, { useState } from 'react';
import { TextField, Button, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const SetOrderLimit = () => {
  const [hours, setHours] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleChange = (e) => {
    setHours(e.target.value);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const orderLimitData = { hours: parseInt(hours, 10) }; // Prepare data for the request

    try {
      const response = await axios.post('http://localhost:3002/api/order-limits/create', orderLimitData);
      console.log('Success:', response.data);
      setSnackbarMessage('Order limit set successfully!');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error setting time limit:', error);
      setSnackbarMessage('Error setting order limit. Please try again.');
      setSnackbarSeverity('error');
    } finally {
      setOpenSnackbar(true); // Open the snackbar to show the message
      setHours(''); // Clear the input field
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px' }}>
      <h2>Set Order Time Limit</h2>
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
        >
          Set Limit
        </Button>
      </form>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SetOrderLimit;
