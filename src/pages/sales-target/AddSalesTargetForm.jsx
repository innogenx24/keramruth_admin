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
import { useNavigate } from "react-router-dom";
import "./sales.css";

const salesRoles = [
  { id: 1, role: "Area Development Officer (ADO)" },
  { id: 2, role: "Master Distributor (MD)" },
  { id: 3, role: "Super Distributor (SD)" },
  { id: 4, role: "Distributor" },
];

export default function AddSalesTargetForm() {
  const [targets, setTargets] = useState(
    salesRoles.map((role) => ({
      id: role.id,
      role: role.role,
      productData: [
        { target: "", duration: "", productType: "Virgin Coconut Oil" },
        { target: "", duration: "", productType: "Virgin Coconut Hair Oil" },
      ],
    }))
  );

  const [autoUpdate, setAutoUpdate] = useState(false);
  const navigate = useNavigate();

  // Handle form field changes
  const handleChange = (id, productIndex, field, value) => {
    setTargets((prevTargets) =>
      prevTargets.map((target) =>
        target.id === id
          ? {
              ...target,
              productData: target.productData.map((product, index) =>
                index === productIndex
                  ? { ...product, [field]: value }
                  : product
              ),
            }
          : target
      )
    );
  };

  // Handle form submission
  const handleSubmit = async () => {
    const formattedData = targets.map((target) => ({
      role: target.role,
      productData: target.productData,
    }));

    try {
      const response = await fetch("http://88.222.245.236:3002/salestarget/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targets: formattedData }), // Wrap data in an object with "targets" key
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        navigate("/dashboard/sales-target"); // Redirect on success
      } else {
        console.error("Error submitting sales target");
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
          {/* Sales Target for Virgin Coconut Oil */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sales Target for Virgin Coconut Oil:
              </Typography>
              {targets.map((target) => (
                <Grid container spacing={2} key={target.id} alignItems="center" sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography>{target.role}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Enter Target"
                      fullWidth
                      value={target.productData[0].target}
                      onChange={(e) =>
                        handleChange(target.id, 0, "target", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Select
                      fullWidth
                      value={target.productData[0].duration}
                      onChange={(e) =>
                        handleChange(target.id, 0, "duration", e.target.value)
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

          {/* Sales Target for Virgin Coconut Hair Oil */}
          <Card variant="outlined" sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sales Target for Virgin Coconut Hair Oil:
              </Typography>
              {targets.map((target) => (
                <Grid container spacing={2} key={target.id} alignItems="center" sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography>{target.role}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Enter Target"
                      fullWidth
                      value={target.productData[1].target}
                      onChange={(e) =>
                        handleChange(target.id, 1, "target", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Select
                      fullWidth
                      value={target.productData[1].duration}
                      onChange={(e) =>
                        handleChange(target.id, 1, "duration", e.target.value)
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
