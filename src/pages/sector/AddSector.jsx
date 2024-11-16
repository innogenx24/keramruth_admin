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
        sector_name: sector ? sector.sector_name : "", // Set initial value dynamically
      },
      enableReinitialize: true, // Allow formik to reinitialize when initialValues change
      validationSchema: Yup.object({
        sector_name: Yup.string().required("Sector name is required."),
      }),
      onSubmit: async (values, { resetForm }) => {
        try {
          let response;
  
          if (isEditMode) {
            response = await fetch(`http://88.222.245.236:3002/sectors/${sector.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            });
          } else {
            response = await fetch("http://88.222.245.236:3002/sectors", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            });
          }
  
          const data = await response.json();
  
          if (response.ok) {
            resetForm();
            navigate("/dashboard/sector");
          } else {
            alert(data.message || "Something went wrong");
          }
        } catch (error) {
          console.error("Error occurred while saving sector:", error);
          alert("An error occurred while saving the sector");
        }
      },
    });
  
    return (
      <Box p={3}>
        <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
          {isEditMode ? "Edit Sector" : "Add Sector"}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <h2>Sector Details:</h2>
            <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  fullWidth
                  name="sector_name"
                  label="Sector Name*"
                  value={formik.values.sector_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.sector_name && Boolean(formik.errors.sector_name)}
                  helperText={formik.touched.sector_name && formik.errors.sector_name}
                />
                <Box sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ width: "100%" }}
                  >
                    {isEditMode ? "Update" : "Save"}
                  </Button>
                </Box>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  };
  
  export default AddOrEditSector;
  