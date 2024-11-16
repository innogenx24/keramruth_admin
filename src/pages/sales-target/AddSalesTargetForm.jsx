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
  const [selectedProduct, setSelectedProduct] = useState(""); // The product selected by the user
  const [rolesData, setRolesData] = useState([]); // Array for storing target data
  const [products, setProducts] = useState([]);
  const [selectedProductCode, setSelectedProductCode] = useState(""); // Store product code
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from the API
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3002/products");
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

  // Handle form field changes
  const handleChange = (roleId, field, value) => {
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
    setSelectedProduct(product.name); // Set the selected product name
    setSelectedProductCode(product.code); // Set the selected product code

    // Create an initial structure for roles data with all roles
    const initialRolesData = salesRoles.map((role) => ({
      roleId: role.id,
      roleName: role.role,
      target: "",
      duration: "",
    }));

    setRolesData(initialRolesData);
  };

  const handleSubmit = async () => {
    if (!selectedProduct || !Array.isArray(rolesData) || rolesData.some(roleData => !roleData.target || !roleData.duration)) {
      console.error("Product and target data are required");
      return;
    }

    // Structure the payload properly
    const payload = {
      product_name: selectedProduct, // Include product name
      targets: rolesData.map((roleData) => ({
        role: roleData.roleName, // Role name
        targetData: [
          {
            target: roleData.target,
            duration: roleData.duration,
          },
        ],
      })),
    };

    try {
      const response = await fetch("http://localhost:3002/salestarget/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        navigate("/dashboard/sales-targets");
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
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
          <InputLabel>Select Product</InputLabel>
          <FormControl fullWidth margin="normal">
            <Select
              value={selectedProduct}
              onChange={(e) => {
                const selected = products.find(
                  (product) => product.name === e.target.value
                );
                handleProductChange(selected);
              }}
              required
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
          </FormControl>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sales Target for {selectedProduct}:
              </Typography>
              {Array.isArray(rolesData) && rolesData.length > 0 ? (
                rolesData.map((roleData) => (
                  <Grid container spacing={2} key={roleData.roleId} alignItems="center" sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography>{roleData.roleName}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        label="Enter Target"
                        fullWidth
                        value={roleData.target}
                        onChange={(e) =>
                          handleChange(roleData.roleId, "target", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Select
                        fullWidth
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
                    </Grid>
                  </Grid>
                ))
              ) : (
                <Typography>Product Not Selected</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Box display="flex">
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleSubmit}
            >
              SAVE
            </Button>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
