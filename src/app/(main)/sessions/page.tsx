// 'use client';
// import { useEffect } from 'react'
// import Cookies from 'js-cookie';

import SessionContainer from "@/components/main/Sessions"
import { cookies } from "next/headers"
type UserData = {
    name: string,
    userid:number
}
type DomainsData = { domains: string }[]
export default async function Sessions() {
    const cookie = cookies()
    const userData = JSON.parse(cookie.get('userData')!.value) as UserData
    const userId = userData.userid
    console.log(userId)
    const data = await fetch(`${process.env.BASE_URL}/api/domains/${userId}`,{cache:'no-cache'})
    const domainsData: DomainsData = await data.json()
    return (
        <>
            <SessionContainer userid={userId} domainsData={domainsData}/>
        </>
    )
}