import { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Box,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchAllMembersRequest } from "../../../redux/slices/member-slice/GetAllmemberSlices";
import { useDispatch, useSelector } from "react-redux";

const EditMemberForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { memberId } = useParams();
  const { allmembers } = useSelector((state) => state.allmembers);

  const [selectedRole, setSelectedRole] = useState(""); // Role dropdown value
  const [formData, setFormData] = useState({
    name: "",
    mobile_number: "",
    email: "",
    role_id: "",
    pincode: "",
    country: "",
    state: "",
    district: "",
    city: "",
    street: "",
    club: "",
    superior_id: "",
    password: "",
    street_name: "",
    building_no_name: "",
    username: "",

  });

  // Fetch all members on mount
  useEffect(() => {
    dispatch(fetchAllMembersRequest());
  }, [dispatch]);

  // Fetch member details for editing
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (memberId && token) {
      axios
        .get(`http://88.222.245.236:3002/directMembers/profileby-admin/${memberId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const member = response.data;
          setFormData({
            name: member.full_name || "",
            mobile_number: member.mobile_number || "",
            email: member.email || "",
            role_id: member.role_id || "",
            pincode: member.pincode || "",
            country: member.country || "",
            state: member.state || "",
            district: member.district || "",
            city: member.city || "",
            street_name: member.street_name || "",
            club: member.club_id || "",
            superior_id: member.superior_id || "",
            password: member.password || "",
            building_no_name: member.building_no_name || "",
            username: member.username || "",
          });
          setSelectedRole(member.role_id || "");
        })
        .catch((error) => {
          console.error("Error fetching member data", error);
          // navigate("/error");
        });
    }
  }, [memberId, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "role_id") setSelectedRole(value);
  };

  // Save updated member data

  const handleSave = () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .put(`http://LOCALHOST:3002/api/user/update/${memberId}`, formData, config)
      .then(() => {
        navigate(`/member-details/${memberId}`);
      })
      .catch((error) => {
        console.error("Error updating member data", error);
      });
  };

  // Filter dropdown options based on the role
  const renderDropdownOptions = () => {
    if (!selectedRole) return null;

    const roleDropdownMap = {
      3: { label: "Area Development Officer", options: allmembers?.ADOs || [] },
      4: { label: "Master Distributor", options: allmembers?.MDs || [] },
      5: { label: "Super Distributor", options: allmembers?.SDs || [] },
      6: { label: "Distributor", options: allmembers?.Ds || [] },
    };

    return Object.entries(roleDropdownMap)
      .filter(([role]) => parseInt(role) <= selectedRole)
      .map(([role, { label, options }]) => (
        <Grid item xs={12} key={role}>
          <InputLabel>{label}</InputLabel>
          <Select
            fullWidth
            name="superior_id"
            value={formData.superior_id}
            onChange={handleChange}
          >
            <MenuItem value="">Select {label}</MenuItem>
            {options.map((item) => (
              <MenuItem key={item?.id} value={item?.id}>
                {item?.username}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      ));
  };

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {/* Left Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>
            <InputLabel>Member Details</InputLabel>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <InputLabel>Member Role*</InputLabel>
                <Select
                  fullWidth
                  value={formData.role_id}
                  name="role_id"
                  onChange={handleChange}
                >
                  <MenuItem value="">Select Role</MenuItem>
                  <MenuItem value="2">Area Development Officer (ADO)</MenuItem>
                  <MenuItem value="3">Master Distributor (MD)</MenuItem>
                  <MenuItem value="4">Super Distributor (SD)</MenuItem>
                  <MenuItem value="5">Distributor</MenuItem>
                  <MenuItem value="6">Customer</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name*"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="username"
                  label="User Name*"
                  value={formData.username}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mobile No*"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email ID*"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password*"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
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
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="country"
                  label="Country*"
                  value={formData.country}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="state"
                  label="State*"
                  value={formData.state}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="district"
                  label="District*"
                  value={formData.district}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="city"
                  label="City*"
                  value={formData.city}
                  onChange={handleChange}

                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="street_name"
                  label="Street Name"
                  value={formData.street_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="building_no_name"
                  label="Building No / Name"
                  value={formData.building_no_name}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>


        </Grid>

        {/* Right Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>
            <InputLabel>Hierarchy & Club</InputLabel>
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <InputLabel>Club*</InputLabel>
                <Select
                  fullWidth
                  value={formData.club}
                  name="club"
                  onChange={handleChange}
                >
                  <MenuItem value="">Select Club</MenuItem>
                  <MenuItem value="500">500 Litres</MenuItem>
                  <MenuItem value="1000">1000 Litres</MenuItem>
                  <MenuItem value="1500">1500 Litres</MenuItem>
                  <MenuItem value="2000">2000 Litres</MenuItem>
                  <MenuItem value="2500">2500 Litres</MenuItem>
                </Select>
              </Grid>
              {renderDropdownOptions()}

            </Grid>
          </Box>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Member
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditMemberForm;
