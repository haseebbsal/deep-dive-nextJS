import SessionContainer from "@/components/main/Sessions"
import ThreadContainer from "@/components/main/ThreadsContainer"
import { cookies } from "next/headers"
type UserData = {
    name: string,
    userid: number
}
type DomainsData = { domains: string }[]
export default async function Thread() {
    const cookie = cookies()
    const userData = JSON.parse(cookie.get('userData')!.value) as UserData
    const userId = userData.userid
    console.log(userId)
    const data = await fetch(`${process.env.BASE_URL}/api/domains/${userId}`, { cache: 'no-cache' })
    const domainsData: DomainsData = await data.json()
    return (
        <>
            {/* hi */}
            <ThreadContainer userid={userId} domainsData={domainsData} />
        </>
    )
}