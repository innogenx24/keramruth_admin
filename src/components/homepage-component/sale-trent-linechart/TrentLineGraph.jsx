import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from "chart.js";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./TrendLineGraph.scss";

Chart.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

const TrendLineGraph = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  // const [startDate, setStartDate] = useState(new Date("2024-01-01")); // Default start date
  // const [endDate, setEndDate] = useState(new Date("2024-12-01")); // Default end date
  const currentDate = new Date(); // Get the current date
  const [startDate, setStartDate] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth() - 4, 1)
  );
  const [endDate, setEndDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)); // Start of the current month
  const [totalQuantity, setTotalQuantity] = useState(0);
  const token = localStorage.getItem("token");
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  // Utility function to generate month labels dynamically
  const generateMonthLabels = (start, end) => {
    const labels = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      labels.push(`${year}-${month}`);
      currentDate.setMonth(currentDate.getMonth() + 1); // Increment to the next month
    }

    return labels;
  };

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `${API_END_POINT}/overall_sales/sales_over_time`,
        {
          startMonth: `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}`,
          endMonth: `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.success) {
        const result = response.data.result;
  
        const months = generateMonthLabels(startDate, endDate);
  
        const productSales = result.reduce((acc, item) => {
          if (!acc[item.productName]) {
            acc[item.productName] = Array(months.length).fill(0);
          }
          const monthIndex = months.indexOf(`${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}`);
          if (monthIndex !== -1) {
            acc[item.productName][monthIndex] = item.quantity;
          }
          return acc;
        }, {});
  
        const colors = [];
        const generateUniqueColor = () => {
          let color;
          do {
            color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`;
          } while (colors.includes(color));
          colors.push(color);
          return color;
        };
  
        const datasets = Object.keys(productSales).map((productName) => {
          const randomColor = generateUniqueColor();
          return {
            label: productName,
            data: productSales[productName],
            borderColor: randomColor.replace("0.2", "1"),
            backgroundColor: randomColor,
            fill: false,
            tension: 0.4,
          };
        });
  
        const reversedMonths = months; // Reverse the months
        const reversedDatasets = datasets.map((dataset) => ({
          ...dataset,
          data: dataset.data.reverse(), // Reverse the data to match the reversed months
        }));

        setChartData({
          labels: reversedMonths,  // Reversed months for X-axis labels
          datasets: reversedDatasets,
        });
  
        const total = result.reduce((sum, item) => sum + item.quantity, 0);
        setTotalQuantity(total);
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 9, 
          },
          padding: 9, 
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        reverse: false, // Ensures the months are displayed in ascending order (left to right)
      },
    },
  };

  return (
    <div className="lineg">
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
        <Typography 
  component="p" 
  sx={{
    marginBottom: '10px',
    fontFamily: '"Inter500", "Roboto", sans-serif',
    fontSize: '18px',
    color: '#232428',
  }}
>
  Sales Trend Over Time
</Typography>

<Typography
  variant="body1"
  sx={{
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '32px',
    color: '#989FA9',
  }}
>
  Total Quantity: {new Intl.NumberFormat('en-IN').format(totalQuantity || 0)}
</Typography>

        </Box>

        <Box 
  display="flex" 
  flexDirection={{ xs: 'column', sm: 'row' }} // Stack vertically on small screens
  gap={2} 
  alignItems="center" 
  justifyContent="space-between" 
  sx={{ flexWrap: 'wrap', gap: 2 }}
>
  {/* Start Date Picker */}
  <Box 
    mb={1} 
    display="flex" 
    flexDirection="column" 
    gap={0.5} 
    sx={{ flex: 1, minWidth: '150px', maxWidth: '300px' }} // Min and max width for responsiveness
  >
    <Typography variant="body2" sx={{ fontSize: "0.675rem", color: "#989FA9" }}>
      From Month
    </Typography>
    <div className="month-selector">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM"
              showMonthYearPicker
              selectsStart
              startDate={startDate}
              endDate={endDate}
               className="date-picker-input"
              style={{ fontSize: '0.875rem', width: '100%' }} // Make DatePicker input smaller
            />
    </div>
          </Box>
  {/* End Date Picker */}
  <Box 
    mb={1} 
    display="flex" 
    flexDirection="column" 
    gap={0.5} 
    sx={{ flex: 1, minWidth: '150px', maxWidth: '300px' }} // Min and max width for responsiveness
  >
    <Typography variant="body2" sx={{ fontSize: "0.775rem", color: "#989FA9" }}>
      To Month
    </Typography>
    <div className="month-selector">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM"
              showMonthYearPicker
              selectsEnd
              startDate={startDate}
              endDate={endDate}
            className="date-picker-input"
              style={{ fontSize: '0.875rem', width: '100%' }}  // Make DatePicker input smaller
            />
     </div>
          </Box>
        </Box>
      </Box>

      <div className="lining_graph">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TrendLineGraph;





















// import React, { useState, useEffect } from "react";
// import { Line } from "react-chartjs-2";
// import { Chart, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from "chart.js";
// import { Box, Typography } from "@mui/material";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "./TrendLineGraph.scss";

// Chart.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

// const TrendLineGraph = () => {
//   const [chartData, setChartData] = useState({ labels: [], datasets: [] });
//   // const [startDate, setStartDate] = useState(new Date("2024-01-01")); // Default start date
//   // const [endDate, setEndDate] = useState(new Date("2024-12-01")); // Default end date
//   const currentDate = new Date(); // Get the current date
//   const [startDate, setStartDate] = useState(
//     new Date(currentDate.getFullYear(), currentDate.getMonth() - 4, 1)
//   );
//   const [endDate, setEndDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)); // Start of the current month
//   const [totalQuantity, setTotalQuantity] = useState(0);
//   const token = localStorage.getItem("token");
//   const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

//   // Utility function to generate month labels dynamically
//   const generateMonthLabels = (start, end) => {
//     const labels = [];
//     let currentDate = new Date(start);

//     while (currentDate <= end) {
//       const year = currentDate.getFullYear();
//       const month = String(currentDate.getMonth() + 1).padStart(2, "0");
//       labels.push(`${year}-${month}`);
//       currentDate.setMonth(currentDate.getMonth() + 1); // Increment to the next month
//     }

//     return labels;
//   };

//   const fetchData = async () => {
//     try {
//       const response = await axios.post(
//         `${API_END_POINT}/overall_sales/sales_over_time`,
//         {
//           startMonth: `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}`,
//           endMonth: `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}`,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
  
//       if (response.data.success) {
//         const result = response.data.result;
  
//         const months = generateMonthLabels(startDate, endDate);
  
//         const productSales = result.reduce((acc, item) => {
//           if (!acc[item.productName]) {
//             acc[item.productName] = Array(months.length).fill(0);
//           }
//           const monthIndex = months.indexOf(`${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}`);
//           if (monthIndex !== -1) {
//             acc[item.productName][monthIndex] = item.quantity;
//           }
//           return acc;
//         }, {});
  
//         const colors = [];
//         const generateUniqueColor = () => {
//           let color;
//           do {
//             color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`;
//           } while (colors.includes(color));
//           colors.push(color);
//           return color;
//         };
  
//         const datasets = Object.keys(productSales).map((productName) => {
//           const randomColor = generateUniqueColor();
//           return {
//             label: productName,
//             data: productSales[productName],
//             borderColor: randomColor.replace("0.2", "1"),
//             backgroundColor: randomColor,
//             fill: false,
//             tension: 0.4,
//           };
//         });
  
//         const reversedMonths = months; // Reverse the months
//         const reversedDatasets = datasets.map((dataset) => ({
//           ...dataset,
//           data: dataset.data.reverse(), // Reverse the data to match the reversed months
//         }));

//         setChartData({
//           labels: reversedMonths,  // Reversed months for X-axis labels
//           datasets: reversedDatasets,
//         });
  
//         const total = result.reduce((sum, item) => sum + item.quantity, 0);
//         setTotalQuantity(total);
//       }
//     } catch (error) {
//       console.error("Error fetching sales data:", error);
//     }
//   };
  

//   useEffect(() => {
//     fetchData();
//   }, [startDate, endDate]);

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "top",
//         labels: {
//           font: {
//             size: 9, 
//           },
//           padding: 9, 
//         },
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//       x: {
//         reverse: false, // Ensures the months are displayed in ascending order (left to right)
//       },
//     },
//   };

//   return (
//     <div className="lineg">
//       <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ flexWrap: 'wrap', gap: 2 }}>
//         <Box sx={{ flex: 1 }}>
//           <Typography variant="h6">Sales Trend Over Time</Typography>
//           <Typography variant="body1">
//             Total Quantity: {new Intl.NumberFormat('en-IN').format(totalQuantity || 0)}
//           </Typography>
//         </Box>

//         <Box 
//   display="flex" 
//   flexDirection={{ xs: 'column', sm: 'row' }} // Stack vertically on small screens
//   gap={2} 
//   alignItems="center" 
//   justifyContent="space-between" 
//   sx={{ flexWrap: 'wrap', gap: 2 }}
// >
//   {/* Start Date Picker */}
//   <Box 
//     mb={1} 
//     display="flex" 
//     flexDirection="column" 
//     gap={0.5} 
//     sx={{ flex: 1, minWidth: '150px', maxWidth: '300px' }} // Min and max width for responsiveness
//   >
//     <Typography variant="body2" sx={{ fontSize: "0.775rem" }}>
//       Select Start Month
//     </Typography>
//     <div className="month-selector">
//             <DatePicker
//               selected={startDate}
//               onChange={(date) => setStartDate(date)}
//               dateFormat="yyyy-MM"
//               showMonthYearPicker
//               selectsStart
//               startDate={startDate}
//               endDate={endDate}
//                className="date-picker-input"
//               style={{ fontSize: '0.875rem', width: '100%' }} // Make DatePicker input smaller
//             />
//     </div>
//           </Box>
//   {/* End Date Picker */}
//   <Box 
//     mb={1} 
//     display="flex" 
//     flexDirection="column" 
//     gap={0.5} 
//     sx={{ flex: 1, minWidth: '150px', maxWidth: '300px' }} // Min and max width for responsiveness
//   >
//     <Typography variant="body2" sx={{ fontSize: "0.775rem" }}>
//       Select End Month
//     </Typography>
//     <div className="month-selector">
//             <DatePicker
//               selected={endDate}
//               onChange={(date) => setEndDate(date)}
//               dateFormat="yyyy-MM"
//               showMonthYearPicker
//               selectsEnd
//               startDate={startDate}
//               endDate={endDate}
//             className="date-picker-input"
//               style={{ fontSize: '0.875rem', width: '100%' }}  // Make DatePicker input smaller
//             />
//      </div>
//           </Box>
//         </Box>
//       </Box>

//       <div className="lining_graph">
//         <Line data={chartData} options={options} />
//       </div>
//     </div>
//   );
// };

// export default TrendLineGraph;




















// import React, { useState, useEffect } from "react";
// import { Line } from "react-chartjs-2";
// import { Chart, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from "chart.js";
// import { Box, Typography } from "@mui/material";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "./TrendLineGraph.scss";

// Chart.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

// const TrendLineGraph = () => {
//   const [chartData, setChartData] = useState({ labels: [], datasets: [] });
//   const [startDate, setStartDate] = useState(new Date("2024-01-01")); // Default start date
//   const [endDate, setEndDate] = useState(new Date("2024-12-01")); // Default end date
//   const [totalQuantity, setTotalQuantity] = useState(0);
//   const token = localStorage.getItem("token");

//   // Utility function to generate month labels dynamically
//   const generateMonthLabels = (start, end) => {
//     const labels = [];
//     let currentDate = new Date(start);

//     while (currentDate <= end) {
//       const year = currentDate.getFullYear();
//       const month = String(currentDate.getMonth() + 1).padStart(2, "0");
//       labels.push(`${year}-${month}`);
//       currentDate.setMonth(currentDate.getMonth() + 1); // Increment to the next month
//     }

//     return labels;
//   };

//   const fetchData = async () => {
//     try {
//       const response = await axios.post(
//         "http://localhost:3002/overall_sales/sales_over_time",
//         {
//           startMonth: `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}`,
//           endMonth: `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}`,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         const result = response.data.result;

//         const months = generateMonthLabels(startDate, endDate);

//         const productSales = result.reduce((acc, item) => {
//           if (!acc[item.productName]) {
//             acc[item.productName] = Array(months.length).fill(0);
//           }
//           const monthIndex = months.indexOf(`${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}`);
//           if (monthIndex !== -1) {
//             acc[item.productName][monthIndex] = item.quantity;
//           }
//           return acc;
//         }, {});

//         const datasets = Object.keys(productSales).map((productName) => {
//           const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`;
//           return {
//             label: productName,
//             data: productSales[productName],
//             borderColor: randomColor.replace("0.2", "1"),
//             backgroundColor: randomColor,
//             fill: false,
//             tension: 0.4,
//           };
//         });

//         setChartData({
//           labels: months,
//           datasets,
//         });

//         const total = result.reduce((sum, item) => sum + item.quantity, 0);
//         setTotalQuantity(total);
//       }
//     } catch (error) {
//       console.error("Error fetching sales data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [startDate, endDate]);

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   };

