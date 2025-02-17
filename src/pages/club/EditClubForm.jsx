import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography,Snackbar,Alert } from "@mui/material";

const EditClubForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { club } = location.state || {};
  const [clubName, setClubName] = useState(club?.club_name || "");
  const [litreQuantity, setLitreQuantity] = useState(
    club?.litre_quantity ? parseInt(club.litre_quantity, 10) : ""
  );
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({
    clubName: "",
    litreQuantity: "",
  });
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  const validateFields = () => {
    // Alphanumeric with spaces and parentheses allowed
    const alphanumericRegex = /^[a-zA-Z0-9\s()]+$/;
  
    const errors = {
      clubName: "",
      litreQuantity: "",
    };
  
    if (!clubName.trim()) {
      errors.clubName = "Club name is required.";
    } else if (!alphanumericRegex.test(clubName)) {
      errors.clubName = "Special characters are not allowed, except parentheses.";
    }
  
    if (litreQuantity === "" || litreQuantity === null || litreQuantity === undefined) {
      errors.litreQuantity = "Litre quantity is required.";
    } else if (isNaN(litreQuantity)) {
      errors.litreQuantity = "Numbers only allowed.";
    }
  
    setFormErrors(errors);
    return !Object.values(errors).some((error) => error);
  };
  
  
  // Function to handle form submission
 // Handle form submission
 const handleFormSubmit = async (event) => {
  event.preventDefault();

  if (!validateFields()) {
    return; // Stop if validation fails
  }

  setLoading(true);
  setError("");

  const updatedClubData = {
    club_name: clubName,
    litre_quantity: litreQuantity,
  };

  try {
    const response = await fetch(`${API_END_POINT}/club/${club?.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedClubData),
    });

    const result = await response.json();

    if (response.ok) {
      // Set success message for Snackbar
      setSnackbarMessage("Club updated successfully!");
      setSnackbarType("success");
      setOpenSnackbar(true);

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/dashboard/club");
      }, 2000);
    } else {
      setError(result.message || "Club name already exists.");
      setSnackbarMessage(result.message || "Failed to update club.");
      setSnackbarType("error");
      setOpenSnackbar(true);
      console.error("Club name already exists", result.message);
    }
  } catch (error) {
    setError("An unexpected error occurred. Please try again.");
    setSnackbarMessage("An unexpected error occurred. Please try again.");
    setSnackbarType("error");
    setOpenSnackbar(true);
    console.error("Error updating club:", error);
  } finally {
    setLoading(false);
  }
};

const handleCloseSnackbar = () => {
  setOpenSnackbar(false);
};


  return (
    <Box sx={{ padding: 2, maxWidth: 500 }}>
      <Typography variant="h6" sx={{ marginBottom: "20px" }}>
        Edit Club
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <TextField
          label="Club Name"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
          fullWidth
          margin="normal"
          error={!!formErrors.clubName}
          helperText={formErrors.clubName}
        />
        {error && <Typography color="error">{error}</Typography>}

        <TextField
          label="Amount"
          value={litreQuantity}
          onChange={(e) => setLitreQuantity(e.target.value)}
          fullWidth
          margin="normal"
          error={!!formErrors.litreQuantity}
          helperText={formErrors.litreQuantity}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </Box>
      </form>

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

export default EditClubForm;
