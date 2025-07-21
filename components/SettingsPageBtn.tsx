import { IconType } from "react-icons";

export const SettingsPageBtn = ( {
    buttonText,
    icon: Icon,
    color,
    onClick
  }: {
    buttonText: string;
    icon: IconType;
    color:string;
    onClick:()=>void;
  }) =>{
    return <div className="flex cursor-pointer group" onClick={onClick}>
        <div className={`flex justify-center items-center group-hover:text-white p-2 ${color == "" ? "text-gray-400" : color}`}>
            <Icon className="w-5 h-5"></Icon>
        </div>
        <div className={`flex items-center text-md font-semibold group-hover:text-white ${color == "" ? "text-gray-400" : color}`}>
            {buttonText}
        </div>
    </div>
}