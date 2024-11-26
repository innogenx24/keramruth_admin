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
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const EditProductForm = ({ handleBackToProducts }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const imageBaseURL = "http://88.222.245.236:3002/uploads/";

  const [errors, setErrors] = useState({
    name: '',
    productVolume: '',
    price: '',
    adoPrice: '',
    mdPrice: '',
    sdPrice: '',
    stock_quantity: '',
    quantity_type:'',
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
    customer_price: ""
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState("");
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [stockStatus, setStockStatus] = useState(true);
  const [productDetails, setProductDetails] = useState(initialProductDetails);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(''); 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://88.222.245.236:3002/category");
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
      setProductDetails(state.product);
      const stockValue = state?.product?.status === true ? true : false;
      
      setStockStatus(stockValue);
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

  const validateForm = () => {
    let formErrors = {};
    
    // Validate required fields
    if (!productDetails.name) {
      formErrors.name = 'Product name is required';
    } else if (productDetails.name.length < 3) {
      formErrors.name = 'Product name must be at least 3 characters';
    } else if (productDetails.name.length > 30) {
      formErrors.name = 'Product name must be less than 30 characters';
    }
    if (!productDetails.productVolume) {
      formErrors.productVolume = 'Product volume is required';
    } else if (isNaN(productDetails.productVolume) || productDetails.productVolume <= 0) {
      formErrors.productVolume = 'Please enter a valid positive number for product volume';
    }
    if (!productDetails.price) {
      formErrors.price = 'MRP price is required';
    } else if (isNaN(productDetails.price) || productDetails.price <= 0) {
      formErrors.price = 'Please enter a number';
    }
    if (!productDetails.adoPrice) {
      formErrors.adoPrice = 'ADO price is required';
    } else if (isNaN(productDetails.adoPrice) || productDetails.adoPrice <= 0) {
      formErrors.adoPrice = 'Please enter a number';
    }
    if (!productDetails.mdPrice) {
      formErrors.mdPrice = 'MD price is required';
    } else if (isNaN(productDetails.mdPrice) || productDetails.mdPrice <= 0) {
      formErrors.mdPrice = 'Please enter a number';
    }
    if (!productDetails.sdPrice) {
      formErrors.sdPrice = 'SD price is required';
    } else if (isNaN(productDetails.sdPrice) || productDetails.sdPrice <= 0) {
      formErrors.sdPrice = 'Please enter a number';
    }
    if (!productDetails.stock_quantity) {
      formErrors.stock_quantity = 'Stock quantity is required';
    } else if (isNaN(productDetails.stock_quantity) || productDetails.stock_quantity <= 0) {
      formErrors.stock_quantity = 'Please enter a number';
    }
      if (!productDetails.quantity_type) {
        formErrors.quantity_type = 'quantity_type is required';
      }
  
    // Set errors to state
    setErrors(formErrors);
  
    // Return true if no errors
    return Object.keys(formErrors).length === 0;
  };
  

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }
  
    if (!productDetails.id) {
      console.error("Product ID is missing");
      return;
    }
  
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
    formData.append("autoUpdate", autoUpdate ? "true" : "false");
    formData.append("category_name", selectedCategory || "General");
    formData.append("stock_quantity", productDetails.stock_quantity || "0");
    formData.append("quantity_type", productDetails.quantity_type || "Unit");
    formData.append("status", stockStatus ? 1 : 0);
  
    // Validate and handle dates
    const validFromDate = productDetails.fromDate
      ? new Date(productDetails.fromDate).toISOString().slice(0, 10)
      : "1970-01-01"; // Default to 1970-01-01 if no date is provided or autoUpdate is off
    const validToDate = productDetails.toDate
      ? new Date(productDetails.toDate).toISOString().slice(0, 10)
      : "1970-01-01";
  
    formData.append("fromDate", autoUpdate ? validFromDate : "1970-01-01");
    formData.append("toDate", autoUpdate ? validToDate : "1970-01-01");
    formData.append("ADO_price", autoUpdate ? productDetails.ADO_price || "0" : "0");
    formData.append("MD_price", autoUpdate ? productDetails.MD_price || "0" : "0");
    formData.append("SD_price", autoUpdate ? productDetails.SD_price || "0" : "0");
    formData.append("distributor_price", autoUpdate ? productDetails.distributor_price || "0" : "0");
    formData.append("customer_price", autoUpdate ? productDetails.customer_price || "0" : "0");
  
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
  
    try {
      const response = await fetch(`http://88.222.245.236:3002/products/${productDetails.id}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Error updating product");
      }
  
      setProductDetails(initialProductDetails);
      setSelectedImage(null);
      setImagePreview(null);
      setImageName("");
      setAutoUpdate(true);
      setStockStatus(true);
  
      navigate("/dashboard/products");
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
              <IconButton color="primary" onClick={() => fileInputRef.current.click()}>
                <AddPhotoAlternateIcon />
              </IconButton>
              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: 'none' }} // Hide the input
              />
            </Box>
            {imageName && <Typography variant="body2" sx={{ marginTop: 1 }}>{imageName}</Typography>} {/* Display the image name */}

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



            <TextField
              fullWidth
              variant="outlined"
              label="Product Name*"
              name="name"
              value={productDetails.name}
              onChange={handleInputChange}
              placeholder="Enter Product Name"
              sx={{ marginBottom: "16px" }}
              error={Boolean(errors.name)}
              helperText={errors.name}   
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
        sx={{ marginBottom: "16px" }}
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
        name="stock_quantity"
        value={productDetails.stock_quantity} // Bind stock_quantity value to state
        label="Stock Quantity*"
        placeholder="Enter Stock Quantity"
        sx={{ marginBottom: "16px" }}
        onChange={handleInputChange}
        error={Boolean(errors.stock_quantity)}
        helperText={errors.stock_quantity} 
      />
      <InputLabel>Quantity Type</InputLabel>
      <Select
        fullWidth
        name="quantity_type"
        value={productDetails.quantity_type} // Bind to the state
        onChange={handleInputChange} // Handle the change
        sx={{ marginBottom: "16px" }}
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
      {autoUpdate && (
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
                InputLabelProps={{
                  shrink: true,
                }}
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
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
          <Typography variant="h6">Set Price</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="h6">Area Development Officer Price</Typography>
          <TextField
            fullWidth
            label="Enter ADO Price"
            name="ADO_price"
            value={productDetails.ADO_price}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6">Master Distributor Price</Typography>
          <TextField
            fullWidth
            label="Enter MD Price"
            name="MD_price"
            value={productDetails.MD_price}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="h6">Super Distributor Price</Typography>
          <TextField
            fullWidth
            label="Enter SD Price"
            name="SD_price"
            value={productDetails.SD_price}
            onChange={handleInputChange}
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
          />
        </Grid>
      </Grid>
        </Box>
      )}


            {/* <Box sx={{ display: "flex", alignItems: "center", marginTop: "16px" }}>
              <InputLabel sx={{ marginRight: "8px" }}>Stock Status</InputLabel>
              <Switch
  checked={stockStatus} // Use 'checked' instead of 'value'
  onChange={(e) => setStockStatus(e.target.checked)}
  name="stockStatus"
/>

            </Box> */}


            <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "flex-start" }}>
            <Button variant="contained" type="submit" fullWidth sx={{ marginTop: "20px" }}>
                Submit
              </Button>
             
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditProductForm;
