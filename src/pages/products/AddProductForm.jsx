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
  Select ,
  MenuItem,
} from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { makePostProduct } from "../../redux/slices/product-slice/ProductPostSlice";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AddProductForm = () => {
  const navigate = useNavigate(); // Initialize navigate
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const formik = useFormik({
    initialValues: {
      autoUpdate: false,
      status: false,
      product_code: "",
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
      createdBy: "",
      category_id: "",
      fromDate: "",
      toDate: "",   
    },
    validationSchema: Yup.object({
      product_code: Yup.number().required("Required"),
      name: Yup.string().required("Required"),
      productVolume: Yup.string().required("Required"),
      price: Yup.number().required("Required"),
      distributorPrice: Yup.number().required("Required"),
      sdPrice: Yup.number().required("Required"),
      mdPrice: Yup.number().required("Required"),
      adoPrice: Yup.number().required("Required"),
    }),
    onSubmit: (values, { resetForm }) => {
      // Generate a random 6-digit product ID
      const productId = Math.floor(100000 + Math.random() * 900000);
    
      // Create FormData to append the values
      const formData = new FormData();
      formData.append("product_code", productId); // Set the generated product ID
      formData.append("autoUpdate", values.autoUpdate);
      formData.append("status", values.status);
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("productVolume", values.productVolume);
      formData.append("price", values.price);
      formData.append("distributorPrice", values.distributorPrice);
      formData.append("sdPrice", values.sdPrice);
      formData.append("mdPrice", values.mdPrice);
      formData.append("adoPrice", values.adoPrice);
      formData.append("quantity_type", values.quantity_type);
    
      if (values.autoUpdate) {
        formData.append("fromDate", values.fromDate);
        formData.append("toDate", values.toDate);
      }
    
      if (selectedFile) {
        formData.append("image", selectedFile); // Attach the selected file
      }
    
      dispatch(makePostProduct(formData));
      resetForm();
      setSelectedFile(null);
      setImagePreview("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      navigate("/dashboard/products");
    },
    
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2MB. Please upload a smaller file.");
        return; 
      }
      formik.setFieldValue("image", file);
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return(
    <Box
      
    >
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Product / Add Product
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          {/* Product Details Section (Left Side) */}
          <Grid item xs={12} md={6}>
          <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>

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
              {selectedFile && <Typography variant="body2" sx={{ marginTop: 1 }}>{selectedFile.name}</Typography>} {/* Display the image name */}
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

              {/* Other input fields remain unchanged */}
              {/* <TextField
                fullWidth
                variant="outlined"
                name="product_code"
                label="Product ID*"
                sx={{ marginBottom: "16px" }}
                {...formik.getFieldProps("product_code")}
                error={formik.touched.product_code && Boolean(formik.errors.product_code)}
                helperText={formik.touched.product_code && formik.errors.product_code}
              /> */}
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
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
              <TextField
                fullWidth
                variant="outlined"
                name="productVolume"
                label="Product Volume*"
                placeholder="Enter Product Volume (200ml, 500ml, 1L)"
                sx={{ marginBottom: "16px" }}
                {...formik.getFieldProps("productVolume")}
                error={formik.touched.productVolume && Boolean(formik.errors.productVolume)}
                helperText={formik.touched.productVolume && formik.errors.productVolume}
              />
            </Box>
          </Grid>

          {/* Price Details Section (Right Side) */}
          <Grid item xs={12} md={6}>
                        <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>

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
                error={formik.touched.adoPrice && Boolean(formik.errors.adoPrice)}
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
                error={formik.touched.distributorPrice && Boolean(formik.errors.distributorPrice)}
                helperText={formik.touched.distributorPrice && formik.errors.distributorPrice}
              />
              <TextField
                fullWidth
                variant="outlined"
                name="stock_quantity"
                label="Stock Quantity*"
                placeholder="Enter Stock Quantity"
                sx={{ marginBottom: "16px" }}
                {...formik.getFieldProps("stock_quantity")}
                error={formik.touched.stock_quantity && Boolean(formik.errors.stock_quantity)}
                helperText={formik.touched.stock_quantity && formik.errors.stock_quantity}
              />
               <InputLabel>Quantity Type</InputLabel>
               <Select
                 fullWidth
                 name="quantity_type"
                 value={formik.values.quantity_type}
                 onChange={(e) => formik.setFieldValue("quantity_type", e.target.value)} 
                 error={formik.touched.quantity_type && Boolean(formik.errors.quantity_type)} 
                 helperText={formik.touched.quantity_type && formik.errors.quantity_type} 
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
    checked={formik.values.autoUpdate}
    name="autoUpdate"
    onChange={(e) => formik.setFieldValue("autoUpdate", e.target.checked)}
    color="primary"
  />
</Box>

{formik.values.autoUpdate && ( // Conditional rendering based on autoUpdate state
  <Box sx={{ mt: 2 }}>
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="From Date"
          type="date"
          value={formik.values.fromDate}
          onChange={(e) => formik.setFieldValue("fromDate", e.target.value)}
          InputLabelProps={{ shrink: true }}
          margin="normal"
          error={formik.touched.fromDate && Boolean(formik.errors.fromDate)}
          helperText={formik.touched.fromDate && formik.errors.fromDate}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="To Date"
          type="date"
          value={formik.values.toDate}
          onChange={(e) => formik.setFieldValue("toDate", e.target.value)}
          InputLabelProps={{ shrink: true }}
          margin="normal"
          error={formik.touched.toDate && Boolean(formik.errors.toDate)}
          helperText={formik.touched.toDate && formik.errors.toDate}
        />
      </Grid>
    </Grid>
  </Box>
)}


<<<<<<< HEAD
=======
              {/* Switches: Auto Update and Stock Status, each under the other */}
              {/* <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <Typography sx={{ marginRight: "8px" }}>Auto Update</Typography>
                <Switch
                  checked={formik.values.autoUpdate}
                  name="autoUpdate"
                  onChange={(e) =>
                    formik.setFieldValue("autoUpdate", e.target.checked)
                  } // Formik update
                  color="primary"
                  error={
                    formik.touched.autoUpdate &&
                    Boolean(formik.errors.autoUpdate)
                  }
                  helperText={
                    formik.touched.autoUpdate && formik.errors.autoUpdate
                  }
                />
                
              </Box> */}
>>>>>>> d25265bfe0c757321da801ff354154cafedbb310

              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
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
      </form>
    </Box>
  );
};

export default AddProductForm;
