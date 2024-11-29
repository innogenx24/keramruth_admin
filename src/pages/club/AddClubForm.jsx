import React, { useState } from "react";
import { Button, Typography, Box, TextField, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AddClubForm = () => {
  const navigate = useNavigate();
  const [clubName, setClubName] = useState("");
  const [litreQuantity, setLitreQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // State for API errors
  const [errors, setErrors] = useState({}); // State for input field errors
  const [submitted, setSubmitted] = useState(false); // Track if form is submitted

  // Validate form fields
  const validate = () => {
    let formErrors = {};
    if (!clubName.trim()) formErrors.clubName = "Club name is required.";
    if (!litreQuantity.trim()) {
      formErrors.litreQuantity = "Litre quantity is required.";
    } else if (!/^\d+$/.test(litreQuantity)) {
      formErrors.litreQuantity = "Numbers only allowed.";
    }
    return formErrors;
  };

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
      const response = await fetch("http://88.222.245.236:3002/club/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clubData),
      });

      const result = await response.json();

      if (response.ok) {
        setClubName("");
        setLitreQuantity("");
        navigate("/dashboard/club");
      } else {
        setError(result.message || "Failed to add club.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes and clear errors
  const handleInputChange = (setter, field) => (e) => {
    const value = e.target.value;
    setter(value);

    if (submitted) {
      setErrors((prev) => ({
        ...prev,
        [field]: field === "litreQuantity" && !/^\d+$/.test(value) && value !== "" 
          ? "Numbers only allowed."
          : "",
      }));
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
              label="Club Name*"
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
              label="Litre Quantity*"
              value={litreQuantity}
              onChange={handleInputChange(setLitreQuantity, "litreQuantity")}
              margin="normal"
              placeholder="Enter Litre Quantity"
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
    </Box>
  );
};

export default AddClubForm;
