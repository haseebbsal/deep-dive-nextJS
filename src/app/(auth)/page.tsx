import PreLoader from "@/components/main/Preloader";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <div className="flex home-box-shadow flex-col items-center gap-4 border border-2  rounded-xl px-40 py-8">
                <Image src={'/images/icons/Dashicon.ico'} className="object-cover" alt="Logo" width={150} height={150} />
                <h1 className=" text-5xl font-bold">DEEP DIVE</h1>
                <Link href={'/auth/signup'} className="home-link px-4 py-2 w-full text-center border border-2 rounded">Sign Up</Link>
                <h1 className=" text-xl ">Already Have An Account?</h1>
                <Link href={'/auth/login'} className="home-link px-4 py-2 w-full text-center border border-2 rounded ">Log In</Link>
            </div>
            <PreLoader/>
        </>
    )
}