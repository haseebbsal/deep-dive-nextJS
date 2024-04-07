"use client";
import Image from "next/image";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Modal } from "react-bootstrap";
import { toast } from 'react-toastify'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import '../../app/globals.css'
import { useRouter } from "next/navigation";
import { useState, useRef, RefObject } from "react";
import { IoCopy } from "react-icons/io5";
import Cookies from "js-cookie";
import { domainVerify } from "@/apis/main";
import { CiLogout } from "react-icons/ci";
import { loggingOut } from "@/apis/auth";
export default function Navbar() {
    const navigate = useRouter()
    let name;
    let id:number=0;
    try {
        name = JSON.parse(Cookies.get('userData')!).name
        id = JSON.parse(Cookies.get('userData')!).userid
    }
    catch {
        navigate.replace('/auth/login')
    }
    const urlDomain = useRef() as RefObject<HTMLInputElement>
    const script_to_copy = useRef() as RefObject<HTMLInputElement>
    const [showModal, setShowModal] = useState(false);
    const [toggleLogOut, setToggleLogOut] = useState(false)
    const handleAddNewClick = () => {
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    }
    function Copy_script() {

        let copyText = script_to_copy.current! as any
        copyText = copyText.innerText

        navigator.clipboard.writeText(copyText);
        toast.info('Text Copied', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",

        });


    }
    const verifycode = async () => {
        console.log('here URL', urlDomain.current?.value)
        if (!urlDomain.current?.value) {
            toast.error('Please Enter Domain', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",

            });
            return;
        }
        else {
            const domain = new URL(urlDomain.current?.value).host
            const dataVerification = await domainVerify(id, domain)
            if (dataVerification.redirected) {
                toast.success('Session Has Expired..', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",

                });
                setTimeout(() => {
                    navigate.push('/auth/login')
                }, 2000)

            }
            else {
                const verificationData= await dataVerification.json()
                if (verificationData.message == 'domain already exists') {
                    toast.error('Domain Already Exists', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",

                    });
                }
                else if (verificationData.message == 'verified') {
                    toast.success('Verified', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",

                    });
                }
                else {
                    toast.error('Not Verified', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",

                    });
                }
            }
           
        }

    };
    async function logOut() {
        const loggingOutResponse = await loggingOut()
        console.log(loggingOutResponse.redirected)
        if (!loggingOutResponse.redirected) {
            const responseData = await loggingOutResponse.json()
            if (responseData.message == 'success') {
                toast.success('Logging Out...', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",

                });
                setTimeout(() => {
                    navigate.push('/auth/login')
                }, 2000)
            }
            else {
                toast.error('Error In Logging Out', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",

                });
            }

        }
        else {
            toast.success('Session Has Expired...', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",

            });
            setTimeout(() => {
                navigate.push('/auth/login')
            }, 2000)
        }
    }
    return (
        <>
            <div className="flex items-center gap-8 py-2">
                <div className="flex items-center justify-end w-[84%]">
                    <button onClick={handleAddNewClick} className="flex gap-2 items-center">
                        Domain
                        <MdKeyboardArrowRight />
                    </button>
                    
                </div>
                <div className="relative w-[14%]">
                    <div className="flex gap-4 items-center cursor-pointer" onClick={() => {
                        setToggleLogOut(!toggleLogOut)
                    }}>
                        <p>{name}</p>
                        <Image alt="personImg" src={'/images/undraw_profile.svg'} width={35} height={35} />
                    </div>
                    {toggleLogOut && <div className="absolute top-full bg-white w-full px-4 py-2 ">
                        <button className="flex gap-2 items-center" onClick={logOut}> <CiLogout /> Log Out</button>
                    </div>}
                </div>
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton className="Colored">
                    <Modal.Title>Add New Domain</Modal.Title>
                </Modal.Header>
                <Modal.Body>


                    {/* Add your content for the modal body here */}
                    <div className="form-group flex flex-col ">
                        <label htmlFor="domainInput">Domain:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="domainInput"
                            placeholder="Enter domain"
                            ref={urlDomain}
                        />
                        <div className="flex justify-end mt-2" >
                            <IoCopy className="text-xl cursor-pointer" onClick={Copy_script}/>
                        </div>
                        <p ref={script_to_copy} style={{ width: '100%', marginTop: '1rem', height: '10rem', userSelect: 'none' }}>{`<script async window_extracting='deep-dive-analytics' data-id='${id}' src="${window.origin}/js/listening.js"></script>`}</p>
                    </div>
                </Modal.Body>
                <Modal.Footer className="flex gap-1 justify-center">

                    <button type="button" className="btn btn-success" onClick={verifycode}>Verify</button>
                    <button type="button" className="btn btn-primary" onClick={handleCloseModal}>Close</button>
                    
                </Modal.Footer>
            </Modal>
        </>
    )
}