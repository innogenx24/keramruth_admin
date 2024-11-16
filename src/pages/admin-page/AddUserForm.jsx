import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Box,
  InputLabel,
  IconButton,
  Switch,
  Typography,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import "./adduser.css";

const AddUserForm = () => {
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    mobileNo: "",
    email: "",
    password: "",
    pincode: "",
    country: "",
    state: "",
    district: "",
    city: "",
    streetName: "",
    username: "",
    image: null,

  });

  const [accessControls, setAccessControls] = useState({
    addEditUsers: false,
    addEditProducts: false,
    addEditAnnouncements: false,
    addEditSalesTarget: false,
    addEditMinimumStock: false,
    addEditRoles: false,
    addEditClub: false,
    deleteUsers: false,
    deleteProducts: false,
    deleteAnnouncements: false,
    deleteSalesTarget: false,
    deleteMinimumStock: false,
    deleteRoles: false,
    deleteClub: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAccessChange = (name) => (event) => {
    setAccessControls((prev) => ({
      ...prev,
      [name]: event.target.checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3002/api/admin/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userDetails,
          accessControls,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("User created successfully:", data);
        alert("User created successfully!");
        // Clear form or handle success state
      } else {
        console.error("Error creating user:", data);
        alert("Failed to create user: " + data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please try again later.");
    }
  };

  return (
    <Box p={3} component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {/* Left Side: Member Details */}
        <Grid item xs={12} md={6}>
          <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>
            <InputLabel>User Details</InputLabel>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <InputLabel>Add Images</InputLabel>
                <IconButton color="primary">
                  <AddPhotoAlternateIcon />
                </IconButton>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name*"
                  name="fullName"
                  value={userDetails.fullName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mobile No*"
                  name="mobileNo"
                  value={userDetails.mobileNo}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email ID*"
                  name="email"
                  value={userDetails.email}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username*"
                  name="username"
                  value={userDetails.username}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password*"
                  type="password"
                  name="password"
                  value={userDetails.password}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
            </Grid>
          </Box>

          {/* Address Section */}
          <Box mt={3} sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>
            <InputLabel>Address</InputLabel>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Pincode*"
                  name="pincode"
                  value={userDetails.pincode}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Country*"
                  name="country"
                  value={userDetails.country}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="State*"
                  name="state"
                  value={userDetails.state}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="District*"
                  name="district"
                  value={userDetails.district}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="City*"
                  name="city"
                  value={userDetails.city}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Street Name"
                  name="streetName"
                  value={userDetails.streetName}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Right Side: Access Controls */}
        <Grid item xs={12} md={6}>
          <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>
            <InputLabel>Access</InputLabel>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {/* Left Side Controls */}
                  <Grid item xs={6}>
                    <Grid container direction="column" spacing={2}>
                      {Object.keys(accessControls)
                        .slice(0, 7) // First 7 switches
                        .map((key) => (
                          <Grid item key={key}>
                            <Box display="flex" alignItems="center">
                              <Typography variant="body1" style={{ marginRight: "auto" }}>
                                {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.charAt(0).toUpperCase())}
                              </Typography>
                              <Switch
                                checked={accessControls[key]}
                                onChange={handleAccessChange(key)}
                              />
                            </Box>
                          </Grid>
                        ))}
                    </Grid>
                  </Grid>

                  {/* Right Side Controls */}
                  <Grid item xs={6}>
                    <Grid container direction="column" spacing={2}>
                      {Object.keys(accessControls)
                        .slice(7) // Last 7 switches
                        .map((key) => (
                          <Grid item key={key}>
                            <Box display="flex" alignItems="center">
                              <Typography variant="body1" style={{ marginRight: "auto" }}>
                                {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.charAt(0).toUpperCase())}
                              </Typography>
                              <Switch
                                checked={accessControls[key]}
                                onChange={handleAccessChange(key)}
                              />
                            </Box>
                          </Grid>
                        ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>

          {/* Save Button */}
          <Box mt={3} textAlign="center">
            <Button
              variant="contained"
              color="success"
              size="large"
              type="submit"
              sx={{ width: "95%" }}
            >
              Save
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddUserForm;
