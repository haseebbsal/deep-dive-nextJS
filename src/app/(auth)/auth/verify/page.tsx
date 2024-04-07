import Unverified from "@/components/main/UnverifiedUser"
import Verified from "@/components/main/VerifiedUser"

export default async function Verify({ searchParams: { token } }: { searchParams: { token: string } }) {
    console.log(token)
    const data = await fetch(`${process.env.BASE_URL}/api/auth/verify?token=${token}`)
    const verifyResponse:{name?:string,message:string} = await data.json()
    const verified=verifyResponse.message=='success'?true:false

    return (
        <>
            {verified ? <Verified name={verifyResponse.name!} />:<Unverified/>}
        </>
    )
}