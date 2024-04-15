import { NextRequest, NextResponse } from "next/server";
const { Readable } = require('stream')
export async function GET(request: NextRequest) {
    console.log(request.url)
    // console.log(request.nextUrl.searchParams)
    // console.log(request.nextUrl.searchParams.getAll('url'))
    let url:string;
    try {
        url = request.nextUrl.searchParams.get('url')!
        
    }
    catch {
        console.log('gando you are')
    }
    // console.log(url)
    let data: any;
    async function Fetching() {
        try {
            
            data = await fetch(`${url}`)
            
        }
        catch {
            Fetching()
        }
    }
    await Fetching()
    let contType: string='';
    try {
        contType = data.headers.get('content-type')
        console.log(contType)
    }
    catch {
        console.log('double gando you are')
    }
    // res.set('Content-Type', data.headers.get('content-type'));

    if (contType.includes('image')) {
        const imageBuffer = await data.arrayBuffer();
        return new NextResponse(Buffer.from(imageBuffer), {
            headers: {
                'Content-Type':contType
        }})
        // res.send(Buffer.from(imageBuffer));
        // return
    }
    else if (contType.includes('font')) {
        // console.log(req.url)
        console.log(contType)
        const buffer = Buffer.from(await data.arrayBuffer())
        const stream = new Readable()
        stream.push(buffer)
        stream.push(null)
        stream.pipe(NextResponse)
        return
    }
    else {
        data = await data.text()
    }
    return new NextResponse(data, {
        headers: {
            'Content-Type': contType
        }
    })
}