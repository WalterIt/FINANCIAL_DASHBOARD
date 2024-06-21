// import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
// import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {Button} from "@/components/ui/button";


export const metadata: Metadata = {
  title:
    "My Financial App",
  description: "Personal Financial Management App",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold text-black/90">Welcome to My Financial App!</h1>
      <Button variant="default" size={"lg"} className="mt-6 text-xl text-white">Jesus Saves!</Button>
    </div>
  );
}
