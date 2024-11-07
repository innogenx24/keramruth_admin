import { useState } from "react";
import { Button, Typography, Box, TextField, Grid } from "@mui/material";
import { makePostRole } from "../../redux/slices/master-slice/role-slice/RolePostSlice";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

const AddRoleForm = () => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      role_name: "",
    },
    validationSchema: Yup.object({
      role_name: Yup.string().required("Required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const parsedValues = {
        ...values,
      };
      // console.log("parsedValues", parsedValues);
      dispatch(makePostRole(parsedValues));
      resetForm();
    },
  });

  return (
    <Box p={3}>
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Masters / Role / Add Role
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <h2>Role Details:</h2>

          <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>
          <form onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                name="role_name"
                label="Role Name*"
                {...formik.getFieldProps("role_name")}
                error={
                  formik.touched.role_name && Boolean(formik.errors.role_name)
                }
                helperText={formik.touched.role_name && formik.errors.role_name}
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