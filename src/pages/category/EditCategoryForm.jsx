import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { makeEditCategory } from "../../redux/slices/master-slice/categort-slice/CategoryEditSlice";

const EditCategoryForm = ({ onCancel }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { club } = location.state || {};
  // console.log("club", club);
  const [category, setCategory] = useState({
    id: "",
    category_name: "",
    parent_category_id: "",
  });

  useEffect(() => {
    if (club) {
      setCategory(club);
    }
  }, [club]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Function to handle form submission (update logic)
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    const parsedValues = {
      ...category,
      id: parseInt(category?.id, 10),
      parent_category_id: parseInt(category?.parent_category_id, 10)
    };
    // console.log("parsedValues", parsedValues);
    dispatch(makeEditCategory({...parsedValues}))
    setCategory("");
  };

  return (
    <Box sx={{ padding: 2, maxWidth: 500 }} component="form" onSubmit={handleFormSubmit}>
      <Typography variant="h6" sx={{ marginBottom: "20px" }}>
        Edit Category
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Category Name*"
        name="category_name" // Update the name attribute
        value={category?.category_name}
        onChange={handleInputChange}
        sx={{ marginBottom: "16px" }}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <Button variant="contained" color="primary" type="submit" sx={{ width: "100%" }}>
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default EditCategoryForm;