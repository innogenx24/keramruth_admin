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
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_END_POINT_IMG } from "../../constants/ApiConstant";

const EditUserProfile = () => {
  const navigate = useNavigate();
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;
  const imageBaseURL = `${API_END_POINT_IMG}/uploads/`;

  const [selectedImage, setSelectedImage] = useState("/static/images/avatar/1.jpg");
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(""); // To hold the error message for display

  const [user, setUser] = useState({
    full_name: "",
    mobile_number: "",
    email: "",
    pincode: "",
    street_name: "",
    city: "",
    state: "",
    country: "",
    image: "",
  });

  const [cities, setCities] = useState([]);
  const [users, setUsers] = useState(null); // Add users state



   // Fetch user data from API (replace with actual API call)
   useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        // const response = await axios.get(`${API_END_POINT}/api/admin/admin-details`, {
        const response = await axios.get(`${API_END_POINT}/admin/admin-details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data); // Store fetched data
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, []); // Run once on component mount

  // State to City mapping
const stateCityMap = {
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

  useEffect(() => {
    if (user.state && stateCityMap[user.state]) {
      setCities(stateCityMap[user.state]);
    } else {
      setCities([]);
    }
  }, [user.state]);

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
      const fileSizeLimit = 2 * 1024 * 1024; // 2MB limit
      const validImageTypes = ["image/jpeg", "image/png"]; // Allowed file types (JPEG, PNG)
  
      // Check file type
      if (!validImageTypes.includes(file.type)) {
        setImageError("Only JPEG (JPG) and PNG images are allowed.");
        return;
      }
  
      // Check file size
      if (file.size > fileSizeLimit) {
        setImageError("Image size must be 2MB or less.");
        return;
      }
  
      // If the file passes both checks, set the image preview and file
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
      setImageError(""); // Clear error message if the file is valid
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
    formData.append("state", user.state);
    formData.append("country", user.country);

    if (imageFile) {
      formData.append("image", imageFile);
    } else {
      formData.append("image", user.image);
    }

    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage
      // const response = await axios.put(`${API_END_POINT}/api/admin/update`, formData, {
      const response = await axios.put(`${API_END_POINT}/admin/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

        navigate("/dashboard/profile");
    } catch (error) {
      console.error("Error updating member data", error);

      // Check if the error response contains a message and set the error message
      if (error.response && error.response.data && error.response.data.error) {
        const message = error.response.data.error;
        setErrorMessage(message);

        if (message === "Mobile number already in use") {
          setErrors((prev) => ({
            ...prev,
            mobile_number: "Mobile number already in used.",
          }));
        } else if (message === "Email already in use") {
          setErrors((prev) => ({
            ...prev,
            email: "Email already in used.",
          }));
        }
      } else {
        setErrorMessage("An unknown error occurred.");
      }
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
    value="India"  // Setting the default value to "India"
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
    {/* List of all Indian states */}
    {[
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
      "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
      "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
      "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
      "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", 
      "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", 
      "Puducherry"
    ].map((state) => (
      <MenuItem key={state} value={state}>
        {state}
      </MenuItem>
    ))}
  </Select>
</FormControl>

</Grid>

              </Grid>
  
              <Grid container spacing={2} sx={{ marginTop: "10px" }}>
                <Grid item xs={6}>
                <FormControl fullWidth>
                <InputLabel>District</InputLabel>
                <Select
                  name="city"
                  value={user.city}
                  onChange={handleInputChange}
                  label="Districts"
                  disabled={!user.state}
                >
                  {cities.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
  
              {/* Save Changes Button */}
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
