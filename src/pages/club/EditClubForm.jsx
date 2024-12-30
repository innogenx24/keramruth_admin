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
    clubName: "",
    litreQuantity: "",
  });
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  const validateFields = () => {
    const alphanumericRegex = /^[a-zA-Z0-9\s]+$/; // Alphanumeric with spaces allowed
  
    const errors = {
      clubName: "",
      litreQuantity: "",
    };
  
    if (!clubName.trim()) {
      errors.clubName = "Club name is required.";
    } else if (!alphanumericRegex.test(clubName)) {
      errors.clubName = "Special characters is not allowed.";
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
        console.log("Club updated successfully:", result.data);
        navigate("/dashboard/club");
      } else {
        setError(result.message || "Club name already exists.");
        console.error("Club name already exists", result.message);
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
    </Box>
  );
};

export default EditClubForm;
