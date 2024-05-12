"use client";
import { Select, SelectItem } from "@nextui-org/select";
import StatCard from "@/components/charts/statCard";
import React, { useState } from "react";
import { useQuery } from "react-query";
import DoughnutChart from "../charts/charts";
import SessionUsageChart from "../charts/UsageChart";
import axios from 'axios'
// import Bowser from 'bowser';
type DomainsData = { domains: string }[]
export default function DashboardContainer({ domainsData ,id}: { domainsData: DomainsData,id:number }) {
    const [activeDomain, setActiveDomain] = useState(domainsData[0])
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
                    <div className="flex justify-center items-start mt-8 gap-4">
                        <div className=" rounded-lg  ">
                            <SessionUsageChart />
                            <div className="text-center mt-4"></div>
                        </div>
                        {parseInt(domainDashboardQuery.data.user_agents)!=0 && <div className=" h-full">
                            <DoughnutChart apidata={domainDashboardQuery.data.user_agents} />
                        </div>}
                    </div>

                </>}
        </div>
    </>
    )
} 
