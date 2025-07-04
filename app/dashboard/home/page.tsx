"use client"
import { useState } from "react";
import { DashboardTopBar } from "@/components/DashboardTopBar";
import { SideBar } from "@/components/SideBar";
import { useRouter } from "next/navigation";

export default function Home(){
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    const router = useRouter();

    const generateRoomId = (length = 8) => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let roomId = '';
        for (let i = 0; i < length/2; i++) {
          roomId += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        roomId += '-';

        for (let i = 0; i < length/2; i++) {
            roomId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return roomId;
    }
      

    return <div className="flex flex-col bg-black h-screen">
        <DashboardTopBar setSidebarVisible={setSidebarVisible} isSidebarVisible={isSidebarVisible}/>
        <div className="flex-1 flex flex-col">
            <div className="flex flex-1">
                <SideBar isVisible={isSidebarVisible}/>
                <div className="bg-neutral-900 w-full rounded-xl text-white">
                    <div className="mt-20 flex justify-center items-center">
                        <button className="w-30 h-15 rounded-xl bg-neutral-700 flex justify-center items-center font-extrabold text-neutral-300 cursor-pointer hover:shadow-lg shadow-neutral-800" onClick={()=>{
                            const roomId = generateRoomId(6);
                            router.push(`/record/podcast/${roomId}`)
                        }}>
                            Record
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}