// 'use client';
// import { useEffect } from 'react'
// import Cookies from 'js-cookie';

import SessionContainer from "@/components/main/Sessions"
import { cookies } from "next/headers"
type UserData = {
    name: string,
    userid:number
}
export const dynamic='force-dynamic'
type DomainsData = { domains: string }[]
export default async function Sessions() {
    const cookie = cookies()
    const userData = JSON.parse(cookie.get('userData')!.value) as UserData
    const userId = userData.userid
    console.log(userId)
    const data = await fetch(`${process.env.BASE_URL}/api/domains/${userId}`,{cache:'no-cache'})
    const domainsData: DomainsData = await data.json()
    // console.log(domainsData)
    
    // const domain = 'https://mocciani.com.pk'
    // Cookies.set('deep_domain', domain)
    // https://www.metroshoes.com.pk
    // https://mocciani.com.pk
    // useEffect(() => {
    //     // window.on
    //     window.onbeforeunload = async (e) => {
    //         // windo
    //         // console.log(e)
    //         window.onbeforeunload=null

    //         Cookies.remove('deep_domain')
    //     }
        
    //     return () => {
    //         Cookies.remove('deep_domain')
    //     }
    // },[])
    // 'https://www.metroshoes.com'
    return (
        <>
            <SessionContainer userid={userId} domainsData={domainsData}/>
            {/* <iframe src={`/api/proxy?url=${domain}`}  width={400} height={400}/> */}
        </>
    )
}