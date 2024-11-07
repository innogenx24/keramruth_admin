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
import "./user.css";
import { makeEditUser } from "../../redux/slices/user-profile-slice/UserEditSlice";
import { useDispatch, useSelector } from "react-redux";

const EditUserProfile = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  // console.log("users", users);
  const [selectedImage, setSelectedImage] = useState(
    "/static/images/avatar/1.jpg"
  );

  // Function to handle file input change (upload new image)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl); // Display the uploaded image
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
  });

  useEffect(() => {
    if (users) {
      setUser(users);
    }
  }, [users]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Function to handle form submission (update logic)
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    const parsedValues = {
      ...user,
    };
    console.log("parsedValues", parsedValues);
    dispatch(makeEditUser({ ...parsedValues }));
    setUser("");
  };

  return (
    <Box
      sx={{ padding: "20px", backgroundColor: "#f5f5f5" }}
      component="form"
      onSubmit={handleFormSubmit}
    >
      <Grid container spacing={2}>
        {/* Profile Section */}
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
            <Box display="flex" alignItems="center" marginBottom="20px">
              <Avatar
                alt="User Profile"
                src={selectedImage}
                sx={{
                  width: 80,
                  height: 80,
                  marginRight: "20px",
                  cursor: "pointer",
                }}
                onClick={() => document.getElementById("imageUpload").click()} // Trigger file input on click
              />
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange} // Handle file selection
              />
            </Box>

            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              name="full_name"
              value={user?.full_name}
              onChange={handleInputChange}
              required
              margin="normal"
            />

            {/* Other Profile Details */}
            <TextField
              fullWidth
              label="Mobile No"
              variant="outlined"
              name="mobile_number"
              value={user?.mobile_number}
              onChange={handleInputChange}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              label="Email ID"
              variant="outlined"
              name="email"
              value={user?.email}
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
              value={user?.pincode}
              onChange={handleInputChange}
              margin="normal"
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Country</InputLabel>
                  <Select defaultValue="India" label="Country">
                    <MenuItem value="India">India</MenuItem>
                    <MenuItem value="USA">USA</MenuItem>
                    <MenuItem value="Canada">Canada</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>State</InputLabel>
                  <Select defaultValue="Karnataka" label="State">
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
                  label="District"
                  variant="outlined"
                  defaultValue="Bengaluru"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Street Name"
                  variant="outlined"
                  name="street_name"
              value={user?.street_name}
              onChange={handleInputChange}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Building No / Name"
              variant="outlined"
              name="building_no_name"
              value={user?.building_no_name}
              onChange={handleInputChange}
              margin="normal"
            />
          </Box>
        </Grid>

        {/* Access Section */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              padding: "20px",
              backgroundColor: "#fff",
              borderRadius: "10px",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Access
            </Typography>

            {/* Checkbox Options for Access */}
            <Grid container spacing={2}>
              {[
                "Add & Edit Users",
                "Delete Users",
                "Add & Edit Products",
                "Delete Products",
                "Add & Edit Announcement",
                "Delete Announcement",
                "Add & Edit Sales Target",
                "Delete Sales Target",
                "Add & Edit Minimum Stock",
                "Delete Minimum Stock",
                "Add & Edit Roles",
                "Delete Sales Roles",
                "Add & Edit Club",
                "Delete Club",
                "Add & Edit Category",
                "Delete Category",
              ].map((label, index) => (
                <Grid item xs={6} key={index}>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label={label}
                  />
                </Grid>
              ))}
            </Grid>

            <Box display="flex" justifyContent="center" marginTop="20px">
              <Button variant="contained" color="success" type="submit">
                Save
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditUserProfile;
