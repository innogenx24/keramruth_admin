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
  const imageBaseURL = "http://88.222.245.236:3002/";

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
      const stockValue = state?.product?.status === 1 ? true : false;
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    if (!productDetails.id) {
      console.error("Product ID is missing");
      return;
    }
  
    const formData = new FormData();
    formData.append("id", productDetails.id);
    formData.append("product_code", productDetails.product_code);
    formData.append("name", productDetails.name);
    formData.append("productVolume", productDetails.productVolume);
    formData.append("distributorPrice", productDetails.distributorPrice);
    formData.append("price", productDetails.price);
    formData.append("description", productDetails.description);
    formData.append("sdPrice", productDetails.sdPrice);
    formData.append("mdPrice", productDetails.mdPrice);
    formData.append("adoPrice", productDetails.adoPrice);
    formData.append("autoUpdate", autoUpdate ? "true" : "false");
    formData.append("category_name", selectedCategory);
    formData.append("stock_quantity", productDetails.stock_quantity);
    formData.append("quantity_type", productDetails.quantity_type);
    formData.append("status", stockStatus ? 1 : 0);
    formData.append("fromDate", productDetails.fromDate);
    formData.append("toDate", productDetails.toDate);
    formData.append("ADO_price", productDetails.ADO_price);
    formData.append("MD_price", productDetails.MD_price);
    formData.append("SD_price", productDetails.SD_price);
    formData.append("distributor_price", productDetails.distributor_price);
    formData.append("customer_price", productDetails.customer_price);
  
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
      />
      <InputLabel>Quantity Type</InputLabel>
      <Select
        fullWidth
        name="quantity_type"
        value={productDetails.quantity_type} // Bind to the state
        onChange={handleInputChange} // Handle the change
        sx={{ marginBottom: "16px" }}
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


            <Box sx={{ display: "flex", alignItems: "center", marginTop: "16px" }}>
              <InputLabel sx={{ marginRight: "8px" }}>Stock Status</InputLabel>
              <Switch
  checked={stockStatus} // Use 'checked' instead of 'value'
  onChange={(e) => setStockStatus(e.target.checked)}
  name="stockStatus"
/>

            </Box>

            {/* <Box sx={{ display: "flex", alignItems: "center", marginTop: "16px" }}>
              <InputLabel sx={{ marginRight: "8px" }}>Auto Update</InputLabel>
              <Switch
  checked={autoUpdate} // Use 'checked' instead of 'value'
  onChange={(e) => setAutoUpdate(e.target.checked)}
  name="autoUpdate"
/>

            </Box>
                value={autoUpdate}
                onChange={(e) => setAutoUpdate(e.target.checked)}
                name="autoUpdate"
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
