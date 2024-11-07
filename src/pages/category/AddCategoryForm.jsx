import { useState } from "react";
import { Button, Typography, Box, TextField, Grid } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { makePostCategory } from "../../redux/slices/master-slice/categort-slice/CategoryPostSlice";

const AddCategoryForm = () => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      category_name: "",
      parent_category_id: "",
    },
    validationSchema: Yup.object({
      category_name: Yup.string().required("Required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const parsedValues = {
        ...values,
        parent_category_id: parseInt(values.parent_category_id, 10),
      };
      // console.log("parsedValues", parsedValues);
      dispatch(makePostCategory(parsedValues));
      resetForm();
    },
  });

  return (
    <Box p={3}>
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Masters / Category / Add Category
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <h2>Category Details:</h2>

          <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                name="category_name"
                label="Category Name*"
                {...formik.getFieldProps("category_name")}
                error={
                  formik.touched.category_name && Boolean(formik.errors.category_name)
                }
                helperText={formik.touched.category_name && formik.errors.category_name}
              />

              {/* Save Button */}
              <Box sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ width: "100%" }} // Set the button width to 100%
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

export default AddCategoryForm;
