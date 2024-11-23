import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";

const EditClubForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { club } = location.state || {};
  const [clubName, setClubName] = useState(club?.club_name || "");
  const [litreQuantity, setLitreQuantity] = useState(
    club?.litre_quantity ? parseInt(club.litre_quantity, 10) : ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({
    clubName: false,
    litreQuantity: false,
  });

  // Function to validate the form fields
  const validateFields = () => {
    const errors = {
      clubName: clubName.trim() === "",
      litreQuantity: litreQuantity === "" || isNaN(litreQuantity),
    };
    setFormErrors(errors);
    return !Object.values(errors).includes(true);
  };

  // Function to handle form submission
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
      const response = await fetch(`http://88.222.245.236:3002/club/${club?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedClubData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Club updated successfully:", result.data);
        navigate("/dashboard/club");
      } else {
        setError(result.message || "Failed to update club.");
        console.error("Failed to update club:", result.message);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Error updating club:", error);
    } finally {
      setLoading(false);
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
          error={formErrors.clubName}
          helperText={formErrors.clubName ? "Club name is required." : ""}
        />
        <TextField
          label="Litre Quantity"
          value={litreQuantity}
          onChange={(e) => setLitreQuantity(e.target.value)}
          fullWidth
          margin="normal"
          error={formErrors.litreQuantity}
          helperText={formErrors.litreQuantity ? "Numbers only allowed" : ""}
        />

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
            sx={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditClubForm;
