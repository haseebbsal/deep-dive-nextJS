import { NextRequest, NextResponse } from "next/server";
const startDBConnection = require('../../../../../database/db-connection')
export async function GET(req:NextRequest,{params:{id}}:{params:{id:string}}) {
    const client = startDBConnection()
    try {
        const allSessionDataQueryId = await client.query(`Select * from client_interaction_data where sessionid=$1`, [id])
        await client.end()
        return NextResponse.json({ data:allSessionDataQueryId.rows,status:1 })
    }
    catch(e) {
        console.log(e)
        console.log(`error in retrieving all session data of ${id}`)
        return NextResponse.json({ status: 0 })
    }
    
}