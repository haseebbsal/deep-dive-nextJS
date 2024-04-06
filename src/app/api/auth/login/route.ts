const startDBConnection = require('../../../../database/db-connection')
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
const jwt = require('jsonwebtoken')
const jwt_secret = process.env.jwt_secret
const accessToken_exp = process.env.access_token_expiration
const refreshToken_exp = process.env.refresh_token_expiration

const bcrypt=require('bcrypt')
type User = { password: string, id: number, name: string, isemailverified: boolean }
export async function POST(request: NextRequest) {
    const client=startDBConnection()
    const { email, password } = await request.json()
    try {
        const data = await client.query(`SELECT * FROM usersignup WHERE email='${email}'`)
        const user: User = data.rows[0] as User;
        console.log("User >> ", user)

        const comparePass = async (enteredPass: string) => {
            const providedPass = enteredPass.toString().trim();
            console.log("User password >> ", user.password)

            try {
                const result = await bcrypt.compare(providedPass, user.password);
                return result;
            } catch (compareError) {
                console.error("Error comparing passwords:", compareError);
                return false;
            }
        }

        if (user) {

            if (!user.isemailverified) {
                await client.end()
                return NextResponse.json({
                    message: 'Email Is Not verified'
                }, { status: 400 })
            }
            else {

                const passwordMatch = await comparePass(password);

                if (passwordMatch) {
                    const cookie=cookies()
                    const accessToken = jwt.sign({ id: user.id,name:user.name}, jwt_secret, { expiresIn: accessToken_exp })
                    const refreshToken = jwt.sign({ id: user.id,name: user.name }, jwt_secret, { expiresIn: refreshToken_exp })
                    let updateValues = [user.id, refreshToken];
                    const queryUpdate = `UPDATE usersignup SET refreshtoken=$2  WHERE id = $1  `
                    await client.query(queryUpdate, updateValues);
                    console.log(`Refresh Token Updated`);
                    cookie.set('accessToken', accessToken)
                    cookie.set('refreshToken', refreshToken)
                    cookie.set('userData', JSON.stringify({ name: user.name, userid: user.id }))
                    await client.end()
                    return NextResponse.json({
                        message: 'success'
                    }, { status: 200 })

                } else {
                    console.log('Password Not Matched');
                    await client.end()
                    return NextResponse.json({
                        message: 'Incorrect Password'
                    }, { status: 400 })
                }

            }

        } else {
            await client.end()
            return NextResponse.json({
                message: 'Email is incorrect'
            }, { status: 400 })
        }
    }
    catch {
        await client.end()
        return NextResponse.json({
            message: 'Failed'
        }, { status: 500 })
    }

}