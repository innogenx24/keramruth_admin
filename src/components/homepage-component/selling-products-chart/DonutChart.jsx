import React, { useRef, useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns'; // For formatting dates
import 'react-datepicker/dist/react-datepicker.css';
import './DonutChart.scss';

Chart.register(ArcElement, Tooltip, Legend);

// Function to generate dynamic colors
const generateColors = (count) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const color = `hsl(${(i * 360) / count}, 70%, 50%)`; // Distribute colors evenly in the HSL spectrum
    colors.push(color);
  }
  return colors;
};

// Function to format numbers in Indian numbering system (lakh, crore, etc.)
const formatIndianCurrency = (num) => {
  // Convert number to string
  let str = num.toString();
  // Split into integer and decimal parts (if any)
  let [integer, decimal] = str.split('.');

  // Add commas to the integer part according to Indian numbering system
  const lastThree = integer.slice(-3); // Get the last three digits
  const otherNumbers = integer.slice(0, integer.length - 3); // Get the remaining part of the integer
  const formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + ',' + lastThree;

  // Combine the formatted integer with the decimal part (if any)
  return formattedInteger + (decimal ? '.' + decimal : '');
};

const DonutChart = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: [], // Labels now show product names with sales
    datasets: [{
      data: [], // Sales data used here
      backgroundColor: [], // Colors for each section of the chart
      hoverBackgroundColor: [], // Hover colors
    }],
  });
  const [isDataAvailable, setIsDataAvailable] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to current date
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%', 
    plugins: {
      legend: {
        position: 'bottom',
        align: 'start',
        labels: {
          usePointStyle: true,
          padding: 10, 
          boxWidth: 12, 
          boxHeight: 12, 
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const dataset = tooltipItem.dataset.data;
            const salesAmount = dataset[tooltipItem.dataIndex]; // Sales amount of the selected item
            return `${tooltipItem.label}: ₹${formatIndianCurrency(salesAmount)}`; // Display sales in Indian currency
          },
        },
      },
    },
  };

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const selectedMonth = format(selectedDate, 'yyyy-MM'); // Format the date to YYYY-MM
        const response = await axios.post(`${API_END_POINT}/overall_sales/mostl_selled_product`, {
          month: selectedMonth,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = response.data.mostSellingProducts;
        const labels = data.map(item => `${item.productName} (₹${item.sales.toLocaleString('en-IN')})`);
        const salesData = data.map(item => item.sales); // Use sales data directly
        const dynamicColors = generateColors(data.length); // Generate unique colors for each item

        const isZeroData = salesData.every(val => val === 0);
        if (isZeroData || data.length === 0) {
          setIsDataAvailable(false);
          setMessage('No data available for the selected month');
        } else {
          setIsDataAvailable(true);
          setChartData({
            labels: labels,
            datasets: [{
              data: salesData,
              backgroundColor: dynamicColors, // Assign dynamic colors to backgroundColor
              hoverBackgroundColor: dynamicColors, // Assign dynamic colors to hoverBackgroundColor
            }],
          });
          setMessage('');
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setIsDataAvailable(false);
        setMessage(error.response?.data?.message || 'An error occurred while fetching the data');
      }
    };

    fetchSalesData();
  }, [selectedDate]);

  return (
    <div className='dchart-container'>
      <p>Most Selling Product</p>

      <div className="month-selector">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="MMMM yyyy" 
          showMonthYearPicker // Limit picker to month and year
          className="date-picker-input"
        />
      </div>

      <div className='doughnu_chart'>
        {isDataAvailable ? (
          <>
            <Doughnut ref={chartRef} data={chartData} options={options} />
            {/* <div className='chart-content'>
              <span>{`${format(selectedDate, 'MMMM yyyy')}`}</span>
            </div> */}
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
//













// import React, { useRef, useEffect, useState } from 'react';
// import { Doughnut } from 'react-chartjs-2';
// import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
// import axios from 'axios';
// import DatePicker from 'react-datepicker';
// import { format } from 'date-fns'; // For formatting dates
// import 'react-datepicker/dist/react-datepicker.css';
// import './DonutChart.scss';

// Chart.register(ArcElement, Tooltip, Legend);

// // Function to generate dynamic colors
// const generateColors = (count) => {
//   const colors = [];
//   for (let i = 0; i < count; i++) {
//     const color = `hsl(${(i * 360) / count}, 70%, 50%)`; // Distribute colors evenly in the HSL spectrum
//     colors.push(color);
//   }
//   return colors;
// };

// const DonutChart = () => {
//   const chartRef = useRef(null);
//   const [chartData, setChartData] = useState({
//     labels: [],
//     datasets: [{
//       data: [],
//       backgroundColor: [],
//       hoverBackgroundColor: [],
//     }],
//   });
//   const [isDataAvailable, setIsDataAvailable] = useState(true);
//   const [message, setMessage] = useState('');
//   const [selectedDate, setSelectedDate] = useState(new Date()); // Default to current date
//   const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     cutout: '70%',
//     plugins: {
//       legend: {
//         position: 'bottom',
//         labels: {
//           usePointStyle: true,
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
//     const fetchSalesData = async () => {
//       try {
//         const selectedMonth = format(selectedDate, 'yyyy-MM'); // Format the date to YYYY-MM
//         const response = await axios.post(`${API_END_POINT}/overall_sales/mostl_selled_product`, {
//           month: selectedMonth,
//         }, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });

//         const data = response.data.mostSellingProducts;
//         const labels = data.map(item => `${item.productName} ${item.percentage}%`);
//         const salesData = data.map(item => item.sales);
//         const dynamicColors = generateColors(data.length); // Generate unique colors for each item

//         const isZeroData = salesData.every(val => val === 0);
//         if (isZeroData || data.length === 0) {
//           setIsDataAvailable(false);
//           setMessage('No data available for the selected month');
//         } else {
//           setIsDataAvailable(true);
//           setChartData({
//             labels: labels,
//             datasets: [{
//               data: salesData,
//               backgroundColor: dynamicColors,
//               hoverBackgroundColor: dynamicColors,
//             }],
//           });
//           setMessage('');
//         }
//       } catch (error) {
//         console.error('Error fetching sales data:', error);
//         setIsDataAvailable(false);
//         setMessage(error.response?.data?.message || 'An error occurred while fetching the data');
//       }
//     };

//     fetchSalesData();
//   }, [selectedDate]);

//   return (
//     <div className='dchart-container'>
//       <h2>Most Selling Product</h2>

//       {/* Month selection */}
//       <div className="month-selector">
//         <DatePicker
//           selected={selectedDate}
//           onChange={(date) => setSelectedDate(date)}
//           dateFormat="MMMM yyyy" // Show full month and year in UI
//           showMonthYearPicker // Limit picker to month and year
//           className="date-picker-input"
//         />
//       </div>

//       <div className='doughnu_chart'>
//         {isDataAvailable ? (
//           <>
//             <Doughnut ref={chartRef} data={chartData} options={options} />
//             <div className='chart-content'>
//               <span>{`${format(selectedDate, 'MMMM yyyy')}`}</span>
//             </div>
//           </>
//         ) : (
//           <div className='no-data'>
//             <span>{message || 'No data available'}</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DonutChart;





















// import React, { useRef, useEffect, useState } from 'react';
// import { Doughnut } from 'react-chartjs-2';
// import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
// import axios from 'axios';
// import DatePicker from 'react-datepicker';
// import { format } from 'date-fns'; // For formatting dates
// import 'react-datepicker/dist/react-datepicker.css';
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
//   const [isDataAvailable, setIsDataAvailable] = useState(true);
//   const [message, setMessage] = useState('');
//   const [selectedDate, setSelectedDate] = useState(new Date()); // Default to current date
//   const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;
  

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     cutout: '70%',
//     plugins: {
//       legend: {
//         position: 'bottom',
//         labels: {
//           usePointStyle: true,
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
//     const fetchSalesData = async () => {
//       try {
//         const selectedMonth = format(selectedDate, 'yyyy-MM'); // Format the date to YYYY-MM
//         const response = await axios.post(`${API_END_POINT}/overall_sales/mostl_selled_product`, {
//           month: selectedMonth,
//         }, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });

//         const data = response.data.mostSellingProducts;
//         const labels = data.map(item => `${item.productName} ${item.percentage}%`);
//         const salesData = data.map(item => item.sales);

//         const isZeroData = salesData.every(val => val === 0);
//         if (isZeroData || data.length === 0) {
//           setIsDataAvailable(false);
//           setMessage('No data available for the selected month');
//         } else {
//           setIsDataAvailable(true);
//           setChartData({
//             labels: labels,
//             datasets: [{
//               data: salesData,
//               backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
//               hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
//             }],
//           });
//           setMessage('');
//         }
//       } catch (error) {
//         console.error('Error fetching sales data:', error);
//         setIsDataAvailable(false);
//         setMessage(error.response?.data?.message || 'An error occurred while fetching the data');
//       }
//     };

//     fetchSalesData();
//   }, [selectedDate]); 

//   return (
//     <div className='dchart-container'>
//       <h2>Most Selling Product</h2>

//       {/* Month selection */}
//       <div className="month-selector">
//         <DatePicker
//           selected={selectedDate}
//           onChange={(date) => setSelectedDate(date)}
//           dateFormat="MMMM yyyy" // Show full month and year in UI
//           showMonthYearPicker // Limit picker to month and year
//           className="date-picker-input"
//         />
//       </div>

//       <div className='doughnu_chart'>
//         {isDataAvailable ? (
//           <>
//             <Doughnut ref={chartRef} data={chartData} options={options} />
//             <div className='chart-content'>
//               <span>{`Data for ${format(selectedDate, 'MMMM yyyy')}`}</span>
//             </div>
//           </>
//         ) : (
//           <div className='no-data'>
//             <span>{message || 'No data available'}</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DonutChart;

































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
//   const [isDataAvailable, setIsDataAvailable] = useState(true); // To track if data is available
//   const [message, setMessage] = useState(''); // To store error/success message
//   const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     cutout: '70%',
//     plugins: {
//       legend: {
//         position: 'bottom',
//         labels: {
//           usePointStyle: true,
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
//     const fetchSalesData = async () => {
//       try {
//         const response = await axios.get(`${API_END_POINT}/overall_sales/mostl_selled_product`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });

//         const data = response.data.mostSellingProducts;
//         const labels = data.map(item => `${item.productName} ${item.percentage}%`);
//         const salesData = data.map(item => item.sales);

//         // Check if sales data is empty or all zeros
//         const isZeroData = salesData.every(val => val === 0);
//         if (isZeroData || data.length === 0) {
//           setIsDataAvailable(false); // No data available, show fallback message
//           setMessage('No data available for the current month'); // Set custom message
//         } else {
//           setIsDataAvailable(true); // Data available, update chart
//           setChartData({
//             labels: labels,
//             datasets: [{
//               data: salesData,
//               backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
//               hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
//             }],
//           });
//           setMessage(''); // Clear any previous messages
//         }
//       } catch (error) {
//         console.error('Error fetching sales data:', error);
//         setIsDataAvailable(false); // In case of an error, show fallback message
//         setMessage(error.response?.data?.message || 'An error occurred while fetching the data'); // Display error message from API response or default message
//       }
//     };

//     fetchSalesData();
//   }, []); // Empty dependency array ensures this effect runs only once

//   useEffect(() => {
//     const handleResize = () => {
//       if (chartRef.current) {
//         chartRef.current.resize();
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
//         {isDataAvailable ? (
//           <>
//             <Doughnut ref={chartRef} data={chartData} options={options} />
//             <div className='chart-content'>
//               <span>This Month</span>
//             </div>
//           </>
//         ) : (
//           <div className='no-data'>
//             <span>{message || 'No data available'}</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DonutChart;























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
