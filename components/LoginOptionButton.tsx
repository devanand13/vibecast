import { IconType } from "react-icons";

export const LoginOptionButton = ({icon:Icon}:{icon:IconType}) => {
    return <div className="m-1 mt-2 w-10 h-10 flex justify-center bg-stone-700 rounded-lg hover:cursor-pointer hover:bg-stone-500">
        <div className="flex items-center">
            <Icon className="w-4 h-4" color="white" />
        </div>
    </div>
}