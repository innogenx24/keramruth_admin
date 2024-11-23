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
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false); // Track if form was submitted

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
      setTargets(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sales targets:", error);
      setLoading(false);
    }
  };

  const handleChange = (productIndex, dataIndex, field, value) => {
    const updatedTargets = [...targets];
    updatedTargets[productIndex].product_data[dataIndex][field] = value;
    setTargets(updatedTargets);

    // Clear errors for this field when input is corrected
    if (formSubmitted) {
      validateField(productIndex, dataIndex, field, value);
    }
  };

  const handleTargetChange = (productIndex, dataIndex, value) => {
    handleChange(productIndex, dataIndex, "target", value);
  };

  const validateField = (productIndex, dataIndex, field, value) => {
    const newErrors = { ...errors };

    if (field === "target" && (!value || !/^\d+$/.test(value))) {
      newErrors[`targetError_${productIndex}_${dataIndex}`] =
        "Target must be a number.";
    } else if (field === "duration" && !value) {
      newErrors[`durationError_${productIndex}_${dataIndex}`] =
        "Duration is required.";
    } else {
      delete newErrors[`${field}Error_${productIndex}_${dataIndex}`];
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};

    targets.forEach((product, productIndex) => {
      product.product_data.forEach((data, dataIndex) => {
        if (!data.target || !/^\d+$/.test(data.target)) {
          newErrors[`targetError_${productIndex}_${dataIndex}`] =
            "Target must be a number.";
        }
        if (!data.duration) {
          newErrors[`durationError_${productIndex}_${dataIndex}`] =
            "Duration is required.";
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // No errors if the object is empty
  };

  const handleSubmit = async () => {
    setFormSubmitted(true); // Mark the form as submitted
    if (!validateForm()) return; // If validation fails, stop submission

    const requestData = {
      product_name: selectedProduct,
      productData: targets.flatMap((product) =>
        product.product_data.map((data) => ({
          role: data.role,
          target: data.target,
          duration: data.duration,
        }))
      ),
    };

    try {
      const response = await axios.put(
        `http://88.222.245.236:3002/salestarget/${encodeURIComponent(selectedProduct)}`,
        requestData
      );

      if (response.data.success) {
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
                      <Grid
                        container
                        spacing={2}
                        key={dataIndex}
                        alignItems="center"
                        sx={{ mb: 2 }}
                      >
                        <Grid item xs={6}>
                          <Typography>{data.role}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            label="Enter Target"
                            fullWidth
                            value={data.target || ""}
                            onChange={(e) =>
                              handleTargetChange(
                                productIndex,
                                dataIndex,
                                e.target.value
                              )
                            }
                            error={
                              !!errors[`targetError_${productIndex}_${dataIndex}`]
                            }
                            helperText={
                              errors[`targetError_${productIndex}_${dataIndex}`]
                            }
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <Select
                            fullWidth
                            value={data.duration || ""}
                            onChange={(e) =>
                              handleChange(
                                productIndex,
                                dataIndex,
                                "duration",
                                e.target.value
                              )
                            }
                            displayEmpty
                            error={
                              !!errors[`durationError_${productIndex}_${dataIndex}`]
                            }
                          >
                            <MenuItem value="" disabled>
                              <em>Select Duration</em>
                            </MenuItem>
                            <MenuItem value="1 month">1 Month</MenuItem>
                            <MenuItem value="3 months">3 Months</MenuItem>
                            <MenuItem value="6 months">6 Months</MenuItem>
                          </Select>
                          <Typography
                            variant="caption"
                            color="error"
                          >
                            {
                              errors[`durationError_${productIndex}_${dataIndex}`]
                            }
                          </Typography>
                        </Grid>
                      </Grid>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" mt={3}>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Update Sales Target
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </div>
  );
}
