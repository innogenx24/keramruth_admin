import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Avatar,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Box } from "@mui/system";
import { makeEditUser } from "../../redux/slices/user-profile-slice/UserEditSlice";
import { useDispatch, useSelector } from "react-redux";

const EditUserProfile = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const imageBaseURL = "http://localhost:3002/";

  const [selectedImage, setSelectedImage] = useState("/static/images/avatar/1.jpg");
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Preview the image
      setSelectedImage(imageUrl);  // Set the selected image for preview
      setImageFile(file);  // Store the file for submission
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
  
      // Only update selectedImage if no new image file has been selected
      if (!imageFile && users.image) {
        setSelectedImage(users.image.includes("http") ? users.image : `${imageBaseURL}${users.image}`);
      }
    }
  }, [users, imageFile]);
  
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
  
    // Append the new image only if a new image file is selected
    if (imageFile) {
      formData.append("image", imageFile); // Append new image
    } else {
      formData.append("image", user.image);
    }
  
    // Dispatch the form data for updating
    dispatch(makeEditUser(formData));
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
            <Box display="flex" alignItems="center" marginBottom="20px">
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

            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              defaultValue="Password12"
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
                    <MenuItem value="USA">USA</MenuItem>
                    <MenuItem value="Canada">Canada</MenuItem>
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
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Building No / Name"
              variant="outlined"
              name="building_no_name"
              value={user.building_no_name}
              onChange={handleInputChange}
              margin="normal"
            />
          </Box>
        </Grid>

        {/* Access Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ padding: "20px", backgroundColor: "#fff", borderRadius: "10px" }}>
            <Typography variant="h6" gutterBottom>
              Access
            </Typography>

           
            <Grid container spacing={2}>
              {/* Left column for Add & Edit permissions */}
              <Grid item xs={6}>
                {[
                  "Add & Edit Users",
                  "Add & Edit Products",
                  "Add & Edit Announcement",
                  "Add & Edit Sales Target",
                  "Add & Edit Minimum Stock",
                  "Add & Edit Roles",
                  "Add & Edit Branches",
                ].map((item) => (
                  <FormControlLabel
                    key={item}
                    control={<Checkbox />}
                    label={item}
                  />
                ))}
              </Grid>

              {/* Right column for Delete permissions */}
              <Grid item xs={6}>
                {[
                  "Delete Users",
                  "Delete Products",
                  "Delete Announcement",
                  "Delete Sales Target",
                  "Delete Minimum Stock",
                ].map((item) => (
                  <FormControlLabel
                    key={item}
                    control={<Checkbox />}
                    label={item}
                  />
                ))}
              </Grid>
            </Grid>
            <Button
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
    </Box>
  );
};

export default EditUserProfile;
