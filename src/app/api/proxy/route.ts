import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const weburl = request.nextUrl.searchParams.get('url')!
    const data = await fetch(weburl)
    let websiteResponse = await data.text()
    websiteResponse = websiteResponse.replaceAll(weburl, `http://localhost:7080/${weburl.split('//')[1]}`)

    return new NextResponse(websiteResponse, {
        headers: {
            'Content-Type':'text/html'
        }
    })
}