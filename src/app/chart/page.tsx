'use client';

// import Chart from "@/components/Charts/page";
// import { Metadata } from "next";
import dynamic from 'next/dynamic';
const DynamicChart = dynamic(() => import('@/components/Charts/page').then((mod) => mod.Chart), {
  ssr: false,
});
import DefaultLayout from "@/components/Layouts/DefaultLayout"; 
import React from "react";

// export const metadata: Metadata = {
//   title: "Next.js Chart | TailAdmin - Next.js Dashboard Template",
//   description:
//     "This is Next.js Chart page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
// };

const BasicChartPage: React.FC = () => {
  return (
    <DefaultLayout>
      <DynamicChart />
    </DefaultLayout>
  );
};

export default BasicChartPage;
