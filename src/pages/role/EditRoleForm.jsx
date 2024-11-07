import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";

const EditRoleForm = ({ onCancel }) => {
  const location = useLocation();
  const { club } = location.state || {}; 
  // console.log("club", club);
  const [roleName, setRoleName] = useState({
    id: "",
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
  };

  // Function to handle form submission (update logic)
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    const parsedValues = {
      ...roleName,
    };
    console.log("parsedValues", parsedValues);
    // dispatch(makeEditCategory({...parsedValues}))
    setRoleName("");
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