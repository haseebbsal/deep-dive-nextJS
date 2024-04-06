const { Client } = require('pg')
function startDBConnection() {
    const client = new Client({
        host: process.env.DB_Host,
        user: process.env.DB_User,
        port: process.env.DB_Port,
        password: process.env.DB_password,
        database: process.env.database
    })
    client.connect()
    return client
}

module.exports=startDBConnection