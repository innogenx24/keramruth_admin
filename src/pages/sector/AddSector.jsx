import { useState, useEffect } from "react";
import { Button, Typography, Box, TextField, Grid } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";

const AddOrEditSector = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isEditMode, setIsEditMode] = useState(false);
  const [sector, setSector] = useState(null);

  useEffect(() => {
    if (location.state && location.state.sector) {
      setSector(location.state.sector);
      setIsEditMode(true);
    }
  }, [location]);

  const formik = useFormik({
    initialValues: {
      sector_name: sector ? sector.sector_name : "",
    },
    enableReinitialize: true, // Ensures form values update when `sector` changes
    validationSchema: Yup.object({
      sector_name: Yup.string().required("Sector name is required."),
    }),
    onSubmit: async (values) => {
      try {
        const url = isEditMode
          ? `http://88.222.245.236:3002/sectors/${sector.id}`
          : "http://88.222.245.236:3002/sectors";
        const method = isEditMode ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          navigate("/dashboard/sector");
        } else {
          alert("An error occurred while saving the sector.");
        }
      } catch (error) {
        console.error("Error saving sector:", error);
      }
    },
  });

  return (
    <Box p={3}>
      <Typography variant="h6" sx={{ mb: 2, color: "#989FA9" }}>
        {isEditMode ? "Edit Sector" : "Add Sector"}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ backgroundColor: "#f5f5f5", p: 3, borderRadius: 2 }}>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                name="sector_name"
                label="Sector Name*"
                value={formik.values.sector_name}
                onChange={formik.handleChange}
                error={formik.touched.sector_name && Boolean(formik.errors.sector_name)}
                helperText={formik.touched.sector_name && formik.errors.sector_name}
                sx={{ mb: 2 }}
              />
              <Button type="submit" variant="contained" color="primary" fullWidth>
                {isEditMode ? "Update" : "Save"}
              </Button>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddOrEditSector;
