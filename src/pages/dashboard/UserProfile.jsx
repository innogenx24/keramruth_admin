import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useSelector, useDispatch } from "react-redux";
import { fetchUsersRequest } from "../../redux/slices/user-profile-slice/UserGetSlice";
import { signOut } from "../../redux/slices/authSlice";

function UserProfile() {
  const navigate = useNavigate(); // Initialize navigate
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const [selectedImage, setSelectedImage] = useState(""); // State for selected image
  const imageBaseURL = "http://localhost:3002/";

  // Set the selected image to the existing image if present
  useEffect(() => {
    if (users?.image) {
      const imageUrl = users.image.includes("http")
        ? users.image
        : `${imageBaseURL}${users.image}`;
      setSelectedImage(imageUrl);
    }
  }, [users]);

  useEffect(() => {
    dispatch(fetchUsersRequest());
  }, [dispatch]);

  const handleEditProfile = () => {
    navigate("/dashboard/edit-profile");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(signOut());
    navigate('/signin');
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      {/* Profile Information */}
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="center">
              <Avatar
                alt={users?.full_name || "User"}
                src={selectedImage || "default-avatar.jpg"} // Use the selected image or a default
                sx={{ width: 100, height: 100 }}
              />
            </Box>
            <Typography align="center" variant="h6">
              {users?.full_name}
            </Typography>
            <Typography
              align="center"
              variant="subtitle1"
              color="textSecondary"
            >
              {users?.username}
            </Typography>
            <Typography align="center" variant="subtitle2">
              {users?.role_name}
            </Typography>
            <Box mt={2}>
              <Typography variant="body2" align="center">
              {users?.building_no_name}, {users?.street_name}, {users?.city},
                <br /> {users?.state}, {users?.pincode}
              </Typography>
              <Typography variant="body2" align="center">
              {users?.mobile_number}
              </Typography>
              <Typography variant="body2" align="center">
              {users?.email}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button variant="contained" color="error" onClick={handleLogout}>
                Logout
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleEditProfile}
                sx={{ minWidth: "100px%" }}
              >
                Edit
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Access Permissions */}
      <Grid item xs={12} sm={4}>
        <Paper elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Access:
            </Typography>
            <Grid container spacing={1}>
              {[
                "Add & Edit Users",
                "Add & Edit Products",
                "Add & Edit Announcement",
                "Add & Edit Sales Target",
                "Add & Edit Minimum Stock",
                "Add & Edit Roles",
                "Add & Edit Club",
              ].map((access, index) => (
                <Grid item xs={6} key={index}>
                  <FormControlLabel
                    control={<Checkbox checked />}
                    label={access}
                  />
                </Grid>
              ))}
              {[
                "Delete Users",
                "Delete Products",
                "Delete Announcement",
                "Delete Sales Target",
                "Delete Minimum Stock",
                "Delete Roles",
                "Delete Club",
              ].map((access, index) => (
                <Grid item xs={6} key={index}>
                  <FormControlLabel
                    control={<Checkbox checked />}
                    label={access}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Paper>
      </Grid>

      {/* ID Card */}
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="center" mb={2}>
              <Avatar
                alt={users?.full_name || "User"}
                src={selectedImage || "default-avatar.jpg"} // Use the selected image or a default
                sx={{ width: 80, height: 80 }}
              />
            </Box>
            <Typography align="center" variant="h6">
            {users?.full_name}
            </Typography>
            <Typography
              align="center"
              variant="subtitle1"
              color="textSecondary"
            >
              {users?.username}
            </Typography>
            <Typography align="center" variant="subtitle2">
            {users?.role_name}
            </Typography>
            <Typography align="center" variant="body2">
              Mobile: +91 {users?.mobile_number}
            </Typography>
            <Typography align="center" variant="body2">
            {users?.email}
            </Typography>
            <Typography align="center" variant="body2">
            {users?.building_no_name}, {users?.street_name}, {users?.city},
            <br /> {users?.state}, {users?.pincode}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default UserProfile;
