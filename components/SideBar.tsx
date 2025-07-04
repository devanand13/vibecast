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
      <div className={`transition-all duration-300 ${isVisible ? "w-65" : "w-20"} bg-black h-screen`}>
            {
                isVisible ? <div className="transition-all flex flex-col text-white pt-5">
                    <div>
                    {
                        sideBarOptions.map((sidebarOption, index) => {
                            console.log(sidebarOption)
                            return <div key={index}>
                                <SideBarBtn icon={sidebarOption.icon} buttonText={sidebarOption.text} isOpen={true}/>             
                            </div>
                        })
                    }
                    </div>
                    
                    <div className="pt-100">
                    <div className="flex">
                        <SideBarBtn icon={MdOndemandVideo} buttonText="Open Studio"isOpen={true}/>
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
                                <SideBarBtn icon={sidebarOption.icon} buttonText={sidebarOption.text} isOpen={true}/>             
                            </div>
                        })
                    }
                    </div>
                </div> : <div className=" transition-all flex flex-col text-white pt-5">
                    <div>
                    {
                        sideBarOptions.map((sidebarOption, index) => {
                            console.log(sidebarOption)
                            return <div key={index} className="m-2 hover:bg-stone-800 rounded-xl p-2 cursor-pointer"> 
                                <SideBarBtn icon={sidebarOption.icon} buttonText={sidebarOption.text} isOpen={false}/>             
                            </div>
                        })
                    }
                    </div>
                    
                    <div className="pt-70">
                    <div className="flex flex-col justify-center items-center">
                        <div className="cursor-pointer hover:bg-stone-800 w-3/5 p-2 rounded-xl">
                            <SideBarBtn icon={MdOndemandVideo} buttonText=""isOpen={false}/>
                        </div>
                        <div className="flex items-center justify-center cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-stone-800 my-2 flex justify-center items-center hover:bg-stone-900">
                                <AiOutlineUserAdd size={20}/>
                            </div>
                        </div>
                    </div>
                    {
                        sideBarBottomOptions.map((sidebarOption, index) => {
                            console.log(sidebarOption)
                            return <div key={index} className="  flex justify-center items-center">
                                <div className="p-2 hover:bg-stone-800 rounded-xl w-3/5 cursor-pointer">
                                    <SideBarBtn icon={sidebarOption.icon} buttonText={""} isOpen={false}/>   
                                </div>          
                            </div>
                        })
                    }
                    </div>
                </div>
            }
      </div>
    );
  };
  