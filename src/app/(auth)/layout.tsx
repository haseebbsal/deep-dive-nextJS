import { ScriptProps } from "next/script";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginSignUpLayout({ children }: {children:React.ReactNode}) {
    
    return (
            <div className={`main-bg-color h-[100vh] flex justify-center items-center text-white`}>
            {children}
            <ToastContainer/>
            </div>
    )
    
}