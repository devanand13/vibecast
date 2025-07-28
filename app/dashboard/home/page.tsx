"use client"
import { useState } from "react";
import { DashboardTopBar } from "@/components/DashboardTopBar";
import { SideBar } from "@/components/SideBar";
import { useRouter } from "next/navigation";
import { DashboardBtn } from "@/components/DashboardBtn";
import { BsRecordCircle } from "react-icons/bs";
import { LuScissorsLineDashed,LuUpload } from "react-icons/lu";
import { CiStreamOn } from "react-icons/ci";
import { GrPlan } from "react-icons/gr";




export default function Home(){
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    const router = useRouter();

    const generateRoomId = () => {
        const length = 8;
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let roomId = '';
        for (let i = 0; i < length/2; i++) {
          roomId += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        roomId += '-';

        for (let i = 0; i < length/2; i++) {
            roomId += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        router.push(`/record/podcast/${roomId}`)
    }

    const DashboardOptions = [
        {
          text: "Record",
          icon: BsRecordCircle,
          onclick: generateRoomId,
          color: "red",
        },
        {
          text: "Edit",
          icon: LuScissorsLineDashed,
          onclick: null,
          color: "neutral",
        },
        {
          text: "Go Live",
          icon: CiStreamOn,
          onclick: null,
          color: "neutral",
        },
        {
          text: "Plan",
          icon: GrPlan,
          onclick: null,
          color: "neutral",
        },
        {
            text: "Upload",
            icon: LuUpload,
            onclick: null,
            color: "neutral",
        },
      ] as const;
      

    return <div className="flex flex-col bg-black h-screen">
        <DashboardTopBar setSidebarVisible={setSidebarVisible} isSidebarVisible={isSidebarVisible}/>
        <div className="flex-1 flex flex-col">
            <div className="flex flex-1">
                <SideBar isVisible={isSidebarVisible}/>
                <div className="bg-neutral-900 w-full rounded-xl text-white">
                    <div className="mt-20 flex justify-center items-center">
                    {
                        DashboardOptions.map((DashboardOption, index) => {
                            return <div key={index}>
                                <DashboardBtn icon={DashboardOption.icon} buttonText={DashboardOption.text} color={DashboardOption.color || "neutral"} onClick={DashboardOption.onclick}/>             
                            </div>
                        })
                    }
                    </div>
                    <div className="p-2 w-full">
                        <div className=" pl-10 w-full text-neutral-200 text-2xl font-semibold">
                            Recents
                        </div>
                        <div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}