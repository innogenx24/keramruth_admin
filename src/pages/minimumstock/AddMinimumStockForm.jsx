import React, { useState } from "react";
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const salesRoles = [
  { id: 1, role: "Area Development Officer (ADO)" },
  { id: 2, role: "Master Distributor (MD)" },
  { id: 3, role: "Super Distributor (SD)" },
  { id: 4, role: "Distributor" },
];

export default function AddMinimumStockForm() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [minimumStocks, setMinimumStocks] = useState(
    salesRoles.map((role) => ({
      id: role.id,
      role: role.role,
      productData: [
        { stock: "", duration: "", productType: "Virgin Coconut Oil" },
        { stock: "", duration: "", productType: "Virgin Coconut Hair Oil" },
      ],
    }))
  );

  const [autoUpdate, setAutoUpdate] = useState(false);

  // Handle form field changes
  const handleChange = (id, productIndex, field, value) => {
    setMinimumStocks((prevStocks) =>
      prevStocks.map((stock) =>
        stock.id === id
          ? {
              ...stock,
              productData: stock.productData.map((product, index) =>
                index === productIndex
                  ? { ...product, [field]: value }
                  : product
              ),
            }
          : stock
      )
    );
  };

  // Handle form submission
  const handleSubmit = async () => {
    const formattedData = minimumStocks.map((stock) => ({
      role: stock.role,
      productData: stock.productData,
    }));

    try {
      const response = await fetch("http://88.222.245.236:3002/minimumstock/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stocks: formattedData }), // Wrap data in an object with "stocks" key
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        // Navigate to the dashboard after successful submission
        navigate("/dashboard/minimum-stock"); // Use navigate here
      } else {
        console.error("Error submitting minimum stock");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Add Minimum Stock
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          {/* Minimum Stock for Virgin Coconut Oil */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Minimum Stock for Virgin Coconut Oil:
              </Typography>
              {minimumStocks.map((stock) => (
                <Grid container spacing={2} key={stock.id} alignItems="center" sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography>{stock.role}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Enter Minimum Stock"
                      fullWidth
                      value={stock.productData[0].stock}
                      onChange={(e) =>
                        handleChange(stock.id, 0, "stock", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Select
                      fullWidth
                      value={stock.productData[0].duration}
                      onChange={(e) =>
                        handleChange(stock.id, 0, "duration", e.target.value)
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
              ))}
            </CardContent>
          </Card>

          {/* Minimum Stock for Virgin Coconut Hair Oil */}
          <Card variant="outlined" sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Minimum Stock for Virgin Coconut Hair Oil:
              </Typography>
              {minimumStocks.map((stock) => (
                <Grid container spacing={2} key={stock.id} alignItems="center" sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography>{stock.role}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Enter Minimum Stock"
                      fullWidth
                      value={stock.productData[1].stock}
                      onChange={(e) =>
                        handleChange(stock.id, 1, "stock", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Select
                      fullWidth
                      value={stock.productData[1].duration}
                      onChange={(e) =>
                        handleChange(stock.id, 1, "duration", e.target.value)
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
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Right side: Auto Update and Save button */}
        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <FormControlLabel
              control={
                <Switch
                  checked={autoUpdate}
                  onChange={() => setAutoUpdate(!autoUpdate)}
                  color="primary"
                />
              }
              label="Auto Update"
              labelPlacement="start"
              sx={{ mb: 4 }}
            />
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
