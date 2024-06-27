'use client'
import dynamic from 'next/dynamic';

import { SessionProvider, authConfigManager } from "@hono/auth-js/react"


const DynamicECommerce = dynamic(() => import('@/components/Dashboard/E-commerce').then((mod) => mod.ECommerce), {
  ssr: false,
});

// import ECommerce from "@/components/Dashboard/E-commerce";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

import { useSession } from "@hono/auth-js/react"
// import { useEffect } from "react";
// import { signIn } from "@hono/auth-js/react"



const DashboardPage= () => {
  const { data: session, update } = useSession() || {};

  // useEffect(() => {
  //   if (typeof window === 'undefined') return;

  //   // Code that should run only on the client-side
  // }, []);

  // if (!session?.user) {
  //   return (
  //     <>
  //     <div className="flex flex-col items-center justify-center h-screen w-full">
  //       <h1 className="text-3xl font-bold text-rose-700/90 dark:text-rose-700/90">Access Denied!</h1>
  //       <p className="mt-8">
  //         <a
  //           href="/login"
  //           // onClick={(e) => {
  //           //   e.preventDefault()
  //           //   // signIn()
  //           // }}
  //           className="text-blue-700 font-semibold hover:underline"
  //         >
  //           You must be signed in to view this page
  //         </a>
  //       </p>
  //     </div>
  //     </>
  //   )
  // }

  return (
    <>
    {/* <SessionProvider> */}
    <DefaultLayout>
      <DynamicECommerce />
    </DefaultLayout>
    {/* </SessionProvider> */}
    </>
  )
}

export default DashboardPage