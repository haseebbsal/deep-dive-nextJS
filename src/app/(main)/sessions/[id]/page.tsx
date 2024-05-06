'use client'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
export default function IndividualSession({ params: { id }, searchParams: { domain } }: { params: { id: string }, searchParams: { domain: string } }) {
    const [loading,setLoading]=useState(true)
    const Domain = domain.includes('http://127.0.0.1:5500') ?'https://1ststep.pk':domain
    Cookies.set('deep_domain', Domain)
    // https://www.metroshoes.com.pk
    // https://mocciani.com.pk
    useEffect(() => {
        setLoading(false)
        window.onbeforeunload = async (e) => {
            window.onbeforeunload=null
            Cookies.remove('deep_domain')
        }
        return () => {
            Cookies.remove('deep_domain')
        }
    }, [])
    if (loading) {
        return 'Loading Session...'
    }
    return (
        <>
            <p>Individual Session</p>
            <div className='relative'>
                <iframe src={`/api/proxy?url=${Domain}`} className='w-full' height={400} />
                <div className='absolute h-full w-full top-0'></div>
            </div>
        </>
    )
}