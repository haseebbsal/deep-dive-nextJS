import React from "react";

const StatCard = ({ number, label }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <div className="text-4xl font-semibold text-blue-500">{number}</div>
      <div className="text-md text-gray-700">{label}</div>
    </div>
  );
};

export default StatCard;
