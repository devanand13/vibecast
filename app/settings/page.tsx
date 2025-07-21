"use client"
import { useEffect, useState } from "react";
import { DashboardTopBar } from "@/components/DashboardTopBar";
import { SideBar } from "@/components/SideBar";
import Image from "next/image";
import { FaLock } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { SettingsPageBtn } from "@/components/SettingsPageBtn";
import { CiUser } from "react-icons/ci";
import { FiCreditCard,FiVideo } from "react-icons/fi";
import { RiNotificationBadgeFill } from "react-icons/ri";
import { GrIntegration } from "react-icons/gr";

interface MyTokenPayload {
    id: number;
    username: string;
    profileImage:string;
    name:string;
    iat: number;
    exp: number;
}


export default function Settings(){
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    const [image,setImage] = useState("");
    const [selection,setSelection] = useState("Profile")
    const [name,setName] = useState("")
    const [user, setUser] = useState<MyTokenPayload | null>(null);


    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
      
        const res = await fetch("/api/s3-upload-url");
        const { uploadUrl, publicUrl } = await res.json();
      
        await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });


        const updatedUser = await fetch("/api/user/updateDetails", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: user?.username,
              profileImage: publicUrl,
            }),
          });          

        const jsonRes = await updatedUser.json()


        if (updatedUser.ok) {
            console.log("✅ User updated:");
            setImage(publicUrl);
            localStorage.setItem("authToken", jsonRes?.token);
        } else {
            console.error("❌ Failed to update");
        }
      };

      const handleNameUpdate = async () => {
        try {
            if(user?.name==name.trim()){
                return
            }
          const updatedUser = await fetch("/api/user/updateDetails", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: user?.username, 
              name: name,            
            }),
          });
          
      
          const jsonRes = await updatedUser.json();
      
          if (updatedUser.ok) {
            console.log("✅ Name updated!");
            localStorage.setItem("authToken", jsonRes.token); 
          } else {
            console.error("❌ Failed to update name");
          }
        } catch (error) {
          console.error("❌ Error updating name:", error);
        }
      };      

      useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) return;
      
        const verifyToken = async () => {
          try {
            const res = await fetch("/api/verify", {
              headers: { Authorization: `Bearer ${token}` },
            });
      
            if (res.ok) {
              const data = await res.json();
              const decoded = data.user as MyTokenPayload;
              console.log(decoded)
              setUser(decoded);
              setImage(decoded.profileImage || "");
              setName(decoded.name || "");
            }
          } catch (error) {
            console.error("Error verifying token:", error);
          }
        };
      
        verifyToken();
      }, []);      
      
      
      

    return <div className="flex flex-col bg-black h-screen overflow-hidden">
        <DashboardTopBar setSidebarVisible={setSidebarVisible} isSidebarVisible={isSidebarVisible}/>
        <div className="flex-1 flex flex-col">
            <div className="flex flex-1">
                <SideBar isVisible={isSidebarVisible}/>
                <div className="bg-neutral-900 w-full rounded-xl text-white">
                    <div className="mt-10 flex justify-center items-center font-extrabold text-3xl">
                        Settings
                    </div>
                    <div className="w-full h-full flex justify-center">
                        <div className="mt-10 w-3/4 h-[55%] bg-neutral-900 flex w-[70%]">
                            <div className="w-3/10">
                                <div className="text-xs font-bold text-gray-400   pt-3 pl-2">
                                    YOUR ACCOUNT
                                </div>
                                <div className="pt-3">
                                    <SettingsPageBtn buttonText="Profile" icon={CiUser} color={ selection=="Profile" ? "white" : "" } onClick={()=>setSelection("Profile")}/>
                                    <SettingsPageBtn buttonText="Subscription" icon={FiCreditCard} color={ selection=="Subscription" ? "white" : ""} onClick={()=>setSelection("Subscription")}/>
                                    <SettingsPageBtn buttonText="Notifications" icon={RiNotificationBadgeFill} color={ selection=="Notifications" ? "white" : ""} onClick={()=>setSelection("Notifications")}/>
                                    <SettingsPageBtn buttonText="Integrations" icon={GrIntegration} color={ selection=="Integrations" ? "white" : ""} onClick={()=>setSelection("Integrations")}/>
                                </div>
                                <div className="text-xs font-bold text-gray-400   pt-10 pl-2">
                                    AUDIO & VIDEO
                                </div>
                                <div className="pt-3">
                                    <SettingsPageBtn buttonText="Studio settings" icon={FiVideo} color={ selection=="Studio settings" ? "white" : ""} onClick={()=>setSelection("Studio settings")}/>
                                </div>
                            </div>
                            <div className="w-7/10">
                                {
                                    selection=="Profile" ? (
                                        <div className="ml-5 bg-neutral-800 h-full rounded-xl">
                                    <div className="pl-8 pt-8 font-bold">
                                        Profile
                                    </div>
                                    <div className="ml-6 mt-3 w-30 h-30 ">
                                    <div onClick={() => document.getElementById("profileImageInput")?.click()}className={`w-full h-full rounded-full overflow-hidden relative group cursor-pointer flex justify-center items-center ${image.trim() != "" ? "":"border"}`}>
                                    {
                                        image.trim() != "" ? <Image
                                        src={image}
                                        alt="Profile"
                                        fill
                                        style={{ objectFit: "cover" }}
                                      /> : <FaUser className="w-15 h-15"/>
                                    
                                    }
                                    <input type="file" id="profileImageInput" className="hidden" accept="image/*" onChange={handleImageUpload}/>
                                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-60 transition-opacity duration-300">
                                        <FiEdit2 className="text-white w-6 h-6" />
                                    </div>
                                    </div>
                                    </div>
                                    <div className="pl-7 pt-3 pb-2 font-bold">
                                        Name
                                        <div className="w-9/10">
                                            <input type="text" className="w-9/10 mt-2 font-normal  shadow-lg rounded pl-3 py-1 hover:shadow-xl hover:bg-neutral-700 focus:outline-none focus:border-violet-800 focus:border-2" value={name} onChange={(e) => setName(e.target.value)} onBlur={handleNameUpdate}/>
                                        </div>
                                    </div>
                                    <div className="pl-7 pt-3 pb-2 font-bold text-white">
                                    Email
                                    <div className="w-9/10 relative mt-2">
                                        <input
                                        type="text"
                                        className="w-full font-normal text-sm shadow-lg rounded pl-3 pr-10 text-neutral-400 py-1 bg-neutral-800 cursor-not-allowed border-none focus:ring-0 focus:outline-none"
                                        value="amaldevanands@gmail.com"
                                        readOnly
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
                                        <FaLock />
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                    ) : (<div className="text-gray-400 text-lg font-semibold flex justify-center items-center h-full ml-5 bg-neutral-800 h-full rounded-xl">
                                    Coming Soon...
                                  </div>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

