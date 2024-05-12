"use client";
import React from "react";
import StatCard from "./statCard.js";
import DoughnutChart from "./charts.js";
import SessionUsageChart from "./UsageChart.js";
export default function Dashboard() {
  return (
    <>
      <div className="p-4 bg-gray-100 max-h-screen overflow-auto">
        <div className="container mx-auto p-4 overflow-auto">
          <h1 className="text-xl font-bold mb-4">Dashboard</h1>
        </div>
        <div className="p-4 bg-gray-100 min-h-screen">
          <div className="grid grid-cols-4 gap-4">
            <StatCard number="10" label="Total sessions" />
            <StatCard number="1" label="Heatmaps" />
            <StatCard number="5" label="Total Users" />
          </div>
          <div className="flex justify-center items-center mt-8">
            <div className="bg-white p-4 rounded-lg shadow-md w-96">
              <SessionUsageChart />
              <div className="text-center mt-4"></div>
            </div>
          </div>

          <div className="flex justify-center items-center mt-8">
            <DoughnutChart />
          </div>
        </div>
      </div>
    </>
  );
}
