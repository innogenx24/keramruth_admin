import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid } from '@mui/material';
import SalesCard from '../../components/homepage-component/total-sale-widget/SalesCard';
import { StockSaleBarGraph } from '../../components/homepage-component/stockSale-graph/StockSaleBarGraph';
import DonutChart from '../../components/homepage-component/selling-products-chart/DonutChart';
import TrentLineGraph from '../../components/homepage-component/sale-trent-linechart/TrentLineGraph';
import './SalesPage.scss';

const SalesPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch data from the API
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/overall_sales/rolebased_sales', {
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

  return (
    <div>
      <Grid container spacing={3}>
        {/* Left Side: Sales Cards */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            {salesData.map((data, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <SalesCard
                  title={`Total Sales (${data.roleName}) (${data.totalUsers})`}
                  sales={data.totalSalesAmount || 0}
                  target={data.targetAmount || 0}
                  growth={data.salesAchievementPercent || 0}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Right Side: Stock Sale Graph */}
        <Grid item xs={12} md={6}>
          <StockSaleBarGraph />
        </Grid>
      </Grid>

      {/* Second Row: Charts */}
      <Grid className="charts-twos" container spacing={3} sx={{ marginTop: 3 }}>
        <Grid item xs={12} md={3}>
          <DonutChart />
        </Grid>
        <Grid item xs={12} md={9}>
          <TrentLineGraph />
        </Grid>
      </Grid>
    </div>
  );
};

export default SalesPage;
