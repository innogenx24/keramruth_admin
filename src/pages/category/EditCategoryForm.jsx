import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import axios from "axios";

const EditCategoryForm = ({ onCancel }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { club } = location.state || {}; // Get the club data from location state

  const [sectors, setSectors] = useState([]); // State to store fetched sectors
  const [category, setCategory] = useState({
    id: "",
    category_name: "",
    parent_category_id: "",
    sector_name: "", // Add a field for sector_name to bind with Select
  });

  const [errors, setErrors] = useState({}); // State to track field errors
  const [serverError, setServerError] = useState(""); // State to track server error
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

 // Fetch sectors
useEffect(() => {
  const fetchSectors = async () => {
      const token = localStorage.getItem('token');

      try {
          const response = await fetch(`${API_END_POINT}/sectors`, {
              method: "GET",
              headers: {
                  "Authorization": `Bearer ${token}`,  // Include token
                  "Content-Type": "application/json",
              },
          });

          if (!response.ok) {
              throw new Error("Network response was not ok");
          }

          const data = await response.json();
          setSectors(data);
      } catch (error) {
          console.error("Error fetching sectors:", error);
      }
  };

  fetchSectors();
}, []);

  // Fetch category data by ID when the component mounts
  useEffect(() => {
    if (club && club.id) {
      const fetchCategoryDetails = async () => {
        try {
          const response = await axios.get(
            `${API_END_POINT}/category/${club.id}`
          );
          setCategory(response.data); // Set fetched category data
        } catch (error) {
          console.error("Error fetching category details:", error);
        }
      };
      fetchCategoryDetails();
    }
  }, [club]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSectorChange = (e) => {
    setCategory((prevDetails) => ({
      ...prevDetails,
      sector_name: e.target.value,
    }));
  };

  const validateFields = () => {
    const newErrors = {};
  
    if (!category.category_name.trim()) {
      newErrors.category_name = "Category name is required.";
    } 
    else if (!/^[a-zA-Z0-9 ]*$/.test(category.category_name)) {
      newErrors.category_name = "Special characters is not allowed.";
    }
  
    if (!category.sector_name.trim()) {
      newErrors.sector_name = "Sector selection is required.";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };
  

  // Handle form submission (update logic)
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!validateFields()) {
      return; // Stop submission if validation fails
    }

    const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage

    try {
      const response = await axios.put(
        `${API_END_POINT}/category/${category.id}`,
        category,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Reset the form on successful update
      setCategory({
        id: "",
        category_name: "",
        parent_category_id: "",
        sector_name: "",
      });
      setErrors({});
      navigate("/dashboard/category");
    } catch (error) {
      if (error.response && error.response.data.error === "Category with this name already exists") {
        setServerError("Category with this name already exists.");
      } else {
        console.error("Error updating category:", error);
        setServerError("An error occurred while updating the category.");
      }
    }
  };

  return (
    <Box sx={{ padding: 2, maxWidth: 500 }} component="form" onSubmit={handleFormSubmit}>
      <Typography variant="h6" sx={{ marginBottom: "20px" }}>
        Edit Category
      </Typography>

      {/* Category Name Input */}
      <TextField
        fullWidth
        variant="outlined"
        label="Category Name*"
        name="category_name"
        value={category.category_name}
        onChange={handleInputChange}
        sx={{ marginBottom: "16px" }}
        error={!!errors.category_name}
        helperText={errors.category_name}
      />

      {serverError && <Typography color="error">{serverError}</Typography>}

      {/* Select Sector Dropdown */}
      <InputLabel sx={{ mt: 2 }}>Select Sector*</InputLabel>
      <Select
        fullWidth
        name="sector_name"
        value={category.sector_name || ""}
        onChange={handleSectorChange}
        displayEmpty
        error={!!errors.sector_name}
        sx={{ marginBottom: "16px" }}
      >
        <MenuItem value="">
          <span style={{ color: "black" }}>Select Sector</span>
        </MenuItem>
        {sectors.length === 0 ? (
          <MenuItem value="" disabled>
            No Sectors Available
          </MenuItem>
        ) : (
          sectors.map((sector) => (
            <MenuItem key={sector.id} value={sector.sector_name}>
              <span style={{ color: "black" }}>{sector.sector_name}</span>
            </MenuItem>
          ))
        )}
      </Select>
      {errors.sector_name && (
        <FormHelperText error>{errors.sector_name}</FormHelperText>
      )}

      {/* Submit and Cancel Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <Button variant="contained" color="primary" type="submit" sx={{ width: "100%" }}>
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default EditCategoryForm;
