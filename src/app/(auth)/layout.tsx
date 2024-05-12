import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';


export default function LoginSignUpLayout({ children }: {children:React.ReactNode}) {
    
    return (
            <div className={`  h-[100vh] flex justify-center items-center text-white relative`}>
                <div className='absolute w-full h-full z-[-1]' style={{filter:'blur(5px)'}}>
                    <Image className='w-full h-full object-cover' src={'/images/background-bakh.jpg!w700wp'} alt='bg-deep' width={800} height={1000}/>
            </div>
            <div className=''>
                {children}
            </div>
            <ToastContainer/>
            </div>
    )
    
}