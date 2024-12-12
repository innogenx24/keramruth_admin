import { useState, useEffect } from "react";
import { Button, Typography, Box, TextField, Grid, Select, MenuItem, InputLabel, Snackbar, Alert } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const AddCategoryForm = () => {
  const [sectors, setSectors] = useState([]); // Store sectors with both `id` and `sector_name`
  const [serverError, setServerError] = useState(""); // Store server error message
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await fetch("http://88.222.245.236:3002/sectors");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSectors(data); // Store all sector data
      } catch (error) {
        console.error("Error fetching sectors:", error);
      }
    };
    fetchSectors();
  }, []);

  const formik = useFormik({
    initialValues: {
      category_name: "",
      parent_category_id: "",
      sector_name: "", // This will store the sector name, not the id
    },
    validationSchema: Yup.object({
      category_name: Yup.string()
        .required("Category name is required")
        .matches(/^[a-zA-Z0-9\s]*$/, "Category name must contain only letters, numbers, and spaces."),
      sector_name: Yup.string().required("Sector is required"), // Validate the name, not the id
    }),
    onSubmit: async (values, { resetForm }) => {
      const parsedValues = {
        ...values,
        parent_category_id: values.parent_category_id ? parseInt(values.parent_category_id, 10) : null, // Ensure `null` if empty
      };

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://88.222.245.236:3002/category',
          parsedValues,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Category added successfully:", response.data);
        resetForm();
        navigate("/dashboard/category");
      } catch (error) {
        console.error("Error posting category:", error.response?.data || error.message);
        setServerError(error.response?.data?.error || "Category name already exists.");
        setOpenSnackbar(true);
      }
    },
  });

  const handleSectorChange = (event) => {
    const selectedSectorId = event.target.value;
    const selectedSector = sectors.find((sector) => sector.id === selectedSectorId);
    formik.setFieldValue("sector_name", selectedSector?.sector_name || ""); // Set the sector name instead of the id
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

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
                error={formik.touched.category_name && Boolean(formik.errors.category_name)}
                helperText={formik.touched.category_name && formik.errors.category_name}
              />
              {serverError && <Typography color="error">{serverError}</Typography>}

              <InputLabel sx={{ mt: 2 }}>Select Sector*</InputLabel>
              <Select
                fullWidth
                name="sector_name"
                value={formik.values.sector_name || ""}
                onChange={handleSectorChange}
                error={formik.touched.sector_name && Boolean(formik.errors.sector_name)}
                displayEmpty
              >
                <MenuItem value="">
                  <span style={{ color: "black" }}>Select Sector</span>
                </MenuItem>
                {sectors.length === 0 ? (
                  <MenuItem value="" disabled>No Sectors Available</MenuItem>
                ) : (
                  sectors.map((sector) => (
                    <MenuItem key={sector.id} value={sector.id}> 
                      <span style={{ color: "black" }}>{sector.sector_name}</span>
                    </MenuItem>
                  ))
                )}
              </Select>
              {formik.touched.sector_name && formik.errors.sector_name && (
                <Typography variant="caption" color="error">
                  {formik.errors.sector_name}
                </Typography>
              )}

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

export default AddCategoryForm;
