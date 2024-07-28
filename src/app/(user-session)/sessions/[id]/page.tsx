"use client";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useQuery } from "react-query";
import axios from "axios";
import { ImSpinner2 } from "react-icons/im";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { FaMousePointer } from "react-icons/fa";

type SessionDataSingle = {
    x_cordinate: string,
    y_cordinate: string,
    action_type: string
    element: string,
    date: string,
    time: string,
    count: number,
    sessiontime: string,
    scrollx?: number,
    scrolly?:number
}

type SessionData = SessionDataSingle[]

type individualSessionData = {
    isnavigated: string,
    startedat: string,
    endedat: string
}

type PointerPostion = {
    transform: string
}
export default function IndividualSession({
    params: { id },
    searchParams: { domain },
}: {
    params: { id: string };
    searchParams: { domain: string };
}) {
    const [loading, setLoading] = useState(true);
    const [playState, setPlayState] = useState(0)
    const [startSession, setStartSession] = useState(true)
    const [currentTime, setCurrentTime] = useState<string | null>()
    const [pointerPosition, setPointerPosition] = useState<null | PointerPostion>()
    const getAllSessionDataOfId = useQuery(['allSessionData', id], () => axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sessions/getAllSessions/${id}`))
    const individualSessionDataOfId = useQuery(['individualSessionData', id], ({ queryKey }) => axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sessions/individualSession/${queryKey[1]}`))
    const Domain = domain.includes("http://127.0.0.1:5501")
        ? "https://petrovibrasolutions.com"
        : `${domain}`;
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

    useEffect(() => {
        let intervalId: any
        function startSession() {
            let count = 0
            let newData: SessionData = []
            const individual: individualSessionData = individualSessionDataOfId.data?.data
            if (getAllSessionDataOfId.data?.data.data.length != 0) {
                for (let j of getAllSessionDataOfId.data?.data.data) {
                    const index = getAllSessionDataOfId.data?.data.data.indexOf(j)
                    const singleSessionData: SessionDataSingle = { x_cordinate: j.x_cordinate, y_cordinate: j.y_cordinate, action_type: j.action_type, element: j.element, date: j.date, time: j.time, count: j.count, sessiontime: j.sessiontime,scrollx:j.scrollx,scrolly:j.scrolly }
                    // if (newData.length == 0) {
                    //   console.log('beginning',singleSessionData.sessiontime,)

                    // }
                    // else {
                    //   console.log('beginning', singleSessionData.sessiontime,'see',newData[newData.length-1].sessiontime)

                    // }
                    if (newData.length == 0) {
                        if (singleSessionData.sessiontime == individual.startedat) {
                            newData.push(singleSessionData)
                        }
                        else {
                            const iterateCount = Math.floor((parseInt(singleSessionData.sessiontime) - parseInt(individual.startedat)) / 1000)
                            for (let k = 1; k <= iterateCount; k++) {
                                const newIndividual = { x_cordinate: '', y_cordinate: '', action_type: '', element: '', count: 0 }
                                let add;
                                if (newData.length == 0) {
                                    add = parseInt(individual.startedat) + 1000
                                }
                                else {
                                    add = parseInt(newData[newData.length - 1].sessiontime) + (1000)
                                }
                                // console.log(`in here before ${newData[newData.length - 1].sessiontime} after ${add}`)
                                newData.push({ ...newIndividual, date: new Date(add).toLocaleDateString(), time: new Date(add).toLocaleTimeString(), sessiontime: `${add}` })
                            }
                            newData.push(singleSessionData)
                        }
                    }
                    else {
                        if (singleSessionData.sessiontime == newData[newData.length - 1].sessiontime) {
                            newData.push(singleSessionData)
                        }
                        else {
                            const iterateCount = Math.floor((parseInt(singleSessionData.sessiontime) - parseInt(newData[newData.length - 1].sessiontime)) / 1000)
                            for (let k = 1; k <= iterateCount; k++) {
                                const newIndividual = { x_cordinate: '', y_cordinate: '', action_type: '', element: '', count: 0 }
                                let add = parseInt(newData[newData.length - 1].sessiontime) + 1000
                                console.log(`in heree before ${newData[newData.length - 1].sessiontime} after ${add}`)
                                newData.push({ ...newIndividual, date: new Date(add).toLocaleDateString(), time: new Date(add).toLocaleTimeString(), sessiontime: `${add}` })
                            }
                            newData.push(singleSessionData)
                        }
                        if (index == getAllSessionDataOfId.data?.data.data.length - 1) {
                            if (singleSessionData.sessiontime != individual.endedat) {
                                const iterateCount = Math.floor((parseInt(individual.endedat) - parseInt(singleSessionData.sessiontime)) / 1000)
                                for (let k = 1; k <= iterateCount; k++) {
                                    const newIndividual = { x_cordinate: '', y_cordinate: '', action_type: '', element: '', count: 0 }
                                    let add = parseInt(newData[newData.length - 1].sessiontime) + 1000
                                    console.log(` in hereee before ${newData[newData.length - 1].sessiontime} after ${add}`)
                                    newData.push({ ...newIndividual, date: new Date(add).toLocaleDateString(), time: new Date(add).toLocaleTimeString(), sessiontime: `${add}` })
                                }
                            }
                        }
                    }
                }
            }
            else {
                const iterateCount = Math.floor((parseInt(individual.endedat) - parseInt(individual.startedat)) / 1000)
                for (let k = 0; k < iterateCount; k++) {
                    const newIndividual = { x_cordinate: '', y_cordinate: '', action_type: '', element: '', count: 0 }
                    let add;
                    if (newData.length == 0) {
                        add = parseInt(individual.startedat) + 1000
                    }
                    else {
                        add = parseInt(newData[newData.length - 1].sessiontime) + 1000
                    }
                    newData.push({ ...newIndividual, date: new Date(add).toLocaleDateString(), time: new Date(add).toLocaleTimeString(), sessiontime: `${add}` })
                }
            }
            newData = newData.sort((a, b) => parseInt(a.sessiontime) - parseInt(b.sessiontime))
            console.log(newData)
            setStartSession(false)
            let setintervalId = setInterval(() => {
                if (count == newData.length - 1) {
                    clearInterval(setintervalId)
                    setPlayState(0)
                }
                else {
                    // console.log(count, newData.length-1)
                    // console.log(`${(count / (newData.length - 1)) * 100}%`)
                    // if()
                    // console.log(newData[count].action_type)
                    // console.log((document.getElementById('iframe') as HTMLIFrameElement).contentWindow!.document.elementFromPoint(newData[count].x_cordinate as any as number, newData[count].y_cordinate as any as number))
                    if (newData[count].action_type == 'click') {
                        ((document.getElementById('iframe') as HTMLIFrameElement).contentWindow!.document.elementFromPoint(newData[count].x_cordinate as any as number, newData[count].y_cordinate as any as number) as any).click()
                    }
                    if (newData[count].action_type == 'scroll') {
                        console.log('im hereeeeee', newData[count].scrollx, newData[count].scrolly)
                        const scrolling=((document.getElementById('iframe') as HTMLIFrameElement).contentWindow!.scrollTo(newData[count].scrollx as any as number, newData[count].scrolly as any as number))
                        // ((document.getElementById('iframe') as HTMLIFrameElement).contentWindow!.document.elementFromPoint(newData[count].x_cordinate as any as number, newData[count].y_cordinate as any as number) as any).click()
                    }
                    setPointerPosition({ transform: `translate(${(newData[count].x_cordinate as any as number)}px,${newData[count].y_cordinate}px)` })
                    // console.log(document.getElementById('sessionPlayerScroll'))
                    if (document.getElementById('sessionPlayerScroll')) {
                        if (newData.length) {
                            document.getElementById('sessionPlayerScroll')!.style.width = `${((count + 1) / (newData.length - 1)) * 100}%`
                        }
                        else {
                            document.getElementById('sessionPlayerScroll')!.style.width = `${(count)}%`
                        }
                    }
                    // console.log('timeeeeee',newData[count].time)
                    setCurrentTime((prev) => {
                        const individual: individualSessionData = individualSessionDataOfId.data?.data
                        if (!prev) {
                            return '0:0:0'
                        }
                        const splitTime = prev.split(':')
                        let hours = parseInt(splitTime[0])
                        let minutes = parseInt(splitTime[1])
                        let seconds = parseInt(splitTime[2])
                        // console.log(splitTime)
                        if ((count == 0)) {
                            if ((seconds + 1) == 60) {
                                if ((minutes + 1) == 60) {
                                    hours += 1
                                }
                                else {
                                    minutes += 1
                                }
                                seconds = 0
                            }
                            else {
                                seconds += 1
                            }
                            return `${hours}:${minutes}:${seconds}`
                        }
                        else {
                            if (newData[count].time == newData[count - 1].time) {
                                return prev
                            }
                            else {
                                if ((seconds + 1) == 60) {
                                    if ((minutes + 1) == 60) {
                                        hours += 1
                                    }
                                    else {
                                        minutes += 1
                                    }
                                    seconds = 0
                                }
                                else {
                                    seconds += 1
                                }
                                return `${hours}:${minutes}:${seconds}`
                            }
                        }
                        // if ((seconds + 1) == 60) {
                        //   if ((minutes + 1) == 60) {
                        //     hours += 1
                        //   }
                        //   else {
                        //     minutes += 1
                        //   }
                        //   seconds = 0
                        // }
                        // else {
                        //   seconds += 1
                        // }
                        // return `${hours}:${minutes}:${seconds}`
                    })
                    // setCurrentTime(new Date(parseInt(newData[count].sessiontime)).toLocaleTimeString())
                    // console.log(new Date(parseInt(newData[count].sessiontime)).toLocaleTimeString(),newData[count],count)
                    count += 1
                }
            }, 20)
            intervalId = setintervalId


        }
        if (!loading && !getAllSessionDataOfId.isLoading && !individualSessionDataOfId.isLoading) {
            startSession()
            setPlayState(1)
        }
        return () => {
            clearInterval(intervalId)
        }
    }, [loading, getAllSessionDataOfId.isLoading, individualSessionDataOfId.isLoading])

    // console.log('pointer',pointerPosition)
    return (
        <>
            <div className="relative  h-[100vh]">
                <div className="h-full overflow-auto relative">
                    <iframe
                        id="iframe"
                        onLoad={(e: any) => {
                            e.target.contentWindow.onmousemove = (e: any) => {
                                console.log(e)
                            }
                            setLoading(false)
                        }}
                        src={`/api/proxy?url=${Domain}`}
                        className={`w-full h-full object-contain h-full ${loading ? 'invisible' : 'visible'} `}
                    />
                    {!loading && !getAllSessionDataOfId.isLoading && !individualSessionDataOfId.isLoading && <div className="flex flex-col mt-16 ">
                        <div>
                            <div className="flex justify-between">
                                <p>{currentTime}</p>
                            </div>
                            <div className="h-[0.5rem] bg-gray-400 rounded-full shadow-xl">
                                <div id="sessionPlayerScroll" className="h-full bg-blue-500 p-1 w-0 rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex justify-center bg-white shadow-xl rounded-full items-center gap-4 p-2">
                            <button className="relative  block">
                                <MdOutlineKeyboardDoubleArrowLeft className="text-3xl spinner-color" />
                                <span className="absolute right-0 top-[-190%] z-[3] w-max bg-white rounded-full spinner-color p-2 hidden">Back 10 secs</span>
                            </button>
                            <button className="relative block">
                                {playState ? <><FaPause className="text-2xl spinner-color " /><span className="absolute right-[-50%] top-[-250%] z-[3] w-max bg-white rounded-full spinner-color p-2 hidden">Pause</span></> : <><FaPlay className="text-2xl spinner-color " /><span className="absolute right-[-50%] top-[-250%] z-[3] w-max bg-white rounded-full spinner-color p-2 hidden">Play</span></>}
                                {/* <FaPlay className="text-2xl spinner-color " />
                <span className="absolute right-[-50%] top-[-250%] z-[3] w-max bg-white rounded-full spinner-color p-2 hidden">Play</span> */}
                            </button>
                            <button className="relative block">
                                <MdKeyboardDoubleArrowRight className="text-3xl spinner-color" />
                                <span className="absolute left-[10%] top-[-190%] z-[3] w-max bg-white rounded-full spinner-color p-2 hidden">Forward 10 secs</span>
                            </button>
                        </div>
                    </div>}
                    {!startSession && <FaMousePointer style={pointerPosition!} id="pointer" className="absolute top-0 left-0 text-xl text-pink-600" />}
                    <div className="absolute h-full w-full z-10 top-0"></div>
                </div>
                {startSession && <ImSpinner2 className="absolute h-1/4 w-1/2 top-[35%] left-[25%] spinner-color animate-spin" />}
            </div>
        </>
    );
}
