import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Avatar,
  Box,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import SearchBox from "../../search-box/SearchUser";
import { useSelector } from "react-redux";

const TargetTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState(null); // State for the selected member's data
  const [targetData, setTargetData] = useState({}); // State for Sales-Target Report

  const imageBaseURL = "http://88.222.245.236:3002/uploads/";
  const { users } = useSelector((state) => state.users);
  const userId = users?.id;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return console.error("Token not found");

      try {
        const response = await axios.get(
          `http://88.222.245.236:3002/user_sales_detail/getLowHierarchySalesDetails/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setData(response.data.result);
          setFilteredData(response.data.result);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredData(
      data.filter((item) =>
        item.full_name.toLowerCase().includes(query)
      )
    );
  };

  const handleRowClick = (member) => {
    setSelectedMember(member);

    // Set targetData based on selected member's data
    setTargetData({
      MonthlyTargetAmount: member.monthlyDetails[0]?.totalMonthlyTarget || 0,
      AchievementAmount: member.monthlyDetails[0]?.totalAchievementAmount || 0,
      PendingAmount: member.monthlyDetails[0]?.pendingAmount || 0,
      month: member.monthlyDetails[0]?.month,
      year: member.monthlyDetails[0]?.year,
      AchievementAmountPercent:
        member.monthlyDetails[0]?.achievementAmountPercent || 0,
    });
  };
  const doughnutData = {
    labels: ['Achieved', 'Pending'],
    datasets: [
      {
        data: [targetData.AchievementAmount || 0, targetData.PendingAmount || 0],
        backgroundColor: ['#4CAF50', '#FF7043'],
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
  
  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-IN").format(number);
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>

{selectedMember && (
  <Box sx={{ mt: 4 }}>
    <Typography variant="h5" sx={{ mb: 2, color: "#989FA9" }}>
      Sales-Target Report for {selectedMember.full_name}
    </Typography>

    {/* Main Card */}
    <Card elevation={3} >
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
          <Box sx={{ flex: 1, borderRadius: "8px", padding: "10px" }}>
            <Typography variant="h5" gutterBottom>
              This Month
            </Typography>
            <Typography variant="subtitle1">Target Amount</Typography>
            <Typography variant="h4" sx={{ color: "black" }}>
              Rs. {new Intl.NumberFormat().format(Number(targetData.MonthlyTargetAmount) || 0)}
            </Typography>
            <Typography variant="body1" color="success.main">
              ● Achieved: Rs. {new Intl.NumberFormat().format(Number(targetData.AchievementAmount) || 0)}
            </Typography>
            <Typography variant="body1" color="error.main">
              ● Pending: Rs. {new Intl.NumberFormat().format(Number(targetData.PendingAmount) || 0)}
            </Typography>

            {/* Doughnut Chart */}
            <Box sx={{ width: 150, height: 150, mx: "auto", mt: 2 }}>
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </Box>

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
          <Box sx={{ flex: 1, borderRadius: "8px", padding: "10px" }}>
            <Typography variant="h5" gutterBottom>
              Target History
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2">
                  {targetData.month} {targetData.year}
                </Typography>
                <Typography variant="body2">
                  {targetData.AchievementAmountPercent}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={parseFloat(targetData.AchievementAmountPercent)}
                sx={{
                  height: 8,
                  backgroundColor: "#f5f5f5",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor:
                      parseFloat(targetData.AchievementAmountPercent) >= 75
                        ? "#4CAF50"
                        : parseFloat(targetData.AchievementAmountPercent) >= 50
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
)}



      {/* Search Box */}
      <Box sx={{ width: "100%", marginBottom: 2 }}>
        <SearchBox value={searchQuery} onSearchChange={handleSearchChange} />
      </Box>

      {/* Table */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Sales Target Data
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Month/Year</TableCell>
              <TableCell>Total Monthly Target</TableCell>
              <TableCell>Achievement Amount</TableCell>
              <TableCell>Pending Amount</TableCell>
              <TableCell>Achievement %</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <TableRow
                  key={row.user_id}
                  onClick={() => handleRowClick(row)} // Handle row click
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={
                          row?.image
                            ? `${imageBaseURL}${row.image}`
                            : "/path/to/default-image.jpg"
                        }
                        sx={{ width: 40, height: 40 }}
                      />
                      <Typography style={{ marginLeft: "10px" }}>
                        {row.full_name}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell>{row.monthlyDetails[0].roleName}</TableCell>
                  <TableCell>
                    {row.monthlyDetails[0].month}/{row.monthlyDetails[0].year}
                  </TableCell>
                  <TableCell>Rs. {formatNumber(row.monthlyDetails[0].totalMonthlyTarget)}</TableCell>
                  <TableCell>Rs. {formatNumber(row.monthlyDetails[0].totalAchievementAmount)}</TableCell>
                  <TableCell>Rs. {formatNumber(row.monthlyDetails[0].pendingAmount)}</TableCell>
                  <TableCell>{row.monthlyDetails[0].achievementAmountPercent}%</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8}>No data found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

     
    </Box>
  );
};

export default TargetTable;