//   return (
//     <div className="lineg">
//       <Box display="flex" justifyContent="space-between" alignItems="center">
//         <Box>
//           <Typography variant="h6">Sales Trend Over Time</Typography>
//           <Typography variant="body1">Total Quantity: {totalQuantity}</Typography>
//         </Box>
//         <Box>
//           <Box mb={1}>
//             <Typography variant="body1">Select Start Month</Typography>
//             <DatePicker
//               selected={startDate}
//               onChange={(date) => setStartDate(date)}
//               dateFormat="yyyy-MM"
//               showMonthYearPicker
//               selectsStart
//               startDate={startDate}
//               endDate={endDate}
//               className="datepicker"
//             />
//           </Box>
//           <Box mb={1}>
//             <Typography variant="body1">Select End Month</Typography>
//             <DatePicker
//               selected={endDate}
//               onChange={(date) => setEndDate(date)}
//               dateFormat="yyyy-MM"
//               showMonthYearPicker
//               selectsEnd
//               startDate={startDate}
//               endDate={endDate}
//               className="datepicker"
//             />
//           </Box>
//         </Box>
//       </Box>
//       <div className="lining_graph">
//         <Line data={chartData} options={options} />
//       </div>
//     </div>
//   );
// };

// export default TrendLineGraph;






