import { IconType } from "react-icons"

export const SideBarBtn = ({
    buttonText,
    icon:Icon,
    isOpen
}:{
    buttonText: string,
    icon:IconType,
    isOpen:boolean
}) => {
    return <div>
        {
            isOpen ? <div className="flex p-2 rounded-xl hover:bg-stone-900 mx-2 my-1 cursor-pointer">
            <div className="flex justify-center items-center">
                <Icon className="w-7 h-7"></Icon>
            </div>
            <div className="text-white pl-2 font-bold flex flex-col text-sm justify-center">
                {buttonText}
            </div>
        </div> : <div className="flex flex-col">
                <div className="flex justify-center items-center">
                    <Icon className="w-7 h-7"></Icon>
                </div>
                <div className="flex justify-center items-center text-xs">
                    {buttonText}
                </div>
        </div>
        }
    </div>
}