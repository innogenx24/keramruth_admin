import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import LeftSideBanner from '../../assets/logo/LeftSideBanner.jpg';

const CreateNewPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [mobileNumber, setMobileNumber] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  const mobileRegex = /^[0-9]{10}$/; // Regex for 10-digit mobile number

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validations
    if (!mobileNumber || !password || !confirmPassword) {
      setErrorMessage("All fields are required");
      return;
    }

    if (!mobileRegex.test(mobileNumber)) {
      setErrorMessage("Please enter a valid mobile number");
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
      const response = await fetch(`${API_END_POINT}/forgot-password/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobileNumber, password, token }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Password updated successfully and confirmation SMS sent.");
        setOpenSnackbar(true);
        setMobileNumber(""); // Reset mobile number field
        setPassword(""); // Reset password field
        setConfirmPassword(""); // Reset confirm password field
        setTimeout(() => {
          navigate("/signin");
        }, 6000);
      } else {
        setErrorMessage(data.message || "Error resetting password");
      }
    } catch (error) {
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
              src={LeftSideBanner}
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
              {/* Mobile Number Field */}
              <TextField
                fullWidth
                label="Mobile Number"
                name="mobileNumber"
                type="text"
                variant="outlined"
                margin="normal"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
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














// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   Button,
//   TextField,
//   Typography,
//   Container,
//   Grid,
//   Box,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import LeftSideBanner from '../../assets/logo/LeftSideBanner.jpg';

// const CreateNewPassword = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { mobileNumber } = location.state || {}; // Retrieve mobile number from location state

//   const [otp, setOtp] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

//   const handleCloseSnackbar = () => {
//     setOpenSnackbar(false);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!otp || !password) {
//       setErrorMessage("OTP and password are required.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_END_POINT}/reset-password`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ mobileNumber, otp, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSuccessMessage("Password reset successfully.");
//         setOpenSnackbar(true);
//         setTimeout(() => {
//           navigate("/signin");
//         }, 6000);
//       } else {
//         setErrorMessage(data.message || "Error resetting password");
//       }
//     } catch (error) {
//       setErrorMessage("Error connecting to server");
//     }
//   };

//   return (
//     <Container maxWidth={false}>
//       <Grid container sx={{ height: "100%", width: "100%" }}>
//         <Grid
//           item
//           xs={12}
//           sm={6}
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             height: "100vh",
//           }}
//         >
//           <Box>
//             <img
//               src={LeftSideBanner}
//               alt="Login"
//               style={{ maxWidth: "100%", height: "100%", borderRadius: "8px" }}
//             />
//           </Box>
//         </Grid>

//         <Grid
//           item
//           xs={12}
//           sm={6}
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             height: "100vh",
//             padding: "16px",
//           }}
//         >
//           <Box sx={{ width: "80%" }}>
//             <Typography variant="h4" gutterBottom>
//               Reset Your Password
//             </Typography>
//             <form onSubmit={handleSubmit}>
//               <TextField
//                 fullWidth
//                 label="Enter OTP"
//                 name="otp"
//                 type="text"
//                 variant="outlined"
//                 margin="normal"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 error={Boolean(errorMessage)}
//                 helperText={errorMessage}
//               />
//               <TextField
//                 fullWidth
//                 label="New Password"
//                 name="password"
//                 type="password"
//                 variant="outlined"
//                 margin="normal"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 error={Boolean(errorMessage)}
//                 helperText={errorMessage}
//               />
//               <Button
//                 color="primary"
//                 variant="contained"
//                 fullWidth
//                 type="submit"
//                 sx={{ mt: 2, backgroundColor: "#00b050", fontSize: "16px" }}
//               >
//                 RESET PASSWORD
//               </Button>
//             </form>

//             <Snackbar
//               open={openSnackbar}
//               autoHideDuration={6000}
//               onClose={handleCloseSnackbar}
//               anchorOrigin={{ vertical: "top", horizontal: "right" }}
//             >
//               <Alert
//                 onClose={handleCloseSnackbar}
//                 severity="success"
//                 sx={{ width: "100%", backgroundColor: "#4caf50", color: "white" }}
//               >
//                 {successMessage}
//               </Alert>
//             </Snackbar>
//           </Box>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default CreateNewPassword;
