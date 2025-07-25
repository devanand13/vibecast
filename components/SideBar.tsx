import { IoIosFolderOpen } from "react-icons/io";
import { AiOutlineSchedule } from "react-icons/ai";
import { MdHomeFilled } from "react-icons/md";
import { SideBarBtn } from "./SideBarBtn";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOndemandVideo } from "react-icons/md";
import { AiOutlineUserAdd } from "react-icons/ai";
import { useState,useRef,useEffect } from "react";
import { LuCirclePlay } from "react-icons/lu";
import { IconType } from "react-icons";
import { HiOutlineLogout } from "react-icons/hi";
import { useRouter } from "next/navigation";



const sideBarOptions = [
    {
        text:"Home",
        icon:MdHomeFilled,
        path:"/dashboard/home"
    },
    {
        text:"Projects",
        icon: IoIosFolderOpen,
        path:"/projects"
    },{
        text:"Schedule",
        icon:AiOutlineSchedule,
        path:"/dashboard/home"
    }
]

const sideBarBottomOptions = [
    {
        text:"Settings",
        icon: IoSettingsOutline,
        path:"/settings"
    }
]

type popUpBtnProps = {
    text: string;
    icon: IconType;
    onClick?: () => void;
    className?: string;
  };
  

export const SideBar = ({ isVisible }: { isVisible: boolean }) => {
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter()

    const buttonRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
          const clickedOutside = !popupRef.current?.contains(event.target as Node) && !buttonRef.current?.contains(event.target as Node);
    
          if (clickedOutside) {
            setShowPopup(false);
          }
        }
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNavigate = (url: string) => () => {
            router.push(url);
            setShowPopup(false);
    };
        
    const handleLogout = async () => {
        try {
            await fetch("/api/user/logout", {
                method: "POST",
                credentials: "include",
            });
          
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
          

    return (
      <div className={`transition-all duration-300 ${isVisible ? "w-65" : "w-20"} bg-black `}>
            {
                isVisible ? <div className="transition-all flex flex-col text-white pt-5">
                    <div>
                    {
                        sideBarOptions.map((sidebarOption, index) => {
                            return <div key={index}>
                                <SideBarBtn icon={sidebarOption.icon} buttonText={sidebarOption.text} path={sidebarOption.path} isOpen={true}/>             
                            </div>
                        })
                    }
                    </div>
                    
                    <div className="pt-100">
                    <div className="flex">
                        <SideBarBtn icon={MdOndemandVideo} buttonText="Open Studio" path="/dashboard/home" isOpen={true}/>
                        <div className="flex items-center justify-center cursor-pointer ">
                            <div className="w-10 h-10 rounded-full bg-stone-800 flex justify-center items-center hover:bg-stone-900">
                            <AiOutlineUserAdd size={20}/>
                            </div>
                        </div>
                    </div>
                    {
                        sideBarBottomOptions.map((sidebarOption, index) => {
                            return <div key={index}>
                                <SideBarBtn icon={sidebarOption.icon} buttonText={sidebarOption.text} path={sidebarOption.path} isOpen={true}/>             
                            </div>
                        })
                    }
                    </div>
                </div> : <div className=" transition-all flex flex-col text-white pt-5">
                    <div>
                    {
                        sideBarOptions.map((sidebarOption, index) => {
                            return <div key={index} className="m-2 hover:bg-stone-800 rounded-xl p-2 cursor-pointer"> 
                                <SideBarBtn icon={sidebarOption.icon} buttonText={sidebarOption.text}  path={sidebarOption.path} isOpen={false}/>             
                            </div>
                        })
                    }
                    </div>
                    
                    <div className="pt-70">
                    <div className="flex flex-col justify-center items-center">
                        <div className="cursor-pointer hover:bg-stone-800 w-3/5 p-2 rounded-xl">
                            <SideBarBtn icon={MdOndemandVideo} buttonText="" path="/dashboard/home" isOpen={false}/>
                        </div>
                        <div className="flex items-center justify-center cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-stone-800 my-2 flex justify-center items-center hover:bg-stone-900">
                                <AiOutlineUserAdd size={20}/>
                            </div>
                        </div>
                    </div>
                    {
                        sideBarBottomOptions.map((sidebarOption, index) => {
                            return <div key={index} className="  flex justify-center items-center">
                                <div className="p-2 hover:bg-stone-800 rounded-xl w-3/5 cursor-pointer">
                                    <SideBarBtn icon={sidebarOption.icon} buttonText={""} path={sidebarOption.path}isOpen={false}/>   
                                </div>          
                            </div>
                        })
                    }
                    </div>
                    
                </div>
            }
            <div className="w-full h-15  pt-3 pl-4">
                <div ref={buttonRef} className="relative rounded-full w-10 h-10 bg-indigo-700 cursor-pointer group" onClick={() => setShowPopup(prev => !prev)}>
                    <div className="absolute w-1 h-1 bg-white rounded-full top-4 left-3 transition-all duration-200 group-hover:top-3 group-hover:left-4"></div>
                    <div className="absolute w-1 h-1 bg-white rounded-full top-4 right-3 transition-all duration-200 group-hover:top-5 group-hover:right-3"></div>
                    <div className="absolute w-4 h-2 border-b-2 border-white rounded-b-full bottom-2 left-1/2 -translate-x-1/2 transform transition-all duration-200 origin-center
                        group-hover:bottom-3 group-hover:-translate-x-[calc(50%+0.25rem)] group-hover:rotate-45">
                    </div>
                </div>
                {showPopup && (
                    <div ref={popupRef} className="absolute bottom-18 left-5 w-67 h-70 bg-neutral-800 text-black rounded-lg shadow-xl z-50 flex flex-col p-2">
                        <div className="text-neutral-400 text-xs pl-5 pt-2 hover:bg-neutral-700 rounded-xl pb-2">
                            Free Plan
                            <div className="font-bold text-white pt-2 text-base ">
                                00:00 / 2 hours
                            </div>
                        </div>

                        <div className="h-[0.1] opacity-20 w-full bg-white mt-2"></div>
                        <div className="pt-5">
                            <PopUpBtn text="Watch a demo" icon={LuCirclePlay} />
                            <PopUpBtn text="Settings" icon={IoSettingsOutline} onClick={handleNavigate("/settings")}/>
                            <PopUpBtn text="Log out" icon={HiOutlineLogout} onClick={handleLogout} />
                        </div>
                    </div>
                    )}
            </div>
      </div>
    );
  };
  

const PopUpBtn = ({ text, icon: Icon, onClick, className = "" }: popUpBtnProps) => {
    return (
        <div
        onClick={onClick}
        className={`rounded-xl flex hover:bg-neutral-700 h-13 w-full pl-1 cursor-pointer ${className}`}
      >
        <div className="w-10 h-full flex justify-center items-center">
          <Icon className="text-white w-5 h-5" />
        </div>
        <div className="text-neutral-200 flex items-center text-sm font-semibold">
          {text}
        </div>
      </div>
    );
  };