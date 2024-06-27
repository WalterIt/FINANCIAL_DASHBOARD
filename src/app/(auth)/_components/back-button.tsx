"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
interface FooterProps {
    labelFooter : string
    labelHref : string
}

export const BackButton = ({labelFooter, labelHref} : FooterProps) => {
    
    return (
        <Button variant={"link"} size={"sm"} asChild className="w-full font-semibold text-[#4E60E2] ">
            <Link href={labelHref} className="cursor-pointer duration-300 hover:text-blue-700">{labelFooter}</Link>
        </Button>
    )
}