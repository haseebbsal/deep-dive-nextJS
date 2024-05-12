import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);


const options:any = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
    title: {
      display: true,
      text: "Doughnut Chart Example",
    },
  },
};


const DoughnutChart = ({ apidata }: { apidata: any }) => {
  let pieData = {
    labels: ["Desktop", "Mobile"],
    datasets: [
      {
        label: "% Of Users",
        data: apidata,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div>
      <Doughnut data={pieData} options={options} />
    </div>
  )
};
export default DoughnutChart;
