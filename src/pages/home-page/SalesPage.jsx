import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Typography, Box } from '@mui/material';
import DatePicker from 'react-datepicker'; // Assuming you're using react-datepicker
import SalesCard from '../../components/homepage-component/total-sale-widget/SalesCard';
import { StockSaleBarGraph } from '../../components/homepage-component/stockSale-graph/StockSaleBarGraph';
import DonutChart from '../../components/homepage-component/selling-products-chart/DonutChart';
import TrentLineGraph from '../../components/homepage-component/sale-trent-linechart/TrentLineGraph';
import 'react-datepicker/dist/react-datepicker.css'; // Add this line if you haven't already
import './SalesPage.scss';

const SalesPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  const token = localStorage.getItem('token');

  // Fetch data from the API
  // useEffect(() => {
  //   const fetchSalesData = async () => {
  //     try {
  //       const response = await axios.get(`${API_END_POINT}/overall_sales/rolebased_sales`, {
  //         headers: { Authorization: `Bearer ${token}` }, // Pass token for authentication
  //       });

  //       if (response.data.success) {
  //         setSalesData(response.data.result);
  //       } else {
  //         setError(response.data.message || 'Failed to fetch data');
  //       }
  //     } catch (err) {
  //       setError(err.message || 'An error occurred while fetching data');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchSalesData();
  // }, [token]);

  useEffect(() => {
    const fetchSalesData = async () => {
      if (!selectedDate) return;
      
      setLoading(true);
      setError(null);
  
      // Convert the selected date to "YYYY-MM" format
      const formattedMonth = selectedDate.toISOString().slice(0, 7);
  
      try {
        const response = await axios.get(`${API_END_POINT}/overall_sales/rolebased_sales?month=${formattedMonth}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.data.success) {
          setSalesData(response.data.result);
        } else {
          setError(response.data.message || 'Failed to fetch data');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchSalesData();
  }, [selectedDate, token]);
  

  // if (loading) return <div>Loading...</div>; // Show loading state
  // if (error) return <div>Error: {error}</div>; // Show error message

  // Mapping roles to abbreviations
  const roleAbbreviations = {
    "Area Development Officer": "ADO",
    "Master Distributor": "MD",
    "Super Distributor": "SD",
    "Distributor": "D",
    "Customer": "C"
  };

  // Utility function to get the abbreviation
  const getRoleAbbreviation = (roleName) => {
    return roleAbbreviations[roleName] || roleName;
  };

  // Calculate overall sales for the company
  const companyOverallSales = salesData.reduce(
    (acc, data) => {
      acc.totalUsers += data.totalUsers;
      acc.targetAmount += data.targetAmount;
      acc.targetStock += data.targetStock;
      acc.totalSalesAmount += data.totalSalesAmount;
      acc.totalStockAchieved += data.totalStockAchieved;
      acc.pendingAmount += data.pendingAmount;
      acc.pendingStock += data.pendingStock;

      acc.salesAchievementPercent += isNaN(parseFloat(data.salesAchievementPercent))
        ? 0
        : parseFloat(data.salesAchievementPercent);

      acc.stockAchievementPercent += isNaN(parseFloat(data.stockAchievementPercent))
        ? 0
        : parseFloat(data.stockAchievementPercent);

      return acc;
    },
    {
      roleName: "Company Total Sales:",
      totalUsers: 0,
      targetAmount: 0,
      targetStock: 0,
      totalSalesAmount: 0,
      totalStockAchieved: 0,
      pendingAmount: 0,
      pendingStock: 0,
      salesAchievementPercent: 0,
      stockAchievementPercent: 0,
    }
  );

  // Calculate average sales and stock achievement percentages
  companyOverallSales.salesAchievementPercent = salesData.length > 0
    ? (companyOverallSales.salesAchievementPercent / salesData.length).toFixed(2)
    : "0.00";

  companyOverallSales.stockAchievementPercent = salesData.length > 0
    ? (companyOverallSales.stockAchievementPercent / salesData.length).toFixed(2)
    : "0.00";

  return (
    <div>
      <Grid container spacing={3}>
 
        <Grid item xs={12} md={12} lg={6}>
          {/* Responsive Container for Title & DatePicker */}
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            gap={{ xs: 1, md: 2 }}
          >
            {/* Title */}
            <Typography
              variant="h6"
              sx={{ color: "#989FA9", mb: { xs: 1, md: 0 } }}
            >
              This Month Details
            </Typography>

            {/* DatePicker (Aligned Right on Large Screens) */}
            <Box className="month-selector" sx={{ width: "100%", textAlign: { xs: "left", md: "right" } }}>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                className="date-picker-input"
                style={{ width: "100%", maxWidth: "200px" }} // Ensure proper width control
              />
            </Box>
          </Box>

          {/* Sales Cards Section */}
          <Grid container spacing={3}>
      
            <Grid item xs={12} sm={6}>
              <SalesCard
                title={
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' }, color: '#333' }}>
                    {' '}{getRoleAbbreviation(companyOverallSales.roleName)}
                    <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, color: '#7e84a3' }}>
                      {' '} ({companyOverallSales.totalUsers})
                    </Typography>
                  </Typography>
                }
                sales={`Rs.${new Intl.NumberFormat('en-IN').format(companyOverallSales.totalSalesAmount || 0)}`}
                target={`Rs.${new Intl.NumberFormat('en-IN').format(companyOverallSales.targetAmount || 0)}`}
                growth={companyOverallSales.salesAchievementPercent}
                roleName={companyOverallSales.roleName}
              />
            </Grid>
            
            {salesData.map((data, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <SalesCard
                  title={
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' }, color: '#333' }}>
                      {data.roleName === 'Customer' ? 'Total Buying:' : 'Total Sales:'}
                      <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, color: '#7e84a3' }}>
                        {' '} {getRoleAbbreviation(data.roleName)}
                        {' '} ({data.totalUsers})
                      </Typography>
                    </Typography>
                  }
                  sales={`Rs.${new Intl.NumberFormat('en-IN').format(data.totalSalesAmount || 0)}`}
                  target={data.roleName === "Customer" ? null : `Rs.${new Intl.NumberFormat('en-IN').format(data.targetAmount || 0)}`}
                  growth={isNaN(parseFloat(data.salesAchievementPercent))
                    ? "0.00"
                    : parseFloat(data.salesAchievementPercent).toFixed(2)}
                  roleName={data.roleName}
                  customerBuyedAmmount={data.customerBuyedAmmount}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>


        {/* Right Side: Stock Sale Graph */}
        <Grid item xs={12} md={12} lg={6}>
          <StockSaleBarGraph />
        </Grid>
      </Grid>

      <Grid className="charts-twos" container spacing={3} sx={{ marginTop: 3 }}>
        <Grid item xs={12} md={12} lg={4}>
          <DonutChart />
        </Grid>
        <Grid item xs={12} md={12} lg={8}>
          <TrentLineGraph />
        </Grid>
      </Grid>
    </div>
  );
};

export default SalesPage;
