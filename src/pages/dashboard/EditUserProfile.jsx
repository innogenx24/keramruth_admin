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
} from "@mui/material";
import { Box } from "@mui/system";
import { makeEditUser } from "../../redux/slices/user-profile-slice/UserEditSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const EditUserProfile = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const imageBaseURL = "http://88.222.245.236:3002/uploads/";
  const navigate = useNavigate(); // Initialize navigate

  const [selectedImage, setSelectedImage] = useState("/static/images/avatar/1.jpg");
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if the file size exceeds 2MB
      if (file.size > 2 * 1024 * 1024) {
        setImageError("Image size must be 2MB or less");
        return; // Stop further execution if file size exceeds limit
      }

      const imageUrl = URL.createObjectURL(file); // Preview the image
      setSelectedImage(imageUrl);  // Set the selected image for preview
      setImageFile(file);  // Store the file for submission
      setImageError(""); // Clear any previous error message
    }
  };

  const [user, setUser] = useState({
    building_no_name: "",
    city: "",
    email: "",
    full_name: "",
    mobile_number: "",
    pincode: "",
    street_name: "",
    state: "",
    username: "",
    country: "",
    image: "", 
  });

  const [errors, setErrors] = useState({
    full_name: "",
    mobile_number: "",
    pincode: "",
  });

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
        image: users.image || "",  // Load the image path
      });
  
      if (!imageFile && users.image) {
        setSelectedImage(users.image.includes("http") ? users.image : `${imageBaseURL}${users.image}`);
      }
    }
  }, [users, imageFile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = "";

    if (name === "mobile_number") {
      if (!/^\d{10}$/.test(value)) {
        errorMessage = "Mobile number must be 10 digits";
      }
    }
  
    if (name === "pincode") {
      if (!/^\d{6}$/.test(value)) {
        errorMessage = "Pincode must be 6 digits";
      }
    }
  
    if (name === "full_name" && !/^[a-zA-Z\s]*$/.test(value)) {
      errorMessage = "Full name should only contain letters and spaces";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));

    // Update the user state with the new value
    setUser((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("full_name", user.full_name);
    formData.append("mobile_number", user.mobile_number);
    formData.append("email", user.email);
    formData.append("pincode", user.pincode);
    formData.append("street_name", user.street_name);
    formData.append("city", user.city);
    formData.append("state", user.state);
    formData.append("country", user.country);
    formData.append("building_no_name", user.building_no_name);
    formData.append("username", user.username);

    if (imageFile) {
      formData.append("image", imageFile); // Append new image
    } else {
      formData.append("image", user.image); // Append the old image (if no new image is selected)
    }

    dispatch(makeEditUser(formData));
    navigate("/dashboard/profile");

  };

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#f5f5f5" }} component="form" onSubmit={handleFormSubmit}>
      <Grid container spacing={2}>
        {/* Profile Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ padding: "20px", backgroundColor: "#fff", borderRadius: "10px" }}>
            <Typography variant="h6" gutterBottom>
              User Details: Profile
            </Typography>
            <Box display="flex" flexDirection="column">
              {/* Display Avatar */}
              <Avatar
                alt="User Profile"
                src={selectedImage}  // Use selectedImage for Avatar src
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
            </Box>

            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              name="full_name"
              value={user.full_name}
              onChange={handleInputChange}
              required
              margin="normal"
            />
            {errors.full_name && (
              <Typography variant="body2" color="error" mt={1}>
                {errors.full_name}
              </Typography>
            )}

            <TextField
              fullWidth
              label="Mobile No"
              variant="outlined"
              name="mobile_number"
              value={user.mobile_number}
              onChange={handleInputChange}
              required
              margin="normal"
            />
            {errors.mobile_number && (
              <Typography variant="body2" color="error" mt={1}>
                {errors.mobile_number}
              </Typography>
            )}

            <TextField
              fullWidth
              label="Email ID"
              variant="outlined"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              required
              margin="normal"
            />

            {/* Address Section */}
            <Typography variant="h6" gutterBottom sx={{ marginTop: "20px" }}>
              Address
            </Typography>

            <TextField
              fullWidth
              label="Pincode"
              variant="outlined"
              name="pincode"
              value={user.pincode}
              onChange={handleInputChange}
              margin="normal"
            />
            {errors.pincode && (
              <Typography variant="body2" color="error" mt={1}>
                {errors.pincode}
              </Typography>
            )}

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Country</InputLabel>
                  <Select
                    name="country"
                    value={user.country}
                    onChange={handleInputChange}
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
                  >
                    <MenuItem value="Karnataka">Karnataka</MenuItem>
                    <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                    <MenuItem value="Tamil Nadu">Tamil Nadu</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ marginTop: "10px" }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="City"
                  variant="outlined"
                  name="city"
                  value={user.city}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Street Name"
                  variant="outlined"
                  name="street_name"
                  value={user.street_name}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: "20px" }}>
                Save Changes
              </Button>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditUserProfile;
