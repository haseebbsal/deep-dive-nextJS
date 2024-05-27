import Link from "next/link"
import Login from "@/components/auth/login"
import SignUp from "@/components/auth/signup"
import { notFound } from "next/navigation"
const Authlinks=['login','signup']
export default function LoginOrSignUp({ params }: { params: { loginorsignup: string } }) {
    const { loginorsignup } = params
    !Authlinks.includes(loginorsignup)?notFound():''
    return (
        <>
            <div className=" home-box-shadow rounded border border-2 flex flex-col gap-8  items-center p-16">
                <div className="flex border w-full border-solid border-white rounded ">
                    <Link href={'/auth/login'} className={loginorsignup == 'login' ? 'bg-[#00c9c8] px-6 py-2 rounded justify-center flex items-center w-1/2 !text-blue' :'px-6 py-2 justify-center flex items-center rounded w-1/2 '}>Login</Link>
                    <Link href={'/auth/signup'} className={loginorsignup == 'signup' ? 'bg-[#00c9c8] px-6 py-2 rounded justify-center flex items-center  w-1/2' : 'px-6 py-2 justify-center rounded flex items-center w-1/2'}>Sign Up</Link>
                </div>
                {
                    loginorsignup=='login'?<Login/>:<SignUp/>
                }
                
            </div>
        </>
    )
    
}