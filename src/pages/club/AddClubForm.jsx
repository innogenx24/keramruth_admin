import React, { useState } from "react";
import { Button, Typography, Box, TextField, Grid,Snackbar,Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AddClubForm = () => {
  const navigate = useNavigate();
  const [clubName, setClubName] = useState("");
  const [litreQuantity, setLitreQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // State for API errors
  const [errors, setErrors] = useState({}); // State for input field errors
  const [submitted, setSubmitted] = useState(false); // Track if form is submitted
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  // Validate form fields
  const validate = () => {
    let formErrors = {};
    const alphanumericRegex = /^[a-zA-Z0-9\s()]+$/;
    
    if (!clubName.trim()) {
      formErrors.clubName = "Club name is required.";
    } else if (!alphanumericRegex.test(clubName)) {
      formErrors.clubName = "Club name cannot contain numbers or special characters.";
    }
  
    if (!litreQuantity.trim()) {
      formErrors.litreQuantity = "Litre quantity is required.";
    } else if (!/^\d+$/.test(litreQuantity)) {
      formErrors.litreQuantity = "Numbers only allowed.";
    }
  
    return formErrors;
  };
  
  // Handle form submission
 // Handle form submission
 const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitted(true);

  // Validate inputs
  const formErrors = validate();
  if (Object.keys(formErrors).length > 0) {
    setErrors(formErrors);
    return;
  }

  setLoading(true);
  setError("");

  const clubData = {
    club_name: clubName,
    litre_quantity: litreQuantity,
  };

  try {
    const response = await fetch(`${API_END_POINT}/club/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clubData),
    });

    const result = await response.json();

    if (response.ok) {
      // Clear form and show success message in Snackbar
      setClubName("");
      setLitreQuantity("");
      setSnackbarMessage("Club created successfully!");
      setSnackbarType("success");
      setOpenSnackbar(true);

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/dashboard/club");
      }, 2000);
    } else {
      setError(result.message || "Failed to add club.");
      setSnackbarMessage(result.message || "Failed to add club.");
      setSnackbarType("error");
      setOpenSnackbar(true);
    }
  } catch (err) {
    setError("An unexpected error occurred. Please try again.");
    setSnackbarMessage("An unexpected error occurred. Please try again.");
    setSnackbarType("error");
    setOpenSnackbar(true);
  } finally {
    setLoading(false);
  }
};

const handleCloseSnackbar = () => {
  setOpenSnackbar(false);
};

  // Handle input changes and clear errors
const handleInputChange = (setter, field) => (e) => {
  const value = e.target.value;
  setter(value);

  if (submitted) {
    setErrors((prev) => {
      const updatedErrors = { ...prev };

      if (field === "clubName") {
        const alphanumericRegex = /^[a-zA-Z0-9\s]+$/;
        updatedErrors[field] =
          !value.trim()
            ? "Club name is required."
            : !alphanumericRegex.test(value)
            ? "Only letters, numbers, and spaces are allowed."
            : "";
      }

      if (field === "litreQuantity") {
        updatedErrors[field] =
          !value.trim()
            ? "Litre quantity is required."
            : !/^\d+$/.test(value) && value !== ""
            ? "Numbers only allowed."
            : "";
      }

      return updatedErrors;
    });
  }
};

  return (
    <Box p={3} component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Masters / Club / Add Club
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <h2>Club Details:</h2>
          <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>
            {/* Club Name Field */}
            <TextField
              fullWidth
              label="Club Name"
              value={clubName}
              onChange={handleInputChange(setClubName, "clubName")}
              margin="normal"
              placeholder="Enter Club Name"
              required
              error={!!errors.clubName}
              helperText={errors.clubName}
            />
            {error && <Typography color="error">{error}</Typography>}

            {/* Litre Quantity Field */}
            <TextField
              fullWidth
              label="Amount"
              value={litreQuantity}
              onChange={handleInputChange(setLitreQuantity, "litreQuantity")}
              margin="normal"
              placeholder="Enter Amount"
              required
              error={!!errors.litreQuantity}
              helperText={errors.litreQuantity}
            />

            {/* API Error Message */}

            {/* Save Button */}
            <Box sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ width: "100%" }}
                disabled={loading}
              >
                {loading ? "Saving..." : "SAVE"}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarType} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddClubForm;
