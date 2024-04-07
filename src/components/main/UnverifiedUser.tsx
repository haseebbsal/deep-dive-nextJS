import Link from "next/link"
export default function Unverified() {
    return (
        <>
            <div className="flex flex-col items-center gap-4">
                <h1 className="text-2xl">Oops... Your Token Has Expired</h1>
                <p>Sign Up With Us Again</p>
                <Link href={'/auth/signup'} className="home-link px-4 py-2 w-full text-center border border-2 rounded">Sign Up Now</Link>
            </div>
        </>
    )
}