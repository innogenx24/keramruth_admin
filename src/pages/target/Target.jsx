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
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const TargetPage = () => {
  const [targetData, setTargetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { users } = useSelector((state) => state.users);
  const userId = users?.id;
  const roleId = users?.role_name;

  const fetchTargetData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found");
      return;
    }

    try {
      const response = await axios.get(
        `http://88.222.245.236:3002/user_sales_detail/sales_achievement/${roleId}/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { success, monthlyDetails } = response.data;
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
    if (userId && roleId) {
      fetchTargetData();
    }
  }, [userId, roleId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!targetData) {
    return <Typography>No data available</Typography>;
  }

  // Calculate the achievement percentage
  const achievementPercentage = parseFloat(targetData.achievementAmountPercent);

  // Calculate the total (AchievementAmountPercent + UnachievementAmountPercent should be 100%)
  const achievementAmountPercent = targetData.achievementAmountPercent;
  const unachievementAmountPercent = targetData.unachievementAmountPercent;

  const doughnutData = {
    labels: ["Achieved", "Pending"],
    datasets: [
      {
        data: [achievementAmountPercent, unachievementAmountPercent],  // Use percentages for the chart
        backgroundColor: [
          // Set color based on achievement percentage
          achievementPercentage >= 75
            ? "#4CAF50" // Green if >= 75%
            : achievementPercentage >= 50
              ? "#FFC107" // Amber if between 50% and 74%
              : "#FF7043", // Red if < 50%

          // Set pending color as light grey
          "#E0E0E0",  // Light grey for pending stock
        ],
        hoverBackgroundColor: [
          // Set hover color for achievement portion
          achievementPercentage >= 75
            ? "#388E3C" // Darker green for hover
            : achievementPercentage >= 50
              ? "#FFB300" // Darker amber for hover
              : "#E64A19", // Darker red for hover

          // Set hover color for pending portion (always light grey hover)
          "#BDBDBD",  // Darker grey for hover
        ],
      },
    ],
  };

  const doughnutOptions = {
    cutout: "70%",
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          },
        },
      },
    },
  };


  /////


  const stockachievementPercentage = parseFloat(targetData.StockAchievementPercent);
  const StockAchievementPercent = parseFloat(targetData.StockAchievementPercent);
  const StockUnachievementPercent = parseFloat(targetData.StockUnachievementPercent);


  // Doughnut chart data
  const stockDoughnutData = {
    labels: ["Achieved", "Pending"],
    datasets: [
      {
        data: [StockAchievementPercent, StockUnachievementPercent],
        backgroundColor: [
          // Achieved portion color based on percentage
          stockachievementPercentage >= 75
            ? "#4CAF50" // Green for >= 75%
            : stockachievementPercentage >= 50
              ? "#FFC107" // Amber for 50%-74%
              : "#FF7043", // Red for < 50%,

          // Pending portion is always grey
          "#E0E0E0",
        ],
        hoverBackgroundColor: [
          // Hover color for achieved portion
          stockachievementPercentage >= 75
            ? "#388E3C" // Dark green for >= 75%
            : stockachievementPercentage >= 50
              ? "#FFB300" // Dark amber for 50%-74%
              : "#E64A19", // Dark red for < 50%,

          // Hover color for pending portion
          "#BDBDBD", // Dark grey
        ],
      },
    ],
  };

  // Doughnut chart options
  const stockDoughnutOption = {
    cutout: "70%", // Doughnut appearance
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`; // Correctly using backticks for string interpolation
          },
        },
      },
    },
  };


  const handleViewMembersTarget = () => {
    navigate("view-member-targets");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, color: "#989FA9" }}>
        Sales-Target Report
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button
          variant="contained"
          onClick={handleViewMembersTarget}
          style={{ backgroundColor: "#28a745", color: "white" }}
        >
          View Members Target
        </Button>
      </Box>

      {/* Main Card */}
      <Card elevation={3} sx={{ p: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            {/* Left Side: This Month */}
            <Box
              sx={{
                flex: 1,
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {/* First Section */}
                <Grid sx={{ display: "flex", flex: 1, gap: 2 }}>
                  <Box>
                    <Typography variant="h5" gutterBottom>
                      This Month
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      Sales Target Amount
                    </Typography>
                    <Typography variant="h4" sx={{ color: "black" }}>
                      Rs. {new Intl.NumberFormat('en-IN').format(Number(targetData.MonthlyTargetAmount) || 0)}
                    </Typography>
                    <Typography variant="body1" color="success.main">
                      ● Target Achieved: Rs. {new Intl.NumberFormat('en-IN').format(Number(targetData.AchievementAmount) || 0)}
                    </Typography>
                    <Typography variant="body1" color="error.main">
                      ● Target Pending: Rs. {new Intl.NumberFormat('en-IN').format(Number(targetData.pendingAmount) || 0)}
                    </Typography>
                  </Box>

                  <Box sx={{ width: 150, height: 150, mx: "auto", mt: 2 }}>
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                  </Box>
                </Grid>

                {/* Second Section */}
                <Grid sx={{ display: "flex", flex: 1, gap: 2 }}>
                  <Box>

                    <Typography variant="subtitle1" gutterBottom>
                      Stock Target
                    </Typography>
                    <Typography variant="h4" sx={{ color: "black" }}>
                      Qty. {new Intl.NumberFormat('en-IN').format(Number(targetData.StockTarget) || 0)}
                    </Typography>
                    <Typography variant="body1" color="success.main">
                      ● Stock Achieved: {new Intl.NumberFormat('en-IN').format(Number(targetData.StockAchievement) || 0)}
                    </Typography>
                    <Typography variant="body1" color="error.main">
                      ● Stock Pending:  {new Intl.NumberFormat('en-IN').format(Number(targetData.PendingStockTarget) || 0)}
                    </Typography>
                  </Box>

                  <Box sx={{ width: 150, height: 150, mx: "auto", mt: 2 }}>
                    <Doughnut data={stockDoughnutData} options={stockDoughnutOption} />
                  </Box>
                </Grid>
              </Box>
              <Box mt={5}>
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
            </Box>

            {/* Right Side: Target History */}
            <Box
              sx={{
                flex: 1,
                borderRadius: "8px",
                padding: "16px",
                gap: "20px",
              }}
            >
              <Typography variant="h5" gutterBottom>
                Sales Target Achievement
              </Typography>
              <Box sx={{ mt: 2 }}>
                {/* Target Achievement Progress */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2">
                    {targetData.month} {targetData.year}
                  </Typography>
                  <Typography variant="body2">
                    {targetData.achievementAmountPercent}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={achievementPercentage}
                  sx={{
                    height: 8,
                    backgroundColor: "#f5f5f5",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        achievementPercentage >= 75
                          ? "#4CAF50"
                          : achievementPercentage >= 50
                            ? "#FFC107"
                            : "#FF7043",
                    },
                  }}
                />
              </Box>

              {/* Add a gap or margin to visually separate the two sections */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Stock Target Achievement
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {/* Target Achievement Progress */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">
                      {targetData.month} {targetData.year}
                    </Typography>
                    <Typography variant="body2">
                      {targetData.StockAchievementPercent}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={stockachievementPercentage}
                    sx={{
                      height: 8,
                      backgroundColor: "#f5f5f5",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor:
                          stockachievementPercentage >= 75
                            ? "#4CAF50"
                            : stockachievementPercentage >= 50
                              ? "#FFC107"
                              : "#FF7043",
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>

  );
};

export default TargetPage;

//
