"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useQuery } from "react-query";
import axios from "axios";
import { ImSpinner2 } from "react-icons/im";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
export default function IndividualSession({
  params: { id },
  searchParams: { domain },
}: {
  params: { id: string };
  searchParams: { domain: string };
}) {
  const [loading, setLoading] = useState(true);
  const getAllSessionDataOfId = useQuery(['allSessionData', id], () => axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sessions/getAllSessions/${id}`))
  const Domain = domain.includes("http://127.0.0.1:5501")
    ? "https://petrovibrasolutions.com"
    : domain;
  Cookies.set("deep_domain", Domain);
  // https://www.metroshoes.com.pk
  // https://mocciani.com.pk
  useEffect(() => {
    window.onbeforeunload = async (e) => {
      window.onbeforeunload = null;
      Cookies.remove("deep_domain");
    };
    return () => {
      Cookies.remove("deep_domain");
    };
  }, []);

  return (
    <>
      <div className="relative h-[30rem]">
        <div className="h-full relative">
          <iframe
            onLoad={() => {
              setLoading(false)
            }}
            src={`/api/proxy?url=${Domain}`}
            className={`w-full h-full ${loading ? 'invisible' : 'visible'} `}
          // height={400}
          />
          {!loading && <div className="flex justify-center mt-16 bg-white shadow-xl rounded-full">
            <div className="flex items-center gap-4 p-2">
              <button className="relative  block">
                <MdOutlineKeyboardDoubleArrowLeft className="text-3xl spinner-color" />
                <span className="absolute right-0 top-[-190%] z-[3] w-max bg-white rounded-full spinner-color p-2 hidden">Back 10 secs</span>
              </button>
              <button className="relative block">
                <FaPlay className="text-2xl spinner-color " />
                <span className="absolute right-[-50%] top-[-250%] z-[3] w-max bg-white rounded-full spinner-color p-2 hidden">Play</span>
              </button>
              <button className="relative block">
                <MdKeyboardDoubleArrowRight className="text-3xl spinner-color" />
                <span className="absolute left-[10%] top-[-190%] z-[3] w-max bg-white rounded-full spinner-color p-2 hidden">Forward 10 secs</span>
              </button>
            </div>
          </div>}
          <div className="absolute h-full w-full top-0"></div>
        </div> 
        {loading && <ImSpinner2 className="absolute h-1/4 w-1/2 top-[35%] left-[25%] spinner-color animate-spin" />}
      </div>
    </>
  );
}
