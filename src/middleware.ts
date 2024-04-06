import { NextRequest, NextResponse } from "next/server";
const jose = require('jose')



const protectedRoutes = ['/dashboard', '/sessions', '/heatmaps']
async function AuthMiddleware(request: NextRequest) {
    const accessToken = request.cookies.get('accessToken')
    const path = request.nextUrl.pathname
    if (!accessToken && protectedRoutes.includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/auth/login',request.nextUrl.origin))
    }
    if (accessToken) {
        const secret = new TextEncoder().encode(process.env.jwt_secret)
        try {
            const { payload } = await jose.jwtVerify(accessToken.value, secret)
            if (!(protectedRoutes.includes(path)) && !(path.includes('/api'))) {
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
                if (responsedata.message == 'success') {
                    if (!(protectedRoutes.includes(path)) && !(path.includes('/api'))) {
                        const response = NextResponse.redirect(new URL('/dashboard', request.nextUrl.origin))
                        response.cookies.set('accessToken', newaccessToken)
                        response.cookies.set('refreshToken', newRefreshToken)
                        return response
                    }
                    const response = NextResponse.next()
                    response.cookies.set('accessToken', newaccessToken)
                    response.cookies.set('refreshToken', newRefreshToken)
                    return response
                }
                else {
                    const response = NextResponse.redirect(new URL('/auth/login', request.nextUrl.origin))
                    response.cookies.delete('accessToken')
                    response.cookies.delete('refreshToken')
                    response.cookies.delete('userData')
                    return response
                }
            }
            catch(e) {
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
        '/api/:path*',
        '/dashboard',
        '/sessions',
        '/heatmaps'
    ]
}