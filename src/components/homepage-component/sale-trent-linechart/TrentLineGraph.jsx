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
  const [startDate, setStartDate] = useState(new Date(currentDate.getFullYear(), 0, 1)); // Start of the current year
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

        const datasets = Object.keys(productSales).map((productName) => {
          const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`;
          return {
            label: productName,
            data: productSales[productName],
            borderColor: randomColor.replace("0.2", "1"),
            backgroundColor: randomColor,
            fill: false,
            tension: 0.4,
          };
        });

        // Reverse the data and labels to fix the chart line direction
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
          <Typography variant="h6">Sales Trend Over Time</Typography>
          <Typography variant="body1">
            Total Quantity: {new Intl.NumberFormat('en-IN').format(totalQuantity || 0)}
          </Typography>
        </Box>

        <Box display="flex" flexDirection="row" gap={2} alignItems="center" justifyContent="space-between" sx={{ flexWrap: 'wrap', gap: 2 }}>
          <Box mb={1} display="flex" flexDirection="column" gap={0.5} sx={{ flex: 1, minWidth: '200px' }}>
            <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>Select Start Month</Typography>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM"
              showMonthYearPicker
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="datepicker"
              style={{ fontSize: '0.875rem' }}  // Make DatePicker input smaller
            />
          </Box>
          <Box mb={1} display="flex" flexDirection="column" gap={0.5} sx={{ flex: 1, minWidth: '200px' }}>
            <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>Select End Month</Typography>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM"
              showMonthYearPicker
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              className="datepicker"
              style={{ fontSize: '0.875rem' }}  // Make DatePicker input smaller
            />
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


























































// import React from "react";
// import { Line } from "react-chartjs-2";
// import { Chart, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';
// import './TrendLineGraph.scss'
// import { Box, MenuItem, Select, Typography } from "@mui/material";

// Chart.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

// const data = {
//   labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
//   datasets: [
//     {
//       label: "First dataset",
//       data: [33, 53, 85, 41, 44, 65],
//       fill: true,
//       backgroundColor: "rgba(75,192,192,0.2)",
//       borderColor: "rgba(75,192,192,1)"
//     },
//     {
//       label: "Second dataset",
//       data: [33, 25, 35, 51, 54, 76],
//       fill: false,
//       borderColor: "#742774"
//     }
//   ]
// };

// const options = {
//   responsive: true,
//   maintainAspectRatio: false, // Added for responsiveness
//   plugins: {
//     legend: {
//       position: false,
//     },
//   },
//   scales: {
//     y: {
//       beginAtZero: true,
//     },
//   },
// };

// export default function TrendLineGraph() {
//   return (
//     <div className="lineg">
//   <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Box>
//                 <Typography variant="h6">Sales Trend Over Time</Typography>
//                 <Typography variant="body1">100000 L</Typography>
//             </Box>
//             <Box>
//                 <Select defaultValue="" variant="outlined" size="small" sx={{ minWidth: 10 }}>
//                     <MenuItem value={1}>Option 1</MenuItem>
//                     <MenuItem value={2}>Option 2</MenuItem>
//                     <MenuItem value={3}>Option 3</MenuItem>
//                 </Select>
//                 <Typography mt={1} variant="body1">Date Dropdown</Typography>
//             </Box>
//         </Box>
//     <div className="lining_graph">
//            <Line data={data} options={options} />
//     </div>
//  </div>
//   );
// }
