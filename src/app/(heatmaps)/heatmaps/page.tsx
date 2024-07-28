import HeaMapContainer from "@/components/main/HeatmapContainer"
import { cookies } from "next/headers"
type UserData = {
    name: string,
    userid: number
}
type DomainsData = { domains: string }[]
export default async function HeatMaps() {
    const cookie = cookies()
    const userData = JSON.parse(cookie.get('userData')!.value) as UserData
    const userId = userData.userid
    const data = await fetch(`${process.env.BASE_URL}/api/domains/${userId}`, { cache: 'no-cache', credentials: 'include' })
    const domainsData: DomainsData = await data.json()
    console.log(domainsData)
    return (
        <>
            <HeaMapContainer domainsData={domainsData} />
        </>
    )
}