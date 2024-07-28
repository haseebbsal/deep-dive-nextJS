// import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
const jose = require('jose')



const protectedRoutes = ['/dashboard', '/sessions', '/heatmaps']
async function AuthMiddleware(request: NextRequest) {
    const accessToken = request.cookies.get('accessToken')
    const userData = request.cookies.get('userData')
    const path = request.nextUrl.pathname
    console.log('path',path)
    if ((!accessToken) && (protectedRoutes.includes(path))) {
        console.log('im hereeeeeeeeee')
        return NextResponse.redirect(new URL('/auth/login',request.nextUrl.origin))
    }
    if (accessToken) {
        const secret = new TextEncoder().encode(process.env.jwt_secret)
        try {
            const { payload } = await jose.jwtVerify(accessToken.value, secret)
            if (!(protectedRoutes.includes(path))&& !path.includes('/sessions')) {
                console.log('over here',path)
                return NextResponse.redirect(new URL('/dashboard', request.nextUrl.origin))
            }
            console.log('accessToken payload',payload)
        }

        catch {
            console.log('access token expired')
            const refreshToken = request.cookies.get('refreshToken')?.value
            try {
                const { payload } = await jose.jwtVerify(refreshToken, secret)
                console.log('refreshToken payload', payload)
                const alg = 'HS256'
                const newRefreshToken = await new jose.SignJWT({ id: payload.id, name: payload.name })
                    .setProtectedHeader({ alg })
                    .setIssuedAt()
                    .setExpirationTime(process.env.refresh_token_expiration)
                    .sign(secret)
                const newaccessToken = await new jose.SignJWT({ id: payload.id ,name:payload.name})
                    .setProtectedHeader({ alg })
                    .setIssuedAt()
                    .setExpirationTime(process.env.access_token_expiration)
                    .sign(secret)
                const data = await fetch(`${process.env.BASE_URL}/api/auth/newtokens`, { method:"POST",body: JSON.stringify({ refreshToken, newRefreshToken, userid:payload.id }),headers:{'Content-Type':'application/json'}})
                const responsedata: { message: string } = await data.json()
                console.log('message',responsedata.message,path)
                if (responsedata.message == 'success') {
                    if (!(protectedRoutes.includes(path)) && !(path.includes('/api'))) {
                        const response = NextResponse.redirect(new URL('/dashboard', request.nextUrl.origin))
                        response.cookies.set('accessToken', newaccessToken,{httpOnly:true,sameSite:true})
                        response.cookies.set('refreshToken', newRefreshToken, { httpOnly: true, sameSite: true })
                        return response
                    }
                    const response = NextResponse.next()
                    response.cookies.set('accessToken', newaccessToken,{httpOnly:true,sameSite:true})
                    response.cookies.set('refreshToken', newRefreshToken,{httpOnly:true,sameSite:true})
                    return response
                }
                else {
                    console.log('im here cause of fail')
                    const response = NextResponse.redirect(new URL('/auth/login', request.nextUrl.origin))
                    response.cookies.delete('accessToken')
                    response.cookies.delete('refreshToken')
                    response.cookies.delete('userData')
                    return response
                }
            }
            catch (e) {
                console.log('refresh token expired')
                // console.log(e)
                const response = NextResponse.redirect(new URL('/auth/login', request.nextUrl.origin))
                response.cookies.delete('accessToken')
                response.cookies.delete('refreshToken')
                response.cookies.delete('userData')
                return response
            }
        }

    }
}

export async  function middleware(request: NextRequest) {
   return await AuthMiddleware(request)
}

export const config = {
    matcher: [
        '/auth/login',
        '/auth/signup',
        '/dashboard',
        '/sessions/:path*',
        '/heatmaps'
    ]
}