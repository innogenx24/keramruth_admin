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
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { makePostProduct } from "../../redux/slices/product-slice/ProductPostSlice";

const AddProductForm = () => {
  const dispatch = useDispatch();

  const fileInputRef = useRef(null); // Ref to reset file input
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageName, setImageName] = useState(""); // State for the image name
  const [imagePreview, setImagePreview] = useState(""); // State for the image preview

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      autoUpdate: false,
      status: false,
      product_code: "",
      image: "", // Set initial image value as an empty string
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
    },
    validationSchema: Yup.object({
      autoUpdate: Yup.boolean(),
      status: Yup.boolean(),
      product_code: Yup.number().required("Required"),
      image: Yup.string().required("Required"), // Update validation to expect a string
      name: Yup.string().required("Required"),
      productVolume: Yup.string().required("Required"),
      description: Yup.string(),
      price: Yup.number().required("Required"),
      distributorPrice: Yup.number().required("Required"),
      sdPrice: Yup.number().required("Required"),
      mdPrice: Yup.number().required("Required"),
      adoPrice: Yup.number().required("Required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const parsedValues = {
        ...values,
        autoUpdate: Boolean(values.autoUpdate),
        status: Boolean(values.status),
        image: selectedFile ? selectedFile.name : "", // Set image to file name
        price: parseInt(values.price, 10),
        sdPrice: parseInt(values.sdPrice, 10),
        mdPrice: parseInt(values.mdPrice, 10),
        adoPrice: parseInt(values.adoPrice, 10),
        distributorPrice: parseInt(values.distributorPrice, 10),
      };
      dispatch(makePostProduct(parsedValues));
      resetForm();
      setSelectedFile(null);
      setImageName(""); // Reset image name
      setImagePreview(""); // Reset image preview
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("image", file.name); // Set image name directly to formik state
      setSelectedFile(file); // Update local state if needed
      setImageName(file.name); // Set image name for display

      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set preview image URL
      };
      reader.readAsDataURL(file);
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

              {/* Other input fields remain unchanged */}
              <TextField
                fullWidth
                variant="outlined"
                name="product_code"
                label="Product ID*"
                sx={{ marginBottom: "16px" }}
                {...formik.getFieldProps("product_code")}
                error={formik.touched.product_code && Boolean(formik.errors.product_code)}
                helperText={formik.touched.product_code && formik.errors.product_code}
              />
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
              <TextField
                fullWidth
                variant="outlined"
                name="quantity_type"
                label="Quantity Type*"
                placeholder="e.g., pcs, ml, kg"
                sx={{ marginBottom: "16px" }}
                {...formik.getFieldProps("quantity_type")}
                error={formik.touched.quantity_type && Boolean(formik.errors.quantity_type)}
                helperText={formik.touched.quantity_type && formik.errors.quantity_type}
              />

              {/* Switches: Auto Update and Stock Status, each under the other */}
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
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
                
              </Box>

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
