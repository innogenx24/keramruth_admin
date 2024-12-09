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
} from "@mui/material";
import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";

const TargetTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const imageBaseURL = "http://88.222.245.236:3002/uploads/";

  const { users } = useSelector((state) => state.users);
  const userId = users?.id; // Get user ID from Redux state

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      try {
        // Update the API call to use the userId for fetching data
        const response = await axios.get(`http://88.222.245.236:3002/user_sales_detail/getLowHierarchySalesDetails/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setData(response.data.result);

          // Initially filter data to show 'Target Achieved (50% & Above)'
          const achievedData = response.data.result.filter(item => {
            return item.monthlyDetails[0].achievementAmountPercent >= 50;
          });
          setFilteredData(achievedData); // Set initially filtered data
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]); // Re-run when userId changes

  // Filter data based on achievement and unachievement percentage
  const filterAchieved = () => {
    const filtered = data.filter(item => {
      return item.monthlyDetails[0].achievementAmountPercent >= 50;
    });
    setFilteredData(filtered);
  };

  const filterNotAchieved = () => {
    const filtered = data.filter(item => {
      return item.monthlyDetails[0].unachievementAmountPercent >= 50;
    });
    setFilteredData(filtered);
  };

  // If data is still loading, show a loading spinner
  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Sales Target Data
      </Typography>

      <div style={{ marginBottom: "20px" }}>
        <Button
          variant="contained"
          color="success"
          onClick={filterAchieved}
          sx={{ marginRight: "10px" }}
        >
          Target Achieved (50% & Above)
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={filterNotAchieved}
        >
          Target Not Achieved (50% & Below)
        </Button>
      </div>

      <TableContainer component={Paper} >
        <Table >
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
              <TableCell>Unachievement %</TableCell>
              <TableCell>Total Stock Target</TableCell>
              <TableCell>Total Stock Achievement</TableCell>
              <TableCell>Pending Stock Target</TableCell>
              <TableCell>Stock Achievement %</TableCell>
              <TableCell>Stock Unachievement %</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <TableRow key={row.user_id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={row?.image ? `${imageBaseURL}${row.image}` : "/path/to/default-image.jpg"}
                        sx={{ width: 40, height: 40 }}
                      />
                      <Typography style={{ marginLeft: "10px" }}>
                        {row.full_name}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell>{row.monthlyDetails[0].roleName}</TableCell>
                  <TableCell>{row.monthlyDetails[0].month}/{row.monthlyDetails[0].year}</TableCell>
                  <TableCell>Rs. {(Number(row.monthlyDetails[0].totalMonthlyTarget) || 0).toFixed(2)}</TableCell>
                  <TableCell>{(Number(row.monthlyDetails[0].totalAchievementAmount) || 0).toFixed(2)}</TableCell>
                  <TableCell>Rs. {(Number(row.monthlyDetails[0].pendingAmount) || 0).toFixed(2)}</TableCell>
                  <TableCell>{(Number(row.monthlyDetails[0].achievementAmountPercent) || 0).toFixed(2)}%</TableCell>
                  <TableCell>{(Number(row.monthlyDetails[0].unachievementAmountPercent) || 0).toFixed(2)}%</TableCell>
                  <TableCell>{(Number(row.monthlyDetails[0].totalStockTarget) || 0).toFixed(2)}</TableCell>
                  <TableCell>{(Number(row.monthlyDetails[0].totalStockAchievement) || 0).toFixed(2)}</TableCell>
                  <TableCell>{(Number(row.monthlyDetails[0].pendingStockTarget) || 0).toFixed(2)}</TableCell>
                  <TableCell>{(Number(row.monthlyDetails[0].stockAchievementPercent) || 0).toFixed(2)}%</TableCell>
                  <TableCell>{(Number(row.monthlyDetails[0].stockUnachievementPercent) || 0).toFixed(2)}%</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={15} align="center">No Data Available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TargetTable;
