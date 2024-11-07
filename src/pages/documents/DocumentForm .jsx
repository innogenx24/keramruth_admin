import { useState, useRef } from "react";
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
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useNavigate } from "react-router-dom";

const AddProductForm = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [status, setStatus] = useState(true);
  const [formValues, setFormValues] = useState({
    product_code: "",
    name: "",
    description: "",
    productVolume: "",
    price: "",
    adoPrice: "",
    mdPrice: "",
    sdPrice: "",
    distributorPrice: "",
    stock_quantity: "",
    quantity_type: "",
  });
  const [image, setImage] = useState(null); // State for selected image
  const [imageName, setImageName] = useState(""); // State for image name
  const fileInputRef = useRef(null); // Reference for file input

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageName(file.name); // Update the image name
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("product_code", formValues.product_code);
    formData.append("name", formValues.name);
    formData.append("description", formValues.description);
    formData.append("productVolume", formValues.productVolume);
    formData.append("price", formValues.price);
    formData.append("adoPrice", formValues.adoPrice);
    formData.append("mdPrice", formValues.mdPrice);
    formData.append("sdPrice", formValues.sdPrice);
    formData.append("distributorPrice", formValues.distributorPrice);
    formData.append("stock_quantity", formValues.stock_quantity);
    formData.append("quantity_type", formValues.quantity_type);
    formData.append("autoUpdate", autoUpdate);
    formData.append("status", status);

    if (image) {
      formData.append("image", image); // Append the image file
      formData.append("imageSize", image.size); // Append the image size
    }

    fetch("http://localhost:3002/products", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        navigate("/dashboard/products"); // Navigate to products page after successful creation
      })
      .catch((error) => {
        console.error("Error:", error);
        // Optionally, display an error message to the user
      });
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
    >
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Product / Add Product
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Product Details Section (Left Side) */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Product Details
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
              {imageName && <Typography variant="body2" sx={{ marginTop: 1 }}>{imageName}</Typography>}

              {/* Other input fields */}
              <TextField
                fullWidth
                variant="outlined"
                name="product_code"
                label="Product ID*"
                sx={{ marginBottom: "16px" }}
                value={formValues.product_code}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                variant="outlined"
                name="name"
                label="Product Name*"
                placeholder="Enter Product Name"
                sx={{ marginBottom: "16px" }}
                value={formValues.name}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                variant="outlined"
                name="description"
                label="Description"
                placeholder="Enter Description"
                multiline
                rows={3}
                sx={{ marginBottom: "16px" }}
                value={formValues.description}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                variant="outlined"
                name="productVolume"
                label="Product Volume*"
                placeholder="Enter Product Volume (200ml, 500ml, 1L)"
                sx={{ marginBottom: "16px" }}
                value={formValues.productVolume}
                onChange={handleChange}
              />
            </Box>
          </Grid>

          {/* Price Details Section (Right Side) */}
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
                name="price"
                label="MRP Price (Customer)*"
                placeholder="Enter MRP Price"
                sx={{ marginBottom: "16px" }}
                value={formValues.price}
                onChange={handleChange}
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
                value={formValues.adoPrice}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                variant="outlined"
                name="mdPrice"
                label="Master Distributor (MD) Price*"
                placeholder="Enter MD Price"
                sx={{ marginBottom: "16px" }}
                value={formValues.mdPrice}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                variant="outlined"
                name="sdPrice"
                label="Super Distributor (SD) Price*"
                placeholder="Enter SD Price"
                sx={{ marginBottom: "16px" }}
                value={formValues.sdPrice}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                variant="outlined"
                name="distributorPrice"
                label="Distributor Price*"
                placeholder="Enter Distributor Price"
                sx={{ marginBottom: "16px" }}
                value={formValues.distributorPrice}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                variant="outlined"
                name="stock_quantity"
                label="Stock Quantity*"
                placeholder="Enter Stock Quantity"
                sx={{ marginBottom: "16px" }}
                value={formValues.stock_quantity}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                variant="outlined"
                name="quantity_type"
                label="Quantity Type*"
                placeholder="e.g., pcs, ml, kg"
                sx={{ marginBottom: "16px" }}
                value={formValues.quantity_type}
                onChange={handleChange}
              />

              {/* Switches: Auto Update and Stock Status */}
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <Typography sx={{ marginRight: "8px" }}>Auto Update</Typography>
                <Switch
                  checked={autoUpdate}
                  onChange={() => setAutoUpdate(!autoUpdate)}
                  color="primary"
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <Typography sx={{ marginRight: "8px" }}>Active Status</Typography>
                <Switch
                  checked={status}
                  onChange={() => setStatus(!status)}
                  color="primary"
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ marginTop: "20px" }}
              >
                Add Product
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddProductForm;
