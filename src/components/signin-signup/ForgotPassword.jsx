import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import LoginImage from "../../assets/logo/LoginImage.png"; // Ensure this path is correct
import "./style.css"; // Ensure this file contains the necessary styles

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      setErrorMessage("Email is required");
      return;
    }

    try {
      const response = await fetch(`${API_END_POINT}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // Use email in the request body
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Reset link sent to your email.");
        setOpenSnackbar(true); // Show success message
        setEmail(""); // Clear the email field
        setErrorMessage(""); // Clear error message
      } else {
        setErrorMessage(data.message || "Error sending reset link");
      }
    } catch (error) {
      setErrorMessage("Error connecting to server");
    }
  };

  return (
    <Container maxWidth={false}>
      <Grid container sx={{ height: "100%", width: "100%" }}>
        {/* Image Section */}
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: {
              xs: "auto",
              sm: "100vh",
            },
          }}
        >
          <Box>
            <img
              src={LoginImage}
              alt="Login"
              style={{ maxWidth: "100%", height: "100%", borderRadius: "8px" }}
            />
          </Box>
        </Grid>

        {/* Form Section */}
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: {
              xs: "auto",
              sm: "100vh",
            },
            padding: "16px",
          }}
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              Forgot Password
            </Typography>
            <Typography variant="body1" gutterBottom>
              Enter your email and we'll send you instructions to reset your
              password.
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Enter Email"
                name="email"
                type="email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={Boolean(errorMessage)}
                helperText={errorMessage}
              />
              <Button
                color="primary"
                variant="contained"
                fullWidth
                type="submit"
                sx={{ mt: 2, backgroundColor: "#00b050", fontSize: "16px" }}
              >
                NEXT
              </Button>
            </form>

            <Snackbar
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert
                onClose={handleCloseSnackbar}
                severity="success"
                sx={{ width: "100%", backgroundColor: "#4caf50", color: "white" }}
              >
                {successMessage}
              </Alert>
            </Snackbar>

            

            <Box sx={{ textAlign: "right", mt: 2 }}>
                            <Typography variant="body2">
                              Back to Login?{" "}
                              <Button
                                color="secondary"
                                variant="text"
                                onClick={() => navigate("/signin")}
                                sx={{ textTransform: "none" }}
                              >
                                Click Here
                              </Button>
                            </Typography>
                          </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ForgotPassword;
