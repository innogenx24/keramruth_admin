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
} from "@mui/material";
import axios from "axios";

export default function EditSalesTarget({ selectedRow, setSelectedRow }) {
  const [targetData, setTargetData] = useState({
    role_name: selectedRow.role_name,
    target: selectedRow.target,
    stock_target: selectedRow.stock_target,
    duration: selectedRow.duration,
  });

  const handleChange = (field, value) => {
    setTargetData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Here you can call the API to update the data
    try {
      // Example: Update the sales target in the backend
      const response = await axios.put("http://example.com/api/salestarget", targetData);

      if (response.data.success) {
        alert("Sales target updated successfully");
        setSelectedRow(null); // Close the edit form after submission
      }
    } catch (error) {
      console.error("Error updating sales target:", error);
      alert("Failed to update sales target.");
    }
  };

  useEffect(() => {
    setTargetData({
      role_name: selectedRow.role_name,
      target: selectedRow.target,
      stock_target: selectedRow.stock_target,
      duration: selectedRow.duration,
    });
  }, [selectedRow]);

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Edit Sales Target
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sales Target Details:
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    label="Sales Target"
                    fullWidth
                    value={targetData.target}
                    onChange={(e) => handleChange("target", e.target.value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Stock Target"
                    fullWidth
                    value={targetData.stock_target}
                    onChange={(e) => handleChange("stock_target", e.target.value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Select
                    fullWidth
                    value={targetData.duration}
                    onChange={(e) => handleChange("duration", e.target.value)}
                  >
                    <MenuItem value="1 month">1 Month</MenuItem>
                    <MenuItem value="3 months">3 Months</MenuItem>
                    <MenuItem value="6 months">6 Months</MenuItem>
                  </Select>
                </Grid>
              </Grid>

              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{
                  marginTop: "24px",
                  width: "50%",
                  borderRadius: "15px",
                  padding: "8px",
                }}
              >
                Update Target
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
