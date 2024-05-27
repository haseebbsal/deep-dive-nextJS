import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';


export default function LoginSignUpLayout({ children }: {children:React.ReactNode}) {
    
    return (
        <div className={`  h-[100vh] flex justify-center items-center text-white relative`} style={{ background:"url('/images/background-bakh.jpg')",backgroundRepeat:"no-repeat",backgroundSize:"cover"}}>
            <div className='absolute w-full h-full z-[1] bg-gray-100 opacity-[0.1] blur-sm' style={{filter:'blur(5px)'}}>
            </div>
            <div className='z-[2]'>
                {children}
            </div>
            <ToastContainer/>
            </div>
    )
    
}