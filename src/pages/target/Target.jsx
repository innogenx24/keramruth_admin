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

  const doughnutData = {
    labels: ["Done", "Pending"],
    datasets: [
      {
        data: [targetData.AchievementAmount, targetData.PendingAmount],
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
              <Grid style={{ display: "flex" }}>
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
                    ● Achieved: Rs. {new Intl.NumberFormat('en-IN').format(Number(targetData.AchievementAmount) || 0)}
                  </Typography>
                  <Typography variant="body1" color="error.main">
                    ● Pending: Rs. {new Intl.NumberFormat('en-IN').format(Number(targetData.pendingAmount) || 0)}
                  </Typography>
                </Box>

                <Box sx={{ width: 150, height: 150, mx: "auto", mt: 2 }}>
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                </Box>
              </Grid>

              <Grid style={{ display: "flex", marginTop: 3 }}>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Stock Target
                  </Typography>
                  <Typography variant="h5" sx={{ color: "black" }}>
                    Total Qty. {new Intl.NumberFormat('en-IN').format(Number(targetData.StockTarget) || 0)}
                  </Typography>
                  <Typography variant="body1" color="success.main">
                    ● Stock Achieved: Rs. {new Intl.NumberFormat('en-IN').format(Number(targetData.StockAchievement) || 0)}
                  </Typography>
                  <Typography variant="body1" color="error.main">
                    ● Pending Stock: Rs. {new Intl.NumberFormat('en-IN').format(Number(targetData.PendingStockTarget) || 0)}
                  </Typography>
                </Box>

                <Box sx={{ width: 150, height: 150, mx: "auto", mt: 2 }}>
                  <Doughnut
                    data={{
                      labels: ["Stock Achieved", "Pending Stock"],
                      datasets: [
                        {
                          data: [targetData.StockAchievement, targetData.PendingStockTarget],
                          backgroundColor: ["#4CAF50", "#FF7043"],
                          hoverBackgroundColor: ["#388E3C", "#E64A19"],
                        },
                      ],
                    }}
                    options={doughnutOptions}
                  />
                </Box>
              </Grid>


              {/* Legend */}
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
                  value={parseFloat(targetData.achievementAmountPercent)}
                  sx={{
                    height: 8,
                    backgroundColor: "#f5f5f5",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        parseFloat(targetData.achievementAmountPercent) >= 75
                          ? "#4CAF50"
                          : parseFloat(targetData.achievementAmountPercent) >= 50
                            ? "#FFC107"
                            : "#FF7043",
                    },
                  }}
                />
              </Box>

              {/* Stock Achievement Progress */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Stock Target Achievement
                </Typography>
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
                  value={parseFloat(targetData.StockAchievementPercent)}
                  sx={{
                    height: 8,
                    backgroundColor: "#f5f5f5",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        parseFloat(targetData.StockAchievementPercent) >= 75
                          ? "#4CAF50"
                          : parseFloat(targetData.StockAchievementPercent) >= 50
                            ? "#FFC107"
                            : "#FF7043",
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TargetPage;
