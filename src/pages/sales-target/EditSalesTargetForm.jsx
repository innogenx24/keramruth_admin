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
  Box,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./sales.css";

export default function EditSalesTarget() {
  const navigate = useNavigate();
  const { state } = useLocation(); // Receiving data from the previous page

  const [selectedProduct, setSelectedProduct] = useState(
    state?.product?.product_name || ""
  );
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch sales target data based on the selected product
  useEffect(() => {
    if (!selectedProduct) return;
    fetchSalesTargets();
  }, [selectedProduct]);

  const fetchSalesTargets = async () => {
    try {
      const response = await axios.get(
        `http://88.222.245.236:3002/salestarget/${encodeURIComponent(selectedProduct)}`
      );
      console.log("Fetched Data:", response.data.data); // Debugging
      setTargets(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sales targets:", error);
      setLoading(false);
    }
  };

  // Handle change in target values and durations
  const handleChange = (productIndex, dataIndex, field, value) => {
    const updatedTargets = [...targets];
    updatedTargets[productIndex].product_data[dataIndex][field] = value;
    setTargets(updatedTargets);
  };

  const handleSubmit = async () => {
    if (!targets.length || targets.some(product => product.product_data.some(data => !data.target || !data.duration))) {
      alert("Please fill out all target values and durations.");
      return;
    }

    

    const requestData = {
      product_name: selectedProduct,
      productData: targets.flatMap((product) => product.product_data.map((data) => ({
        role: data.role,
        target: data.target,
        duration: data.duration,
      }))),
    };

    // Log the data being sent
    console.log("Sending data to backend:", requestData);

    try {
      const response = await axios.put(
        `http://88.222.245.236:3002/salestarget/${encodeURIComponent(selectedProduct)}`,
        requestData
      );

      if (response.data.success) {
        // Log success
        console.log("Sales targets updated:", response.data);
        
        // Re-fetch the updated data after the PUT request is successful
        await fetchSalesTargets();

        alert("Sales targets updated successfully");
        navigate("/dashboard/sales-target");
      }
    } catch (error) {
      console.error("Error updating sales targets:", error);
      alert("Failed to update sales targets.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Edit Sales Target for {selectedProduct}
      </Typography>

      {loading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sales Target for {selectedProduct}:
                </Typography>
                {targets.map((product, productIndex) => (
                  <div key={product.id}>
                    {product.product_data.map((data, dataIndex) => (
                      <Grid container spacing={2} key={dataIndex} alignItems="center" sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                          <Typography>{data.role}</Typography>
                        </Grid>

                        <Grid item xs={3}>
  <TextField
    label="Enter Target"
    fullWidth
    value={data.target || ""}
    error={isNaN(data.target)}
    helperText={isNaN(data.target) ? "Only numeric values are allowed" : ""}
    onChange={(e) => {
      const value = e.target.value;
      if (!isNaN(value) && Number(value) >= 0) {
        handleChange(productIndex, dataIndex, "target", value);
      } else {
        handleChange(productIndex, dataIndex, "target", ""); // Clear invalid input
      }
    }}
  />
</Grid>

                        <Grid item xs={3}>
                          <Select
                            fullWidth
                            value={data.duration || ""}
                            onChange={(e) =>
                              handleChange(productIndex, dataIndex, "duration", e.target.value)
                            }
                            displayEmpty
                          >
                            <MenuItem value="" disabled>
                              <em>Select Duration</em>
                            </MenuItem>
                            <MenuItem value="1 month">1 Month</MenuItem>
                            <MenuItem value="3 months">3 Months</MenuItem>
                            <MenuItem value="6 months">6 Months</MenuItem>
                          </Select>
                        </Grid>
                      </Grid>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex"  mt={3} >
              <Button variant="contained" color="primary" onClick={handleSubmit} >
                Update Sales Target
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </div>
  );
}
