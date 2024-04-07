import { NextRequest, NextResponse } from "next/server";
const startDBConnection = require('../../../../database/db-connection')
const bcrypt = require('bcrypt')
const pgp = require('pg-promise')()
const jose = require('jose')
const nodemailer = require('nodemailer')

export  async function POST(request: NextRequest) {
    const { name, email, password } = await request.json()

    const client = startDBConnection()
    try {
        const data = await client.query(`SELECT * FROM usersignup WHERE email='${email}'`)
        const user = data.rows[0];
        // console.log("User >> ", user)
        if (user) {
            await client.end()
            return NextResponse.json({
                message: "email already exists"
            })
        }
        else {

            try {
                // console.log("Password In signup >>", password)
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                // console.log("Password In DB Hashed >>", hashedPassword)
                // Execute SQL query to insert a new user
                const secret = jose.base64url.decode(process.env.jwt_secret)
                const jwt = await new jose.EncryptJWT({ name,email,hashedPassword})
                    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
                    .setIssuedAt()
                    .setExpirationTime('2h')
                    .encrypt(secret)
                console.log(jwt)

                const gmail_password = 'uuph pxtp uuvx yiwd'
                const daddys_email = 'bakhtiyarmalik7@gmail.com'

                let config = {
                    service: 'gmail', // your email domain
                    auth: {
                        user: daddys_email,   // your email address
                        pass: gmail_password // your password
                    }
                }
                let transporter = nodemailer.createTransport(config);


                let message = {
                    from: daddys_email, // sender address
                    to: email, // list of receivers
                    subject: 'Welcome To Deep-Dive Analytics!', // Subject line
                    html: `<b>Hey There Deep-Dive Member.  To Verify Your Account Please Follow The Link <a href='${process.env.BASE_URL}/auth/verify?token=${jwt}'>Verify Now</a>  </b>`, // html body
                };

                try {

                    const data = await transporter.sendMail(message)
                    console.log(data)
                    // {
                    //     msg: "Email sent",
                    //         info: info.messageId,
                    //             preview: nodemailer.getTestMessageUrl(info)
                    // }
                }
                catch {
                    console.log('error in sending email')
                }
                await client.end()
                return NextResponse.json({
                    message: "success"
                })
            }
            catch (error) {
                await client.end()
                console.error('Error during signup:', error);
                return NextResponse.json({
                    message: "Failed"
                })
            }
        }
    }
    catch {
        await client.end()
        return NextResponse.json({
            message: "Failed"
        })
    }
    
    
}