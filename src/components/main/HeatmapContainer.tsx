'use client'

import { useEffect, useState } from "react"
import h337 from 'heatmap.js'
import { Select, SelectItem } from "@nextui-org/select";
import Cookies from "js-cookie";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
type DomainsData = { domains: string }[]
export default function HeaMapContainer({ domainsData }: { domainsData: DomainsData }) {
    const queryclient=useQueryClient()
    const [activeDomain, setActiveDomain] = useState(domainsData[0])
    const[scrollPos,setScrollPos]=useState(0)
    const heatMapsData = useQuery(['heatmap domains', activeDomain.domains, scrollPos], ({ queryKey }) => axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/heatmaps?url=${queryKey[1]}&scrollPos=${queryKey[2]}`), {
        staleTime:Infinity
    })
    const [initialise, setInitialise] = useState(false)
    console.log(heatMapsData.data?.data)
    if (!activeDomain) {
        return <p>No Domains On The Dashboard</p>
    }

    console.log('active domain',activeDomain.domains)
    const Domain = `${activeDomain.domains}`;
    Cookies.set("deep_domain", Domain);
    const [loading, setLoading] = useState(true)

    function MakeHeatMap() {
        const iframeDocument = (document.getElementById('heatmapContainer')! as any as HTMLIFrameElement).contentDocument!
        const heatmapContainer = iframeDocument.createElement('div');
        heatmapContainer.id = 'overlayHeat'
        heatmapContainer.style.top = `${scrollPos}px`;
        heatmapContainer.style.left = '0';
        heatmapContainer.style.width = '100%';
        heatmapContainer.style.height = '100% ';
        heatmapContainer.style.pointerEvents = 'none';
        heatmapContainer.style.position = 'absolute';
        const iterate = iframeDocument.body.querySelector('#overlayHeat')
        if (iterate) {
            iterate.remove()
        }
        iframeDocument.body.appendChild(heatmapContainer)
        var config = {
            container: heatmapContainer,
            radius: 10,
            maxOpacity: .5,
            minOpacity: 0,
            blur: .75,
        };
        // create heatmap with configuration
        var heatmapInstance = h337.create(config);
        console.log(heatMapsData.data!.data)
        heatmapInstance.setData({
            max: 1,
            min: 0,
            data: heatMapsData.data!.data
            // data: heatMapsData.data.data
        })
        setInitialise(true)
    }
    useEffect(() => {
        window.onbeforeunload = async (e) => {
            window.onbeforeunload = null;
            Cookies.remove("deep_domain");
        };

        return () => {
            Cookies.remove('deep_domain')
        }

    }, [])
    useEffect(() => {
        if (initialise) {
            const iframeDocument = (document.getElementById('heatmapContainer')! as any as HTMLIFrameElement).contentDocument!
            setInterval(() => {
                const iframeDocument = (document.getElementById('heatmapContainer')! as any as HTMLIFrameElement).contentDocument!
                iframeDocument.getElementById('overlayHeat')!.style.position = 'absolute'
            },0)
            setInitialise(false)
        }
    }, [initialise])
    
    useEffect(() => {
        if (!loading) {
            if (heatMapsData.data) {
                if (!initialise) {
                    MakeHeatMap()
                }
            }
        }
    }, [activeDomain, heatMapsData.data?.data, loading])
    
    useEffect(() => {
        if (!heatMapsData.isFetching && heatMapsData.data) {
            MakeHeatMap()
        }
    },[scrollPos,heatMapsData])
    return (
        <>
            <div className='h-[100vh]'>
                <div className="flex justify-end p-2">
                    <Select
                        variant={"underlined"}
                        label="Select Domain"
                        selectedKeys={[activeDomain.domains]}
                        className="max-w-xs  "
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value != "") {
                                setActiveDomain({ domains: value });
                            }
                        }}
                    >
                        {domainsData.map((animal: any) => (
                            <SelectItem
                                className="bg-transparent!"
                                key={animal.domains}
                                value={animal.domains}
                            >
                                {animal.domains}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
                <iframe
                    id="heatmapContainer"
                    onLoad={(e: any) => {
                        const iframe = e.target as any as HTMLIFrameElement
                        iframe.contentWindow!.document.onscroll = () => {
                            const scrollingWrolling = iframe.contentWindow!.scrollY
                            console.log('scroll', scrollingWrolling)
                            // queryclient.clear()
                            setScrollPos(scrollingWrolling)
                        }
                        setLoading(false)
                    }}
                    src={`/api/proxy?url=${Domain}`}
                    className={`w-full h-full object-contain h-full ${loading ? 'invisible' : 'visible'} `}
                />
                {/* <div id="heatmapContainer" className="h-full w-full">

                </div> */}
            </div>
        </>
    )
}