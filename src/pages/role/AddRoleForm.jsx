import { useState } from "react";
import { Button, Typography, Box, TextField, Grid } from "@mui/material";
import { makePostRole } from "../../redux/slices/master-slice/role-slice/RolePostSlice";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const AddRoleForm = () => {
  const dispatch = useDispatch();
  const [showErrors, setShowErrors] = useState(false); // Track whether errors should be shown
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      role_name: "",
    },
    validationSchema: Yup.object({
      role_name: Yup.string().required("Role name is required."),
    }),
    onSubmit: (values, { resetForm }) => {
      const parsedValues = {
        ...values,
      };
      dispatch(makePostRole(parsedValues));
      resetForm();
      navigate("/dashboard/role"); // Navigate to the product list page after submission

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
