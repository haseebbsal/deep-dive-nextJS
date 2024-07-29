import { NextRequest, NextResponse } from "next/server";
let clientDB = require('../../../database/db-connection')
type DatabaseData = {
    x_cordinate: number,
    y_cordinate: number,
    scrolly: string
}
type HeatMap = {
    x: number,
    y: number,
    value?: number,
}
export async function GET(req: NextRequest) {
    const client = clientDB()
    const domain = req.nextUrl.searchParams.get('url')
    const scrolly = parseFloat(req.nextUrl.searchParams.get('scrollPos')!)
    const secondScrollY=scrolly+800
    let heatmapCount:HeatMap[]=[]
    const getDomainInteractionData = await client.query('select * from client_interaction_data where domain=$1 order by id', [domain])
    let filteredData:HeatMap[] = []
    let currentscroll=0
    for (let k of getDomainInteractionData.rows) {
        let data = k as DatabaseData
        console.log(typeof data.scrolly)
        let scroll = data.scrolly ? parseFloat(data.scrolly) : 0
        if (typeof data.scrolly=='number') {
            currentscroll = scroll
        }
        if ((currentscroll >= scrolly && currentscroll <= secondScrollY) && data.x_cordinate) {
            filteredData = [...filteredData, { x: data.x_cordinate, y: data.y_cordinate}]
        }
        // console.log('scroll data',scroll)
        // if (typeof data.scrolly == 'object' && (currentscroll >= scrolly && currentscroll <= secondScrollY)) {
        //     filteredData = [...filteredData, { x: data.x_cordinate, y: data.y_cordinate, scrolly: data.scrolly }]
        // }
        // else if (scroll <= secondScrollY && scroll >= scrolly ) {
        //     filteredData = [...filteredData, { x: data.x_cordinate, y: data.y_cordinate, scrolly: data.scrolly }]
        //     currentscroll=scroll
        // }
        // else if (!currentscroll) {
        //     continue
        // }
        // else {
        //     break
        // }
    }

    console.log(filteredData)
    
    // for (let j of getDomainInteractionData.rows) {
    //     const finding = heatmapCount.find((e) => e.x == j.x_cordinate && e.y == j.y_cordinate)
    //     if (finding) {
    //         heatmapCount = heatmapCount.map((e) => {
    //             if (e.x == finding.x && e.y == finding.y) {
    //                 e.value += 1
    //                 return e
    //             }
    //             return e
    //         })
    //     }
    //     else {
    //         if (j.x_cordinate!=null) {
    //             heatmapCount=[...heatmapCount,{x:parseInt(j.x_cordinate),y:parseInt(j.y_cordinate),value:1}]
    //         }
    //     }
    // }
    // console.log(heatmapCount)
    await client.end()
    return NextResponse.json(filteredData)
}