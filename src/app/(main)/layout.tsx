import Navbar from "@/components/main/Navbar";
import SideBar from "@/components/main/Sidebar";
import { ScriptProps } from "next/script";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MainLayout({ children }: ScriptProps) {
    return (
        <div className={`h-[100vh]  flex `}>
            <div className="flex w-full">
                <SideBar/>
                <div className="w-full">
                    <Navbar />
                    <div className="bg-gray-100 h-[91vh] p-4">
                        {children}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )

}