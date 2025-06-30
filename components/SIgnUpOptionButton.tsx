import { IconType } from "react-icons";

export const SignUpOptionButton = ({
  buttonText,
  icon: Icon,
  color,
  onClick
}: {
  buttonText: string;
  icon: IconType;
  color:string;
  onClick?: () => void;
}) => {
  return (
    <div className="bg-black flex items-center w-4/5 rounded-xl hover:cursor-pointer hover:bg-zinc-800" onClick={onClick}>
      <div className="pl-3">
        <Icon className="w-7 h-7" color={color} />
      </div>
      <div className="flex justify-center w-full py-3 cursor-pointer">
        <button className="text-white font-bold cursor-pointer">
          {buttonText}
        </button>
      </div>
    </div>
  );
};
