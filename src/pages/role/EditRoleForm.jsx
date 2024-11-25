import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const EditRoleForm = ({ onCancel }) => {
  const location = useLocation();
  const { club } = location.state || {}; 
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState({
    id: "",
    role_name: "",
  });
  const [errors, setErrors] = useState({
    role_name: "",
  });

  useEffect(() => {
    if (club) {
      setRoleName(club);
    }
  }, [club]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoleName((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    // Reset error message when user starts typing
    if (value.trim() !== "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        role_name: "",
      }));
    }
  };

  // Function to validate the form before submitting
  const validateForm = () => {
    const newErrors = {};
    if (!roleName.role_name.trim()) {
      newErrors.role_name = "Role name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  // Function to handle form submission (update logic)
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate before proceeding
    if (!validateForm()) {
      return; // Do not submit if validation fails
    }

    const parsedValues = {
      ...roleName,
    };
    console.log("parsedValues", parsedValues);
    // dispatch(makeEditCategory({...parsedValues}))
    setRoleName({ id: "", role_name: "" });
    navigate("/dashboard/role"); // Navigate to the role list page after submission
  };

  return (
    <Box sx={{ padding: 2, maxWidth: 500 }} component="form" onSubmit={handleFormSubmit}>
      <Typography variant="h6" sx={{ marginBottom: "20px" }}>
        Edit Role
      </Typography>
      <TextField
        label="Role Name"
        name="role_name" // Update the name attribute
        value={roleName?.role_name}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        error={!!errors.role_name} // Display error style if there's an error
        helperText={errors.role_name} // Display error message
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ width: "100%" }} // Set button width to 100%
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default EditRoleForm;
