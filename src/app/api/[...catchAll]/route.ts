import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest, { params:{catchAll} }: { params: { catchAll: string[] } }) {
    const url = catchAll.join('/')
    const baseurl = cookies().get('deep_domain')?.value!
    let data: any
    // console.log('get domain url', catchAll)
    // console.log(baseurl)
    const extensions = [
        ".aac", ".abw", ".apng", ".arc", ".avif", ".avi", ".azw", ".bin", ".bmp", ".bz", ".bz2", ".cda",
        ".csh", ".css", ".csv", ".doc", ".docx", ".eot", ".epub", ".gz", ".gif", ".htm", ".html", ".ico",
        ".ics", ".jar", ".jpeg", ".jpg", ".js", ".json", ".jsonld", ".mid", ".midi", ".mjs", ".mp3", ".mp4",
        ".mpeg", ".mpkg", ".odp", ".ods", ".odt", ".oga", ".ogv", ".ogx", ".opus", ".otf", ".png", ".pdf",
        ".php", ".ppt", ".pptx", ".rar", ".rtf", ".sh", ".svg", ".tar", ".tif", ".tiff", ".ts", ".ttf",
        ".txt", ".vsd", ".wav", ".weba", ".webm", ".webp", ".woff", ".woff2", ".xhtml", ".xls", ".xlsx",
        ".xml", ".xul", ".zip", ".3gp", ".3g2", ".7z", ".jfif"
    ];
    if (!baseurl) {
        return redirect('/')
    }
    // else {
    //     if (!(url.includes(baseurl.split('//')[1]))) {
    //         const findingExtension = extensions.find((e) => url.includes(e))
    //         if (!findingExtension) {
    //             notFound()
    //         }
    //     }
    // }
   
    if (url.includes(baseurl.split('//')[1])) {
        let new_url = url.split(baseurl.split('//')[1])[1]
        data = await fetch(`${baseurl}${new_url}`)
        // console.log('new url')
        // console.log(`${baseurl}${new_url}`)
    }
    else {
        data = await fetch(`${baseurl}/${url}`)
        // console.log('normal url')
        // console.log(`${baseurl}/${url}`)
    }
    
    
        

    let contType: string = '';
    try {
        contType = data.headers.get('content-type')!
    }
    catch {
        console.log('double gando you are')
    }

    

    // console.log(`${baseurl}/${url}`, 'content type', contType)
    // console.log('cont type',contType)
    

    const findingExtension = extensions.find((e) => url.includes(e))
    if (!findingExtension) {
        data = await data.text()
        // baseurl.split('//')[1]
        data = data.replaceAll(baseurl, `http://localhost:7080/${baseurl.split('//')[1]}`)
        data = data.replaceAll('href="/"', `href="http://localhost:7080/${baseurl.split('//')[1]}"`)

        return new NextResponse(data, {
            headers: {
                'Content-Type': 'text/html'
            }
        })
        
    }
    
    if (url.endsWith('.jfif')) {
        const imageBuffer = await data.arrayBuffer();
        return new NextResponse(Buffer.from(imageBuffer))
    }

    if (contType.includes('image')) {
        const imageBuffer = await data.arrayBuffer();
        return new NextResponse(Buffer.from(imageBuffer), {
            headers: {
                'Content-Type': contType
            }
        })
    }
    else if (contType.includes('font')) {
        const buffer = Buffer.from(await data.arrayBuffer());
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contType
            }
        });
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