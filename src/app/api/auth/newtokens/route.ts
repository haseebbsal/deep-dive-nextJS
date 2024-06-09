import { NextRequest, NextResponse } from "next/server";
let clientDB=require('../../../../database/db-connection')
export async function POST(request: NextRequest) {
    const client = clientDB()
    const { refreshToken,newRefreshToken, userid } = await request.json()
    try {
        const data = await client.query(`SELECT * FROM usersignup WHERE id='${userid}'`)
        const user = data.rows[0];
        if (user) {
            console.log(refreshToken,user.refreshtoken)
            if (user.refreshtoken == refreshToken) {
                let updateValues = [userid, newRefreshToken];
                const queryUpdate = `UPDATE usersignup SET refreshtoken=$2  WHERE id = $1  `
                await client.query(queryUpdate, updateValues);
                console.log('refresh token updated again')
                await client.end()
                return NextResponse.json({
                    message:'success'
                })
            }
            else {
                await client.end()
                console.log('here')
                return NextResponse.json({
                    message: 'fail'
                })

            }

        } else {
            await client.end()
            console.log('no here')
            return NextResponse.json({
                message: 'fail'
            })
        }
    }
    catch {
        await client.end()
        console.log('no actually here')
        return NextResponse.json({
            message: 'fail'
        })
    }
}