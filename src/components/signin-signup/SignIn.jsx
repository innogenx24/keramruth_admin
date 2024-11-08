import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextField, Typography, Container, Grid, Box, Snackbar, InputAdornment, IconButton } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { signInRequest } from '../../redux/slices/authSlice';
import LoginImage from '../../assets/logo/LoginImage.png';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './style.css';

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, error } = useSelector((state) => state.auth);

  // Local state for managing password visibility, remember me, and snackbar
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required')
    }),
    onSubmit: (values) => {
      dispatch(signInRequest({ ...values, rememberMe }));

      // Store token in localStorage if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem('email', values.email); // Store email (or token) in localStorage
      } else {
        sessionStorage.setItem('email', values.email); // Store temporarily in sessionStorage
      }
    }
  });

  // Handle authentication redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard/sales');
    }
  }, [isAuthenticated, navigate]);

  // Prefill email from storage if available
  useEffect(() => {
    const storedEmail = localStorage.getItem('email') || sessionStorage.getItem('email');
    if (storedEmail) {
      formik.setFieldValue('email', storedEmail);
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
          <Box>
            <img src={LoginImage} alt="Login" style={{ maxWidth: '100%', height: '100%', borderRadius: '8px' }} />
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
            <Typography variant="h4" gutterBottom>
              Sign In
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              {/* Email Field */}
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                margin="normal"
                {...formik.getFieldProps('email')}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
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

              {/* Forgot Password Link */}
              <Box sx={{ mt: 1, textAlign: 'center' }}>
                <Typography variant="body2">
                  Forgot Your Password?{' '}
                  <Button
                    variant="text"
                    onClick={() => navigate('/forgot-password')}
                    sx={{ textTransform: 'none', fontWeight: 'bold' }}
                  >
                    Click Here
                  </Button>
                </Typography>
              </Box>

              {/* Sign Up Link */}
              <Box sx={{ mt: -1, textAlign: 'center' }}>
                <Typography variant="body2">
                  Don't have an account?{' '}
                  <Button
                    variant="text"
                    onClick={() => navigate('/signup')}
                    sx={{ textTransform: 'none', fontWeight: 'bold' }}
                  >
                    Click Here
                  </Button>
                </Typography>
              </Box>

              {/* Snackbar for Error Display */}
              <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={error ? "Invalid Email or Password" : ""}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              />
            </form>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignIn;
