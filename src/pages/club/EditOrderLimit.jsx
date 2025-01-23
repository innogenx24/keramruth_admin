import React, { useState, useEffect } from 'react';
import { TextField, Button, Snackbar, Alert, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const EditOrderLimit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { limit } = location.state || {};

  const [hours, setHours] = useState(limit ? limit.hours : '');
  const [days, setDays] = useState(limit ? limit.days : '');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const [errors, setErrors] = useState({
    hours: '',
    days: '',
  });
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  useEffect(() => {
    if (!limit) {
      navigate("/orders_time_set");
    }
  }, [limit, navigate]);

  const handleHoursChange = (e) => {
    const value = e.target.value;
    setHours(value);

    if (days === '0' && (value <= 0 || value > 24)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        hours: 'For 0 days, hours must be between 1 and 24',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        hours: '',
      }));
    }
  };


  const handleDaysChange = (e) => {
    setDays(e.target.value);
    if (e.target.value.trim() !== '') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        days: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
  
    if (days === '0') {
      if (!hours || hours < 1 || hours > 24) {
        newErrors.hours = 'Hours must be between 1 and 24.';
      }
    }
  
    if (days === '' || days < 0) {
      newErrors.days = 'Days must be at least 0.';
    } else if (days > 24) {
      newErrors.days = 'Days cannot exceed 24.';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    

    if (!validateForm()) {
      return;
    }

    try {
      await axios.put(`${API_END_POINT}/order-limits/${limit.id}`, { hours, days });
      setOpenSnackbar(true);
      setTimeout(() => navigate("/dashboard/orders_time_set"), 1500);
    } catch (error) {
      console.error('Failed to update order limit:', error);
      setErrorSnackbar(true);
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
          label="Enter Days"
          type="number"
          value={days}
          onChange={handleDaysChange}
          variant="outlined"
          fullWidth
          margin="normal"
          error={!!errors.days}
          helperText={errors.days}
        />

        <TextField
          label="Enter Hours (0-24)"
          type="number"
          value={hours}
          onChange={handleHoursChange}
          variant="outlined"
          fullWidth
          margin="normal"
          error={!!errors.hours}
          helperText={errors.hours}
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
