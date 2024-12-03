import { useState } from "react"; 
import { Button, Typography, Box, TextField, Grid } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API calls

const AddRoleForm = () => {
  const [showErrors, setShowErrors] = useState(false); // Track whether errors should be shown
  const [error, setError] = useState(""); // To store backend error message
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      role_name: "",
    },
    validationSchema: Yup.object({
      role_name: Yup.string()
        .required("Role name is required.")
        .matches(/^[a-zA-Z0-9 ]*$/, "Special characters is not allowed."), 
    }),
    onSubmit: async (values, { resetForm }) => {
      const parsedValues = { ...values };

      try {
        const token = localStorage.getItem("token"); // Get the token from localStorage

        const response = await axios.post(
          "http://88.222.245.236:3002/roles/create", // API URL
          parsedValues, // The role data to be sent
          {
            headers: {
              Authorization: `Bearer ${token}`, // Set the authorization header
            },
          }
        );

        if (response.status === 200) {
          resetForm();
          navigate("/dashboard/role"); // Navigate to the role list page after successful submission
        }
      } catch (error) {
        // Handle errors, including the "Role name already exists" case
        if (error.response?.data?.message === "Role name already exists") {
          setError("Role name already exists");
        } else {
          setError("An error occurred while adding the role.");
        }
      }
    },
  });

  const handleSubmit = (e) => {
    setShowErrors(true); // Enable error display after submit is clicked
    formik.handleSubmit(e); // Call formik's submit handler
  };

  return (
    <Box p={3}>
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Masters / Role / Add Role
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <h2>Role Details:</h2>

          <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                name="role_name"
                label="Role Name*"
                {...formik.getFieldProps("role_name")}
                error={
                  showErrors && formik.touched.role_name && Boolean(formik.errors.role_name)
                }
                helperText={
                  showErrors && formik.touched.role_name && formik.errors.role_name
                }
              />
              {/* Show backend error message under role_name field */}
              {error && <Typography color="error">{error}</Typography>}

              {/* Save Button */}
              <Box sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ width: "100%" }}
                >
                  SAVE
                </Button>
              </Box>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddRoleForm;
