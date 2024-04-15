async function domainVerify(userid:number,domain:string) {
    const domainVerifyCredentials = {
        userid,
        domain
    }
    const data = await fetch('/api/domainVerification', { method: 'POST', body: JSON.stringify(domainVerifyCredentials), headers: { "Content-Type": "application/json" } })
    return data
}

export {domainVerify}