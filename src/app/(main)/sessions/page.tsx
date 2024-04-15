'use client';
import { useEffect } from 'react'
import Cookies from 'js-cookie';
export const dynamic='force-dynamic'
export default  function Sessions() {
    const domain = 'https://computerpartshq.com'
    Cookies.set('deep_domain', domain)
        
    useEffect(() => {
        
        
        return () => {
            Cookies.remove('deep_domain')
        }
    },[])
    // 'https://www.metroshoes.com'
    return (
        <>
            <p className="text-center">
                Sessions
            </p>
            <iframe src={`/api/proxy?url=${domain}`}  width={400} height={400}/>
        </>
    )
}