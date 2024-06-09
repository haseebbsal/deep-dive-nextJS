import { NextRequest, NextResponse } from "next/server";
const startDBConnection=require('../../../../../database/db-connection')
export async function GET(req: NextRequest,{params:{id}}:{params:{id:string}}) {
    const client = startDBConnection()
    const data = await client.query('select * from sessionplayer where sessionid=$1', [id])
    await client.end()
    return NextResponse.json(data.rows[0])
}