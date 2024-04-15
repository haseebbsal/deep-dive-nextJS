"use client";

import { loginAPI } from "@/apis/auth";
import { useRouter } from "next/navigation";
export default function Login() {
    const navigate = useRouter()
    async function handleSubmit(e: any) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const data = [...formData.entries()]
        const loginResponse = await loginAPI(data)
        if (loginResponse == 'success') {
            setTimeout(() => {
                navigate.replace('/dashboard')
            },2000)
            
        }


    }
    return (
        <>
            <form className="flex flex-col w-full gap-6" onSubmit={handleSubmit}>
                <div className="flex gap-2 items-center">
                    <label htmlFor="email" className="w-[50%]">Email:</label>
                    <input type="text" name="email" autoComplete='email' id="email" className="w-full text-black p-1" />
                </div>
                <div className="flex gap-2 items-center">
                    <label htmlFor="password" className="w-[50%]">Password:</label>
                    <input type="password" name="password" autoComplete='current-password' id="password" className="w-full text-black p-1" />
                </div>
                <button type="submit" className="rounded p-1.5 bg-transparent text-white border-solid border-white border font-bold">Login</button>
            </form>
        </>
    )
}