import { useState, useEffect } from "react";
import { Button, Typography, Box, TextField, Grid } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";

const AddOrEditSector = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get state passed via navigation

  const [isEditMode, setIsEditMode] = useState(false);
  const [sector, setSector] = useState(null); // For storing sector data when editing

  // If editing, set the sector data from the location state (passed during navigation)
  useEffect(() => {
    if (location.state && location.state.sector) {
      setSector(location.state.sector);
      setIsEditMode(true); // Switch to edit mode if sector data is available
    }
  }, [location]);

  const formik = useFormik({
    initialValues: {
      sector_name: sector ? sector.sector_name : "", // Populate sector name if editing
    },
    validationSchema: Yup.object({
      sector_name: Yup.string().required("Sector name is required."),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        let response;

        if (isEditMode) {
          // If editing, make a PUT request to update the sector
          response = await fetch(`http://88.222.245.236:3002/sectors/${sector.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          });
        } else {
          // If adding, make a POST request to create the sector
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
          // On success, navigate back to the sectors list
          navigate("/dashboard/sectors");
          resetForm();
        } else {
          // Handle error response if needed
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
              {/* Save Button */}
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
