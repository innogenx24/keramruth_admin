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
  CircularProgress,
} from "@mui/material";
import { useSelector } from "react-redux";
import SearchBox from "../../search-box/SearchUser";
import { API_END_POINT_IMG } from "../../constants/ApiConstant";

const TargetTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  const imageBaseURL = `${API_END_POINT_IMG}/uploads/`;
  const { users } = useSelector((state) => state.users);
  const userId = users?.id;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return console.error("Token not found");

      try {
        const response = await axios.get(
          `${API_END_POINT}/user_sales_detail/getLowHierarchySalesDetails/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setData(response.data.result);
          // Filter the data initially to show only Target Achieved (50% & Above)
          const filtered = response.data.result.filter(item => item.monthlyDetails[0].achievementAmountPercent >= 50);
          setFilteredData(filtered);
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

  // Filter data based on achievement and unachievement percentage
  const filterAchieved = () => {
    const filtered = data.filter(item => item.monthlyDetails[0].achievementAmountPercent >= 50);
    setFilteredData(filtered);
  };

  const filterNotAchieved = () => {
    const filtered = data.filter(item => item.monthlyDetails[0].unachievementAmountPercent >= 50);
    setFilteredData(filtered);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-IN").format(number);
  };

  if (loading) return <CircularProgress />;


  const renderCircularProgress = (percent) => {
    const color = getColor(percent);

    return (
      <Box position="relative" display="inline-flex" mr={2}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={80}
          thickness={5}
          style={{ color: "#e0e0e0" }}
        />
        <CircularProgress
          variant="determinate"
          value={percent}
          size={80}
          thickness={5}
          style={{
            position: "absolute",
            color: color,
          }}
        />
        <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: "1.08rem !important", color: "primary" }}>
            {`${(parseFloat(percent) || 0).toFixed(2)}%`}
          </Typography>
        </Box>
      </Box>
    );
  };

  const getColor = (percent) => {
    if (percent >= 75) return 'green';
    if (percent >= 50) return 'orange';
    return 'red';
  };


  return (
    <Box>

      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Current Month Sales Target
      </Typography>
      {/* Search Box */}
      <Box sx={{ width: "100%", marginBottom: 2 }}>
        <SearchBox value={searchQuery} onSearchChange={handleSearchChange} />
      </Box>

      {/* Table */}
      <Typography variant="h6" sx={{ mb: 2 }}>
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#DCDCDC" }}>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Month/Year</TableCell>
              <TableCell>Total Monthly Target</TableCell>
              <TableCell>Achievement Amount</TableCell>
              <TableCell>Pending Amount</TableCell>
              <TableCell>Sales Achievement(%)</TableCell>
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

                  <TableCell>
                    <Box display="flex" alignItems="center" justifyContent="center">
                      {renderCircularProgress(
                        row.monthlyDetails[0].achievementAmountPercent || 0
                      )}

                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  No data found 50% more than.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TargetTable;
