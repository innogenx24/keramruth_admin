import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Typography } from '@mui/material';
import SalesCard from '../../components/homepage-component/total-sale-widget/SalesCard';
import { StockSaleBarGraph } from '../../components/homepage-component/stockSale-graph/StockSaleBarGraph';
import DonutChart from '../../components/homepage-component/selling-products-chart/DonutChart';
import TrentLineGraph from '../../components/homepage-component/sale-trent-linechart/TrentLineGraph';
import './SalesPage.scss';

const SalesPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch data from the API
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(`${API_END_POINT}/overall_sales/rolebased_sales`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token for authentication
          },
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
  }, [token]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message
  }

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


  return (
    <div>
      <Grid container spacing={3}>
        {/* Left Side: Sales Cards */}
        <Grid item xs={12} md={12} lg={6}>
          <Grid container spacing={3}>
            {salesData.map((data, index) => (
              <Grid item xs={12} sm={6} key={index}>
  <SalesCard
    title={
      <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' }, color: '#333' }}>
        Total Sales: 
        {/* <br /> */}
        <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, color: '#7e84a3' }}>
         {' '} {getRoleAbbreviation( data.roleName)}
         {' '} ({data.totalUsers})
        </Typography>
      </Typography>
    }
    sales={`Rs.${new Intl.NumberFormat('en-IN').format(data.totalSalesAmount || 0)}`}
    target={`Rs.${new Intl.NumberFormat('en-IN').format(data.targetAmount || 0)}`}
    growth={data.salesAchievementPercent || 0}
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

      {/* Second Row: Charts */}
      <Grid className="charts-twos" container spacing={3} sx={{ marginTop: 3 }}>
        {/* <Grid item xs={12} md={3}> */}
        <Grid  item xs={12} md={12} lg={4}>
          <DonutChart />
        </Grid>
        {/* <Grid item xs={12} md={9}> */}
        <Grid item xs={12} md={12} lg={8}>
          <TrentLineGraph />
        </Grid>
      </Grid>
    </div>
  );
};

export default SalesPage;
