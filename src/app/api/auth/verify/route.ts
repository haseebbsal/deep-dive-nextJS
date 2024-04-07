import { NextRequest, NextResponse } from "next/server";
const jose=require('jose')
let clientDB = require('../../../../database/db-connection')

export async function GET(request: NextRequest) {
    const client=clientDB()
    const token = request.nextUrl.searchParams.get('token')
    const secret = jose.base64url.decode(process.env.jwt_secret)
    try {
        const { payload } = await jose.jwtDecrypt(token, secret)
        const { name, email, hashedPassword } = payload
        await client.query('INSERT INTO usersignup(name, email, password,isemailverified) VALUES($1, $2, $3,$4)', [name, email, hashedPassword,true]);
        await client.end()
        console.log('User Created Successfully')
        return NextResponse.json({
            message: 'success',
            name

        })
    }
    catch {
        return NextResponse.json({
            message:'fail'
        })
    }
    
}