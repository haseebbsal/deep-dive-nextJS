import { NextRequest, NextResponse } from "next/server";
let clientDB = require('../../../database/db-connection')
type HeatMap = {
    x: number,
    y: number,
    value:number
}
export async function GET(req: NextRequest) {
    const client = clientDB()
    const domain = req.nextUrl.searchParams.get('url')
    let heatmapCount:HeatMap[]=[]
    const getDomainInteractionData = await client.query('select * from client_interaction_data where domain=$1', [domain])
    for (let j of getDomainInteractionData.rows) {
        const finding = heatmapCount.find((e) => e.x == j.x_cordinate && e.y == j.y_cordinate)
        if (finding) {
            heatmapCount = heatmapCount.map((e) => {
                if (e.x == finding.x && e.y == finding.y) {
                    console.log('hereeeeeeeeee')
                    e.value += 1
                    return e
                }
                return e
            })
        }
        else {
            if (j.x_cordinate!=null) {
                heatmapCount=[...heatmapCount,{x:parseInt(j.x_cordinate),y:parseInt(j.y_cordinate),value:1}]
            }
        }
    }
    console.log(heatmapCount)
    await client.end()
    return NextResponse.json(heatmapCount)
}