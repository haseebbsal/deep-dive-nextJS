import { NextRequest, NextResponse } from "next/server";
const startDBConnection = require('../../../database/db-connection')
export const dynamic = 'force-dynamic'
import Bowser from 'bowser';
export async function GET(request: NextRequest) {
    const client = startDBConnection()
    const id = request.nextUrl.searchParams.get('userid')
    const domain = request.nextUrl.searchParams.get('domain')
    const total_users = await client.query('SELECT COUNT(user_id) as count FROM useripadd where domain=$1', [domain])
    const total_session = await client.query('SELECT COUNT(id) as count  from sessionplayer where completed=true AND domain=$1 AND userid=$2', [domain, id])
    const user_agent = await client.query('SELECT agent FROM useripadd where domain=$1', [domain])
    const country_count = await client.query("select count(*) as total_count,user_country from useripadd WHERE domain=$1 group by user_country ", [domain])
    const country_list = []
    const country_count_list=[]
    for (let j of country_count.rows) {
        country_list.push(j.user_country)
    }
    for (let j of country_count.rows) {
        country_count_list.push(j.total_count)
    }
    console.log('country',country_count.rows)
    const user_agents =user_agent.rows 
    const unique_agents: any = { mobile: [], desktop: [] }
    user_agents.forEach((e: any) => {
        const parser = Bowser.getParser(e.agent);
        if (parser.getPlatformType() === 'mobile') {
            unique_agents.mobile.push(e.agent)
        } else {
            unique_agents.desktop.push(e.agent)
        }
    }
    )
    let mobileCount = 0
    let desktopCount = 0
    unique_agents.desktop.forEach((e: any) => {
        let count = 0
        user_agents.forEach((j: any) => {
            if (j.agent == e) {
                count += 1
            }
        })
        desktopCount = count
    })
    unique_agents.mobile.forEach((e: any) => {
        let count = 0
        user_agents.forEach((j: any) => {
            if (j.agent == e) {
                count += 1
            }
        })
        desktopCount = count
    })
    await client.end()
    return NextResponse.json({ total_users: total_users.rows[0].count, total_sessions: total_session.rows[0].count, user_agents:user_agents.length==0?[0,0]: [(desktopCount / user_agents.length) * 100, (mobileCount / user_agents.length) * 100],country_total_list:country_count_list,country_list })

}