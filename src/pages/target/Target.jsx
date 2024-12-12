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
    fetchTargetData();
  }, []);

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
        data: [targetData.AchievementAmount, targetData.pendingAmount],
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
              <Grid style={{display:"flex"}}>
                <Box>
                <Typography variant="h5" gutterBottom>
                This Month
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
  Target Amount
</Typography>
<Typography variant="h4" sx={{ color: "black" }}>
  Rs. {new Intl.NumberFormat().format(Number(targetData.MonthlyTargetAmount) || 0)}
</Typography>
<Typography variant="body1" color="success.main">
  ● Achieved: Rs. {new Intl.NumberFormat().format(Number(targetData.AchievementAmount) || 0)}
</Typography>
<Typography variant="body1" color="error.main">
  ● Pending: Rs. {new Intl.NumberFormat().format(Number(targetData.pendingAmount) || 0)}
</Typography>

                </Box>
              

              <Box sx={{ width: 150, height: 150, mx: "auto", mt: 2 }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
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
                Target History
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="body2">Last Month</Typography>
                  <Typography variant="body2">
                    {targetData.achievementAmountPercent}%
                  </Typography>
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
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TargetPage;
