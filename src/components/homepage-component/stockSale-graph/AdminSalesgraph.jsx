'use client';
import React, { useState, useEffect, useRef } from "react";
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
import "./StockSaleBarGraph.scss";

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
    labels: [],
    datasets: [],
  });

  const chartRef = useRef(null);
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const response = await axios.get(
          `${API_END_POINT}/overall_sales/stock_over_detail`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          const result = response.data.result;
          const sortedResult = result.sort(
            (a, b) => new Date(a.month) - new Date(b.month)
          );

          const months = sortedResult.map((item) => item.month);
          const soldStockAmount = sortedResult.map(
            (item) => item.totalSoldStockAmount
          );
         

          const chart = chartRef.current;
          if (chart) {
            const ctx = chart.ctx;

            const greenGradient = ctx.createLinearGradient(0, 0, 0, 400);
            greenGradient.addColorStop(0, "rgba(102, 255, 153, 1)");
            greenGradient.addColorStop(1, "rgba(51, 204, 102, 0.8)");

            const redGradient = ctx.createLinearGradient(0, 0, 0, 400);
            redGradient.addColorStop(0, "rgba(255, 102, 102, 1)");
            redGradient.addColorStop(1, "rgba(255, 51, 51, 0.8)");

            setChartData({
              labels: months,
              datasets: [
                {
                  label: "Sales Achieved Amount",
                  data: soldStockAmount,
                  backgroundColor: greenGradient,
                  barThickness: 25,
                  borderRadius: 4,
                },
                
              ],
            });
          }
        }
      } catch (error) {
        console.error("Error fetching stock details:", error);
      }
    };

    fetchStockDetails();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (data) {
            return new Intl.NumberFormat("en-IN").format(data.raw);
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Stock Volume",
        },
        ticks: {
          callback: function (value) {
            return new Intl.NumberFormat("en-US").format(value);
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
    },
  };

  return (
    <div className="bar_chart_container">
      <div className="sales_dotimg">
        <div>Stock / Sales</div>
      </div>
      <div className="bar_chart">
        <Bar data={chartData} options={options} ref={chartRef} />
      </div>
    </div>
  );
}
