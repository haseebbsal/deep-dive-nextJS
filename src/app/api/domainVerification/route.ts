import { NextRequest, NextResponse } from "next/server";
let clientDB=require('../../../database/db-connection')
export async function POST(request: NextRequest) {
    const client = clientDB()
    const { userid, domain } = await request.json();
    let response;
    const dataQuery = await client.query(`SELECT * FROM userdomains WHERE userid='${userid}' AND domains='${domain}'`)
    if (dataQuery.rows.length > 0) {
        const data = dataQuery.rows[0].isverified
        if (data) {
            response = NextResponse.json({ message: 'domain already exists' })
        }
        else {
            let updateValues = [userid, domain, true];
            const queryUpdate = `UPDATE userdomains SET isverified=$3  WHERE userid = $1 AND domains = $2 `
            try {
                const secondDataQuery = await client.query(queryUpdate, updateValues)
                response = NextResponse.json({ message: 'verified' })
            }
            catch {
                response = NextResponse.json({ message: 'unverified' })
            }
        }
    }
    else {
        response = NextResponse.json({ message: 'unverified' })
    }
    await client.end()
    return response;
}