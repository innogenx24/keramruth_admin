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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { makeEditUser } from "../../redux/slices/user-profile-slice/UserEditSlice";

const EditUserProfile = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const imageBaseURL = "http://88.222.245.236:3002/uploads/";

  const [selectedImage, setSelectedImage] = useState("/static/images/avatar/1.jpg");
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

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
        image: users.image || "",
      });

      if (!imageFile && users.image) {
        setSelectedImage(users.image.includes("http") ? users.image : `${imageBaseURL}${users.image}`);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setImageError("Image size must be 2MB or less.");
        return;
      }
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
      setImageError("");
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
    formData.append("district", user.city);
    formData.append("state", user.state);
    formData.append("country", user.country);
    formData.append("building_no_name", user.building_no_name);
    formData.append("username", user.username);

    if (imageFile) {
      formData.append("image", imageFile);
    } else {
      formData.append("image", user.image);
    }

    try {
      const response = await dispatch(makeEditUser(formData));
      if (!response.error) {
        navigate("/dashboard/profile");
      } else {
        setErrors((prev) => ({
          ...prev,
          mobile_number: response.error.message === "Mobile number already in use" ? "Mobile number already in use." : "",
          email: response.error.message === "Email already in use" ? "Email already in use." : ""
        }));
      }
    } catch (error) {
      console.error("Submission error: ", error);
    }
  };

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#f5f5f5" }}>
      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={2}>
          {/* Left Section: Profile Details */}
          <Grid item xs={12} md={6}>
            <Box sx={{ padding: "20px", backgroundColor: "#fff", borderRadius: "10px" }}>
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
            </Box>
          </Grid>

          {/* Right Section: Save Changes */}
          <Grid item xs={12} md={6}>
            <Box sx={{ padding: "20px", backgroundColor: "#fff", borderRadius: "10px" }}>
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
    </Box>
  );
};

export default EditUserProfile;
