"use client"

import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Header } from './header'
import { Social } from './social'
import { BackButton } from './back-button'


interface CardWrapperProps {
    children :  React.ReactNode,
    headerLabel : string,
    backButtonLabel : string,
    backButtonHref : string,
    showSocial? : boolean
}

export const CardWrapper = ({children, headerLabel, backButtonLabel, backButtonHref, showSocial} : CardWrapperProps) => {
  return (
    <Card className='w-[500px]'>
        <CardHeader>
            <Header label={headerLabel} />
        </CardHeader>
        <CardContent>
            {children} 
        </CardContent>           
        {showSocial && 
        <CardFooter>
            <Social />
        </CardFooter>}
        <CardFooter>
            <BackButton labelFooter={backButtonLabel} labelHref={backButtonHref} />
        </CardFooter>
    </Card>
  )
}