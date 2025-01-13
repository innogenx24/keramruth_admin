import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextField, Typography, Container, Grid, Box, Snackbar, InputAdornment, IconButton } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { signInRequest } from '../../redux/slices/authSlice';
import LoginImage from '../../assets/logo/LoginImage.png';
import BannerImage from '../../assets/logo/BannerImage.jpg';
import LeftSideBanner from '../../assets/logo/LeftSideBanner.jpg';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './style.css';
import AppLogo2 from '../../assets/logo/AppLogo2';
import DishaLogo from '../../assets/logo/DishaLogo';
import AppLogo from '../../assets/logo/AppLogo';

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user, error } = useSelector((state) => state.auth);  // Assume user contains role info

  // Local state for managing password visibility, remember me, and snackbar
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      mobile_number: '', // Change from email to mobile_number
      password: ''
    },
    validationSchema: Yup.object({
      mobile_number: Yup.string().required('Required').matches(/^[0-9]{10}$/, 'Invalid mobile number'), // Adjust validation for mobile number
      password: Yup.string().required('Required')
    }),
    onSubmit: (values) => {

      dispatch(signInRequest({ ...values, rememberMe }));
      setOpenSnackbar(true);
      // Store mobile_number in localStorage if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem('mobile_number', values.mobile_number); // Store mobile_number in localStorage
      } else {
        sessionStorage.setItem('mobile_number', values.mobile_number); // Store temporarily in sessionStorage
      }
    }
  });

  // Handle authentication redirect
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect based on the user role
      if (user?.role === 'Admin') {
        navigate('/dashboard');
      } else if (user?.role === 'Customer') {
        navigate('/dashboard/book-orders');
      }
      else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, navigate, user]);

  // Prefill mobile_number from storage if available
  useEffect(() => {
    const storedMobileNumber = localStorage.getItem('mobile_number') || sessionStorage.getItem('mobile_number');
    if (storedMobileNumber) {
      formik.setFieldValue('mobile_number', storedMobileNumber);
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

  return (
    <Container maxWidth={false}>
      <Grid container sx={{ height: '100%', width: '100%' }}>
        {/* Image Section */}
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: {
              xs: 'auto',
              sm: '100vh'
            }
          }}
        >
          {/* <Box>
            <img src={BannerImage} alt="Login" style={{ maxWidth: '100%', height: '100%', borderRadius: '8px' }} />
          </Box> */}
          <Box>
            <img src={LeftSideBanner} alt="Login" style={{ maxWidth: '100%', height: '100%', borderRadius: '8px' }} />
          </Box>
        </Grid>

        {/* Form Section */}
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: {
              xs: 'auto',
              sm: '100vh'
            },
            padding: '16px'
          }}
        >

          <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
              marginBottom: "50px",
              marginTop: "30px",
            }}
          >
            {/* <DishaLogo/>
            <AppLogo /> */}
            <AppLogo2 />
            {/* working */}
          </Box>

            <Typography variant="h4" gutterBottom>
              Login
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              {/* Mobile Number Field */}
              <TextField
                fullWidth
                label="Mobile Number" // Change label to Mobile Number
                name="mobile_number" // Change name to mobile_number
                type="text"
                variant="outlined"
                margin="normal"
                {...formik.getFieldProps('mobile_number')}
                error={formik.touched.mobile_number && Boolean(formik.errors.mobile_number)}
                helperText={formik.touched.mobile_number && formik.errors.mobile_number}
              />

              {/* Password Field with Visibility Toggle */}
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                margin="normal"
                {...formik.getFieldProps('password')}
                error={formik.touched.password && Boolean(formik.errors.password)}
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
                  )
                }}
              />

              {/* Remember Me Checkbox */}
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label htmlFor="remember" style={{ marginLeft: '8px' }}>
                  Remember Me
                </label>
              </Box>

              {/* Submit Button */}
              <Button
                color="primary"
                variant="contained"
                fullWidth
                type="submit"
                style={{ marginTop: '16px' }}
              >
                LOGIN
              </Button>


              <Box sx={{ textAlign: "right", mt: 2 }}>
                <Typography variant="body2">
                  <Button
                    color="secondary"
                    variant="text"
                    onClick={() => navigate('/forgot-password')}
                    sx={{ textTransform: "none" }}
                  >
                    Forgot your password
                  </Button>
                </Typography>
              </Box>

              {error && <Typography color="error">{error}</Typography>}

              <Snackbar
                open={openSnackbar}
                message={error ? "Invalid Mobile Number or Password" : "Successfully login"}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                ContentProps={{
                  sx: {
                    backgroundColor: error ? 'red' : 'green',
                    color: 'white',
                    fontWeight: 'bold',
                  },
                }}
              />
            </form>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignIn;
