import { useState, useRef, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Box,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { makePostMember } from "../../../redux/slices/member-slice/MemberPostSlice";
import { fetchAllMembersRequest } from "../../../redux/slices/member-slice/GetAllmemberSlices";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AddMemberForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const { loading, success, error, member } = useSelector((state) => state.memberPost);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [selectClub, setSelectedClub] = useState("500 Litres");
  const fileInputRef = useRef(null); // Ref to reset file input
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const { allmembers } = useSelector((state) => state.allmembers);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  

  useEffect(() => {
    if (isFormSubmitted) { 
    if (error) {
      setErrorMessage(error);
      setOpenSnackbar(true);
    }
    if (success) {
      setErrorMessage('Member added successfully!');
      setOpenSnackbar(true);
    }
  }
  }, [error, success]);

  // Fetch clubs from the API
  const fetchClubs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      const response = await fetch("http://88.222.245.236:3002/club", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setClubs(result.data); // Populate clubs data
      } else {
        console.error("Error fetching clubs:", result.message);
      }
    } catch (error) {
      console.error("Error fetching clubs:", error);
    } finally {
    }
  };

  // Fetch clubs on component mount
  useEffect(() => {
    fetchClubs();
  }, []);

  useEffect(() => {
    dispatch(fetchAllMembersRequest());
  }, [selectedRole, dispatch]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      formik.setFieldValue("image", file); // Set the image in Formik field
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL
    }
  };

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      role_id: "",
      image: null,
      full_name: "",
      // username: "",
      mobile_number: "",
      email: "",
      password: "",
      pincode: "",
      country: "",
      state: "",
      district: "",
      city: "",
      street_name: "",
      building_no_name: "",
      club_name: "",

      superior_id: null,
    },
    validationSchema: Yup.object({
      role_id: Yup.string().required("Please select one Role"),
      image: Yup.mixed(),
      full_name: Yup.string().required("Required"),
      // username: Yup.string().required("Required"),
      mobile_number: Yup.number().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
      pincode: Yup.number().required("Required"),
      country: Yup.string().required("Required"),
      state: Yup.string().required("Required"),
      district: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
      street_name: Yup.string().required("Required"),
      building_no_name: Yup.string().required("Required"),
      club_name: Yup.string().required("Please select a club"), // Validate club_name

    }),
    onSubmit: (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("role_id", values.role_id);
      formData.append("full_name", values.full_name);
      // formData.append("username", values.username);
      formData.append("mobile_number", values.mobile_number);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("pincode", values.pincode);
      formData.append("country", values.country);
      formData.append("state", values.state);
      formData.append("district", values.district);
      formData.append("city", values.city);
      formData.append("street_name", values.street_name);
      formData.append("building_no_name", values.building_no_name);
      formData.append("club_name", formik.values.club_name); // Append club_name
      formData.append("image", values.image);
      formData.append("superior_id", values.superior_id);
      
      setIsFormSubmitted(true); 
      dispatch(makePostMember(formData));
      // resetForm();
      // navigate('/dashboard/members');
    },
  });

  // Handle change when selecting a club
  const handleClubChange = (event) => {
    setSelectedClub(event.target.value);
  };

  // Handle change when selecting a role
  const handleRoleChange = (event) => {
    formik.setFieldValue("role_id", event.target.value);
    setSelectedRole(event.target.value);
  };


  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };


  return (
    <Box p={3}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          {/* {/ Left Side: Member Details /} */}
          <Grid item xs={12} md={6}>
            <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>
              <InputLabel>Member Details</InputLabel>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InputLabel>Member Role*</InputLabel>
                  <Select
                    fullWidth
                    defaultValue=""
                    name="role_id"
                    value={selectedRole}
                    onChange={handleRoleChange}
                  >
                    <MenuItem value="">Select Role</MenuItem>
                    <MenuItem value="2">Area Development Officer(ADO)</MenuItem>
                    <MenuItem value="3">Master Distributor(MD)</MenuItem>
                    <MenuItem value="4">Super Distributor(SD)</MenuItem>
                    <MenuItem value="5">Distributors</MenuItem>
                    <MenuItem value="6">Customers</MenuItem>
                  </Select>
                </Grid>

                {/* Image Upload Section */}
                <Grid item xs={12}>
  <InputLabel>Add Image*</InputLabel>
  <IconButton color="primary" component="label">
    <AddPhotoAlternateIcon />
    <input
      type="file"
      hidden
      accept="image/*"
      onChange={handleImageChange}
    />
  </IconButton>
  {selectedFile && (
    <Typography variant="body2" sx={{ marginTop: "10px" }}>
      Selected file: {selectedFile.name}
    </Typography>
  )}
  {/* Preview the uploaded image */}
  {imagePreview && (
    <Box mt={2}>
      <img
        src={imagePreview}
        alt="Preview"
        style={{ width: "100%", maxWidth: "300px", height: "auto", borderRadius: "8px" }}
      />
    </Box>
  )}
</Grid>


                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="full_name"
                    label="Full Name*"
                    {...formik.getFieldProps("full_name")}
                    error={
                      formik.touched.full_name &&
                      Boolean(formik.errors.full_name)
                    }
                    helperText={
                      formik.touched.full_name && formik.errors.full_name
                    }
                  />
                </Grid>
                {/* <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="username"
                    label="User Name*"
                    {...formik.getFieldProps("username")}
                    error={
                      formik.touched.username && Boolean(formik.errors.username)
                    }
                    helperText={
                      formik.touched.username && formik.errors.username
                    }
                  />
                </Grid> */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="mobile_number"
                    label="Mobile No*"
                    type="number"
                    {...formik.getFieldProps("mobile_number")}
                    error={
                      formik.touched.mobile_number &&
                      Boolean(formik.errors.mobile_number)
                    }
                    helperText={
                      formik.touched.mobile_number &&
                      formik.errors.mobile_number
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Email ID*"
                    {...formik.getFieldProps("email")}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
      <TextField
        fullWidth
        name="password"
        label="Password*"
        type={showPassword ? "text" : "password"} // Toggle type based on state
        {...formik.getFieldProps("password")}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        InputProps={{
          // Add an icon button to toggle visibility
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleTogglePasswordVisibility}
                edge="end"
                aria-label="toggle password visibility"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Grid>
              </Grid>
            </Box>

            {/* {/ Address Section /} */}
            <Box
              mt={3}
              sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}
            >
              <InputLabel>Address</InputLabel>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="pincode"
                    label="Pincode*"
                    {...formik.getFieldProps("pincode")}
                    error={
                      formik.touched.pincode && Boolean(formik.errors.pincode)
                    }
                    helperText={formik.touched.pincode && formik.errors.pincode}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="country"
                    label="Country*"
                    {...formik.getFieldProps("country")}
                    error={
                      formik.touched.country && Boolean(formik.errors.country)
                    }
                    helperText={formik.touched.country && formik.errors.country}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="state"
                    label="State*"
                    {...formik.getFieldProps("state")}
                    error={formik.touched.state && Boolean(formik.errors.state)}
                    helperText={formik.touched.state && formik.errors.state}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="district"
                    label="District*"
                    {...formik.getFieldProps("district")}
                    error={
                      formik.touched.district && Boolean(formik.errors.district)
                    }
                    helperText={
                      formik.touched.district && formik.errors.district
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="city"
                    label="City*"
                    {...formik.getFieldProps("city")}
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    helperText={formik.touched.city && formik.errors.city}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="street_name"
                    label="Street Name"
                    {...formik.getFieldProps("street_name")}
                    error={
                      formik.touched.street_name &&
                      Boolean(formik.errors.street_name)
                    }
                    helperText={
                      formik.touched.street_name && formik.errors.street_name
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="building_no_name"
                    label="Building No / Name"
                    {...formik.getFieldProps("building_no_name")}
                    error={
                      formik.touched.building_no_name &&
                      Boolean(formik.errors.building_no_name)
                    }
                    helperText={
                      formik.touched.building_no_name &&
                      formik.errors.building_no_name
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* {/ Right Side: Club & Superior Distributors /} */}
          <Grid item xs={12} md={6}>
            <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>
              <InputLabel>Club & Superior Distributors</InputLabel>
              <Grid container spacing={2}>
              <Grid item xs={12}>
  <InputLabel>Club*</InputLabel>
  <Select
    fullWidth
    name="club_name"
    value={formik.values.club_name}
    onChange={(e) => {
      formik.setFieldValue("club_name", e.target.value); // Set club_name directly
    }}
    error={Boolean(formik.touched.club_name && formik.errors.club_name)}
  >
    <MenuItem value="">Select Club</MenuItem>
    {clubs.map((club) => (
      <MenuItem key={club.id} value={club.club_name}>
        {club.club_name}
      </MenuItem>
    ))}
  </Select>
  {formik.touched.club_name && formik.errors.club_name && (
    <Typography color="error">{formik.errors.club_name}</Typography>
  )}
</Grid>




                {(selectedRole === "6" ||
                  selectedRole === "5" ||
                  selectedRole === "4" ||
                  selectedRole === "3") && (
                    <Grid item xs={12}>
                      <InputLabel>Area Development Officer</InputLabel>
                      <Select
                        fullWidth
                        defaultValue=""
                        name="superior_id"
                        value={formik.values.superior_id}
                        onChange={(event) => {
                          formik.setFieldValue("superior_id", event.target.value);
                        }}
                        error={formik.touched.superior_id && Boolean(formik.errors.superior_id)}
                        helperText={formik.touched.superior_id && formik.errors.superior_id}
                      >
                        <MenuItem value="">Select (ADO)</MenuItem>
                        {allmembers?.ADOs?.map((item) => (
                          <MenuItem key={item?.id} value={item?.id}>
                            {item?.username}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  )}

                {(selectedRole === "6" ||
                  selectedRole === "5" ||
                  selectedRole === "4") && (
                    <Grid item xs={12}>
                      <InputLabel>Master Distributor</InputLabel>
                      <Select
                        fullWidth
                        defaultValue=""
                        name="superior_id"
                        value={formik.values.superior_id}
                        onChange={(event) => {
                          formik.setFieldValue("superior_id", event.target.value);
                        }}
                        error={formik.touched.superior_id && Boolean(formik.errors.superior_id)}
                        helperText={formik.touched.superior_id && formik.errors.superior_id}
                      >
                        <MenuItem value="">Select Master Distributor</MenuItem>
                        {allmembers?.MDs?.map((item) => (
                          <MenuItem key={item?.id} value={item?.id}>
                            {item?.username}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  )}

                {(selectedRole === "6" || selectedRole === "5") && (
                  <Grid item xs={12}>
                    <InputLabel>Super Distributor</InputLabel>
                    <Select
                      fullWidth
                      defaultValue=""
                      name="superior_id"
                      value={formik.values.superior_id}
                      onChange={(event) => {
                        formik.setFieldValue("superior_id", event.target.value);
                      }}
                      error={formik.touched.superior_id && Boolean(formik.errors.superior_id)}
                      helperText={formik.touched.superior_id && formik.errors.superior_id}
                    >
                      <MenuItem value="">Select Super Distributor</MenuItem>
                      {allmembers?.SDs?.map((item) => (
                        <MenuItem key={item?.id} value={item?.id}>
                          {item?.username}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                )}

                {selectedRole === "6" && (
                  <Grid item xs={12}>
                    <InputLabel>Distributor</InputLabel>
                    <Select
                      fullWidth
                      defaultValue=""
                      name="superior_id"
                      value={formik.values.superior_id}
                      onChange={(event) => {
                        formik.setFieldValue("superior_id", event.target.value);
                      }}
                      error={formik.touched.superior_id && Boolean(formik.errors.superior_id)}
                      helperText={formik.touched.superior_id && formik.errors.superior_id}
                    >
                      <MenuItem value="">Select Distributor</MenuItem>
                      {allmembers?.Ds?.map((item) => (
                        <MenuItem key={item?.id} value={item?.id}>
                          {item?.username}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                )}



              </Grid>
            </Box>

            {/* {/ Save Button /} */}
            <Box mt={3} textAlign="right">
              <Button
                variant="contained"
                color="success"
                size="large"
                type="submit"
              >
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={error ? "error" : "success"}
          sx={{ width: "100%", background: error ? 'red' : 'green', color: 'white' }}
        >
          {errorMessage || "An error occurred while updating member data."}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddMemberForm;