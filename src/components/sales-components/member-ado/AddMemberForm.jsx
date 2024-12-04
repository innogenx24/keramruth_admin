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


  useEffect(() => {
    if (isFormSubmitted) {
      if (error) {
        setErrorMessage(error);
        setOpenSnackbar(true);
      }
      if (success) {
        setErrorMessage('Member added successfully!');
        setOpenSnackbar(true);
        navigate('/dashboard/members');
      }
    }
  }, [error, success]);
  // const [loading, setLoading] = useState(false);

  // State to City mapping
  const stateDistrictMapping = {
    "Andhra Pradesh": [
      "Anakapalli", "Anantapur", "Bapatla", "Chittoor", "East Godavari", "Eluru",
      "Guntur", "Kakinada", "Konaseema", "Krishna", "Kurnool", "Nandyal", "Nellore",
      "Parvathipuram Manyam", "Prakasam", "Sri Potti Sriramulu Nellore", "Sri Sathya Sai",
      "Srikakulam", "Tirupati", "Visakhapatnam", "Vizianagaram", "West Godavari",
      "YSR Kadapa", "Alluri Sitharama Raju", "NTR", "Palnadu"
    ],
    "Arunachal Pradesh": [
      "Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Kamle", "Kra Daadi", "Kurung Kumey", "Lepa Rada",
      "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Namsai", "Pakke Kessang", "Papum Pare",
      "Shi-Yomi", "Siang", "Tawang", "Tirap", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang"
    ],
    "Assam": [
      "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang",
      "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat",
      "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong",
      "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari",
      "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri",
      "West Karbi Anglong"
    ],
    "Bihar": [
      "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar",
      "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur",
      "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger",
      "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur",
      "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"
    ],
    "Chhattisgarh": [
      "Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur",
      "Dantewada", "Dhamtari", "Durg", "Gariaband", "Gaurela-Pendra-Marwahi", "Janjgir-Champa",
      "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Korea", "Mahasamund", "Mungeli",
      "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"
    ],
    "Goa": ["North Goa", "South Goa", "Panaji", "Vasco da Gama", "Margao"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Junagadh", "Kheda", "Mehsana", "Patan", "Sabarkantha", "Anand", "Banaskantha", "Dahod", "Narmada", "Porbandar", "Chhota Udepur", "Gir Somnath", "Mahisagar", "Morbi", "Navajo", "Surendranagar", "Tapi", "Valsad"],
    "Haryana": ["Chandigarh", "Faridabad", "Gurugram", "Ambala", "Hisar", "Karnal", "Panipat", "Rewari", "Sonipat", "Yamunanagar", "Bhiwani", "Rohtak", "Sirsa", "Jhajjar", "Mahendragarh", "Nuh", "Panchkula", "Fatehabad", "Palwal", "Kaithal"],
    "Himachal Pradesh": ["Shimla", "Manali", "Kullu", "Dharamsala", "Kangra", "Solan", "Mandi", "Bilaspur", "Hamirpur", "Una", "Sirmaur", "Chamba", "Kullu", "Lahaul and Spiti", "Una"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Hazaribagh", "Bokaro", "Deoghar", "Giridih", "Dumka", "Khunti", "Pakur", "Sahebganj", "Ramgarh", "Godda", "Latehar", "Palamu", "Simdega", "Chatra", "Garhwa", "Koderma", "Saraikela Kharsawan"],
    "Karnataka": ["Bangalore", "Mysuru", "Mangalore", "Hubli", "Belgaum", "Bidar", "Chikkaballapur", "Chikkamagaluru", "Davanagere", "Hassan", "Hubli", "Kolar", "Koppal", "Mandya", "Raichur", "Ramanagara", "Shivamogga", "Tumkur", "Udupi", "Ballari", "Chitradurga", "Dakshina Kannada", "Gadag", "Haveri", "Kodagu", "Bagalkot", "Yadgir"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kottayam", "Alappuzha", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Malappuram", "Palakkad", "Pathanamthitta", "Pernakulam", "Thrissur", "Wayanad"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Ujjain", "Jabalpur", "Sagar", "Rewa", "Satna", "Dewas", "Ratlam", "Shivpuri", "Sehore", "Shahdol", "Chhindwara", "Mandla", "Tikamgarh", "Panna", "Khargone", "Burhanpur", "Neemuch", "Mandsaur", "Balaghat", "Betul", "Hoshangabad", "Khandwa", "Alirajpur", "Anuppur", "Ashoknagar", "Chhatarpur", "Dindori", "Harda", "Jhabua", "Katni", "Narsinghpur", "Seoni", "Shivpuri", "Singrauli", "Umaria"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane", "Solapur", "Sangli", "Ratnagiri", "Jalgaon", "Satara", "Kolhapur", "Latur", "Nanded", "Amravati", "Akola", "Yavatmal", "Buldhana", "Hingoli", "Wardha", "Washim", "Chandrapur", "Gadchiroli", "Bhandara", "Sindhudurg", "Palghar"],
    "Manipur": ["Imphal", "Thoubal", "Kangpokpi", "Bishnupur", "Churachandpur", "Senapati", "Ukhrul", "Tamenglong", "Noney", "Peren"],
    "Meghalaya": ["East Khasi Hills", "West Khasi Hills", "Ri-Bhoi", "West Jaintia Hills", "East Jaintia Hills", "South Garo Hills", "North Garo Hills", "West Garo Hills"],
    "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Kolasib", "Mamit", "Serchhip", "Lawngtlai", "Hnahthial", "Siaha"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Mon", "Phek", "Tuensang", "Zunheboto"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Balasore", "Baripada", "Bargarh", "Jagatsinghpur", "Jajpur", "Kendrapara", "Khurda", "Koraput", "Nayagarh", "Puri", "Sambalpur", "Sundargarh", "Angul", "Ganjam", "Kalahandi", "Dhenkanal", "Deogarh", "Nuapada", "Malkangiri", "Rayagada", "Mayurbhanj"],
    "Punjab": ["Chandigarh", "Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda", "Firozpur", "Hoshiarpur", "Rupnagar", "Moga", "Faridkot", "Barnala", "Sangrur", "Mansa", "Muktsar", "Kapurthala", "Tarn Taran", "Shaheed Bhagat Singh Nagar", "Fatehgarh Sahib", "Sri Muktsar Sahib"],
    "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur", "Ajmer", "Kota", "Alwar", "Bikaner", "Bundi", "Churu", "Dausa", "Hanumangarh", "Jhunjhunu", "Jhalawar", "Nagaur", "Pali", "Rajsamand", "Sikar", "Sirohi", "Tonk", "Barmer", "Banswara", "Baran", "Bhilwara", "Dholpur", "Dungarpur", "Karauli", "Pali", "Pratapgarh", "Rajasmand", "Sawai Madhopur", "Shri Ganganagar"],
    "Sikkim": ["Gangtok", "Namchi", "Pakyong", "Mangan", "Rangpo"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Tirunelveli", "Erode", "Vellore", "Tirupur", "Dharmapuri", "Cuddalore", "Kanchipuram", "Nagapattinam", "Karur", "Pudukkottai", "Thanjavur", "Villupuram", "Dindigul", "Kanyakumari", "Ramanathapuram", "Thoothukudi", "Virudhunagar", "Sivaganga", "Krishnagiri", "Ariyalur", "Perambalur", "Tiruvarur"],
    "Telangana": ["Hyderabad", "Warangal", "Khammam", "Adilabad", "Nalgonda", "Karimnagar", "Mahabubnagar", "Nizamabad", "Medak", "Khammam", "Rangareddy", "Siddipet", "Jangaon", "Peddapalli", "Suryapet", "Warangal Rural", "Warangal Urban", "Mancherial", "Bhupalpally", "Mulugu", "Jayashankar", "Jogulamba Gadwal"],
    "Tripura": ["Agartala", "Udaipur", "Belonia", "Kailashahar", "Dharmanagar", "Ambassa", "Sabroom", "Khowai", "Teliamura", "Jolaibari"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Allahabad", "Gorakhpur", "Noida", "Meerut", "Mathura", "Firozabad", "Jhansi", "Ghaziabad", "Aligarh", "Bareilly", "Shahjahanpur", "Rampur", "Bijnor", "Moradabad", "Muzaffarnagar", "Saharanpur", "Jaunpur", "Sitapur", "Etawah", "Mau", "Azamgarh", "Ballia"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Nainital", "Rishikesh", "Almora", "Bageshwar", "Chamoli", "Champawat", "Haldwani", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
    "West Bengal": ["Kolkata", "Darjeeling", "Siliguri", "Asansol", "Howrah", "Bardhaman", "Malda", "Purulia", "Hooghly", "North 24 Parganas", "South 24 Parganas", "Maldah", "Birbhum", "Jalpaiguri", "Murshidabad", "Nadia", "Bankura", "Cooch Behar", "Purba Medinipur", "Paschim Medinipur"],
    "Andaman and Nicobar Islands": ["Port Blair"],
    "Chandigarh": ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
    "Lakshadweep": ["Kavaratti"],
    "Delhi": ["New Delhi", "Old Delhi", "Dwarka", "Rohini"],
    "Puducherry": ["Puducherry", "Auroville", "Mahe"],
  };


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
        setErrorMessage("Only JPEG, JPG, or PNG images are allowed.");
        return; // Stop further processing if the file type is not allowed
      }
  
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage("File size must be less than 2MB.");
        return; // Stop further processing if the file size exceeds 2MB
      }
  
      // If validation passes, set the selected file and preview
      setSelectedFile(file);
      formik.setFieldValue("image", file); // Set the image in Formik field
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL
      setErrorMessage(""); // Clear any previous error message
      setOpenSnackbar(false); // Hide the snackbar error
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
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
      pincode: Yup.number().required("Required"),
      country: Yup.string().required("Required"),
      state: Yup.string().required("Required"),
      district: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
      street_name: Yup.string().required("Required"),
      building_no_name: Yup.string().required("Required"),
      club_name: Yup.string().required("Please select a club"),
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
      const finalSuperiorId = selectedD || selectedSd || selectedMd || selectedAdo || selectedAdmin;
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


  useEffect(() => {
    if (selectedRole) {
      // Reset dependent states when role changes
      setSelectedAdmin(null)
      setSelectedAdo(null);
      setSelectedMd(null);
      setSelectedSd(null);
      setSelectedD(null);
    }
  }, [selectedRole]);

  useEffect(() => {
    if (selectedAdo && ["3", "4", "5", "6"].includes(selectedRole)) {
      // Fetch MDs based on selected ADO
      fetch(`http://88.222.245.236:3002/directMembers/users-by-ado?adoId=${selectedAdo}&roleId=3`)
        .then((res) => res.json())
        .then((data) => setMds(data))
        .catch((err) => console.error("Error fetching MDs:", err));
    }
  }, [selectedAdo, selectedRole]);

  useEffect(() => {
    if (selectedMd && ["4", "5", "6"].includes(selectedRole)) {
      // Fetch SDs based on selected MD
      fetch(`http://88.222.245.236:3002/directMembers/users-by-md?mdId=${selectedMd}&roleId=4`)
        .then((res) => res.json())
        .then((data) => setSds(data))
        .catch((err) => console.error("Error fetching SDs:", err));
    }
  }, [selectedMd, selectedRole]);

  useEffect(() => {
    if (selectedSd && ["5", "6"].includes(selectedRole)) {
      // Fetch Ds based on selected SD
      fetch(`http://88.222.245.236:3002/directMembers/users-by-sd?sdId=${selectedSd}&roleId=5`)
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
                    <MenuItem value="">Select Role</MenuItem>
                    <MenuItem value="2">Area Development Officer(ADO)</MenuItem>
                    <MenuItem value="3">Master Distributor(MD)</MenuItem>
                    <MenuItem value="4">Super Distributor(SD)</MenuItem>
                    <MenuItem value="5">Distributors</MenuItem>
                    <MenuItem value="6">Customers</MenuItem>
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
        style={{ width: "100%", maxWidth: "300px", height: "auto", borderRadius: "8px" }}
      />
    </Box>
  )}
  {/* Display error message below image upload */}
  {errorMessage && (
    <Typography color="error" variant="body2" sx={{ marginTop: "10px" }}>
      {errorMessage}
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
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
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
                    value={formik.values.country} // Bind value from Formik's values
                    InputProps={{
                      readOnly: true, // Make the field read-only
                    }}
                    {...formik.getFieldProps("country")}
                    error={formik.touched.country && Boolean(formik.errors.country)}
                    helperText={formik.touched.country && formik.errors.country}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="state"
                    label="State*"
                    select
                    value={formik.values.state}
                    onChange={handleStateChange}
                    error={formik.touched.state && Boolean(formik.errors.state)}
                    helperText={formik.touched.state && formik.errors.state}
                  >
                    {Object.keys(stateDistrictMapping).map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="district"
                    label="District*"
                    select
                    value={formik.values.district}
                    onChange={formik.handleChange}
                    error={formik.touched.district && Boolean(formik.errors.district)}
                    helperText={formik.touched.district && formik.errors.district}
                  >
                    {districts.map((district) => (
                      <MenuItem key={district} value={district}>
                        {district}
                      </MenuItem>
                    ))}
                  </TextField>
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

                {selectedRole === "2" ? (
                  <Grid item xs={12}>
                    <InputLabel>Admin</InputLabel>
                    <Select
                      fullWidth
                      name="superior_id"
                      value={selectedAdmin || ""} // Show previous ADO for reference
                      onChange={(e) => handleAdminChange(e.target.value)}
                      error={Boolean(!selectedAdmin)}
                    >
                      <MenuItem value="">Select Admin</MenuItem>
                      {allmembers?.Admins?.map((item) => (
                        <MenuItem key={item?.id} value={item?.id}>
                          {item?.username}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                ) : null}

                {selectedRole === "3" || selectedRole === "4" || selectedRole === "5" || selectedRole === "6" ? (
                  <Grid item xs={12}>
                    <InputLabel>Area Development Officer (ADO)</InputLabel>
                    <Select
                      fullWidth
                      name="superior_id"
                      value={selectedAdo || ""} // Show previous ADO for reference
                      onChange={(e) => handleAdoChange(e.target.value)}
                      error={Boolean(!selectedAdo)}
                    >
                      <MenuItem value="">Select ADO</MenuItem>
                      {allmembers?.ADOs?.map((item) => (
                        <MenuItem key={item?.id} value={item?.id}>
                          {item?.username}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                ) : null}


                {selectedRole === "4" || selectedRole === "5" || selectedRole === "6" ? (
                  <Grid item xs={12}>
                    <InputLabel>Master Distributor (MD)</InputLabel>
                    <Select
                      fullWidth
                      name="superior_id"
                      value={selectedMd || ""} // Show previous MD for reference
                      onChange={(e) => handleMdChange(e.target.value)}
                    >
                      <MenuItem value="">Select MD</MenuItem>
                      {mds.length > 0 ? (
                        mds.map((item) => (
                          <MenuItem key={item?.id} value={item?.id}>
                            {item?.username}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No MDs available</MenuItem>
                      )}

                    </Select>
                  </Grid>
                ) : null}

                {selectedRole === "5" || selectedRole === "6" ? (
                  <Grid item xs={12}>
                    <InputLabel>Super Distributor (SD)</InputLabel>
                    <Select
                      fullWidth
                      name="superior_id"
                      value={selectedSd || ""} // Show previous SD for reference
                      onChange={(e) => handleSdChange(e.target.value)}
                    >
                      <MenuItem value="">Select SD</MenuItem>
                      {sds.length > 0 ? (
                        sds?.map((item) => (
                          <MenuItem key={item?.id} value={item?.id}>
                            {item?.username}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No SDs available</MenuItem>
                      )}
                    </Select>
                  </Grid>
                ) : null}

                {selectedRole === "6" ? (
                  <Grid item xs={12}>
                    <InputLabel>Distributor (D)</InputLabel>
                    <Select
                      fullWidth
                      name="superior_id"
                      value={selectedD || ""}
                      onChange={(e) => handleDChange(e.target.value)}
                    >
                      <MenuItem value="">Select D</MenuItem>
                      {ds.length > 0 ? (
                        ds?.map((item) => (
                          <MenuItem key={item?.id} value={item?.id}>
                            {item?.username}
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