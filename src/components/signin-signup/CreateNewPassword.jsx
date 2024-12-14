import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Box,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoginImage from "../../assets/logo/LoginImage.png";
import "./style.css";

const CreateNewPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation regex

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validations
    if (!email || !password || !confirmPassword) {
      setErrorMessage("All fields are required");
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    // Password strength validation
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "Password must contain at least 8 characters, including one uppercase, one lowercase, one digit, and one special character."
      );
      return;
    }

    try {
      const response = await fetch("http://88.222.245.236:3002/forgot-password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
    
      const data = await response.json();
    
      // Log the response to ensure it's correct
      console.log("Response from API:", data);

      if (response.ok) {
        // Log success response
        console.log("Password update successful");
        setSuccessMessage("Password updated successfully and confirmation email sent.");
        setOpenSnackbar(true); // Show success Snackbar
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        // Automatically navigate after 6 seconds (Snackbar duration)
        setTimeout(() => {
          navigate("/signin");
        }, 6000);
      } else {
        console.error("Error response:", data); // Log the error
        setErrorMessage(data.message || "Error resetting password");
      }
    } catch (error) {
      console.error("Fetch error:", error); // Log fetch/network errors
      setErrorMessage("Error connecting to server");
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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

        {/* Right section with the form */}
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
          <Box sx={{ width: "80%" }}>
            <Typography variant="h4" gutterBottom>
              Reset Your Password
            </Typography>
            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* New Password Field */}
              <TextField
                fullWidth
                label="New Password"
                name="password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Confirm Password Field */}
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                variant="outlined"
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Error Message */}
              {errorMessage && (
                <Typography variant="body2" color="error" sx={{ mt: 1, textAlign: "left" }}>
                  {errorMessage}
                </Typography>
              )}

              {/* Submit Button */}
              <Button
                color="primary"
                variant="contained"
                fullWidth
                type="submit"
                sx={{
                  mt: 2,
                  backgroundColor: "#00c853", // Green button
                  "&:hover": { backgroundColor: "#00b24a" }, // Hover effect
                }}
              >
                Submit
              </Button>

              {/* Back to Login */}
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
            </form>
          </Box>
        </Grid>
      </Grid>

      {/* Snackbar for Success Message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%", backgroundColor: "#4caf50", color: "white" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateNewPassword;
