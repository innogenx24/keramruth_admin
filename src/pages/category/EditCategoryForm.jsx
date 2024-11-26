import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
import { useDispatch } from "react-redux";
import { makeEditCategory } from "../../redux/slices/master-slice/categort-slice/CategoryEditSlice";
  import { useNavigate } from "react-router-dom";
  
const EditCategoryForm = ({ onCancel }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { club } = location.state || {}; // Get the club data from location state

  const [sectors, setSectors] = useState([]); // State to store fetched sectors
  const [category, setCategory] = useState({
    id: "",
    category_name: "",
    parent_category_id: "",
    sector_name: "", // Add a field for sector_name to bind with Select
  });

  const [errors, setErrors] = useState({}); // State to track field errors

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await fetch("http://88.222.245.236:3002/sectors");
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

  useEffect(() => {
    if (club) {
      setCategory(club); // Set category state when club data is available
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
    if (!category.sector_name.trim()) {
      newErrors.sector_name = "Sector selection is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission (update logic)
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!validateFields()) {
      return; // Stop submission if validation fails
    }

    // Prepare data for dispatch
    const parsedValues = {
      ...category,
      id: parseInt(category.id, 10), // Ensure id is an integer
    };

    // Dispatch the action to edit the category
    dispatch(makeEditCategory(parsedValues));

    // Reset the form
    setCategory({
      id: "",
      category_name: "",
      parent_category_id: "",
      sector_name: "",
    });
    navigate("/dashboard/category");

    setErrors({}); // Clear errors after successful submission
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
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ width: "100%" }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default EditCategoryForm;
