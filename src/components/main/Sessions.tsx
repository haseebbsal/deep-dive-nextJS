'use client'
import { Select,SelectItem } from "@nextui-org/select";
import { useEffect, useState } from "react";
import { useInfiniteQuery } from "react-query";
import Cookies from "js-cookie";
import Link from "next/link";
type DomainsData={domains:string}[]
export default function SessionContainer({ domainsData,userid }: { domainsData: DomainsData,userid:any }) {
    const [activeDomain, setActiveDomain] = useState(domainsData[0])
    // let userId:number;
    // if (window) {
    //     userId = JSON.parse(Cookies.get('userData')!).userid
    // }
    // const userId = JSON.parse(Cookies.get('userData')!).userid

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isLoading,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery(['sessions', userid, activeDomain?.domains], ({ queryKey, pageParam = 0 }) => fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sessions/${queryKey[1]}?page=${pageParam}&domain=${queryKey[2]}`).then(e => e.json()), {
        getNextPageParam: (lastPage, pages) => {
            console.log('lastpage', lastPage)
            return lastPage.next
        },
        enabled:!!activeDomain
    })
    console.log('hasNextPage',hasNextPage)
    // const sessions = useQuery(['sessions',userid,activeDomain.domains], ({queryKey}) => fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sessions/${queryKey[1]}/${queryKey[2]}`).then(e=>e.json()))
    if (!domainsData.length) {
        return 'no domains exist'
    }
    console.log('actual data',data)
    return (
        <>
            <div className="flex justify-end">
                <Select
                    variant={"underlined"}
                    label="Select Domain"
                    selectedKeys={[activeDomain.domains]}
                    className="max-w-xs bg-transparent!"
                    onChange={(e) => {
                        const value = e.target.value
                        if (value != '') {
                            setActiveDomain({ domains:value })
                        }
                    }}
                >
                    {domainsData.map((animal) => (
                        <SelectItem className="bg-transparent!" key={animal.domains} value={animal.domains}>
                            {animal.domains}
                        </SelectItem>
                    ))}
                </Select>
            </div>
            <div className="flex flex-col items-center mt-8 gap-2">
                {isLoading && <p>Fetching Sessions..</p>}
                {!isLoading && !isFetching && data?.pages[0].data.length==0 && <p>No Sessions On This Domain</p>}
                {data?.pages.map((page) => {
                    return page.data.map((dataPage: any) => <Link href={`sessions/${dataPage.sessionid}?domain=${activeDomain.domains}`}>{dataPage.sessionid}</Link>)
                })
                }
                {hasNextPage && <button disabled={isFetching} onClick={() => { fetchNextPage() }}>{isFetching ? 'loading...' : 'Fetch Next'}</button>}
            </div>
            {/* <div>
            {hasNextPage && <button disabled={isFetching} onClick={() => { fetchNextPage() }}>{isFetching ? 'loading...' :'Fetch Next'}</button>}
            </div> */}
        </>
    )
}

