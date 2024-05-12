import Navbar from "@/components/main/Navbar";
import SideBar from "@/components/main/Sidebar";
import ToastHolder from "@/components/main/ToastContainer";
import React from "react";

export default function MainLayout({ children }: {children:React.ReactNode}) {
    return (
        <div className={`h-[100vh]  flex `}>
            <div className="flex w-full">
                <SideBar/>
                <div className="flex flex-col w-full">
                    <Navbar />
                    <div className="bg-gray-100 h-full p-4 overflow-scroll">
                        {children}
                    </div>
                </div>
            </div>
            <ToastHolder/>
        </div>
    )

}