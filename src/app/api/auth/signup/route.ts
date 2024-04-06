import { NextRequest, NextResponse } from "next/server";
const startDBConnection = require('../../../../database/db-connection')
const bcrypt = require('bcrypt')
const pgp = require('pg-promise')()

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
                await client.query('INSERT INTO usersignup(name, email, password) VALUES($1, $2, $3)', [name, email, hashedPassword]);
                console.log('User created successfully');
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