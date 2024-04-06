import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
const jwt = require('jsonwebtoken')
const clientDB=require('../../../../database/db-connection')
export async function GET(request: NextRequest) {
    const client = clientDB()
    const cookie = cookies()
    const refreshToken = cookie.get('refreshToken')?.value
    try {
        const verifiedRefresh = jwt.verify(refreshToken, process.env.jwt_secret)
        let updateValues = [verifiedRefresh.id];
        const queryUpdate = `UPDATE usersignup SET refreshtoken=null  WHERE id = $1  `
        const data = await client.query(queryUpdate, updateValues)
        await client.end()
        console.log('refresh token deleted')
        cookie.delete('userData')
        cookie.delete('accessToken')
        cookie.delete('refreshToken')
        return NextResponse.json({message:'success'})
    }

    catch (e) {
        console.log(e)
        return NextResponse.json({message:'failed'})
    }
}