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
  CircularProgress,
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
  const { success, error, member } = useSelector(
    (state) => state.memberPost
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [imageError, setImageError] = useState("");
  // const [selectClub, setSelectedClub] = useState("500 Litres");
  // const fileInputRef = useRef(null); // Ref to reset file input
  const [states, setStates] = useState([]); // Define states
  const [districts, setDistricts] = useState([]); // Define districts
  const [selectedClub, setSelectedClub] = useState("500 Litres");
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const { allmembers } = useSelector((state) => state.allmembers);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stateDistrictMapping, setStateDistrictMapping] = useState({});

  useEffect(() => {
    if (isFormSubmitted) {
      if (error) {
        setErrorMessage(error);
        setOpenSnackbar(true);
      }
      if (success) {
        setErrorMessage("Member added successfully!");
        setOpenSnackbar(true);

        // Wait for 2 seconds before navigating
        setTimeout(() => {
          setOpenSnackbar(false);
          navigate("/dashboard/members");
        }, 2000);
      }
    }
  }, [error, success]);
  // const [loading, setLoading] = useState(false);

  // State to City mapping
  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    formik.setFieldValue("pincode", pincode);

    if (pincode.length === 6) {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`
        );
        const data = await response.json();

        if (data[0].Status === "Success") {
          const { State, District } = data[0].PostOffice[0];
          formik.setFieldValue("state", State);
          formik.setFieldValue("district", District);

          // Populate districts and mapping dynamically if needed
          setStateDistrictMapping((prev) => ({
            ...prev,
            [State]: [...new Set(data[0].PostOffice.map((po) => po.District))],
          }));
          setDistricts([...new Set(data[0].PostOffice.map((po) => po.District))]);
        } else {
          formik.setFieldError("pincode", "Invalid Pincode.");
        }
      } catch (error) {
        formik.setFieldError("pincode", "Failed to fetch details.");
      } finally {
        setLoading(false);
      }
    }
  };
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const UserId = user?.id;
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;


  const fetchClubs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      const response = await fetch(`${API_END_POINT}/club`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setClubs(result.data);
      } else {
        console.error("Error fetching clubs:", result.message);
      }
    } catch (error) {
      console.error("Error fetching clubs:", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  useEffect(() => {
    dispatch(fetchAllMembersRequest());
  }, [selectedRole, dispatch]);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type (JPEG, JPG, PNG)
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setImageError("Only JPEG, JPG, or PNG images are allowed.");
        return; // Stop further processing if the file type is not allowed
      }

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setImageError("File size must be less than 2MB.");
        return; // Stop further processing if the file size exceeds 2MB
      }

      // If validation passes, set the selected file and preview
      setSelectedFile(file);
      formik.setFieldValue("image", file); // Set the image in Formik field
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL
      setImageError(""); // Clear any previous error message
      setOpenSnackbar(false); // Hide the snackbar error
    } else {
      // Clear any existing error message when no file is selected
      setImageError("");
    }
  };


  // Formik setup
  const formik = useFormik({
    initialValues: {
      role_id: "",
      image: null,
      full_name: "",
      mobile_number: "",
      email: "",
      password: "",
      pincode: "",
      country: "India", // Set default country value
      state: "",
      district: "",
      city: "",
      street_name: "",
      building_no_name: "",
      club_name: "",
      superior_id: "",
    },
    validationSchema: Yup.object({
      role_id: Yup.string().required("Please select one Role"),
      // image: Yup.mixed(),
      full_name: Yup.string().required("Required"),
      // mobile_number: Yup.number().required("Required"),
      mobile_number: Yup.string()
        .required("Required")
        .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
      password: Yup.string().required("Required"),
      pincode: Yup.number().required("Required"),
      country: Yup.string().required("Required"),
      state: Yup.string().required("Required"),
      district: Yup.string().required("Required"),
      club_name: Yup.string(),
      // superior_id: Yup.string().required("Please select aany one  superior_id"),
    }),
    onSubmit: (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("role_id", values.role_id);
      formData.append("full_name", values.full_name);
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
      formData.append("club_name", values.club_name);
      formData.append("image", values.image);
      // formData.append("superior_id", values.superior_id);
      const finalSuperiorId =
        selectedD || selectedSd || selectedMd || selectedAdo || selectedAdmin || UserId;
      formData.append("superior_id", finalSuperiorId);


      setIsFormSubmitted(true);

      dispatch(makePostMember(formData));
      resetForm();
    },
  });

  // Handle state change to update corresponding districts
  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    formik.setFieldValue("state", selectedState); // Set the selected state in Formik
    setDistricts(stateDistrictMapping[selectedState] || []); // Update districts based on the state
    formik.setFieldValue("district", ""); // Clear district field on state change
  };

  // Handle club change
  const handleClubChange = (event) => {
    setSelectedClub(event.target.value);
  };

  const roleOptions = (() => {
    switch (role) {
      case "Admin":
        return [
          { label: "Area Development Officer (ADO)", value: "2" },
          { label: "Master Distributor (MD)", value: "3" },
          { label: "Super Distributor (SD)", value: "4" },
          { label: "Distributor (D)", value: "5" },
          { label: "Customer (C)", value: "6" },
        ];
      case "Area Development Officer":
        return [
          { label: "Master Distributor (MD)", value: "3" },
          { label: "Super Distributor (SD)", value: "4" },
          { label: "Distributor (D)", value: "5" },
          { label: "Customer (C)", value: "6" },
        ];
      case "Master Distributor":
        return [
          { label: "Super Distributor (SD)", value: "4" },
          { label: "Distributor (D)", value: "5" },
          { label: "Customer (C)", value: "6" },
        ];
      case "Super Distributor":
        return [
          { label: "Distributor (D)", value: "5" },
          { label: "Customer (C)", value: "6" },
        ];
      case "Distributor":
        return [{ label: "Customer (C)", value: "6" }];
      default:
        return [];
    }
  })();

  // Handle role change
  const handleRoleChange = (event) => {
    formik.setFieldValue("role_id", event.target.value);
    setSelectedRole(event.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  /////**dropdown implementation****//// */
  //////////////////////////////////////////
  const [mds, setMds] = useState([]);
  const [sds, setSds] = useState([]);
  const [ds, setDs] = useState([]);
  const [selectedAdo, setSelectedAdo] = useState(null);
  const [selectedMd, setSelectedMd] = useState(null);
  const [selectedSd, setSelectedSd] = useState(null);
  const [selectedD, setSelectedD] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  // console.log("selectedAdmin", selectedAdmin);

  useEffect(() => {
    if (selectedRole) {
      // Reset dependent states when role changes
      setSelectedAdmin(null);
      setSelectedAdo(null);
      setSelectedMd(null);
      setSelectedSd(null);
      setSelectedD(null);
    }
  }, [selectedRole]);

  //*** Initialy data set***//
  useEffect(() => {
    if (user?.role === "Area Development Officer") {
      setSelectedAdo(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === "Master Distributor") {
      setSelectedMd(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === "Super Distributor") {
      setSelectedSd(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === "Distributor") {
      setSelectedD(user.id);
    }
  }, [user]);

  //*** Dta Fetching For Dynamic dropdown  ***//
  useEffect(() => {
    if (selectedAdo && ["3", "4", "5", "6"].includes(selectedRole)) {
      // Fetch MDs based on selected ADO
      fetch(
        `${API_END_POINT}/directMembers/users-by-ado?adoId=${selectedAdo}&roleId=3`
      )
        .then((res) => res.json())
        .then((data) => setMds(data))
        .catch((err) => console.error("Error fetching MDs:", err));
    }
  }, [selectedAdo, selectedRole]);

  useEffect(() => {
    if (selectedMd && ["4", "5", "6"].includes(selectedRole)) {
      // Fetch SDs based on selected MD
      fetch(
        `${API_END_POINT}/directMembers/users-by-md?mdId=${selectedMd}&roleId=4`
      )
        .then((res) => res.json())
        .then((data) => setSds(data))
        .catch((err) => console.error("Error fetching SDs:", err));
    }
  }, [selectedMd, selectedRole]);

  useEffect(() => {
    if (selectedSd && ["5", "6"].includes(selectedRole)) {
      // Fetch Ds based on selected SD
      fetch(
        `${API_END_POINT}/directMembers/users-by-sd?sdId=${selectedSd}&roleId=5`
      )
        .then((res) => res.json())
        .then((data) => setDs(data))
        .catch((err) => console.error("Error fetching Ds:", err));
    }
  }, [selectedSd, selectedRole]);

  const handleAdminChange = (adminId) => {
    setSelectedAdmin(adminId);
    setSelectedAdo(null);
    setSelectedSd(null);
    setSds([]);
    setSelectedD(null);
    setDs([]);
  };

  const handleAdoChange = (adoId) => {
    setSelectedAdo(adoId);
    setSelectedMd(null);
    setMds([]);
    setSelectedSd(null);
    setSds([]);
    setSelectedD(null);
    setDs([]);
  };

  const handleMdChange = (mdId) => {
    setSelectedMd(mdId);
    setSelectedSd(null);
    setSds([]);
    setSelectedD(null);
    setDs([]);
  };

  const handleSdChange = (sdId) => {
    setSelectedSd(sdId);
    setSelectedD(null);
    setDs([]);
  };

  const handleDChange = (dId) => {
    setSelectedD(dId);
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
                    {/* Default Option */}
                    <MenuItem value="">Select Role</MenuItem>

                    {/* Dynamic Role Options */}
                    {roleOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
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
                        style={{
                          width: "100%",
                          maxWidth: "300px",
                          height: "auto",
                          borderRadius: "8px",
                        }}
                      />
                    </Box>
                  )}
                  {/* Display error message below image upload */}
                  {imageError && (
                    <Typography
                      color="error"
                      variant="body2"
                      sx={{ marginTop: "10px" }}
                    >
                      {imageError}
                    </Typography>
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
                    type="tel"
                    {...formik.getFieldProps("mobile_number")}
                    error={
                      formik.touched.mobile_number &&
                      Boolean(formik.errors.mobile_number)
                    }
                    helperText={
                      formik.touched.mobile_number &&
                      formik.errors.mobile_number
                    }
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Email ID"
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
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
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
            <Box mt={3} sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>
              <InputLabel>Address</InputLabel>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="pincode"
                    label="Pincode*"
                    value={formik.values.pincode}
                    onChange={handlePincodeChange}
                    error={formik.touched.pincode && Boolean(formik.errors.pincode)}
                    helperText={formik.touched.pincode && formik.errors.pincode}
                  />
                  {loading && <CircularProgress size={20} />}
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="country"
                    label="Country*"
                    value={formik.values.country}
                    InputProps={{
                      readOnly: true,
                    }}
                    error={formik.touched.country && Boolean(formik.errors.country)}
                    helperText={formik.touched.country && formik.errors.country}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="state"
                    label="State*"
                    value={formik.values.state}
                    InputProps={{
                      readOnly: true, // State is auto-filled based on PIN code
                    }}
                    error={formik.touched.state && Boolean(formik.errors.state)}
                    helperText={formik.touched.state && formik.errors.state}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="district"
                    label="District*"
                    value={formik.values.district}
                    InputProps={{
                      readOnly: true, // District is auto-filled based on PIN code
                    }}
                    error={formik.touched.district && Boolean(formik.errors.district)}
                    helperText={formik.touched.district && formik.errors.district}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="city"
                    label="City / Place"
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
                {!(selectedRole === "6" || selectedRole === "2") && (
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
                      <Typography color="error">
                        {formik.errors.club_name}
                      </Typography>
                    )}
                  </Grid>
                )}


                {selectedRole === "2" ? (
                  <Grid item xs={12}>
                    <InputLabel>Admin</InputLabel>
                    <Select
                      fullWidth
                      name="superior_id"
                      value={selectedAdmin || ""} // Show previous ADO for reference
                      onChange={(e) => handleAdminChange(e.target.value)}
                    >
                      <MenuItem value="">Select Admin</MenuItem>
                      {allmembers?.Admins?.map((item) => (
                        <MenuItem key={item?.id} value={item?.id}>
                          {item.full_name}{` (${item.username})`}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                ) : null}

                {!["Master Distributor", "Super Distributor", "Distributor"].includes(user?.role) && (
                  selectedRole === "3" ||
                    selectedRole === "4" ||
                    selectedRole === "5" ||
                    selectedRole === "6" ? (

                    <Grid item xs={12}>
                      <InputLabel>Area Development Officer (ADO)</InputLabel>
                      <Select
                        fullWidth
                        name="superior_id"
                        value={selectedAdo || ""} // Show previous ADO for reference
                        onChange={(e) => handleAdoChange(e.target.value)}
                        error={Boolean(!selectedAdo)}
                        disabled={user?.role === "Area Development Officer"}
                      >
                        <MenuItem value="">Select ADO</MenuItem>
                        {user?.role === "Area Development Officer" && (
                          <MenuItem value={user.id}>{user.user_name}</MenuItem>
                        )}
                        {allmembers?.ADOs?.map((item) => (
                          <MenuItem key={item?.id} value={item?.id}>
                            {item.full_name}{` (${item.username})`}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  ) : null
                )}

                {!["Super Distributor", "Distributor"].includes(user?.role) && (
                  selectedRole === "4" ||
                    selectedRole === "5" ||
                    selectedRole === "6" ? (
                    <Grid item xs={12}>
                      <InputLabel>Master Distributor (MD)</InputLabel>
                      <Select
                        fullWidth
                        name="superior_id"
                        value={selectedMd || ""} // Show previous MD for reference
                        onChange={(e) => handleMdChange(e.target.value)}
                        disabled={user?.role === "Master Distributor"} // Disable selection if logged-in user is MD
                      >
                        {/* Default "Select MD" option */}
                        <MenuItem value="">Select MD</MenuItem>

                        {/* Logged-in MD option (if applicable) */}
                        {user?.role === "Master Distributor" && (
                          <MenuItem value={user.id}>{user.user_name}</MenuItem>
                        )}

                        {/* Render MDs from the fetched list */}
                        {mds.length > 0 ? (
                          mds.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.full_name}{` (${item.username})`}
                            </MenuItem>
                          ))
                        ) : (
                          // No MDs available message
                          <MenuItem disabled>No MDs available</MenuItem>
                        )}
                      </Select>
                    </Grid>

                  ) : null
                )}

                {user?.role !== "Distributor" && (
                  selectedRole === "5" || selectedRole === "6" ? (
                    <Grid item xs={12}>
                      <InputLabel>Super Distributor (SD)</InputLabel>
                      <Select
                        fullWidth
                        name="superior_id"
                        value={selectedSd || ""} // Show previous SD for reference
                        onChange={(e) => handleSdChange(e.target.value)}
                        disabled={user?.role === "Super Distributor"}
                      >
                        <MenuItem value="">Select SD</MenuItem>
                        {user?.role === "Super Distributor" && (
                          <MenuItem value={user.id}>{user.user_name}</MenuItem>
                        )}

                        {sds.length > 0 ? (
                          sds?.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.full_name}{` (${item.username})`}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No SDs available</MenuItem>
                        )}
                      </Select>
                    </Grid>
                  ) : null
                )}

                {selectedRole === "6" ? (
                  <Grid item xs={12}>
                    <InputLabel>Distributor (D)</InputLabel>
                    <Select
                      fullWidth
                      name="superior_id"
                      value={selectedD || ""}
                      onChange={(e) => handleDChange(e.target.value)}
                      disabled={user?.role === "Distributor"}
                    >
                      <MenuItem value="">Select D</MenuItem>
                      {user?.role === "Distributor" && (
                        <MenuItem value={user.id}>{user.user_name}</MenuItem>
                      )}

                      {ds.length > 0 ? (
                        ds?.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.full_name}{` (${item.username})`}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No Ds available</MenuItem>
                      )}
                    </Select>
                  </Grid>
                ) : null}
              </Grid>
            </Box>

            {/* {/ Save Button /} */}
            <Box mt={3} textAlign="right">
              <Button
                variant="contained"
                color="success"
                size="large"
                type="submit"
                fullWidth
                sx={{ marginTop: "24px", borderRadius: "15px", padding: "8px" }}
              >
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000} // Auto-hide after 2 seconds
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={success ? "success" : "error"}
          variant="filled"
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddMemberForm;
