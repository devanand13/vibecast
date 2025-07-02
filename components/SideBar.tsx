import { DiVim } from "react-icons/di";
import { IoIosFolderOpen } from "react-icons/io";
import { AiOutlineSchedule } from "react-icons/ai";
import { MdHomeFilled } from "react-icons/md";
import { SideBarBtn } from "./SideBarBtn";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOndemandVideo } from "react-icons/md";
import { AiOutlineUserAdd } from "react-icons/ai";



const sideBarOptions = [
    {
        text:"Home",
        icon:MdHomeFilled
    },
    {
        text:"Projects",
        icon: IoIosFolderOpen
    },{
        text:"Schedule",
        icon:AiOutlineSchedule
    }
]

const sideBarBottomOptions = [
    {
        text:"Settings",
        icon: IoSettingsOutline
    }
]


export const SideBar = ({ isVisible }: { isVisible: boolean }) => {

    return (
      <div className={`transition-all duration-300 ${isVisible ? "w-65" : "w-16"} bg-black h-screen`}>
            {
                isVisible ? <div className="flex flex-col text-white pt-5">
                    <div>
                    {
                        sideBarOptions.map((sidebarOption, index) => {
                            console.log(sidebarOption)
                            return <div key={index}>
                                <SideBarBtn icon={sidebarOption.icon} buttonText={sidebarOption.text} />             
                            </div>
                        })
                    }
                    </div>
                    
                    <div className="pt-100">
                    <div className="flex">
                        <SideBarBtn icon={MdOndemandVideo} buttonText="Open Studio"/>
                        <div className="flex items-center justify-center cursor-pointer ">
                            <div className="w-10 h-10 rounded-full bg-stone-800 flex justify-center items-center hover:bg-stone-900">
                            <AiOutlineUserAdd size={20}/>
                            </div>
                        </div>
                    </div>
                    {
                        sideBarBottomOptions.map((sidebarOption, index) => {
                            console.log(sidebarOption)
                            return <div key={index}>
                                <SideBarBtn icon={sidebarOption.icon} buttonText={sidebarOption.text}/>             
                            </div>
                        })
                    }
                    </div>
                </div> : <div>

                </div>
            }
      </div>
    );
  };
  