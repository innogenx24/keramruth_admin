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
  const [errors, setErrors] = useState({
    hours: '',
  });
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  useEffect(() => {
    if (!limit) {
      // If no limit data is passed, navigate back
      navigate("/orders_time_set");
    }
  }, [limit, navigate]);

  const handleChange = (e) => {
    setHours(e.target.value);
    // Reset error when user starts typing
    if (e.target.value.trim() !== '') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        hours: '',
      }));
    }
  };

  // Validate the form before submission
  const validateForm = () => {
    const newErrors = {};
    if (!hours || hours <= 0) {
      newErrors.hours = 'Please enter a valid time limit greater than 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before making the API call
    if (!validateForm()) {
      return; // If validation fails, do not proceed
    }

    try {
      // await axios.put(`${API_END_POINT}/api/order-limits/${limit.id}`, { hours });
      await axios.put(`${API_END_POINT}/order-limits/${limit.id}`, { hours });
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
          error={!!errors.hours} // Display error style if there's an error
          helperText={errors.hours} // Display error message
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
