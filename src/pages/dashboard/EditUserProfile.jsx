import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Avatar,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_END_POINT_IMG } from "../../constants/ApiConstant";

const EditUserProfile = () => {
  const navigate = useNavigate();
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;
  const imageBaseURL = `${API_END_POINT_IMG}/uploads/`;

  const [selectedImage, setSelectedImage] = useState(
    "/static/images/avatar/1.jpg"
  );
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(""); // To hold the error message for display
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState("success");

  const [user, setUser] = useState({
    full_name: "",
    mobile_number: "",
    email: "",
    pincode: "",
    street_name: "",
    city: "",
    state: "",
    country: "",
    image: "",
  });

  const [cities, setCities] = useState([]);
  const [users, setUsers] = useState(null); // Add users state

  // Fetch user data from API (replace with actual API call)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        // const response = await axios.get(`${API_END_POINT}/api/admin/admin-details`, {
        const response = await axios.get(
          `${API_END_POINT}/admin/admin-details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(response.data); // Store fetched data
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, []); // Run once on component mount

  // State to City mapping


  useEffect(() => {
    if (users) {
      setUser({
        full_name: users.full_name || "",
        mobile_number: users.mobile_number || "",
        email: users.email || "",
        pincode: users.pincode || "",
        street_name: users.street_name || "",
        city: users.city || "",
        state: users.state || "",
        country: users.country || "India",
        building_no_name: users.building_no_name || "",
        username: users.username || "",
        image: users.image || "",
      });

      if (!imageFile && users.image) {
        setSelectedImage(
          users.image.includes("http")
            ? users.image
            : `${imageBaseURL}${users.image}`
        );
      }
    }
  }, [users, imageFile]);

  const validateFields = () => {
    const newErrors = {};
    if (!user.full_name.trim()) newErrors.full_name = "Full Name is required.";
    if (!user.mobile_number.trim()) {
      newErrors.mobile_number = "Mobile Number is required.";
    } else if (!/^\d{10}$/.test(user.mobile_number)) {
      newErrors.mobile_number = "Invalid Mobile Number. Must be 10 digits.";
    }
    if (!user.pincode.trim()) {
      newErrors.pincode = "Pincode is required.";
    } else if (!/^\d{6}$/.test(user.pincode)) {
      newErrors.pincode = "Invalid Pincode. Must be 6 digits.";
    }
    return newErrors;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({
      ...user,
      [name]: value,
    });

    if (name === "pincode" && value.length === 6) {
      fetchStateAndDistrict(value);
    }
  };

  const fetchStateAndDistrict = async (pincode) => {
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = response.data[0];

      if (data.Status === "Success") {
        const { State, District } = data.PostOffice[0];

        // Update the state and district fields
        setUser((prevUser) => ({
          ...prevUser,
          state: State,
          city: District,
        }));
      } else {
        alert("Invalid Pincode!");
      }
    } catch (error) {
      console.error("Error fetching pincode data:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeLimit = 2 * 1024 * 1024; // 2MB limit
      const validImageTypes = ["image/jpeg", "image/png"]; // Allowed file types (JPEG, PNG)

      // Check file type
      if (!validImageTypes.includes(file.type)) {
        setImageError("Only JPEG (JPG) and PNG images are allowed.");
        return;
      }

      // Check file size
      if (file.size > fileSizeLimit) {
        setImageError("Image size must be 2MB or less.");
        return;
      }

      // If the file passes both checks, set the image preview and file
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
      setImageError(""); // Clear error message if the file is valid
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const validationErrors = validateFields();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append("full_name", user.full_name);
    formData.append("mobile_number", user.mobile_number);
    formData.append("email", user.email);
    formData.append("pincode", user.pincode);
    formData.append("street_name", user.street_name);
    formData.append("city", user.city);
    formData.append("state", user.state);
    formData.append("country", user.country);

    if (imageFile) {
      formData.append("image", imageFile);
    } else {
      formData.append("image", user.image);
    }

    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage
      // const response = await axios.put(`${API_END_POINT}/api/admin/update`, formData, {
      const response = await axios.put(
        `${API_END_POINT}/admin/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const successMessage = `Profile updated successfully.`;
      setSuccessMessage(successMessage);
      setSnackbarType("success");
      setOpenSnackbar(true);

      setTimeout(() => {
        setOpenSnackbar(false);
        navigate("/dashboard/profile");
      }, 2000);
    } catch (error) {
      console.error("Error updating member data", error);

      // Check if the error response contains a message and set the error message
      if (error.response && error.response.data && error.response.data.error) {
        const message = error.response.data.error;
        setErrorMessage(message);

        if (message === "Mobile number already in use") {
          setErrors((prev) => ({
            ...prev,
            mobile_number: "Mobile number already in used.",
          }));
        } else if (message === "Email already in use") {
          setErrors((prev) => ({
            ...prev,
            email: "Email already in used.",
          }));
        }
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    }
  };

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#f5f5f5" }}>
      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={2}>
          {/* Left Section: Profile Details */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                padding: "20px",
                backgroundColor: "#fff",
                borderRadius: "10px",
              }}
            >
              <Typography variant="h6" gutterBottom>
                User Details: Profile
              </Typography>

              {/* Avatar */}
              <Avatar
                alt="User Profile"
                src={selectedImage}
                onClick={() => document.getElementById("imageUpload").click()}
                sx={{ width: 56, height: 56 }}
              />
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              {imageError && (
                <Typography variant="body2" color="error" mt={1}>
                  {imageError}
                </Typography>
              )}

              {/* Full Name */}
              <TextField
                fullWidth
                label="Full Name"
                name="full_name"
                value={user.full_name}
                onChange={handleInputChange}
                margin="normal"
                error={!!errors.full_name}
                helperText={errors.full_name}
              />

              {/* Mobile Number */}
              <TextField
                fullWidth
                label="Mobile No"
                name="mobile_number"
                value={user.mobile_number}
                onChange={handleInputChange}
                margin="normal"
                error={!!errors.mobile_number}
                helperText={errors.mobile_number}
              />

              {/* Email */}
              <TextField
                fullWidth
                label="Email ID"
                variant="outlined"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                required
                margin="normal"
                error={!!errors.email}
                helperText={errors.email}
              />

              <Typography variant="h6" gutterBottom sx={{ marginTop: "20px" }}>
                Address
              </Typography>

              {/* Pincode */}
              <TextField
                fullWidth
                label="Pincode"
                name="pincode"
                value={user.pincode}
                onChange={handleInputChange}
                margin="normal"
                error={!!errors.pincode}
                helperText={errors.pincode}
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Country</InputLabel>
                    <Select
                      name="country"
                      value="India" // Setting the default value to "India"
                      disabled
                      label="Country"
                    >
                      <MenuItem value="India">India</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>State</InputLabel>
                    <Select
                      name="state"
                      value={user.state}
                      onChange={handleInputChange}
                      label="State"
                      disabled
                    >
                      <MenuItem value={user.state}>{user.state}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ marginTop: "10px" }}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>District</InputLabel>
                    <Select
                      name="city"
                      value={user.city}
                      onChange={handleInputChange}
                      label="District"
                      disabled={!user.state}
                    >
                      <MenuItem value={user.city}>{user.city}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Street Name"
                    variant="outlined"
                    name="street_name"
                    value={user.street_name}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ marginTop: "10px" }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Building Name/No"
                    name="building_no_name"
                    value={user.building_no_name}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
              {/* Save Changes Button */}
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{ marginTop: "20px" }}
              >
                Save Changes
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarType}
          variant="filled"
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditUserProfile;
