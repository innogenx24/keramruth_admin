import { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  TextField,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCategoryForm = () => {
  const [sectors, setSectors] = useState([]);
  const [serverError, setServerError] = useState(""); // Store server error message
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Store snackbar message
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSectors = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${API_END_POINT}/sectors`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setSectors(data);
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
      sector_name: "",
    },
    validationSchema: Yup.object({
      category_name: Yup.string()
        .required("Category name is required")
        .matches(
          /^[a-zA-Z0-9\s]*$/,
          "Category name must contain only letters, numbers, and spaces."
        ),
      sector_name: Yup.string().required("Sector is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const selectedSector = sectors.find(
        (sector) => sector.id === parseInt(values.sector_name)
      );

      const parsedValues = {
        ...values,
        sector_name: selectedSector ? selectedSector.sector_name : "",
        parent_category_id: parseInt(values.parent_category_id, 10),
      };

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${API_END_POINT}/category`,
          parsedValues,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Category added successfully:", response.data);

        setSnackbarMessage("Category added successfully!");
        setSnackbarType("success");
        setOpenSnackbar(true);

        setTimeout(() => {
          resetForm();
          navigate("/dashboard/category");
        }, 2000);
      } catch (error) {
        console.error("Error posting category:", error.response?.data || error.message);

        setSnackbarMessage(
          error.response?.data?.error || "Category name already exists."
        );
        setSnackbarType("error");
        setOpenSnackbar(true);
      }
    },
  });

  const handleSectorChange = (event) => {
    formik.setFieldValue("sector_name", event.target.value);
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
                error={
                  formik.touched.category_name && Boolean(formik.errors.category_name)
                }
                helperText={
                  formik.touched.category_name && formik.errors.category_name
                }
              />
              {serverError && (
                <Typography color="error">{serverError}</Typography>
              )}

              <InputLabel sx={{ mt: 2 }}>Select Sector*</InputLabel>
              <Select
                fullWidth
                name="sector_name"
                value={formik.values.sector_name || ""}
                onChange={handleSectorChange}
                error={
                  formik.touched.sector_name && Boolean(formik.errors.sector_name)
                }
                displayEmpty
              >
                <MenuItem value="">
                  <span style={{ color: "black" }}>Select Sector</span>
                </MenuItem>
                {sectors.length === 0 ? (
                  <MenuItem value="" disabled>
                    No Sectors Available
                  </MenuItem>
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

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarType}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddCategoryForm;
