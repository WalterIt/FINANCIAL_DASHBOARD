import React from 'react'
import { cn } from '@/lib/utils'

interface HeaderProps {
    label : string
} 

export const Header = ({label} : HeaderProps) => {
  return (
    <div className='w-full flex flex-col justify-center items-center gap-y-4'>
        <h1 className={cn("text-3xl text-slate-600 font-semibold")}> 🔐Financial Dashboard</h1>
        <p className='text-md'>{label}</p>
    </div>
  )
}