import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Box,
  FormHelperText, // Added for error message display
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./sales.css";

const salesRoles = [
  { id: 1, role: "Area Development Officer" },
  { id: 2, role: "Master Distributor" },
  { id: 3, role: "Super Distributor" },
  { id: 4, role: "Distributor" },
];

export default function AddSalesTargetForm() {
  const [selectedProduct, setSelectedProduct] = useState(""); // Selected product name
  const [rolesData, setRolesData] = useState([]); // Array for storing target data
  const [products, setProducts] = useState([]);
  const [selectedProductCode, setSelectedProductCode] = useState(""); // Store product code
  const [errors, setErrors] = useState({}); // For tracking validation errors
  const [formSubmitted, setFormSubmitted] = useState(false); // Track form submission
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from the API
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found");
          return;
        }

        const response = await fetch(
          "http://88.222.245.236:3002/products/admin_product",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const validateFields = () => {
    const validationErrors = {};

    if (!selectedProduct) {
      validationErrors.product = "Please select a product.";
    }

    rolesData.forEach((roleData) => {
      if (!roleData.target) {
        validationErrors[`${roleData.roleId}-target`] =
          "Numbers only allowed..";
      } else if (!/^\d+$/.test(roleData.target)) {
        validationErrors[`${roleData.roleId}-target`] =
          "Target must be a number.";
      }

      if (!roleData.duration) {
        validationErrors[`${roleData.roleId}-duration`] =
          "Duration is required.";
      }
    });

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (roleId, field, value) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [`${roleId}-${field}`]: "", // Clear error for specific field
    }));

    setRolesData((prevRolesData) =>
      prevRolesData.map((roleData) =>
        roleData.roleId === roleId
          ? {
              ...roleData,
              [field]: value,
            }
          : roleData
      )
    );
  };

  const handleProductChange = (product) => {
    setSelectedProduct(product.name); // Set selected product name
    setSelectedProductCode(product.code); // Set selected product code

    const initialRolesData = salesRoles.map((role) => ({
      roleId: role.id,
      roleName: role.role,
      target: "",
      duration: "",
    }));

    setRolesData(initialRolesData);
    setErrors({}); // Clear errors when product changes
  };

  const handleSubmit = async () => {
    setFormSubmitted(true);
  
    if (!validateFields()) {
      console.error("Validation failed");
      return;
    }
  
    const payload = {
      product_name: selectedProduct,
      targets: rolesData.map((roleData) => ({
        role: roleData.roleName,
        targetData: [
          {
            target: roleData.target,
            duration: roleData.duration,
          },
        ],
      })),
    };
  
    try {
      const response = await fetch(
        "http://localhost:3002/salestarget/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
  
      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        navigate("/dashboard/sales-target");
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
  
        // Set the error message for the specific product
        if (errorData.message === "Sales targets for this product already exist.") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            product: errorData.message, // Display message for product selection error
          }));
        }
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Masters / Sales Target
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
        <FormControl fullWidth margin="normal" error={!!errors.product}>
  <InputLabel>Select Product</InputLabel>
  <Select
    value={selectedProduct}
    onChange={(e) => {
      const selected = products.find(
        (product) => product.name === e.target.value
      );
      handleProductChange(selected);
    }}
  >
    <MenuItem value="">
      <em>Select a Product</em>
    </MenuItem>
    {products.map((product) => (
      <MenuItem key={product.id} value={product.name}>
        {product.name}
      </MenuItem>
    ))}
  </Select>
  {errors.product && <FormHelperText>{errors.product}</FormHelperText>}
</FormControl>


          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sales Target for {selectedProduct}:
              </Typography>
              {rolesData.map((roleData) => (
                <Grid container spacing={2} key={roleData.roleId} alignItems="center" sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography>{roleData.roleName}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Target"
                      fullWidth
                      value={roleData.target}
                      onChange={(e) =>
                        handleChange(roleData.roleId, "target", e.target.value)
                      }
                      error={!!errors[`${roleData.roleId}-target`]}
                      helperText={errors[`${roleData.roleId}-target`] || ""}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl
                      fullWidth
                      error={!!errors[`${roleData.roleId}-duration`]}
                    >
                      <Select
                        value={roleData.duration}
                        onChange={(e) =>
                          handleChange(roleData.roleId, "duration", e.target.value)
                        }
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          <em>Select Duration</em>
                        </MenuItem>
                        <MenuItem value="1 month">1 month</MenuItem>
                        <MenuItem value="3 months">3 months</MenuItem>
                        <MenuItem value="6 months">6 months</MenuItem>
                      </Select>
                      {errors[`${roleData.roleId}-duration`] && (
                        <FormHelperText>
                          {errors[`${roleData.roleId}-duration`]}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              ))}
            </CardContent>
          </Card>
        </Grid>

       
        <Grid item xs={12}>
        <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit}

              
              sx={{ marginTop: "24px",    width: "50%",
                borderRadius: "15px", padding: "8px" }}
            >
              Save
            </Button>
        </Grid>
      </Grid>
    </div>
  );
}
