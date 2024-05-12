"use client";
import { Select, SelectItem } from "@nextui-org/select";
import { useEffect, useState } from "react";
import { useInfiniteQuery } from "react-query";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
type DomainsData = { domains: string }[];
export default function SessionContainer({
  domainsData,
  userid,
}: {
  domainsData: DomainsData;
  userid: any;
}) {
  const [activeDomain, setActiveDomain] = useState(domainsData[0]);
  const [sessions, setSessions] = useState([]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  }: {
      data: any,
      fetchNextPage:any,
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
        console.log("lastpage", lastPage);
        return lastPage.next;
      },
      enabled: !!activeDomain,
    }
  );
  console.log("hasNextPage", hasNextPage);
  if (!domainsData.length) {
    return "no domains exist";
  }
  console.log("actual data", data);

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

      {isLoading && <p className="text-center">Fetching Sessions..</p>}
      {!isLoading && !isFetching && data?.pages[0].data.length === 0 && (
        <p className="text-center">No Sessions On This Domain</p>
      )}
      {
        data?.pages[0].data.length !== 0 && !isLoading && <div className="flex flex-col items-center mt-8 gap-2">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody className="table-hover">
              {data?.pages.map((page:any) =>
                page.data.map((dataPage: any) => (
                  <tr key={dataPage.sessionid}>
                    <td>
                      <Link
                        href={`sessions/${dataPage.sessionid}?domain=${activeDomain.domains}`}
                      >
                        {dataPage.sessionid}
                      </Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ))
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
