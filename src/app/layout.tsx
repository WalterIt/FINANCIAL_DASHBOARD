// "use client";
import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { QueryProvider } from "@/providers/query-provider";
import { SessionProvider } from "next-auth/react";
// import  auth  from "@/auth.config";



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await auth()
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [loading, setLoading] = useState<boolean>(true);


  // useEffect(() => {
  //   setTimeout(() => setLoading(false), 1000);
  // }, []);


  return (
    // <SessionProvider session={session}>
    <html lang="en">
      <QueryProvider>
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark h-full">
          { children}
          {/* {loading ? <Loader /> : children} */}
        </div>
      </body>
      </QueryProvider>
    </html>
    // </SessionProvider>
  );
}
