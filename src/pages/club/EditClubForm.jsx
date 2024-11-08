import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { TextField, Button, Box, Typography } from "@mui/material";

const EditClubForm = ({ onCancel }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate
  const { club } = location.state || {}; // Destructure club data from state
  const [clubName, setClubName] = useState(club?.club_name || "");
  // Convert litre_quantity to an integer for display without decimals
  const [litreQuantity, setLitreQuantity] = useState(
    club?.litre_quantity ? parseInt(club.litre_quantity, 10) : ""
  );
  const [loading, setLoading] = useState(false); // Loading state for the button
  const [error, setError] = useState(""); // Error state for API response

  // Function to handle form submission (update logic)
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading
    setError(""); // Reset error message

    // Prepare the data to be sent
    const updatedClubData = {
      club_name: clubName,
      litre_quantity: litreQuantity,
    };

    try {
      // Send PUT request to the API
      const response = await fetch(`http://88.222.245.236:3002/club/${club?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedClubData),
      });

      const result = await response.json();

      if (response.ok) {
        // Handle success - navigate to the club dashboard
        console.log("Club updated successfully:", result.data);
        navigate('/dashboard/club'); // Redirect to /dashboard/club
      } else {
        // Handle errors returned from the API
        setError(result.message || "Failed to update club.");
        console.error("Failed to update club:", result.message);
      }
    } catch (error) {
      // Handle network or unexpected errors
      setError("An unexpected error occurred. Please try again.");
      console.error("Error updating club:", error);
    } finally {
      setLoading(false); // Stop loading
    }
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
        />
        <TextField
          label="Litre Quantity"
          value={litreQuantity}
          onChange={(e) => setLitreQuantity(parseInt(e.target.value, 10) || "")} // Convert input to integer
          fullWidth
          margin="normal"
          type="number" // Set type to number for litre quantity
        />

        {/* Error Message */}
        {error && <Typography color="error">{error}</Typography>}

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
            sx={{ width: "100%" }} // Set button width to 100%
            disabled={loading} // Disable button while loading
          >
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditClubForm;