// nelow is linegraph 

// import React, { useState, useEffect } from "react";
// import { Bar } from "react-chartjs-2"; // Import Bar instead of Line
// import { Chart, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js"; // Import BarElement
// import { Box, Typography } from "@mui/material";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "./TrendLineGraph.scss";

// Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

// const TrendLineGraph = () => {
//   const [chartData, setChartData] = useState({ labels: [], datasets: [] });
//   const currentDate = new Date(); 
//   const [startDate, setStartDate] = useState(
//     new Date(currentDate.getFullYear(), currentDate.getMonth() - 4, 1)
//   );
//   const [endDate, setEndDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)); 
//   const [totalQuantity, setTotalQuantity] = useState(0);
//   const token = localStorage.getItem("token");
//   const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

//   const generateMonthLabels = (start, end) => {
//     const labels = [];
//     let currentDate = new Date(start);

//     while (currentDate <= end) {
//       const year = currentDate.getFullYear();
//       const month = String(currentDate.getMonth() + 1).padStart(2, "0");
//       labels.push(`${year}-${month}`);
//       currentDate.setMonth(currentDate.getMonth() + 1);
//     }

//     return labels;
//   };

//   const fetchData = async () => {
//     try {
//       const response = await axios.post(
//         `${API_END_POINT}/overall_sales/sales_over_time`,
//         {
//           startMonth: `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}`,
//           endMonth: `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}`,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
  
