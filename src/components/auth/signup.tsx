'use client';

import { signUpAPI } from "@/apis/auth";
import { useRouter } from "next/navigation";

export default function SignUp() {
    const router=useRouter()

    async function handleSubmit(e:any) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const data = [...formData.entries()]
        console.log(data)
        if (await signUpAPI(data)) {
            setTimeout(() => {
                router.push('/auth/login')
            }, 2000)
        }
        
    }
    return (
        <>
            <form className="flex flex-col w-full gap-6" onSubmit={handleSubmit}>
                <div className="flex gap-2 items-center">
                    <label htmlFor="name" className="w-[50%]">Full Name:</label>
                    <input type="text" name="name" autoComplete='name' id="name" className="w-full text-black p-1" />
                </div>
                <div className="flex gap-2 items-center">
                    <label htmlFor="email" className="w-[50%]">Email:</label>
                    <input type="text" autoComplete='email' name="email" id="email" className="w-full text-black p-1" />
                </div>
                <div className="flex gap-2 items-center">
                    <label htmlFor="password" className="w-[50%]">Password:</label>
                    <input type="password" autoComplete='current-password' name="password" id="password" className="w-full text-black p-1" />
                </div>
                <button type="submit" className="rounded p-1.5 bg-transparent text-white border-solid border-white border font-bold">Sign Up</button>
            </form>
        </>
    )
}