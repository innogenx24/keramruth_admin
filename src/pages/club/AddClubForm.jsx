import React, { useState } from "react";
import { Button, Typography, Box, TextField, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AddClubForm = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [clubName, setClubName] = useState("");
  const [litreQuantity, setLitreQuantity] = useState("");
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState(""); // State for error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(""); // Reset error message

    // Prepare the data to be sent
    const clubData = {
      club_name: clubName,
      litre_quantity: litreQuantity,
    };

    try {
      // Send POST request to the API
      const response = await fetch("http://88.222.245.236:3002/club/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clubData),
      });

      const result = await response.json();

      if (response.ok) {
        // Handle success - reset the form and redirect
        console.log("Club added successfully:", result.data);
        setClubName(""); // Reset club name
        setLitreQuantity(""); // Reset litre quantity

        // Redirect to the desired URL after successful addition
        navigate('/dashboard/club'); // Navigate to /dashboard/club
      } else {
        // Handle errors returned from the API
        setError(result.message || "Failed to add club.");
        console.error("Failed to add club:", result.message);
      }
    } catch (error) {
      // Handle network or unexpected errors
      setError("An unexpected error occurred. Please try again.");
      console.error("Error adding club:", error);
    } finally {
      setLoading(false); // Stop loading
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
            <TextField
              fullWidth
              label="Club Name*"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              margin="normal"
              placeholder="Enter Club Name"
              required
            />

            <TextField
              fullWidth
              label="Litre Quantity"
              value={litreQuantity}
              onChange={(e) => setLitreQuantity(e.target.value)}
              placeholder="Enter Litre Quantity"
              required
              margin="normal"
              type="number" // Set type to number for litre quantity
            />

            {/* Error Message */}
            {error && <Typography color="error">{error}</Typography>}

            {/* Save Button */}
            <Box sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ width: "100%" }} // Set the button width to 100%
                disabled={loading} // Disable button while loading
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
