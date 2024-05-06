import { NextRequest, NextResponse } from "next/server";
const startDBConnection=require('../../../../database/db-connection')

export const dynamic='force-dynamic'
export async function GET(request:NextRequest,{params:{id}}:{params:{id:number}}) {
    const client = startDBConnection()
    const domain = request.nextUrl.searchParams.get('domain')!
    const data = await client.query('SELECT  * from sessionplayer WHERE userid=$1 AND domain=$2 AND completed=true', [id, domain])
    const counting_data = await client.query('SELECT COUNT(id) from sessionplayer WHERE userid=$1 AND domain=$2 AND completed=true', [id, domain])
    await client.end()
    const total_count = counting_data.rows[0].count
    const limit = 3
    const pageNum = parseInt(request.nextUrl.searchParams.get('page')!)
    const actualData = data.rows
    const startIndex = pageNum * limit
    const endIndex=startIndex+limit
    const pageData = actualData.slice(startIndex, endIndex)
    if (endIndex >= total_count) {
        return NextResponse.json({ data: pageData })
    }
    return NextResponse.json({ data: pageData, next: pageNum + 1 })
    
}