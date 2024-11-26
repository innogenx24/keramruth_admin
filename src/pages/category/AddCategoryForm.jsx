import { useState, useEffect } from "react";
import { Button, Typography, Box, TextField, Grid, Select, MenuItem, InputLabel } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { makePostCategory } from "../../redux/slices/master-slice/categort-slice/CategoryPostSlice";
import { useNavigate } from "react-router-dom";

const AddCategoryForm = () => {
  const dispatch = useDispatch();
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await fetch("http://88.222.245.236:3002/sectors");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Fetched sectors:", data); // Debugging log
        setSectors(data);
      } catch (error) {
        console.error("Error fetching sectors:", error);
      }
    };
    fetchSectors();
  }, []);

  const handleSectorChange = (event) => {
    setSelectedSector(event.target.value);
    formik.setFieldValue("sector_name", event.target.value);
  };

  const formik = useFormik({
    initialValues: {
      category_name: "",
      parent_category_id: "",
      sector_name: "",
    },
    validationSchema: Yup.object({
      category_name: Yup.string().required("Category name is required"),
      sector_name: Yup.string().required("Sector is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const parsedValues = {
        ...values,
        parent_category_id: parseInt(values.parent_category_id, 10),
      };
      dispatch(makePostCategory(parsedValues));
      resetForm();
      navigate("/dashboard/category");
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
                error={formik.touched.category_name && Boolean(formik.errors.category_name)}
                helperText={formik.touched.category_name && formik.errors.category_name}
              />

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
                    <MenuItem key={sector.id} value={sector.sector_name}>
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
