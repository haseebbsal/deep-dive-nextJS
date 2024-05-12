import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ArcElement, // Import ArcElement necessary for doughnut charts
} from "chart.js";

// Register the necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ["This project", "Other projects"],
  datasets: [
    {
      label: "# of Sessions",
      data: [22, 0],
      backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(201, 203, 207, 0.6)"],
      borderColor: ["rgba(54, 162, 235, 1)", "rgba(201, 203, 207, 1)"],
      borderWidth: 1,
      hoverOffset: 4,
    },
  ],
};

const options:any = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
  },
};

const SessionUsageChart = () => <Doughnut data={data} options={options} />;

export default SessionUsageChart;
