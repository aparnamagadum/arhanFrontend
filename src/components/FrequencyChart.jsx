import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const FrequencyChart = () => {
  const data = {
    labels: ["Minutely", "Hourly", "Daily", "Weekly", "Monthly"],
    datasets: [
      {
        label: "Task Frequency Guide",
        data: [60, 24, 1, 0.25, 0.03], // Example values for visual representation
        backgroundColor: [
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
          "rgba(255, 205, 86, 0.8)",
          "rgba(54, 162, 235, 0.8)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        backgroundColor: "#2D3748",
        titleColor: "#F7FAFC",
        bodyColor: "#CBD5E0",
        callbacks: {
          label: function (tooltipItem) {
            const frequencies = [
              "Every minute (e.g., * * * * *)",
              "Every hour (e.g., 0 * * * *)",
              "Every day (e.g., 0 0 * * *)",
              "Every week (e.g., 0 0 * * 0)",
              "Every month (e.g., 0 0 1 * *)",
            ];
            return frequencies[tooltipItem.dataIndex];
          },
        },
      },
      legend: {
        display: true,
        labels: {
          color: "#E2E8F0",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#E2E8F0",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
      x: {
        ticks: {
          color: "#E2E8F0",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-8 rounded-lg shadow-xl">
      <h2 className="text-2xl font-extrabold mb-4 text-white text-center">
        Cron Frequency Guide
      </h2>
      <p className="text-white text-center mb-6">
        Use this chart to understand how frequently tasks will run. Hover over
        each bar for details.
      </p>
      <div className="p-4 bg-white bg-opacity-20 rounded-lg">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default FrequencyChart;
