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

const durations = ["1 month", "3 months", "6 months"]; // Array for duration options

export default function EditMinimumStockForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [stockData, setStockData] = useState({
    role: '',
    virginCoconutOil: { stock: '', duration: '' },
    virginCoconutHairOil: { stock: '', duration: '' },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        let data;

        // If data is passed through state
        if (state?.row) {
          data = state.row;
        } else {
          throw new Error('No data available');
        }

        // Ensure the fetched data is structured correctly
        const virginCoconutOil = data.productData.find(p => p.productType === "Virgin Coconut Oil");
        const virginCoconutHairOil = data.productData.find(p => p.productType === "Virgin Coconut Hair Oil");

        // Set the fetched data
        setStockData({
          role: data.role || 'No Role Provided',
          virginCoconutOil: {
            stock: virginCoconutOil?.stock || '',
            duration: virginCoconutOil?.duration || '',
          },
          virginCoconutHairOil: {
            stock: virginCoconutHairOil?.stock || '',
            duration: virginCoconutHairOil?.duration || '',
          },
        });
      } catch (error) {
        setError(error.message);
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [state]);

  // Handle form field changes
  const handleChange = (product, field, value) => {
    setStockData((prevData) => ({
      ...prevData,
      [product]: {
        ...prevData[product],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare payload with the required format
    const payload = {
      role: stockData.role,
      productData: [
        {
          productType: "Virgin Coconut Oil",
          stock: stockData.virginCoconutOil.stock,
          duration: stockData.virginCoconutOil.duration,
        },
        {
          productType: "Virgin Coconut Hair Oil",
          stock: stockData.virginCoconutHairOil.stock,
          duration: stockData.virginCoconutHairOil.duration,
        },
      ],
    };

    console.log('Sending payload:', JSON.stringify(payload));

    try {
      const response = await fetch(`http://88.222.245.236:3002/minimumstock/${state.row.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error response:', errorResponse);
        throw new Error(errorResponse.message || 'Failed to update stock data');
      }

      console.log('Minimum stock data updated successfully');
      navigate("/dashboard/minimum-stock");
    } catch (error) {
      console.error('Error updating stock data:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Edit Minimum Stock
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Minimum Stock for Virgin Coconut Oil
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                  <Typography variant="subtitle1">{stockData.role}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Enter Minimum Stock"
                    fullWidth
                    value={stockData.virginCoconutOil.stock || ""}
                    onChange={(e) =>
                      handleChange("virginCoconutOil", "stock", e.target.value)
                    }
                    type="number"
                  />
                </Grid>
                <Grid item xs={3}>
                  <Select
                    value={stockData.virginCoconutOil.duration || ""}
                    onChange={(e) =>
                      handleChange("virginCoconutOil", "duration", e.target.value)
                    }
                    fullWidth
                    displayEmpty
                  >
                    <MenuItem value="" disabled>Duration</MenuItem>
                    {durations.map((duration) => (
                      <MenuItem key={duration} value={duration}>{duration}</MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Minimum Stock for Virgin Coconut Hair Oil
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                  <Typography variant="subtitle1">{stockData.role}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Enter Minimum Stock"
                    fullWidth
                    value={stockData.virginCoconutHairOil.stock || ""}
                    onChange={(e) =>
                      handleChange("virginCoconutHairOil", "stock", e.target.value)
                    }
                    type="number"
                  />
                </Grid>
                <Grid item xs={3}>
                  <Select
                    value={stockData.virginCoconutHairOil.duration || ""}
                    onChange={(e) =>
                      handleChange("virginCoconutHairOil", "duration", e.target.value)
                    }
                    fullWidth
                    displayEmpty
                  >
                    <MenuItem value="" disabled>Duration</MenuItem>
                    {durations.map((duration) => (
                      <MenuItem key={duration} value={duration}>{duration}</MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Save Changes
        </Button>
      </Box>
    </div>
  );
}
