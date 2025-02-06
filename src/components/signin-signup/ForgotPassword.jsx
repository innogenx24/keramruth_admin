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
import LeftSideBanner from '../../assets/logo/LeftSideBanner.jpg'; // Ensure this path is correct
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(""); // State for phone number
  const [otp, setOtp] = useState(""); // State for OTP
  const [otpSent, setOtpSent] = useState(false); // Flag to check if OTP has been sent
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSendOtp = async (event) => {
    event.preventDefault();

    // Ensure phone number always starts with '+'
    const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

    // Check if phone number is entered
    if (!formattedPhoneNumber) {
      setErrorMessage("Please enter your phone number");
      return;
    }

    try {
      const response = await fetch(`${API_END_POINT}/sent-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: formattedPhoneNumber, // Send the formatted phone number
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("OTP sent successfully!");
        setOtpSent(true); // Mark OTP as sent
        setOpenSnackbar(true); // Show success message
        setErrorMessage(""); // Clear error message
      } else {
        setErrorMessage(data.message || "Error sending OTP");
      }
    } catch (error) {
      setErrorMessage("Error connecting to server");
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    // Ensure phone number always starts with '+'
    const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

    // Check if OTP is entered
    if (!otp) {
      setErrorMessage("Please enter the OTP");
      return;
    }

    try {
      const response = await fetch(`${API_END_POINT}/sent-otp/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: formattedPhoneNumber, // Send the formatted phone number
          code: otp,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("OTP verified successfully!");
        setOpenSnackbar(true); // Show success message
        setErrorMessage(""); // Clear error message
        navigate(`${API_END_POINT}/craete-password`)
      } else {
        setErrorMessage(data.message || "Invalid OTP");
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
              src={LeftSideBanner}
              alt="Forgot Password"
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

            {/* If OTP is not sent yet, show phone number input */}
            {!otpSent ? (
              <>
                <Typography variant="body1" gutterBottom>
                  Enter your mobile number to receive an OTP
                </Typography>
                <form onSubmit={handleSendOtp}>
                  <PhoneInput
                    country={'in'} // Set default country code (e.g., India)
                    value={phoneNumber}
                    onChange={(phone) => setPhoneNumber(phone)}
                    error={Boolean(errorMessage)}
                    inputProps={{
                      maxLength: 15,
                    }}
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
              </>
            ) : (
              // If OTP is sent, show OTP input and verify button
              <>
                <Typography variant="body1" gutterBottom>
                  Enter the OTP sent to {phoneNumber}
                </Typography>
                <form onSubmit={handleVerifyOtp}>
                  <TextField
                    fullWidth
                    label="OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    error={Boolean(errorMessage)}
                    helperText={errorMessage}
                    inputProps={{ maxLength: 6 }}
                  />
                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    type="submit"
                    sx={{ mt: 2, backgroundColor: "#00b050", fontSize: "16px" }}
                  >
                    VERIFY OTP
                  </Button>
                </form>
              </>
            )}

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













// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
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

// const ForgotPassword = () => {
//   const navigate = useNavigate();
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

//   const handleCloseSnackbar = () => {
//     setOpenSnackbar(false);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!mobileNumber) {
//       setErrorMessage("Mobile number is required");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_END_POINT}/forgot-password`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ mobileNumber }), // Use mobile number in the request body
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSuccessMessage("OTP sent to your mobile number.");
//         setOpenSnackbar(true); // Show success message
//         setMobileNumber(""); // Clear mobile number field
//         setErrorMessage(""); // Clear error message
//         // Redirect to OTP verification page (if applicable)
//         navigate("/verify-otp", { state: { mobileNumber } });
//       } else {
//         setErrorMessage(data.message || "Error sending OTP");
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
//           <Box>
//             <Typography variant="h4" gutterBottom>
//               Forgot Password
//             </Typography>
//             <Typography variant="body1" gutterBottom>
//               Enter your mobile number and we'll send you OTP to reset your
//               password.
//             </Typography>
//             <form onSubmit={handleSubmit}>
//               <TextField
//                 fullWidth
//                 label="Enter Mobile Number"
//                 name="mobileNumber"
//                 type="text"
//                 variant="outlined"
//                 margin="normal"
//                 value={mobileNumber}
//                 onChange={(e) => setMobileNumber(e.target.value)}
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
//                 NEXT
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

// export default ForgotPassword;
