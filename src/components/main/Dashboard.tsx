"use client";
import { Select, SelectItem } from "@nextui-org/select";
import StatCard from "@/components/charts/statCard";
import React, { useState } from "react";
import { useQuery } from "react-query";
import DoughnutChart from "../charts/charts";
import SessionUsageChart from "../charts/UsageChart";
import { Chart, ArcElement, RadialLinearScale, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js'
import axios from 'axios'
import PieChart from "../charts/pieChart";


// import Bowser from 'bowser';
import { Bar, Line, PolarArea } from "react-chartjs-2"
Chart.register(RadialLinearScale);
Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(ArcElement);
Chart.register(PointElement);
Chart.register(LineElement);
Chart.register(BarElement);
const options: any = {
    responsive: true,
    plugins: {
        legend: {
            position: "bottom",
        },
        title: {
            display: true,
            text: "Pie Chart Example",
        },
    },
};
type DomainsData = { domains: string }[]
export default function DashboardContainer({ domainsData ,id}: { domainsData: DomainsData,id:number }) {
    const [activeDomain, setActiveDomain] = useState(domainsData[0])
    if (!activeDomain) {
        return <p>No Domains On The Dashboard</p>
    }
    const domainDashboardQuery = useQuery(['domainDashboard', activeDomain.domains], ({ queryKey }) => axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard?userid=${id}&domain=${queryKey[1]}`), {
        select(data) {
            return data.data


        },
    })
    return (
        <>
        <div className="flex justify-between mb-4">
                <div>
                    <StatCard number={`${domainsData.length}`} label="Total domain verified" extraClass="!flex-row !gap-4 !p-2 h-full" numberClass={'!text-2xl'}/>
                </div>
            <Select
                variant={"underlined"}
                label="Select Domain"
                selectedKeys={[activeDomain.domains]}
                className="max-w-xs bg-transparent!"
                onChange={(e) => {
                    const value = e.target.value;
                    if (value != "") {
                        setActiveDomain({ domains: value });
                    }
                }}
            >
                {domainsData.map((animal: any) => (
                    <SelectItem
                        className="bg-transparent!"
                        key={animal.domains}
                        value={animal.domains}
                    >
                        {animal.domains}
                    </SelectItem>
                ))}
            </Select>
        </div>
            <div >
                {(domainDashboardQuery.isLoading) && <p className="text-center">Fetching {activeDomain.domains} dashboard info</p>}
                {!domainDashboardQuery.isLoading  && <>
                    <div className="grid grid-cols-3 gap-4">
                        <StatCard number={domainDashboardQuery.data!.total_sessions} label="Total sessions" />
                        <StatCard number="1" label="Heatmaps" />
                        <StatCard number={domainDashboardQuery.data!.total_users} label="Total Users" />
                        {/* <StatCard number="5" label="Total domain verified" /> */}
                    </div>
                    <div className="flex justify-center flex-wrap items-start mt-8 gap-4">
                        <div className=" rounded-lg  ">
                            <SessionUsageChart />
                            {/* <div className="text-center mt-4"></div> */}
                        </div>
                        {parseInt(domainDashboardQuery.data.user_agents)!=0 && <div className=" h-full">
                            <DoughnutChart apidata={domainDashboardQuery.data.user_agents} />
                        </div>}
                        {domainDashboardQuery.data.country_list.length != 0 && <div>
                            <PieChart labels={domainDashboardQuery.data.country_list} data={domainDashboardQuery.data.country_total_list} />
                        </div>}
                        <div className="flex gap-4">
                            <div>
                                <Line className="!h-[20rem] !w-full" options={options} data={{
                                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                                    datasets: [{
                                        label: 'No Of Users',
                                        data: [65, 59, 80, 81, 56, 55, 40],
                                        fill: false,
                                        borderColor: '#FF3B3B',
                                        tension: 0.1
                                    }]
                                }} />
                            </div>
                            <div>
                                <PolarArea className="!h-[20rem] !w-full" options={options} data={{
                                    labels: [
                                        'Safari',
                                        'Chrome',
                                        'Microsoft Edge',
                                        'FireFox',
                                    ],
                                    datasets: [{
                                        label: 'My First Dataset',
                                        data: [11, 16, 7, 3],
                                        backgroundColor: [
                                            'rgb(255, 99, 132)',
                                            'rgb(75, 192, 192)',
                                            'rgb(255, 205, 86)',
                                            'rgb(201, 203, 207)',
                                        ]
                                    }]
                                }} />
                            </div>
                        </div>
                        
                    </div>

                </>}
        </div>
    </>
    )
} 
