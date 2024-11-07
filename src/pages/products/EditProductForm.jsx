import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Switch,
  InputLabel,
  IconButton,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { useDispatch } from "react-redux";
import { makeEditProduct } from "../../redux/slices/product-slice/ProductEditSlice";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const EditProductForm = ({ handleBackToProducts }) => {
  const { state } = useLocation();
  const navigate = useNavigate(); // Initialize navigate
  const dispatch = useDispatch();
  const fileInputRef = useRef(null); // Reference for hidden file input

  const initialProductDetails = {
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
  };

  // States for form fields
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState(""); // State to hold image name
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [stockStatus, setStockStatus] = useState(true);
  const [productDetails, setProductDetails] = useState(initialProductDetails);

  useEffect(() => {
    if (state?.product) {
      setProductDetails(state.product);
      const stockValue = state?.product?.status === "Active" ? true : false;
      setStockStatus(stockValue);
      setAutoUpdate(state.product.autoUpdate);

      if (state.product.image) {
        setSelectedImage(state.product.image);
        setImagePreview(state.product.image);
        setImageName(state.product.image); // Set the image name if exists
      }
    }
  }, [state]);

  // Handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setImageName(file.name); // Set the image name
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    const parsedValues = {
      ...productDetails,
      image: selectedImage instanceof File ? selectedImage.name : productDetails.image,
      autoUpdate: Boolean(autoUpdate),
      status: Boolean(stockStatus ? "Active" : "Inactive"),
      price: parseInt(productDetails.price, 10),
      sdPrice: parseInt(productDetails.sdPrice, 10),
      mdPrice: parseInt(productDetails.mdPrice, 10),
      adoPrice: parseInt(productDetails.adoPrice, 10),
      distributorPrice: parseInt(productDetails.distributorPrice, 10),
    };
    dispatch(makeEditProduct({ ...parsedValues }));

    // Reset form fields
    setProductDetails(initialProductDetails);
    setSelectedImage(null);
    setImagePreview(null);
    setImageName(""); // Reset image name
    setAutoUpdate(true);
    setStockStatus(true);

    // Navigate back to products page
    navigate("/dashboard/products");
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
              label="Product ID*"
              name="id"
              value={productDetails.id}
              InputProps={{ readOnly: true }}
              sx={{ marginBottom: "16px" }}
            />

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
              label="Distributor Price*"
              name="distributorPrice"
              value={productDetails.distributorPrice}
              onChange={handleInputChange}
              placeholder="Enter Distributor Price"
              sx={{ marginBottom: "16px" }}
            />

            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <Typography sx={{ marginRight: "8px" }}>Auto Update</Typography>
              <Switch
                name="autoUpdate"
                checked={autoUpdate}
                onChange={() => setAutoUpdate((prev) => !prev)}
                color="primary"
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <Typography sx={{ marginRight: "8px" }}>Stock Status</Typography>
              <Switch
                name="stockStatus"
                checked={stockStatus}
                onChange={() => setStockStatus((prev) => !prev)}
                color="primary"
              />
            </Box>

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
    </Box>
  );
};

export default EditProductForm;
