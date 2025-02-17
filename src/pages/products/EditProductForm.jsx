import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Switch,
  Snackbar,
  Alert,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { API_END_POINT_IMG } from "../../constants/ApiConstant";

const EditProductForm = ({ handleBackToProducts }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;
  const imageBaseURL = `${API_END_POINT_IMG}/uploads/`;

  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState("success");

  const [errors, setErrors] = useState({
    name: "",
    productVolume: "",
    price: "",
    adoPrice: "",
    mdPrice: "",
    sdPrice: "",
    quantity: "",
    quantity_type: "",
  });

  const initialProductDetails = {
    product_code: "",
    image: "",
    id: "",
    name: "",
    productVolume: "",
    distributorPrice: "",
    price: "",
    description: "",
    sdPrice: "",
    mdPrice: "",
    adoPrice: "",
    category_name: "",
    stock_quantity: "",
    quantity_type: "",
    fromDate: "",
    toDate: "",
    ADO_price: "",
    MD_price: "",
    SD_price: "",

    distributor_price: "",
    customer_price: "",
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState("");
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [stockStatus, setStockStatus] = useState(true);
  const [productDetails, setProductDetails] = useState(initialProductDetails);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const currentDateWithTimeISO = new Date().toISOString();
  const currentDate = new Date().toISOString().split("T")[0]; // Current date in yyyy-mm-dd format

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Get the token (from localStorage, sessionStorage, or state)
        const token = localStorage.getItem("token"); // or use your preferred storage method

        // Set up the fetch options with Authorization header
        const response = await fetch(`${API_END_POINT}/category`, {
          method: "GET", // HTTP method (GET by default)
          headers: {
            "Content-Type": "application/json", // Ensure content type is JSON
            Authorization: `Bearer ${token}`, // Add the token to Authorization header
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (state?.product) {
      // setProductDetails(state.product);
      setProductDetails((prevDetails) => ({
        ...prevDetails,
        ...state.product, // Spread other product properties
        stock_quantity: "", // Ensure stock_quantity starts as empty
      }));
      const stockValue = state?.product?.status === true ? true : false;

      setAutoUpdate(state.product.autoUpdate);
      setSelectedCategory(state.product.category_name);

      if (state.product.image) {
        setSelectedImage(state.product.image);
        setImagePreview(`${imageBaseURL}${state.product.image}`);
        setImageName(state.product.image);
      }
    }
  }, [state]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validImageTypes.includes(file.type)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          image: "Only JPEG, JPG, and PNG formats are allowed.",
        }));
        setSelectedImage(null);
        setImagePreview(null);
        setImageName("");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          image: "Image size less than 2MB only.",
        }));
        setSelectedImage(null);
        setImagePreview(null);
        setImageName("");
        return;
      }

      setErrors((prevErrors) => ({ ...prevErrors, image: "" }));
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setImageName(file.name);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleQuantityChange = (e) => {
    const { value } = e.target;
    const newQuantity = parseInt(value, 10);
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      stock_quantity: isNaN(newQuantity) ? 0 : newQuantity, // Handle invalid numbers
    }));
  };

  const validateForm = () => {
    let formErrors = {};

    // Validate required fields
    if (!productDetails.name) {
      formErrors.name = "Product name is required";
    } else if (productDetails.name.length < 3) {
      formErrors.name = "Product name must be at least 3 characters";
    } else if (productDetails.name.length > 225) {
      formErrors.name = "Product name must be less than 225 characters";
    }

    if (!productDetails.productVolume) {
      formErrors.productVolume = "Product volume is required";
    } else if (
      isNaN(productDetails.productVolume) ||
      productDetails.productVolume <= 0
    ) {
      formErrors.productVolume =
        "Please enter a valid positive number for product volume";
    }

    if (!productDetails.quantity_type) {
      formErrors.quantity_type = "Quantity type is required";
    }
    if (!productDetails.price) {
      formErrors.price = "Customer price is required";
    } else if (isNaN(productDetails.price) || productDetails.price <= 0) {
      formErrors.price = "Please enter a valid number";
    }

    // Validate Stock Quantity field
    // if (!productDetails.stock_quantity) {
    //   formErrors.quantity = 'Stock quantity is required';
    // } else if (isNaN(productDetails.stock_quantity) || productDetails.stock_quantity <= 0) {
    //   formErrors.quantity = 'Please enter a valid number for stock quantity';
    // }

    if (!productDetails.adoPrice) {
      formErrors.adoPrice = "Area Development Officer price is required";
    } else if (isNaN(productDetails.adoPrice) || productDetails.adoPrice <= 0) {
      formErrors.adoPrice = "Please enter a valid number";
    }
    if (!productDetails.mdPrice) {
      formErrors.mdPrice = "Master Distributor price is required";
    } else if (isNaN(productDetails.mdPrice) || productDetails.mdPrice <= 0) {
      formErrors.mdPrice = "Please enter a valid number";
    }
    if (!productDetails.sdPrice) {
      formErrors.sdPrice = "Super Distributor price is required";
    } else if (isNaN(productDetails.sdPrice) || productDetails.sdPrice <= 0) {
      formErrors.sdPrice = "Please enter a valid number";
    }
    if (!productDetails.distributorPrice) {
      formErrors.distributorPrice = "Distributor price is required";
    } else if (
      isNaN(productDetails.distributorPrice) ||
      productDetails.distributorPrice <= 0
    ) {
      formErrors.distributorPrice = "Please enter a valid number";
    }

    if (autoUpdate) {
      // Validate auto-update specific fields
      if (!productDetails.fromDate) {
        formErrors.fromDate = "From Date is required";
      }
      if (!productDetails.toDate) {
        formErrors.toDate = "To Date is required";
      }

      // Validate prices for auto-update
      if (productDetails.customer_price >= productDetails.price) {
        formErrors.customer_price =
          "Customer Price must be less than the original Customer price";
      }

      if (productDetails.distributor_price >= productDetails.distributorPrice) {
        formErrors.distributor_price =
          "Distributor Price must be less than the original Distributor price";
      }

      if (productDetails.SD_price >= productDetails.sdPrice) {
        formErrors.SD_price =
          "SD Price must be less than the original SD price";
      }

      if (productDetails.MD_price >= productDetails.mdPrice) {
        formErrors.MD_price =
          "MD Price must be less than the original MD price";
      }

      if (productDetails.ADO_price >= productDetails.adoPrice) {
        formErrors.ADO_price =
          "ADO Price must be less than the original ADO price";
      }

      // Validate date order
      const fromDate = new Date(productDetails.fromDate);
      const toDate = new Date(productDetails.toDate);
      if (toDate < fromDate) {
        formErrors.toDate = "To Date must be after From Date";
      }
    }

    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const totalStockQuantity =
      productDetails.stock_quantity + (state?.product?.stock_quantity || 0);

    // Validate the form before submitting
    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }

    if (!productDetails.id) {
      console.error("Product ID is missing");
      return;
    }

    // Create a FormData object to append all the form data
    const formData = new FormData();
    formData.append("id", productDetails.id);
    formData.append("product_code", productDetails.product_code);
    formData.append("name", productDetails.name);
    formData.append("productVolume", productDetails.productVolume);
    formData.append("distributorPrice", productDetails.distributorPrice || "0");
    formData.append("price", productDetails.price || "0");
    formData.append("description", productDetails.description || "");
    formData.append("sdPrice", productDetails.sdPrice || "0");
    formData.append("mdPrice", productDetails.mdPrice || "0");
    formData.append("adoPrice", productDetails.adoPrice || "0");

    // Set autoUpdate-related fields (fromDate, toDate, and prices) based on the autoUpdate flag
    formData.append("autoUpdate", autoUpdate ? "true" : "false");
    formData.append("stockStatus", stockStatus ? "1" : "0");

    // If autoUpdate is false, set dates to "1970-01-01" and prices to "0"
    if (!autoUpdate) {
      formData.append("fromDate", currentDateWithTimeISO);
      formData.append("toDate", currentDateWithTimeISO);
      formData.append("customer_price", "0");
      formData.append("distributor_price", "0");
      formData.append("SD_price", "0");
      formData.append("MD_price", "0");
      formData.append("ADO_price", "0");
    } else {
      // Otherwise, set the dates and prices to the values from the form
      formData.append(
        "fromDate",
        productDetails.fromDate || currentDateWithTimeISO
      );
      formData.append(
        "toDate",
        productDetails.toDate || currentDateWithTimeISO
      );
      formData.append("customer_price", productDetails.customer_price || "0");
      formData.append(
        "distributor_price",
        productDetails.distributor_price || "0"
      );
      formData.append("SD_price", productDetails.SD_price || "0");
      formData.append("MD_price", productDetails.MD_price || "0");
      formData.append("ADO_price", productDetails.ADO_price || "0");
    }

    formData.append("category_name", selectedCategory || "");
    formData.append("stock_quantity", totalStockQuantity);
    formData.append("quantity_type", productDetails.quantity_type || "Unit");
    // formData.append("status", stockStatus ? 0 : 1);

    // If an image was selected, append it to the form data
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      // Send the PUT request to update the product
      const response = await fetch(
        `${API_END_POINT}/products/${productDetails.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      // Handle server response
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === "Product name is already exists.") {
          setServerError("Product name is already exists.");
        } else {
          throw new Error("Error updating product");
        }
      } else {
        // Reset form fields upon success
        setProductDetails(initialProductDetails);
        setSelectedImage(null);
        setImagePreview(null);
        setImageName("");
        setAutoUpdate(true);
        setStockStatus(true);

        const successMessage = `Product updated successfully.`;
        setSuccessMessage(successMessage);
        setSnackbarType("success");
        setOpenSnackbar(true);

        // Delay navigation by 2 seconds
        setTimeout(() => {
          setOpenSnackbar(false);
          navigate("/dashboard/products");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <Box
      sx={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
      }}
      component="form"
      onSubmit={handleFormSubmit}
    >
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        {state?.product ? "Edit Product" : "Add Product"}
      </Typography>

      <Grid container spacing={3}>
        {/* Left section with product details */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Products Details
            </Typography>
            <InputLabel>Add Images</InputLabel>
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
            {imageName && (
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                {imageName}
              </Typography>
            )}{" "}
            {/* Display the image name */}
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
            {errors.image && (
              <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
                {errors.image}
              </Typography>
            )}
            <TextField
              fullWidth
              variant="outlined"
              label="Product Name*"
              name="name"
              value={productDetails.name}
              onChange={(e) => {
                handleInputChange(e);
                setServerError(""); // Clear server error on input change
              }}
              placeholder="Enter Product Name"
              sx={{ marginBottom: "16px" }}
              error={Boolean(errors.name) || Boolean(serverError)}
              helperText={errors.name || serverError}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Description"
              name="description"
              value={productDetails.description}
              onChange={handleInputChange}
              placeholder="Enter Description"
              multiline
              rows={3}
              sx={{ marginBottom: "16px", borderRadius: "15px" }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Product Volume*"
              name="productVolume"
              value={productDetails.productVolume}
              onChange={handleInputChange}
              placeholder="Enter Product Volume (200ml, 500ml, 1L)"
              sx={{ marginBottom: "16px" }}
              error={Boolean(errors.productVolume)}
              helperText={errors.productVolume}
            />
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              value={productDetails.category_name || selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setProductDetails((prevDetails) => ({
                  ...prevDetails,
                  category_name: e.target.value,
                }));
              }}
              fullWidth
              variant="outlined"
              sx={{ marginBottom: "16px", borderRadius: "20px" }}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.category_name}>
                  {category.category_name}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Grid>

        {/* Right section with price details */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: "#fff",
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
              label="MRP Price (Customer)*"
              name="price"
              value={productDetails.price}
              onChange={handleInputChange}
              placeholder="Enter MRP Price"
              sx={{ marginBottom: "16px" }}
              error={Boolean(errors.price)}
              helperText={errors.price}
            />

            <Typography variant="h6" gutterBottom>
              For Distributors Price:
            </Typography>

            <TextField
              fullWidth
              variant="outlined"
              name="adoPrice"
              value={productDetails.adoPrice}
              label="Area Development Officer (ADO) Price*"
              placeholder="Enter ADO Price"
              sx={{ marginBottom: "16px" }}
              onChange={handleInputChange}
              error={Boolean(errors.adoPrice)}
              helperText={errors.adoPrice}
            />
            <TextField
              fullWidth
              variant="outlined"
              name="mdPrice"
              value={productDetails.mdPrice}
              label="Master Distributor (MD) Price*"
              placeholder="Enter MD Price"
              sx={{ marginBottom: "16px" }}
              onChange={handleInputChange}
              error={Boolean(errors.mdPrice)}
              helperText={errors.mdPrice}
            />
            <TextField
              fullWidth
              variant="outlined"
              name="sdPrice"
              value={productDetails.sdPrice}
              label="Super Distributor (SD) Price*"
              placeholder="Enter SD Price"
              sx={{ marginBottom: "16px" }}
              onChange={handleInputChange}
              error={Boolean(errors.sdPrice)}
              helperText={errors.sdPrice}
            />
            <TextField
              fullWidth
              variant="outlined"
              name="distributorPrice"
              value={productDetails.distributorPrice}
              label="Distributor Price*"
              placeholder="Enter Distributor Price"
              sx={{ marginBottom: "16px" }}
              onChange={handleInputChange}
              error={Boolean(errors.distributorPrice)}
              helperText={errors.distributorPrice}
            />
            <Typography>Available Stock</Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={productDetails.finalStockQuantity}
              sx={{ marginBottom: "16px" }}
              disabled
            />
            <TextField
              fullWidth
              variant="outlined"
              name="quantity"
              value={productDetails.stock_quantity}
              label="Add Quantity"
              placeholder="Enter Stock Quantity"
              sx={{ marginBottom: "16px" }}
              onChange={handleQuantityChange}
              error={Boolean(errors.quantity)}
              helperText={errors.quantity}
            />
            <InputLabel>Quantity Type</InputLabel>
            <Select
              fullWidth
              name="quantity_type"
              value={productDetails.quantity_type} // Bind to the state
              onChange={handleInputChange} // Handle the change
              sx={{ marginBottom: "16px", borderRadius: "20px" }}
              error={Boolean(errors.quantity_type)}
              helperText={errors.quantity_type}
            >
              <MenuItem value="">Select Quantity Type</MenuItem>
              <MenuItem value="ml">ml</MenuItem>
              <MenuItem value="liters">Liters</MenuItem>
              <MenuItem value="kg">Kg</MenuItem>
              <MenuItem value="gm">gm</MenuItem>
            </Select>

            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <Typography sx={{ marginRight: "8px" }}>Auto Update</Typography>
              <Switch
                checked={autoUpdate}
                onChange={(e) => setAutoUpdate(e.target.checked)}
                color="primary"
              />
            </Box>

            {/* Conditional Fields: From Date & To Date */}
            {autoUpdate ? (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="From Date"
                      type="date"
                      name="fromDate"
                      value={productDetails.fromDate}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ inputProps: { min: currentDate } }}
                      error={Boolean(errors.fromDate)}
                      helperText={errors.fromDate}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="To Date"
                      type="date"
                      name="toDate"
                      value={productDetails.toDate}
                      onChange={handleInputChange}
                      error={Boolean(errors.toDate)}
                      helperText={errors.toDate}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ inputProps: { min: currentDate } }}
                    />
                  </Grid>
                </Grid>
                <Typography variant="h6">Set Price</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="h6">
                      Area Development Officer Price
                    </Typography>
                    <TextField
                      fullWidth
                      label="Enter ADO Price"
                      name="ADO_price"
                      value={productDetails.ADO_price}
                      onChange={handleInputChange}
                      error={Boolean(errors.ADO_price)}
                      helperText={errors.ADO_price}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6">
                      Master Distributor Price
                    </Typography>
                    <TextField
                      fullWidth
                      label="Enter MD Price"
                      name="MD_price"
                      value={productDetails.MD_price}
                      onChange={handleInputChange}
                      error={Boolean(errors.MD_price)}
                      helperText={errors.MD_price}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="h6">
                      Super Distributor Price
                    </Typography>
                    <TextField
                      fullWidth
                      label="Enter SD Price"
                      name="SD_price"
                      value={productDetails.SD_price}
                      onChange={handleInputChange}
                      error={Boolean(errors.SD_price)}
                      helperText={errors.SD_price}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6">Distributor Price</Typography>
                    <TextField
                      fullWidth
                      label="Enter Distributor Price"
                      name="distributor_price"
                      value={productDetails.distributor_price}
                      onChange={handleInputChange}
                      error={Boolean(errors.distributor_price)}
                      helperText={errors.distributor_price}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="h6">Customer Price</Typography>
                    <TextField
                      fullWidth
                      label="Enter Customer Price"
                      name="customer_price"
                      value={productDetails.customer_price}
                      onChange={handleInputChange}
                      error={Boolean(errors.customer_price)}
                      helperText={errors.customer_price}
                    />
                  </Grid>
                </Grid>
              </Box>
            ) : null}

            {/* <Box sx={{ display: "flex", alignItems: "center", marginTop: "16px" }}>
              <InputLabel sx={{ marginRight: "8px" }}>Stock Status</InputLabel>
              <Switch
  checked={stockStatus} // Use 'checked' instead of 'value'
  onChange={(e) => setStockStatus(e.target.checked)}
  name="stockStatus"
/>

            </Box> */}

            <Box
              sx={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{ marginTop: "20px" }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
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

export default EditProductForm;
