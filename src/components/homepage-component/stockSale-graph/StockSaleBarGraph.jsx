'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import './StockSaleBarGraph.scss';
import DOTIMAGE from '../../../assets/homepage-assert/barDotImg.png';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function StockSaleBarGraph() {
  const [chartData, setChartData] = useState({
    labels: [], // Monthly labels
    datasets: [
      {
        label: "Unsold Stock",
        data: [], // Unsold stock data for each month
        // backgroundColor: "#FFC600", // Yellow
                backgroundColor: [
          "#FFC600",
          "rgba(1, 197, 114, 1)",
          "#FF3535",
          "rgba(1, 197, 114, 1)",
          "#FFC600",
          "#FFC600",
        ],
        barThickness: 25,
      },
      {
        label: "Sold Stock",
        data: [], // Sold stock data for each month
        // backgroundColor: "#FFEAA3", // Light Yellow
                backgroundColor: [
          "#FFEAA3",
          "rgba(144, 238, 144, 1)",
          "#FF7F7F",
          "rgba(144, 238, 144, 1)",
          "#FFEAA3",
          "#FFEAA3",
        ],
        barThickness: 25,
      },
    ],
  });

  const [totalTarget, setTotalTarget] = useState(0);
  const [totalSold, setTotalSold] = useState(0);
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          generateLabels: (chart) => {
            const uniqueColors = [];
            const datasets = chart.data.datasets;
  
            // Loop through each dataset and ensure unique colors for the legend
            datasets.forEach(dataset => {
              dataset.backgroundColor.forEach(color => {
                if (!uniqueColors.includes(color)) {
                  uniqueColors.push(color);
                }
              });
            });
  
            // Create unique legend labels
            return uniqueColors.map(color => ({
              text: color === "#FFC600" || color === "rgba(1, 197, 114, 1)" || color === "#FF3535" ? "Unsold Stock" : "Sold Stock",
              fillStyle: color,
              strokeStyle: color,
              lineWidth: 1,
            }));
          },
          usePointStyle: true, // Makes the legend circle
          pointStyle: 'circle', // Ensures the point style is a circle
          pointRadius: 6, // Reduces the size of the circle
          font: {
            size: 10, // Adjusts the legend text size
            weight: 'normal', // Adjusts the font weight (optional)
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (data) {
            return new Intl.NumberFormat("en-US").format(data.raw);
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Stock Volume',
        },
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat("en-US").format(value);
          },
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1,
        },
        stacked: true,
      },
      x: {
        title: {
          display: true,
          text: 'Months',
        },
        stacked: true,
      },
    },
  };
  
  useEffect(() => {
    // Fetch data from API
    const fetchStockDetails = async () => {
      try {
        const response = await axios.get(`${API_END_POINT}/overall_sales/stock_over_detail`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          const result = response.data.result;
  
          // Sort the result by month in ascending order
          const sortedResult = result.sort((a, b) => new Date(a.month) - new Date(b.month));
  
          // Prepare labels and datasets for each month
          const months = sortedResult.map(item => item.month); // Extract sorted months
          const soldStock = sortedResult.map(item => item.totalSoldStock); // Extract sold stock
          const targetStock = sortedResult.map(item => item.totalTargetStock); // Extract total stock
  
          // Calculate unsold stock for each month
          const unsoldStock = targetStock.map((stock, index) => stock - soldStock[index]);
  
          // Update chart data dynamically
          setChartData({
            labels: months, // Sorted months as labels
            datasets: [
              { label: "Unsold Stock", data: unsoldStock,                 backgroundColor: [
                "#FFC600",
                "rgba(1, 197, 114, 1)",
                "#FF3535",
                "rgba(1, 197, 114, 1)",
                "#FFC600",
                "#FFC600",
              ],},
              { label: "Sold Stock", data: soldStock,                 backgroundColor: [
                "#FFEAA3",
                "rgba(144, 238, 144, 1)",
                "#FF7F7F",
                "rgba(144, 238, 144, 1)",
                "#FFEAA3",
                "#FFEAA3",
              ], },
            ],
          });
  
          setTotalTarget(targetStock.reduce((total, current) => total + current, 0));
          setTotalSold(soldStock.reduce((total, current) => total + current, 0));
        }
      } catch (error) {
        console.error("Error fetching stock details:", error);
      }
    };
  
    fetchStockDetails();
  }, []);
  

  return (
    <div className="bar_chart_containr">
      <div className="slaes_dotimg">
        {/* <div>Total Stock: {new Intl.NumberFormat("en-US").format(totalTarget)}</div> */}
        <div>Stock / Sales</div>
        <div>Sold Stock: {new Intl.NumberFormat("en-US").format(totalSold)}</div>
      </div>

      <div className="bar_chart">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}















// 'use client';
// import React from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Bar } from "react-chartjs-2";
// import './StockSaleBarGraph.scss';
// import DOTIMAGE from '../../../assets/homepage-assert/barDotImg.png'

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// export function StockSaleBarGraph() {
//   const chartData = {
//     labels: ["January", "February", "March", "April", "May", "June"],
//     datasets: [
//       {
//         label: "Bottom 80%",
//         data: [70000, 40000, 65000, 55000, 88000, 52000],
//         backgroundColor: [
//           "#FFC600",
//           "rgba(1, 197, 114, 1)",
//           "#FF3535",
//           "rgba(1, 197, 114, 1)",
//           "#FFC600",
//           "#FFC600",
//         ],
//         stack: 'combined',
//         barThickness: 25,
//       },
//       {
//         label: "Top 20%",
//         data: [10000, 30000, 20000, 15000, 25000, 18000],
//         backgroundColor: [
//           "#FFEAA3",
//           "rgba(144, 238, 144, 1)",
//           "#FF7F7F",
//           "rgba(144, 238, 144, 1)",
//           "#FFEAA3",
//           "#FFEAA3",
//         ],
//         stack: 'combined',
//         barThickness: 25,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//       tooltip: {
//         callbacks: {
//           label: function (data) {
//             return "₺" + new Intl.NumberFormat("tr-TR").format(data.raw);
//           },
//         },
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: false,
//           text: 'Stocks',
//         },
//         min: 0,
//         max: 100000,
//         ticks: {
//           callback: function(value) {
//             if (value === 0) return "0 S";
//             if (value === 25000) return "10k S";
//             if (value === 50000) return "50k S";
//             if (value === 75000) return "80k S";
//             if (value === 100000) return "100K S";
//             return null;
//           },
//           stepSize: 25000,
//           count: 4,
//         },
//         grid: {
//           display: true,
//           color: 'rgba(0, 0, 0, 0.1)',
//           lineWidth: 1,
//         },
//       },
//       x: {
//         title: {
//           display: false,
//           text: 'Months',
//         },
//         stacked: true,
//         categoryPercentage: 0.5,
//         barPercentage: 1.0,
//       },
//     },
//   };

//   return(
//     <div  className="bar_chart_containr">
//       <div className="slaes_dotimg">
//          <div>Total Stock / Selled</div>
//          <img src={DOTIMAGE} alt="" />
//       </div>

//       <div className="bar_chart">
//       <Bar data={chartData} options={options} />
//      </div>
//     </div>
//   )
// }
