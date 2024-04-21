'use client'
import { Select,SelectItem } from "@nextui-org/select";
import { useEffect, useState } from "react";
type DomainsData={domains:string}[]
export default function SessionContainer({ domainsData }: { domainsData: DomainsData }) {
    const [activeDomain, setActiveDomain] = useState(domainsData[0])
    useEffect(() => {
        async function getDomainData() {
            
        }
    })
    return (

        <div className="flex justify-end">
            <Select
                variant={"underlined"}
                label="Select Domain"
                selectedKeys={[activeDomain.domains]}
                className="max-w-xs bg-transparent!"
                onChange={(e) => {
                    const value = e.target.value
                    if (value != '') {
                        setActiveDomain({ domains:value })
                    }
                }}
            >
                {domainsData.map((animal) => (
                    <SelectItem className="bg-transparent!" key={animal.domains} value={animal.domains}>
                        {animal.domains}
                    </SelectItem>
                ))}
            </Select>
        </div>

        
    )
    
    
}

