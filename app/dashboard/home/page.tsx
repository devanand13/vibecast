"use client"
import { useState } from "react";
import { DashboardTopBar } from "@/components/DashboardTopBar";
import { SideBar } from "@/components/SideBar";

export default function Home(){
    const [isSidebarVisible, setSidebarVisible] = useState(true);

    return <div className="flex flex-col bg-black">
        <DashboardTopBar setSidebarVisible={setSidebarVisible} isSidebarVisible={isSidebarVisible}/>
        <div className="flex">
            <SideBar isVisible={isSidebarVisible}/>
            <div className="bg-stone-900 w-full rounded-xl">
            </div>
        </div>
    </div>
}