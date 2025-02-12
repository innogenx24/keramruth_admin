
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Box,
  Snackbar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signInRequest } from "../../redux/slices/authSlice";
import LeftSideBanner from "../../assets/logo/LeftSideBanner.jpg";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./style.css";
import { requestForToken } from "../../../firebase-config";

import CommonLogos from "../../assets/logo/CommonLogos.png";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user, error } = useSelector((state) => state.auth); // Assume user contains role info
  const [accountDeletedError, setAccountDeletedError] = useState("");

  // Local state for managing password visibility, remember me, and snackbar
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      mobile_number: "", // Change from email to mobile_number
      password: "",
    },
    validationSchema: Yup.object({
      mobile_number: Yup.string()
        .required("Required")
        .matches(/^[0-9]{10}$/, "Invalid mobile number"), // Adjust validation for mobile number
      password: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      dispatch(signInRequest({ ...values, rememberMe }));
      setOpenSnackbar(true);
      // Store mobile_number in localStorage if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem("mobile_number", values.mobile_number); // Store mobile_number in localStorage
      } else {
        sessionStorage.setItem("mobile_number", values.mobile_number); // Store temporarily in sessionStorage
      }
    },
  });

  // Handle authentication redirect
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect based on the user role
      if (user?.role === "Admin") {
        navigate("/dashboard");
      } else if (user?.role === "Customer") {
        navigate("/dashboard/book-orders");
      } else {
        navigate("/dashboard");
      }
    }
    requestForToken(user?.id);

  }, [isAuthenticated, navigate, user]);

  // Prefill mobile_number from storage if available
  useEffect(() => {
    const storedMobileNumber =
      localStorage.getItem("mobile_number") ||
      sessionStorage.getItem("mobile_number");
    if (storedMobileNumber) {
      formik.setFieldValue("mobile_number", storedMobileNumber);
    }
  }, []);

  // Handle error Snackbar display
  useEffect(() => {
    if (error) {
      setOpenSnackbar(true);
    }
  }, [error]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (error) {
      if (error === "Mobile number not found") {
        formik.setErrors({
          mobile_number: "Mobile number not found",
          password: "", // Clear password error if mobile number is invalid
        });
        setAccountDeletedError(""); // Clear deleted account error
      } else if (error === "Invalid password") {
        formik.setErrors({
          mobile_number: "", // Clear mobile number error if password is invalid
          password: "Invalid password",
        });
        setAccountDeletedError(""); // Clear deleted account error
      } else if (error === "Your account has been deleted.") {
        setAccountDeletedError("Your account has been deleted.");
        formik.setErrors({
          mobile_number: "", // Clear mobile number error
          password: "", // Clear password error
        });
      } else {
        formik.setErrors({
          mobile_number: "Invalid mobile or password", // Default message for other errors
          password: "Invalid mobile or password",
        });
        setAccountDeletedError(""); // Clear deleted account error
      }
    }
  }, [error]);

  
  

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
          {/* <Box>
            <img src={BannerImage} alt="Login" style={{ maxWidth: '100%', height: '100%', borderRadius: '8px' }} />
          </Box> */}
          <Box>
            <img
              src={LeftSideBanner}
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                marginBottom: "50px",
                marginTop: "30px",
              }}
            >
              {/* First Logo */}
              <Box sx={{ marginRight: 2 }}>
                <img
                  src={CommonLogos}
                  alt="Login"
                  style={{
                    width: "350px",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            </Box>

            <Typography variant="h4" gutterBottom>
              Login
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              {/* Mobile Number Field */}
              <TextField
                fullWidth
                label="Mobile Number"
                name="mobile_number"
                type="text"
                variant="outlined"
                margin="normal"
                {...formik.getFieldProps("mobile_number")}
                error={
                  formik.touched.mobile_number &&
                  Boolean(formik.errors.mobile_number)
                }
                helperText={
                  formik.touched.mobile_number && formik.errors.mobile_number
                }
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                margin="normal"
                {...formik.getFieldProps("password")}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Remember Me Checkbox */}
              <Box sx={{ display: "flex", alignItems: "center",marginBottom:'10px'}}>
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label htmlFor="remember" style={{ marginLeft: "8px" }}>
                  Remember Me
                </label>
              </Box>
              <Box
                sx={{ textAlign: "center", color: "red", marginBottom: "16px" }}
              >
                {accountDeletedError && (
                  <Typography variant="body2" color="error">
                    {accountDeletedError}
                  </Typography>
                )}
              </Box>

              {/* Submit Button */}
              <Button
                color="primary"
                variant="contained"
                fullWidth
                type="submit"
                style={{ marginTop: "16px" }}
              >
                LOGIN
              </Button>

              <Box sx={{ textAlign: "right", mt: 2 }}>
                <Typography variant="body2">
                  <Button
                    color="secondary"
                    variant="text"
                    onClick={() => navigate("/forgot-password")}
                    sx={{ textTransform: "none" }}
                  >
                    Forgot your password
                  </Button>
                </Typography>
              </Box>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignIn;