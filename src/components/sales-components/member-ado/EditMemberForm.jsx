
import { useState, useEffect } from "react";
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
  FormControl,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchAllMembersRequest } from "../../../redux/slices/member-slice/GetAllmemberSlices";
import { useDispatch, useSelector } from "react-redux";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { Snackbar, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from "@mui/icons-material";

const EditMemberForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { memberId } = useParams();
  const { allmembers } = useSelector((state) => state.allmembers);
  const [image, setImage] = useState(null); // Store the selected image
  const [imageName, setImageName] = useState(""); // Store image file name for display
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;
  const imageBaseURL = `${API_END_POINT}/uploads/`;
  const [showPassword, setShowPassword] = useState(false);
  const [imageError, setImageError] = useState(""); // Store image error message
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [clubs, setClubs] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [selectedRole, setSelectedRole] = useState(""); // Role dropdown value
  const [formData, setFormData] = useState({
    name: "",
    mobile_number: "",
    email: "",
    role_id: "",
    image: "",
    pincode: "",
    country: "",
    state: "",
    district: "",
    city: "",
    street: "",
    club_name: "",

    superior_id: "",
    password: "",
    street_name: "",
    building_no_name: "",
    username: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    mobile_number: "",
    email: "",
    role_id: "",
    pincode: "",
    country: "",
    state: "",
    district: "",
    city: "",
    username: "",
    password: "",
    street_name: "",
    building_no_name:"",

  });

  // Fetch all members on mount
  useEffect(() => {
    dispatch(fetchAllMembersRequest());
  }, [dispatch]);

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
    "Goa": ["North Goa", "South Goa","Panaji", "Vasco da Gama", "Margao"],
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
  

const [districts, setDistricts] = useState([]);


// Handle state change
const handleStateChange = (e) => {
  const { value } = e.target;
  setFormData((prev) => ({ ...prev, state: value }));
  setDistricts(stateDistrictMapping[value] || []); // Update districts based on state
};

// Update districts when state changes
useEffect(() => {
  if (formData.state) {
    const selectedDistricts = stateDistrictMapping[formData.state] || [];
    setDistricts(selectedDistricts);
  } else {
    setDistricts([]);
  }
}, [formData.state]);

   // Fetch clubs from the API
   const fetchClubs = async () => {
    setLoading(true);
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
        setClubs(result.data); // Set the clubs from the data property
      } else {
        console.error("Error fetching clubs:", result.message); // Handle any error messages
      }
    } catch (error) {
      console.error("Error fetching clubs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch member details for editing
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (memberId && token) {
      axios
        .get(`${API_END_POINT}/directMembers/profileby-admin/${memberId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const member = response.data;
          setFormData({
            full_name: member.full_name || "",
            mobile_number: member.mobile_number || "",
            email: member.email || "",
            role_id: member.role_id || "",
            image: member.image || "",
            pincode: member.pincode || "",
            country: member.country || "",
            state: member.state || "",
            district: member.district || "",
            city: member.city || "",
            street_name: member.street_name || "",
            club_name: member.club_name || "", // Set club_name from response data

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

  // Handle image upload with validation for size and format
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        setImageError("Image size less than 2MB only.");
        setImage(null); // Clear the image
        setImageName(""); // Reset image name
        return;
      }

      // Validate image type (JPEG, PNG)
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setImageError("Only JPEG and PNG images are allowed.");
        setImage(null); // Clear the image
        setImageName(""); // Reset image name
        return;
      }

      // Reset error and set image
      setImageError("");
      setImage(file);
      setImageName(file.name);
    }
  };
// Call fetchClubs when the component mounts
useEffect(() => {
  fetchClubs();
}, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "role_id") setSelectedRole(value);
  };

  const validateForm = () => {
    let validationErrors = {};
    let isValid = true;

    // Check required fields
    if (!formData.full_name) {
      validationErrors.name = "Full Name is required";
      isValid = false;
    }
    // if (!formData.mobile_number) {
    //   validationErrors.mobile_number = "Mobile Number is required";
    //   isValid = false;
    // }
    // if (!formData.email) {
    //   validationErrors.email = "Email is required";
    //   isValid = false;
    // }
    if (!formData.mobile_number) {
      validationErrors.mobile_number = "Mobile Number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobile_number)) {
      // Phone number regex: Must be exactly 10 digits
      validationErrors.mobile_number = "Enter a valid 10 digits Mobile Number";
      isValid = false;
    }
    
    if (!formData.email) {
      validationErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      // Email regex: Standard email format
      validationErrors.email = "Enter a valid Email address";
      isValid = false;
    }
    
    if (!formData.role_id) {
      validationErrors.role_id = "Role is required";
      isValid = false;
    }
    if (!formData.pincode) {
      validationErrors.pincode = "Pincode is required";
      isValid = false;
    }
    if (!formData.country) {
      validationErrors.country = "Country is required";
      isValid = false;
    }
    if (!formData.state) {
      validationErrors.state = "State is required";
      isValid = false;
    }
    if (!formData.district) {
      validationErrors.district = "District is required";
      isValid = false;
    }
    if (!formData.city) {
      validationErrors.city = "City is required";
      isValid = false;
    }
    if (!formData.username) {
      validationErrors.username = "Username is required";
      isValid = false;
    }
    if (!formData.password) {
      validationErrors.password = "Password is required";
      isValid = false;
    }
    

    setErrors(validationErrors);
    return isValid;
  };

  // Save updated member data

  const handleSave = () => {


    // Only proceed if the image is valid
    if (imageError) {
      return;
    }

    const isValid = validateForm();
    if (!isValid) return;
    const token = localStorage.getItem("token");
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // Required for image upload
      },
    };
  
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    if (image) {
      data.append("image", image); // Attach the image file
    }
  
    axios
      // .put(`${API_END_POINT}/api/user/update/${memberId}`, data, config)
      .put(`${API_END_POINT}/user/update/${memberId}`, data, config)
      .then(() => {
        navigate(`/dashboard/members`);
      })
      .catch((error) => {
        console.error("Error updating member data", error);

        // Check if the error response contains a message and set the error message
        if (error.response && error.response.data && error.response.data.error) {
          setErrorMessage(error.response.data.error); // Extract the error message
        } else {
          setErrorMessage("An unknown error occurred.");
        }
  
        // Open Snackbar to display the error message
        setOpenSnackbar(true);
      });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  

  // Filter dropdown options based on the role
  const renderDropdownOptions = () => {
    if (!selectedRole) return null;

    const roleDropdownMap = {
      2: { label: "Admin", options: allmembers?.Admins || [] },
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
  <InputLabel>Edit Image</InputLabel>
  <IconButton color="primary" component="label">
    <AddPhotoAlternateIcon />
    <input type="file" hidden onChange={handleImageUpload} />
  </IconButton>
  {imageName && <Typography variant="body2">{imageName}</Typography>}
  {imageError && (
          <Typography variant="body2" color="error">{imageError}</Typography>
        )}
  <Box mt={2}>
    {image ? (
      // Show preview of the uploaded image
      <img
        src={URL.createObjectURL(image)}
        alt="Uploaded Preview"
        style={{ maxWidth: "100%", maxHeight: "200px" }}
      />
    ) : formData.image ? (
      // Show previously uploaded image
      <img
        src={`${imageBaseURL}${formData.image}`}
        alt="Current Profile"
        style={{ maxWidth: "100%", maxHeight: "200px" }}
      />
    ) : (
      // Fallback for no image
      <Typography variant="body2">No image uploaded</Typography>
    )}
  </Box>
</Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name*"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="username"
                  label="User Name*"
                  value={formData.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                />
              </Grid> */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mobile No*"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  error={!!errors.mobile_number}
                  helperText={errors.mobile_number}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email ID*"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password*"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
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

          <Box
  mt={3}
  sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}
>
  <InputLabel>Address</InputLabel>
  <Grid container spacing={2}>
    {/* Pincode Field */}
    <Grid item xs={6}>
      <TextField
        fullWidth
        name="pincode"
        label="Pincode*"
        value={formData.pincode}
        onChange={handleChange}
        error={!!errors.pincode}
        helperText={errors.pincode}
      />
    </Grid>

    {/* Country Field */}
    <Grid item xs={6}>
      <TextField
        fullWidth
        name="country"
        label="Country*"
        value="India"  // Set constant value for country
        disabled  // Disable the field so the user cannot edit it
        InputProps={{
          readOnly: true,  // Ensure the field is read-only
        }}
      />
    </Grid>

    {/* State Field */}
    <Grid item xs={6}>
      <FormControl fullWidth>
        <InputLabel>State</InputLabel>
        <Select
          label="State"
          name="state"
          value={formData.state}
          onChange={handleStateChange}
        >
          {Object.keys(stateDistrictMapping).map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>

    {/* District Field */}
    <Grid item xs={6}>
      <FormControl fullWidth>
        <InputLabel>District</InputLabel>
        <Select
          label="District"
          name="district"
          value={formData.district}
          onChange={handleChange}
        >
          {districts.map((district) => (
            <MenuItem key={district} value={district}>
              {district}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>

    {/* City Field */}
    <Grid item xs={6}>
      <TextField
        fullWidth
        name="city"
        label="City*"
        value={formData.city}
        onChange={handleChange}
        error={!!errors.city}
        helperText={errors.city}
      />
    </Grid>

    {/* Street Name Field */}
    <Grid item xs={6}>
      <TextField
        fullWidth
        name="street_name"
        label="Street Name"
        value={formData.street_name}
        onChange={handleChange}
        error={!!errors.street_name}
        helperText={errors.street_name}
      />
    </Grid>

    {/* Building No / Name Field */}
    <Grid item xs={6}>
      <TextField
        fullWidth
        name="building_no_name"
        label="Building No / Name"
        value={formData.building_no_name}
        onChange={handleChange}
        error={!!errors.building_no_name}
        helperText={errors.building_no_name}
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
         

            {(formData.role_id !== "6" && formData.role_id !== "2") && (selectedRole !== "6" && selectedRole !== "2") && (
  <Grid item xs={12}>
    <InputLabel>Club*</InputLabel>
    <Select
      fullWidth
      value={formData.club_name}
      name="club_name"
      onChange={handleChange}
    >
      <MenuItem value="">Select Club</MenuItem>
      {clubs.map((club) => (
        <MenuItem key={club.id} value={club.club_name}>
          {club.club_name}
        </MenuItem>
      ))}
    </Select>
  </Grid>
)}



              {renderDropdownOptions()}

            </Grid>
            <Grid item xs={12}>
        <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: "24px", borderRadius: "15px", padding: "8px" }}
              onClick={handleSave}
            >
              Save
            </Button>
        </Grid>
          </Box>
        </Grid>
        
        {/* Save Button */}
        
      </Grid>
      <Snackbar
  open={openSnackbar}
  autoHideDuration={6000}
  onClose={handleCloseSnackbar}
  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
  <Alert
    onClose={handleCloseSnackbar}
    severity="error"
    sx={{ width: "100%", background:'red', color: 'white' }}
  >
    {errorMessage || "An error occurred while updating member data."}
  </Alert>
</Snackbar>
    </Box>
  );
};

export default EditMemberForm;