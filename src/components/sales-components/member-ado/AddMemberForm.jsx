import { useState, useRef, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Box,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import "./addmember.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { makePostMember } from "../../../redux/slices/member-slice/MemberPostSlice";
import { fetchAllMembersRequest } from "../../../redux/slices/member-slice/GetAllmemberSlices"; // Import useNavigate

const AddMemberForm = () => {
  const dispatch = useDispatch();

  const [selectClub, setSelectedClub] = useState("");
  const fileInputRef = useRef(null); // Ref to reset file input
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const { allmembers } = useSelector((state) => state.allmembers);

  useEffect(() => {
    dispatch(fetchAllMembersRequest());
  }, [selectedRole, dispatch]);

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      role_id: "",
      image: null,
      full_name: "",
      username: "",
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
      club: "",
      superior_id: 24,
      superior_d: "",
      superior_sd: "",
      superior_md: "",
      superior_ado: "",
    },
    validationSchema: Yup.object({
      role_id: Yup.string().required("Please select one Role"),
      image: Yup.mixed(),
      // .test('fileSize', 'File size is too large', (value) => {
      //   if (value) {
      //     return value.size <= 1000000; // 1MB
      //   }
      //   return true;
      // })
      // .test('fileType', 'Unsupported file format', (value) => {
      //   if (value) {
      //     return ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type);
      //   }
      //   return true;
      // }),
      full_name: Yup.string().required("Required"),
      username: Yup.string().required("Required"),
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
      club: Yup.string(),
      superior_ado: Yup.number(),
      superior_md: Yup.number(),
      superior_sd: Yup.number(),
      superior_d: Yup.number(),
    }),
    onSubmit: (values, { resetForm }) => {
      const parsedValues = {
        ...values,
        role_id: parseInt(values.role_id, 10),
        image: values.image?.name,
        superior_id: parseInt(values.superior_id, 10),
        superior_d: parseInt(values.superior_d, 10),
        superior_sd: parseInt(values.superior_sd, 10),
        superior_md: parseInt(values.superior_md, 10),
        superior_ado: parseInt(values.superior_ado, 10),
      };
      dispatch(makePostMember(parsedValues));
      resetForm();
      setSelectedRole("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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

  return (
    <Box p={3}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          {/* Left Side: Member Details */}
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
                    // {...formik.getFieldProps("role_id")}
                    // error={formik.touched.role_id && Boolean(formik.errors.role_id)}
                    // helperText={formik.touched.role_id && formik.errors.role_id}
                  >
                    <MenuItem value="">Select Role</MenuItem>
                    <MenuItem value="2">Area Developemnt Officer(ADO)</MenuItem>
                    <MenuItem value="3">Master Distributor(MD)</MenuItem>
                    <MenuItem value="4">Super Distributor(SD)</MenuItem>
                    <MenuItem value="5">Distributors</MenuItem>
                    <MenuItem value="6">Customers</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>Add Images</InputLabel>
                  <TextField
                    name="image"
                    type="file"
                    inputProps={{ accept: "image/*" }}
                    fullWidth
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      formik.setFieldValue("image", file); // Set file to formik state
                      setSelectedFile(file); // Update local state if needed
                    }}
                    inputRef={fileInputRef} // Attach the ref to the file input
                    error={formik.touched.image && Boolean(formik.errors.image)}
                    helperText={formik.touched.image && formik.errors.image}
                  />
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
                <Grid item xs={12}>
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
                </Grid>
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
                    type="password"
                    {...formik.getFieldProps("password")}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Address Section */}
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

          {/* Right Side: Club & Superior Distributors */}
          <Grid item xs={12} md={6}>
            <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>
              <InputLabel>Club & Superior Distributors</InputLabel>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InputLabel>Club*</InputLabel>
                  <Select
                    fullWidth
                    defaultValue=""
                    name="club"
                    value={selectClub}
                    onChange={handleClubChange}
                    {...formik.getFieldProps("club")}
                    error={formik.touched.club && Boolean(formik.errors.club)}
                    helperText={formik.touched.club && formik.errors.club}
                  >
                    <MenuItem value="">Select Club</MenuItem>
                    <MenuItem value="500">500 Litres</MenuItem>
                    <MenuItem value="1000">1000 Litres</MenuItem>
                    <MenuItem value="1500">1500 Litres</MenuItem>
                    <MenuItem value="2000">2000 Litres</MenuItem>
                    <MenuItem value="2500">2500 Litres</MenuItem>
                  </Select>
                </Grid>

                {/* Conditionally render the fields based on the selected role */}
                {selectedRole === "6" && (
                  <Grid item xs={12}>
                    <InputLabel>Distributor</InputLabel>
                    <Select
                      fullWidth
                      defaultValue=""
                      name="superior_d"
                      value={formik.values.superior_d}
                      onChange={(event) => {
                        formik.handleChange(event);
                      }}
                      {...formik.getFieldProps("superior_d")}
                      error={
                        formik.touched.superior_d &&
                        Boolean(formik.errors.superior_d)
                      }
                      helperText={
                        formik.touched.superior_d && formik.errors.superior_d
                      }
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

                {(selectedRole === "6" || selectedRole === "5") && (
                  <Grid item xs={12}>
                    <InputLabel>Super Distributor</InputLabel>
                    <Select
                      fullWidth
                      defaultValue=""
                      name="superior_sd"
                      value={formik.values.superior_sd}
                      onChange={(event) => {
                        formik.handleChange(event);
                      }}
                      {...formik.getFieldProps("superior_sd")}
                      error={
                        formik.touched.superior_sd &&
                        Boolean(formik.errors.superior_sd)
                      }
                      helperText={
                        formik.touched.superior_sd && formik.errors.superior_sd
                      }
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

                {(selectedRole === "6" ||
                  selectedRole === "5" ||
                  selectedRole === "4") && (
                  <Grid item xs={12}>
                    <InputLabel>Master Distributor</InputLabel>
                    <Select
                      fullWidth
                      defaultValue=""
                      name="superior_md"
                      value={formik.values.superior_md}
                      onChange={(event) => {
                        formik.handleChange(event);
                      }}
                      {...formik.getFieldProps("superior_md")}
                      error={
                        formik.touched.superior_md &&
                        Boolean(formik.errors.superior_md)
                      }
                      helperText={
                        formik.touched.superior_md && formik.errors.superior_md
                      }
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

                {(selectedRole === "6" ||
                  selectedRole === "5" ||
                  selectedRole === "4" ||
                  selectedRole === "3") && (
                  <Grid item xs={12}>
                    <InputLabel>Area Developement Officer</InputLabel>
                    <Select
                      fullWidth
                      defaultValue=""
                      name="superior_ado"
                      value={formik.values.superior_ado}
                      onChange={(event) => {
                        formik.handleChange(event);
                      }}
                      {...formik.getFieldProps("superior_ado")}
                      error={
                        formik.touched.superior_ado &&
                        Boolean(formik.errors.superior_ado)
                      }
                      helperText={
                        formik.touched.superior_ado &&
                        formik.errors.superior_ado
                      }
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
              </Grid>
            </Box>

            {/* Save Button */}
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
    </Box>
  );
};

export default AddMemberForm;
