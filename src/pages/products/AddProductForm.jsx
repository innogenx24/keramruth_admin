import { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Switch,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddProductForm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imageError, setImageError] = useState("");
  const [serverError, setServerError] = useState("");
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState("success");

  const currentDate = new Date().toISOString().split("T")[0]; // Current date in yyyy-mm-dd format
  const currentDateWithTimeISO = new Date().toISOString(); // Full ISO date with time

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const response = await fetch(`${API_END_POINT}/category`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Set Authorization header
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    formik.setFieldValue("category_name", event.target.value);
  };

  const formik = useFormik({
    initialValues: {
      autoUpdate: false,
      status: false,
      name: "",
      description: "",
      productVolume: "",
      price: "",
      distributorPrice: "",
      sdPrice: "",
      mdPrice: "",
      adoPrice: "",
      stock_quantity: "",
      quantity_type: "",
      category_name: "",
      fromDate: "",
      toDate: "",
      customer_price: "",
      distributor_price: "",
      MD_price: "",
      SD_price: "",
      ADO_price: "",
    },
    validationSchema: Yup.lazy((values) =>
      Yup.object({
        name: Yup.string()
          .required("Product name is required")
          .min(3, "Product name must be at least 3 characters long")
          .max(100, "Product name cannot be more than 100 characters long"),

        productVolume: Yup.string()
          .required("Product volume is required")
          .matches(/^\d+(\.\d+)?$/, "Must be a valid number"),

        price: Yup.number()
          .required("Customer price is required")
          .min(0, "Customer price cannot be negative"),

        distributorPrice: Yup.number()
          .required("Distributor price is required")
          .min(0, "Distributor price cannot be negative"),

        sdPrice: Yup.number()
          .required("Super distributor price is required")
          .min(0, "SD price cannot be negative"),

        mdPrice: Yup.number()
          .required("Master distributor price is required")
          .min(0, "MD price cannot be negative"),

        adoPrice: Yup.number()
          .required("Area development officer price is required")
          .min(0, "ADO price cannot be negative"),

        quantity_type: Yup.string().required("Quantity type is required"),

        category_name: Yup.string().required("Category name is required"),

        stock_quantity: Yup.number()
          .required("Stock quantity is required")
          .min(0, "Stock quantity cannot be negative"),

        fromDate: values.autoUpdate
          ? Yup.date().required("From Date is required")
          : Yup.date(),

        toDate: values.autoUpdate
          ? Yup.date()
              .required("To Date is required")
              .test(
                "is-after",
                "To Date must be after From Date",
                function (value) {
                  const { fromDate } = this.parent;
                  return !fromDate || new Date(value) > new Date(fromDate);
                }
              )
          : Yup.date(),

        customer_price: values.autoUpdate
          ? Yup.number()
              .min(0, "Customer price cannot be negative")
              .lessThan(
                Yup.ref("price"),
                "Customer price must be less than the original customer price"
              )
          : Yup.number().nullable(),

        distributor_price: values.autoUpdate
          ? Yup.number()
              .min(0, "Distributor price cannot be negative")
              .lessThan(
                Yup.ref("distributorPrice"),
                "Distributor price must be less than the original distributor price"
              )
          : Yup.number().nullable(),

        SD_price: values.autoUpdate
          ? Yup.number()
              .min(0, "SD price cannot be negative")
              .lessThan(
                Yup.ref("sdPrice"),
                "SD price must be less than the original SD price"
              )
          : Yup.number().nullable(),

        MD_price: values.autoUpdate
          ? Yup.number()
              .min(0, "MD price cannot be negative")
              .lessThan(
                Yup.ref("mdPrice"),
                "MD price must be less than the original MD price"
              )
          : Yup.number().nullable(),

        ADO_price: values.autoUpdate
          ? Yup.number()
              .min(0, "ADO price cannot be negative")
              .lessThan(
                Yup.ref("adoPrice"),
                "ADO price must be less than the original ADO price"
              )
          : Yup.number().nullable(),
      })
    ),

    onSubmit: async (values, { resetForm }) => {
      const randomProductCode = Math.floor(100000 + Math.random() * 900000);
      const formData = new FormData();

      formData.append("product_code", randomProductCode);
      formData.append("name", values.name);
      formData.append("productVolume", values.productVolume);
      formData.append("price", values.price);
      formData.append("distributorPrice", values.distributorPrice);
      formData.append("sdPrice", values.sdPrice);
      formData.append("mdPrice", values.mdPrice);
      formData.append("adoPrice", values.adoPrice);
      formData.append("quantity_type", values.quantity_type);
      formData.append("category_name", values.category_name);
      formData.append("stock_quantity", values.stock_quantity);
      formData.append("autoUpdate", values.autoUpdate);
      formData.append("description", values.description);

      if (!values.autoUpdate) {
        formData.delete("fromDate");
        formData.delete("toDate");
        formData.append("customer_price", "0");
        formData.append("distributor_price", "0");
        formData.append("SD_price", "0");
        formData.append("MD_price", "0");
        formData.append("ADO_price", "0");
      } else {
        formData.append("fromDate", values.fromDate || currentDateWithTimeISO);
        formData.append("toDate", values.toDate || currentDateWithTimeISO);
        formData.append("customer_price", values.customer_price || "0");
        formData.append("distributor_price", values.distributor_price || "0");
        formData.append("SD_price", values.SD_price || "0");
        formData.append("MD_price", values.MD_price || "0");
        formData.append("ADO_price", values.ADO_price || "0");
      }

      if (selectedFile) formData.append("image", selectedFile);

      try {
        const token = localStorage.getItem("token");
        await axios.post(`${API_END_POINT}/products`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const successMessage = `Product created successfully.`;
        setSuccessMessage(successMessage);
        setSnackbarType("success");
        setOpenSnackbar(true);

        // Delay navigation by 2 seconds
        setTimeout(() => {
          setOpenSnackbar(false);
          navigate("/dashboard/products");
        }, 2000);
      } catch (error) {
        if (error.response && error.response.data.error) {
          setServerError(error.response.data.error);
        } else {
          console.error("Error submitting product:", error);
        }
      }
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSizeLimit = 2 * 1024 * 1024;
      const validImageTypes = ["image/jpeg", "image/png"];
      if (!validImageTypes.includes(file.type)) {
        setImageError("Only JPEG and PNG images are allowed.");
        return;
      }
      if (file.size > fileSizeLimit) {
        setImageError("Image size must be 2MB or less.");
        return;
      }
      setImageError("");
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box
      sx={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        // backgroundColor: "#f5f5f5",
        backgroundColor: "#fff",
        borderRadius: "8px",
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Product / Add Product
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          {/* Product Details Section (Left Side) */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                // backgroundColor: "#fff",
                backgroundColor: "#F1F3FF",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Products Details
              </Typography>
              <InputLabel sx={{ color: "#232428" }}>Add Images</InputLabel>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  color="primary"
                  onClick={() => fileInputRef.current.click()}
                >
                  <AddPhotoAlternateIcon />
                </IconButton>
                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  style={{ display: "none" }} // Hide the input
                />
              </Box>

              {selectedFile && (
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  {selectedFile.name}
                </Typography>
              )}

              {imagePreview && (
                <div>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: "200px",
                      height: "auto",
                      marginTop: "10px",
                      marginBottom: "16px",
                    }}
                  />
                </div>
              )}

              {/* Display image error message */}
              {imageError && (
                <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
                  {imageError}
                </Typography>
              )}

              <TextField
                fullWidth
                variant="outlined"
                name="name"
                label="Product Name*"
                placeholder="Enter Product Name"
                sx={{ marginBottom: "16px" }}
                {...formik.getFieldProps("name")}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />

              {serverError && (
                <Typography color="error">{serverError}</Typography>
              )}

              <TextField
                fullWidth
                variant="outlined"
                name="description"
                label="Description"
                placeholder="Enter Description"
                multiline
                rows={3}
                sx={{ marginBottom: "16px", borderRadius: "15px" }}
                {...formik.getFieldProps("description")}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />
              <TextField
                fullWidth
                variant="outlined"
                name="productVolume"
                label="Product Volume(100ml, 500ml, 1L)*"
                placeholder="Enter Product Volume (100ml, 500ml, 1L)"
                sx={{ marginBottom: "16px" }}
                {...formik.getFieldProps("productVolume")}
                error={
                  formik.touched.productVolume &&
                  Boolean(formik.errors.productVolume)
                }
                helperText={
                  formik.touched.productVolume && formik.errors.productVolume
                }
              />
              <InputLabel sx={{ mt: 2 }}>Select Category*</InputLabel>
              <Select
                fullWidth
                name="category_name"
                value={formik.values.category_name || ""}
                onChange={handleCategoryChange} // Update formik values on category change
                error={
                  formik.touched.category_name &&
                  Boolean(formik.errors.category_name)
                }
                displayEmpty
              >
                <MenuItem value="">
                  <span>Select Category</span>
                </MenuItem>
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <MenuItem key={category.id} value={category.category_name}>
                      <span>{category.category_name}</span>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No Category Available
                  </MenuItem>
                )}
              </Select>
              {formik.touched.category_name && formik.errors.category_name && (
                <Typography variant="caption" color="error">
                  {formik.errors.category_name}
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Price Details Section (Right Side) */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: "#F1F3FF",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Price Details
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                name="price"
                label="MRP Price (Customer)*"
                placeholder="Enter MRP Price"
                sx={{ marginBottom: "16px" }}
                {...formik.getFieldProps("price")}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />
              <Typography variant="subtitle1" gutterBottom>
                For Distributors Price:
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                name="adoPrice"
                label="Area Development Officer (ADO) Price*"
                placeholder="Enter ADO Price"
                sx={{ marginBottom: "16px" }}
                {...formik.getFieldProps("adoPrice")}
                error={
                  formik.touched.adoPrice && Boolean(formik.errors.adoPrice)
                }
                helperText={formik.touched.adoPrice && formik.errors.adoPrice}
              />
              <TextField
                fullWidth
                variant="outlined"
                name="mdPrice"
                label="Master Distributor (MD) Price*"
                placeholder="Enter MD Price"
                sx={{ marginBottom: "16px" }}
                {...formik.getFieldProps("mdPrice")}
                error={formik.touched.mdPrice && Boolean(formik.errors.mdPrice)}
                helperText={formik.touched.mdPrice && formik.errors.mdPrice}
              />
              <TextField
                fullWidth
                variant="outlined"
                name="sdPrice"
                label="Super Distributor (SD) Price*"
                placeholder="Enter SD Price"
                sx={{ marginBottom: "16px" }}
                {...formik.getFieldProps("sdPrice")}
                error={formik.touched.sdPrice && Boolean(formik.errors.sdPrice)}
                helperText={formik.touched.sdPrice && formik.errors.sdPrice}
              />
              <TextField
                fullWidth
                variant="outlined"
                name="distributorPrice"
                label="Distributor Price*"
                placeholder="Enter Distributor Price"
                sx={{ marginBottom: "16px" }}
                {...formik.getFieldProps("distributorPrice")}
                error={
                  formik.touched.distributorPrice &&
                  Boolean(formik.errors.distributorPrice)
                }
                helperText={
                  formik.touched.distributorPrice &&
                  formik.errors.distributorPrice
                }
              />
              <TextField
                fullWidth
                variant="outlined"
                name="stock_quantity"
                label="Stock Quantity*"
                placeholder="Enter Stock Quantity"
                sx={{ marginBottom: "16px" }}
                {...formik.getFieldProps("stock_quantity")}
                error={
                  formik.touched.stock_quantity &&
                  Boolean(formik.errors.stock_quantity)
                }
                helperText={
                  formik.touched.stock_quantity && formik.errors.stock_quantity
                }
              />
              <InputLabel>Quantity Type</InputLabel>
              <Select
                fullWidth
                name="quantity_type"
                value={formik.values.quantity_type}
                onChange={(e) =>
                  formik.setFieldValue("quantity_type", e.target.value)
                }
                error={
                  formik.touched.quantity_type &&
                  Boolean(formik.errors.quantity_type)
                }
                sx={{ marginBottom: "16px", borderRadius: "20px" }}
              >
                <MenuItem value="">Select Quantity Type</MenuItem>
                <MenuItem value="ml">ml</MenuItem>
                <MenuItem value="liters">Liters</MenuItem>
                <MenuItem value="kg">Kg</MenuItem>
                <MenuItem value="gm">gm</MenuItem>
              </Select>
              {formik.touched.quantity_type && formik.errors.quantity_type && (
                <Typography color="error" variant="body2">
                  {formik.errors.quantity_type}
                </Typography>
              )}

              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <Typography sx={{ marginRight: "8px" }}>Auto Update</Typography>
                <Switch
                  checked={formik.values.autoUpdate}
                  name="autoUpdate"
                  onChange={(e) =>
                    formik.setFieldValue("autoUpdate", e.target.checked)
                  }
                  color="primary"
                />
              </Box>

              {/* Conditional Fields: From Date & To Date */}
              {formik.values.autoUpdate && (
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="From Date"
                        type="date"
                        value={formik.values.fromDate}
                        onChange={(e) =>
                          formik.setFieldValue("fromDate", e.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        error={
                          formik.touched.fromDate &&
                          Boolean(formik.errors.fromDate)
                        }
                        helperText={
                          formik.touched.fromDate && formik.errors.fromDate
                        }
                        InputProps={{
                          inputProps: { min: currentDate }, // Disable past dates
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="To Date"
                        type="date"
                        value={formik.values.toDate}
                        onChange={(e) =>
                          formik.setFieldValue("toDate", e.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        error={
                          formik.touched.toDate && Boolean(formik.errors.toDate)
                        }
                        helperText={
                          formik.touched.toDate && formik.errors.toDate
                        }
                        InputProps={{
                          inputProps: { min: currentDate }, // Disable past dates
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Typography variant="h6">Set Price</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="h6">
                        Area Development Officer Price{" "}
                      </Typography>

                      <TextField
                        fullWidth
                        label="Enter ADO Price"
                        name="ADO_price"
                        value={formik.values.ADO_price}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.ADO_price &&
                          Boolean(formik.errors.ADO_price)
                        }
                        helperText={
                          formik.touched.ADO_price && formik.errors.ADO_price
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6">
                        Master Distributor Price{" "}
                      </Typography>

                      <TextField
                        fullWidth
                        label="Enter MD Price"
                        name="MD_price" // Match the key in Formik's initial values
                        value={formik.values.MD_price}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.MD_price &&
                          Boolean(formik.errors.MD_price)
                        }
                        helperText={
                          formik.touched.MD_price && formik.errors.MD_price
                        }
                      />
                    </Grid>
                    {/* Add other price fields here as needed */}
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="h6">
                        Super Distributor Price{" "}
                      </Typography>

                      <TextField
                        fullWidth
                        label="Enter SD Price"
                        name="SD_price"
                        value={formik.values.SD_price}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.SD_price &&
                          Boolean(formik.errors.SD_price)
                        }
                        helperText={
                          formik.touched.SD_price && formik.errors.SD_price
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6">Distributor Price:</Typography>

                      <TextField
                        fullWidth
                        label="Enter Distributor Price"
                        name="distributor_price"
                        value={formik.values.distributor_price}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.distributor_price &&
                          Boolean(formik.errors.distributor_price)
                        }
                        helperText={
                          formik.touched.distributor_price &&
                          formik.errors.distributor_price
                        }
                      />
                    </Grid>
                    {/* Add other price fields here as needed */}
                  </Grid>
                  <Typography variant="h6">Customer Price</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Enter Customer Price"
                        name="customer_price"
                        value={formik.values.customer_price}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.customer_price &&
                          Boolean(formik.errors.customer_price)
                        }
                        helperText={
                          formik.touched.customer_price &&
                          formik.errors.customer_price
                        }
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
              {/* <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <Typography sx={{ marginRight: "8px" }}>
                  Stock Status
                </Typography>
                
                <Switch
                  checked={formik.values.status}
                  name="status"
                  onChange={(e) =>
                    formik.setFieldValue("status", e.target.checked)
                  } // Formik update
                  color="primary"
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  helperText={formik.touched.status && formik.errors.status}
                />
              </Box> */}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: "24px", borderRadius: "15px", padding: "8px" }}
              >
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarType}
          variant="filled"
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      {serverError && (
        <Snackbar
          open={true}
          autoHideDuration={2000}
          onClose={() => setServerError("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setServerError("")}
            severity="error"
            variant="filled"
          >
            {serverError}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default AddProductForm;
