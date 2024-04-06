"use client";
import Link from "next/link";
import Image from "next/image";
import { useState} from "react";
import { FaPlay } from "react-icons/fa";
import { RiFireFill } from "react-icons/ri";
import { MdSpaceDashboard } from "react-icons/md";
import { BsBoxArrowLeft, BsBoxArrowRight } from "react-icons/bs";
import { cookies } from "next/headers";



export default function SideBar() {
    const [toggle, setToggle] = useState(false) 
   
    return (
        <div  className={toggle ? "main-bg-color h-full w-[5%]" : "main-bg-color h-full w-[25%]"}>
            <div  className="flex flex-col text-white  gap-8">
                <div className="flex  items-center flex-wrap ">
                    <div className={toggle ? "w-[100%] flex justify-center" : "w-[40%] flex justify-center"}>
                        <Image src={'/images/icons/Dashicon.ico'} width={80} height={80} alt="logo" />
                    </div>
                    {!toggle && <p className="font-bold text-2xl ">DEEP DIVE</p>}
                </div>
                <div className={toggle ? "flex justify-center items-center flex-wrap" : "flex items-center flex-wrap  "}>
                    <Link href={'/dashboard'} className="w-[40%] justify-center flex"><MdSpaceDashboard /></Link>
                    {!toggle && <Link href={'/dashboard'} className="font-bold ">Dashboard</Link>}
                </div>
                <div className={toggle ? "flex justify-center items-center flex-wrap" : "flex items-center flex-wrap  "}>   
                    <Link href={'/sessions'} className="w-[40%] justify-center flex"><FaPlay  /></Link>
                    {!toggle && <Link href={'/sessions'} className="font-bold ">Sessions</Link>}
                </div>
                <div className={toggle ? "flex justify-center items-center flex-wrap" : "flex items-center flex-wrap  "}>
                    <Link href={'/heatmaps'} className="w-[40%] justify-center flex " ><RiFireFill  /></Link>
                    {!toggle && <Link href={'/heatmaps'} className="font-bold ">Heatmaps</Link>}
                </div>
                <div className="flex justify-center items-center flex-wrap  ">
                    {!toggle && <BsBoxArrowLeft onClick={() => {
                        setToggle(!toggle)
                    }} className="text-xl cursor-pointer" />}
                    {toggle && <BsBoxArrowRight onClick={() => {
                        setToggle(!toggle)
                    }} className="text-xl cursor-pointer" />}
                </div>
                



            </div>
        </div>
    )

}