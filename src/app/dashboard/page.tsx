'use client'
import ECommerce from "@/components/Dashboard/E-commerce";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { SessionProvider, authConfigManager } from "@hono/auth-js/react"
import { useSession } from "@hono/auth-js/react"
import { signIn } from "@hono/auth-js/react"



const DashboardPage= () => {
  const { data: session, update } = useSession() || {};

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full">
        <h1 className="text-3xl font-bold text-rose-700/90 dark:text-rose-700/90">Access Denied!</h1>
        <p className="mt-8">
          <a
            href="/login"
            onClick={(e) => {
              e.preventDefault()
              // signIn()
            }}
            className="text-blue-700 font-semibold hover:underline"
          >
            You must be signed in to view this page
          </a>
        </p>
      </div>
    )
  }


  return (
    <>
    <SessionProvider>
    <DefaultLayout>
      <ECommerce />
    </DefaultLayout>
    </SessionProvider>
  </>
  )
}

export default DashboardPage