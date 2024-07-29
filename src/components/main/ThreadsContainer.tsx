"use client";
import { Select, SelectItem } from "@nextui-org/select";
import { useEffect, useState } from "react";
import { useInfiniteQuery } from "react-query";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import Image from "next/image";
type DomainsData = { domains: string }[];
export default function ThreadContainer({
    domainsData,
    userid,
}: {
    domainsData: DomainsData;
    userid: any;
}) {
    const [activeDomain, setActiveDomain] = useState(domainsData[0]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isLoading,
    }: {
        data: any,
        fetchNextPage: any,
        hasNextPage?: any,
        isFetching: any,
        isLoading: any
    } = useInfiniteQuery(
        ["sessions", userid, activeDomain?.domains],
        ({ queryKey, pageParam = 0 }) =>
            fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/sessions/${queryKey[1]}?page=${pageParam}&domain=${queryKey[2]}`
            ).then((e) => e.json()),
        {
            getNextPageParam: (lastPage, pages) => {
                return lastPage.next;
            },
            enabled: !!activeDomain,
        }
    );
    if (!domainsData.length) {
        return "no domains exist";
    }

    return (
        <>
            <div className="flex justify-end">
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
                    {domainsData.map((animal) => (
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

            {isLoading && <p className="text-center">Fetching Threads..</p>}
            {!isLoading && !isFetching && data?.pages[0].data.length === 0 && (
                <p className="text-center">No Threads On This Domain</p>
            )}
            {
                data?.pages[0].data.length !== 0 && !isLoading && <div className="flex flex-col items-center mt-8 gap-2">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Session ID</th>
                                <th>Date</th>
                                <th>Suspicious Activity</th>
                            </tr>
                        </thead>
                        <tbody className="table-hover">
                            {data?.pages.map((page: any) =>
                                page.data.map((dataPage: any,index:number) => {
                                    const newStartedAt = new Date(parseInt(dataPage.startedat))
                                    const endedAt = new Date(parseInt(dataPage.endedat))
                                    console.log(newStartedAt)
                                    console.log(endedAt)
                                    const newStartedAtMinutes = newStartedAt.getMinutes()
                                    const endedAtMinutes = endedAt.getMinutes()
                                    const newStartedAtSeconds = newStartedAt.getSeconds()
                                    const endedAtSeconds = endedAt.getSeconds()
                                    let realMinutes;
                                    let fakeMinutes;
                                    let seconds;
                                    if (endedAtMinutes == newStartedAtMinutes) {
                                        fakeMinutes = 0
                                        realMinutes = 0
                                    }
                                    else {
                                        fakeMinutes = endedAtMinutes - newStartedAtMinutes
                                    }
                                    seconds = endedAtSeconds < newStartedAtSeconds ? newStartedAtSeconds - endedAtSeconds : endedAtSeconds - newStartedAtSeconds
                                    if (fakeMinutes) {
                                        const minutesToSeconds = fakeMinutes * 60
                                        const removeSecondsFromMinutes = (minutesToSeconds - seconds)
                                        if (removeSecondsFromMinutes < 60) {
                                            realMinutes = 0
                                            seconds = removeSecondsFromMinutes
                                        }
                                        else {
                                            realMinutes = Math.floor((minutesToSeconds - seconds) / 60)
                                            seconds = (minutesToSeconds - seconds)
                                            seconds = seconds < 60 ? (60 * realMinutes) - seconds : seconds - (60 * realMinutes)
                                        }
                                        console.log('fake', fakeMinutes, minutesToSeconds)
                                        // console.log('seconds', seconds)
                                        // realMinutes = Math.floor((minutesToSeconds - seconds) / 60)
                                        // seconds = (minutesToSeconds - seconds)
                                        // seconds = seconds < 60 ? 60 - seconds : seconds - 60
                                        // console.log((minutesToSeconds - seconds))
                                        // console.log((minutesToSeconds - seconds) -60)
                                        // realMinutes=Math.floor((minutesToSeconds-seconds)/60)
                                    }
                                    console.log('realMinutes', realMinutes)
                                    console.log('seconds', seconds)
                                    // console.log(seconds)
                                    // const pmConst = 12
                                    // const pmMapping:{[index:number]:number} = { 13: 1, 14: 2, 15: 3, 16: 4, 17: 5, 18: 6, 19: 7, 20: 8, 21: 9, 22: 10, 23: 11 }
                                    // const newStartedAt = new Date(parseInt(dataPage.startedat)).getHours()
                                    // const endedAt = new Date(parseInt(dataPage.endedat)).getHours()
                                    // const isPmActualTime = newStartedAt > 12 ? pmMapping[newStartedAt] : newStartedAt
                                    // const isAmActualTime = endedAt > 12 ? pmMapping[endedAt] : endedAt
                                    // let hoursToDisplay:number
                                    // if ((isPmActualTime !== newStartedAt)&& (isAmActualTime==endedAt)) {
                                    //   const pmDifference = pmConst - isPmActualTime
                                    //   hoursToDisplay=pmDifference+endedAt
                                    // }
                                    // else if ((isAmActualTime !== endedAt) && (isPmActualTime == newStartedAt)) {
                                    //   const pmDifference = pmConst - newStartedAt
                                    //   hoursToDisplay = pmDifference + endedAt
                                    // }
                                    // else {
                                    //   hoursToDisplay = endedAt-newStartedAt
                                    // }
                                    return (
                                        <tr key={dataPage.sessionid} className="relative">
                                            <td>
                                                <Link
                                                    className="text-black"
                                                    href={`sessions/${dataPage.sessionid}?domain=${activeDomain.domains}`} >{dataPage.sessionid}</Link>
                                            </td>
                                            <td>{new Date(parseInt(dataPage.startedat)).toLocaleDateString()}</td>
                                            {/* <td>{new Date(parseInt(dataPage.startedat)).getHours()}</td>
                      <td>{new Date(parseInt(dataPage.endedat)).getHours()}</td>
                      <td>{new Date(parseInt(dataPage.startedat)).getMinutes()}</td>
                      <td>{new Date(parseInt(dataPage.endedat)).getMinutes()}</td> */}
                                            <td>{index%2==0?'Yes':'No' }</td>

                                            {/* <td>{hoursToDisplay}:{new Date(parseInt(dataPage.startedat)).getMinutes() > new Date(parseInt(dataPage.endedat)).getMinutes() ? new Date(parseInt(dataPage.startedat)).getMinutes() - new Date(parseInt(dataPage.endedat)).getMinutes() : new Date(parseInt(dataPage.endedat)).getMinutes() - new Date(parseInt(dataPage.startedat)).getMinutes()}:{new Date(parseInt(dataPage.startedat)).getSeconds() > new Date(parseInt(dataPage.endedat)).getSeconds() ? new Date(parseInt(dataPage.startedat)).getSeconds() - new Date(parseInt(dataPage.endedat)).getSeconds() : new Date(parseInt(dataPage.endedat)).getSeconds() - new Date(parseInt(dataPage.startedat)).getSeconds()}</td> */}
                                            {/* <td className="flex items-center gap-2">
                                                <p className="m-0">{dataPage.country}</p>
                                                <div className="h-[2rem] w-[2rem] ">
                                                    <Image className="w-full h-full" src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/${dataPage.countrycode.toLowerCase()}.svg`} width={50} height={50} alt={`${dataPage.country} flag`} />
                                                </div>
                                            </td> */}
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>

                    {/* Fetch Next Page Button */}
                    {hasNextPage && (
                        <button
                            disabled={isFetching}
                            onClick={() => {
                                fetchNextPage();
                            }}
                        >
                            {isFetching ? "Loading..." : "Fetch Next"}
                        </button>
                    )}
                </div>
            }

            {/* <div>
            {hasNextPage && <button disabled={isFetching} onClick={() => { fetchNextPage() }}>{isFetching ? 'loading...' :'Fetch Next'}</button>}
            </div> */}
        </>
    );
}
