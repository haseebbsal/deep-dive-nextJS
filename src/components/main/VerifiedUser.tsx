import Link from "next/link";

export default function Verified({name}:{name:string}) {
    return (
        <>
            <div className="flex flex-col  items-center gap-4">
                <h1 className="text-2xl">Welcome {name}</h1>
                <p>Please Login To Explore The Possibilities Within DEEP DIVE ANALYTICS</p>
                <Link href={'/auth/login'} className="home-link px-4 py-2 w-full text-center border border-2 rounded">Login Now</Link>
            </div>
        </>
    )
}