//       if (response.data.success) {
//         const result = response.data.result;
  
//         const months = generateMonthLabels(startDate, endDate);
  
//         const productSales = result.reduce((acc, item) => {
//           if (!acc[item.productName]) {
//             acc[item.productName] = Array(months.length).fill(0);
//           }
//           const monthIndex = months.indexOf(`${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}`);
//           if (monthIndex !== -1) {
//             acc[item.productName][monthIndex] = item.quantity;
//           }
//           return acc;
//         }, {});
  
//         const colors = [];
//         const generateUniqueColor = () => {
//           let color;
//           do {
//             color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`;
//           } while (colors.includes(color));
//           colors.push(color);
//           return color;
//         };
  
//         const datasets = Object.keys(productSales).map((productName) => {
//           const randomColor = generateUniqueColor();
//           return {
//             label: productName,
//             data: productSales[productName],
//             borderColor: randomColor.replace("0.2", "1"),
//             backgroundColor: randomColor,
//             borderWidth: 1, // Added border width for bars
//           };
//         });
  
//         const reversedMonths = months; 
//         const reversedDatasets = datasets.map((dataset) => ({
//           ...dataset,
//           data: dataset.data.reverse(),
//         }));

//         setChartData({
//           labels: reversedMonths,  
//           datasets: reversedDatasets,
//         });
  
