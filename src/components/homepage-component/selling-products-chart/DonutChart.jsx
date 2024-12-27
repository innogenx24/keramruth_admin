import React, { useRef, useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import './DonutChart.scss';

Chart.register(ArcElement, Tooltip, Legend);

const DonutChart = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
      ],
      hoverBackgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
      ],
    }],
  });
  const [isDataAvailable, setIsDataAvailable] = useState(true); // To track if data is available
  const [message, setMessage] = useState(''); // To store error/success message

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const dataset = tooltipItem.dataset.data;
            const total = dataset.reduce((acc, val) => acc + val, 0);
            const percentage = ((dataset[tooltipItem.dataIndex] / total) * 100).toFixed(2);
            return `${tooltipItem.label}: ${percentage}%`;
          },
        },
      },
    },
  };

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get('http://88.222.245.236:3002/overall_sales/mostl_selled_product', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = response.data.mostSellingProducts;
        const labels = data.map(item => `${item.productName} ${item.percentage}%`);
        const salesData = data.map(item => item.sales);

        // Check if sales data is empty or all zeros
        const isZeroData = salesData.every(val => val === 0);
        if (isZeroData || data.length === 0) {
          setIsDataAvailable(false); // No data available, show fallback message
          setMessage('No data available for the current month'); // Set custom message
        } else {
          setIsDataAvailable(true); // Data available, update chart
          setChartData({
            labels: labels,
            datasets: [{
              data: salesData,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
              hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            }],
          });
          setMessage(''); // Clear any previous messages
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setIsDataAvailable(false); // In case of an error, show fallback message
        setMessage(error.response?.data?.message || 'An error occurred while fetching the data'); // Display error message from API response or default message
      }
    };

    fetchSalesData();
  }, []); // Empty dependency array ensures this effect runs only once

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='dchart-container'>
      <h2>Most Selling Product</h2>

      <div className='doughnu_chart'>
        {isDataAvailable ? (
          <>
            <Doughnut ref={chartRef} data={chartData} options={options} />
            <div className='chart-content'>
              <span>This Month</span>
            </div>
          </>
        ) : (
          <div className='no-data'>
            <span>{message || 'No data available'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonutChart;























// import React, { useRef, useEffect, useState } from 'react';
// import { Doughnut } from 'react-chartjs-2';
// import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
// import axios from 'axios';
// import './DonutChart.scss';

// Chart.register(ArcElement, Tooltip, Legend);

// const DonutChart = () => {
//   const chartRef = useRef(null);
//   const [chartData, setChartData] = useState({
//     labels: [],
//     datasets: [{
//       data: [],
//       backgroundColor: [
//         '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
//       ],
//       hoverBackgroundColor: [
//         '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
//       ],
//     }],
//   });

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     cutout: '70%', // Adjust this value to change the thickness of the doughnut
//     plugins: {
//       legend: {
//         position: 'bottom',
//         labels: {
//           usePointStyle: true, // This will change the legend icons to circles
//         },
//       },
//       tooltip: {
//         callbacks: {
//           label: function (tooltipItem) {
//             const dataset = tooltipItem.dataset.data;
//             const total = dataset.reduce((acc, val) => acc + val, 0);
//             const percentage = ((dataset[tooltipItem.dataIndex] / total) * 100).toFixed(2);
//             return `${tooltipItem.label}: ${percentage}%`;
//           },
//         },
//       },
//     },
//   };

//   useEffect(() => {
//     // Fetch the data from the API
//     const fetchSalesData = async () => {
//       try {
//         const response = await axios.get('http://localhost:3002/overall_sales/mostl_selled_product', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });

//         const data = response.data.mostSellingProducts;
//         const labels = data.map(item => `${item.productName} ${item.percentage}%`);
//         const salesData = data.map(item => item.sales);

//         setChartData({
//           labels: labels,
//           datasets: [{
//             data: salesData,
//             backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
//             hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
//           }],
//         });
//       } catch (error) {
//         console.error('Error fetching sales data:', error);
//       }
//     };

//     fetchSalesData();
//   }, []); // Empty dependency array ensures this effect runs only once

//   // Resize handler
//   useEffect(() => {
//     const handleResize = () => {
//       if (chartRef.current) {
//         chartRef.current.resize(); // Trigger chart resize
//       }
//     };

//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   return (
//     <div className='dchart-container'>
//       <h2>Most Selling Product</h2>

//       <div className='doughnu_chart'>
//         <Doughnut ref={chartRef} data={chartData} options={options} />
//         <div className='chart-content'>
//           <span>This Month</span>
//         </div> {/* Overlay for content */}
//       </div>
//     </div>
//   );
// };

// export default DonutChart;
