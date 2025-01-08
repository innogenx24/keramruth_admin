import React, { useState } from 'react';
import { TextField, Button, Snackbar, Alert, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

const roles = [
  { label: "Area Development Officer (ADO)", value: "Area Development Officer" },
  { label: "Master Distributor (MD)", value: "Master Distributor" },
  { label: "Super Distributor (SD)", value: "Super Distributor" },
  { label: "Distributor", value: "Distributor" },
];

const SetOrderLimit = () => {
  const [hours, setHours] = useState('');
  const [selectedRole, setSelectedRole] = useState(''); // New state for selected role
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  const handleChangeHours = (e) => {
    setHours(e.target.value);
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value); // Update selected role
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check that both fields are valid before submitting
    if (!selectedRole || !hours) {
        setSnackbarMessage('Please select a role and enter hours');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
    }

    console.log('Sending data to backend:', { hours, role: selectedRole });

    const orderLimitData = { hours: parseInt(hours, 10), role: selectedRole };

    try {
        // const response = await axios.post(`${API_END_POINT}/api/order-limits/create`, orderLimitData);
        const response = await axios.post(`${API_END_POINT}/order-limits/create`, orderLimitData);
        console.log('Success:', response.data);
        setSnackbarMessage('Order limit set successfully!');
        setSnackbarSeverity('success');
    } catch (error) {
        console.error('Error setting time limit:', error);
        setSnackbarMessage('Error setting order limit. Please try again.');
        setSnackbarSeverity('error');
    } finally {
        setOpenSnackbar(true);
        setHours('');
        setSelectedRole('');
    }
};

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px' }}>
      <h2>Set Order Time Limit</h2>
      <form onSubmit={handleSubmit}>
        {/* Role Selection Dropdown */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Role</InputLabel>
          <Select
            value={selectedRole}
            onChange={handleRoleChange}
            label="Role"
            variant="outlined"
          >
            {roles.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                {role.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Time Limit Input */}
        <TextField
          label="Time Limit (hours)"
          type="number"
          value={hours}
          onChange={handleChangeHours}
          variant="outlined"
          fullWidth
          margin="normal"
          required
        />

        {/* Submit Button */}
        <Button 
          variant="contained" 
          color="primary" 
          type="submit" 
          fullWidth
        >
          Set Limit
        </Button>
      </form>

      {/* Snackbar for feedback */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SetOrderLimit;
