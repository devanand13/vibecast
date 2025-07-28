"use client"
import { useState } from "react";
import { DashboardTopBar } from "@/components/DashboardTopBar";
import { SideBar } from "@/components/SideBar";

export default function Projects(){
    const [isSidebarVisible, setSidebarVisible] = useState(true);
      

    return <div className="flex flex-col bg-black h-screen">
        <DashboardTopBar setSidebarVisible={setSidebarVisible} isSidebarVisible={isSidebarVisible}/>
        <div className="flex-1 flex flex-col">
            <div className="flex flex-1">
                <SideBar isVisible={isSidebarVisible}/>
                <div className="bg-neutral-900 w-full rounded-xl text-white">
                    <div className="mt-20 flex justify-center items-center">
                        Rolling out Soon...
                    </div>
                </div>
            </div>
        </div>
    </div>
}