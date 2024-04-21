import { NextRequest, NextResponse } from "next/server";
const startDBConnection = require('../../../../database/db-connection')
export const dynamic='force-dynamic'
export async function GET(request:NextRequest,{params:{id}}:{params:{id:number}}) {
    const client = startDBConnection()
    const data = await client.query('SELECT domains from userdomains WHERE userid=$1', [id])
    await client.end()
    return NextResponse.json(data.rows)
    
}