import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";

const TargetPage = () => {
  const [targetData, setTargetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // Initialize navigate

  // Extract user data from Redux state
  const { users } = useSelector((state) => state.users);
  const userId = users?.id; // Assuming the user ID is stored in the state.users object
  const roleId = users?.role_name; // Assuming the user's role is stored in the users object
  

  const fetchTargetData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found");
      return;
    }

    try {
      // Construct the API endpoint dynamically using roleId and userId
      const response = await axios.get(
        `http://88.222.245.236:3002/user_sales_detail/sales_achievement/${roleId}/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { success, role, user_id, monthlyDetails } = response.data;
      if (success && monthlyDetails.length > 0) {
        setTargetData(monthlyDetails[0]);
      } else {
        console.error("No data available");
      }
    } catch (error) {
      console.error("Error fetching target data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTargetData();
  }, []);

  // If the data is still loading, show a loading spinner
  if (loading) {
    return <CircularProgress />;
  }

  // If no target data is available, show a message
  if (!targetData) {
    return <Typography>No data available</Typography>;
  }

  // Prepare the data for the doughnut chart
  const doughnutData = {
    labels: ["Done", "Pending"],
    datasets: [
      {
        data: [
          targetData.AchievementAmount,
          targetData.pendingAmount,
        ],
        backgroundColor: ["#4CAF50", "#FF7043"],
        hoverBackgroundColor: ["#388E3C", "#E64A19"],
      },
    ],
  };

  const doughnutOptions = {
    cutout: "70%",
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw} L`;
          },
        },
      },
    },
  };

  // Navigate to the "View Members Target" page when button is clicked
  const handleViewMembersTarget = () => {
    navigate("view-member-targets");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, color: "#989FA9" }}>
        All Targets
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleViewMembersTarget}  // Button click triggers navigation
          style={{
            backgroundColor: "#28a745",
            color: "white",
          }}
        >
          View Members Target
        </Button>
      </Box>

      {/* Card Section */}
      <Card elevation={3} sx={{ p: 3, mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            {/* Left Content: This Month */}
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                This Month
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Target Amount
              </Typography>
              <Typography variant="h4" sx={{ color: "black" }}>
  {(Number(targetData.MonthlyTargetAmount) || 0).toFixed(2)} L
</Typography>
<Typography variant="body1" color="success.main">
  ● Achieved: {(Number(targetData.AchievementAmount) || 0).toFixed(2)} L
</Typography>
<Typography variant="body1" color="error.main">
  ● Pending: {(Number(targetData.pendingAmount) || 0).toFixed(2)} L
</Typography>
            </Grid>

            {/* Right Content: Target History */}
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                Target History
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2">Last Month</Typography>
                  <Typography variant="body2">{targetData.achievementAmountPercent}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={targetData.achievementAmountPercent}
                  sx={{
                    height: 8,
                    backgroundColor: "#f5f5f5",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        targetData.achievementAmountPercent >= 75
                          ? "#4CAF50"
                          : targetData.achievementAmountPercent >= 50
                          ? "#FFC107"
                          : "#FF7043",
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          {/* Doughnut Chart Section */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
              <Box sx={{ width: 150, height: 150 }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </Box>
            </Grid>
          </Grid>

          {/* Legend */}
          <Box mt={3}>
            <Typography variant="caption">
              <Box component="span" color="success.main">
                ● Done 100%
              </Box>{" "}
              &nbsp;
              <Box component="span" color="warning.main">
                ● 75%-50%
              </Box>{" "}
              &nbsp;
              <Box component="span" color="error.main">
                ● 50%-0%
              </Box>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TargetPage;