//         const total = result.reduce((sum, item) => sum + item.quantity, 0);
//         setTotalQuantity(total);
//       }
//     } catch (error) {
//       console.error("Error fetching sales data:", error);
//     }
//   };
  

//   useEffect(() => {
//     fetchData();
//   }, [startDate, endDate]);

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "top",
//         labels: {
//           font: {
//             size: 9, 
//           },
//           padding: 9, 
//         },
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//       x: {
//         reverse: false, 
//       },
//     },
//   };

//   return (
//     <div className="lineg">
//       <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ flexWrap: 'wrap', gap: 2 }}>
//         <Box sx={{ flex: 1 }}>
//           <Typography variant="h6">Sales Trend Over Time</Typography>
//           <Typography variant="body1">
//             Total Quantity: {new Intl.NumberFormat('en-IN').format(totalQuantity || 0)}
//           </Typography>
//         </Box>

//         <Box 
//           display="flex" 
//           flexDirection={{ xs: 'column', sm: 'row' }} 
//           gap={2} 
//           alignItems="center" 
//           justifyContent="space-between" 
//           sx={{ flexWrap: 'wrap', gap: 2 }}
//         >
//           {/* Start Date Picker */}
//           <Box 
//             mb={1} 
//             display="flex" 
//             flexDirection="column" 
//             gap={0.5} 
//             sx={{ flex: 1, minWidth: '150px', maxWidth: '300px' }} 
//           >
//             <Typography variant="body2" sx={{ fontSize: "0.775rem" }}>
//               Select Start Month
//             </Typography>
//             <div className="month-selector">
//               <DatePicker
//                 selected={startDate}
//                 onChange={(date) => setStartDate(date)}
//                 dateFormat="yyyy-MM"
//                 showMonthYearPicker
//                 selectsStart
//                 startDate={startDate}
//                 endDate={endDate}
//                 className="date-picker-input"
//                 style={{ fontSize: '0.875rem', width: '100%' }}
//               />
//             </div>
//           </Box>
          
//           {/* End Date Picker */}
//           <Box 
//             mb={1} 
//             display="flex" 
//             flexDirection="column" 
//             gap={0.5} 
//             sx={{ flex: 1, minWidth: '150px', maxWidth: '300px' }} 
//           >
//             <Typography variant="body2" sx={{ fontSize: "0.775rem" }}>
//               Select End Month
//             </Typography>
//             <div className="month-selector">
//               <DatePicker
//                 selected={endDate}
//                 onChange={(date) => setEndDate(date)}
//                 dateFormat="yyyy-MM"
//                 showMonthYearPicker
//                 selectsEnd
//                 startDate={startDate}
//                 endDate={endDate}
//                 className="date-picker-input"
//                 style={{ fontSize: '0.875rem', width: '100%' }}
//               />
//             </div>
//           </Box>
//         </Box>
//       </Box>

//       <div className="lining_graph">
//         <Bar data={chartData} options={options} /> {/* Changed to Bar */}
//       </div>
//     </div>
//   );
// };

// export default TrendLineGraph;

