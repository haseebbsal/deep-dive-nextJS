import React from "react";

const StatCard = ({ number, label, extraClass, numberClass }: { number: string, label: string, extraClass?: string, numberClass?:String}) => {
  return (
    <div className={`flex flex-col ${extraClass} items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out`}>
      <div className={`text-4xl ${numberClass} font-semibold text-blue-500`}>{number}</div>
      <div className="text-md text-gray-700">{label}</div>
    </div>
  );
};

export default StatCard;
