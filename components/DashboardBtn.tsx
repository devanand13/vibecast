import { IconType } from "react-icons";

const colorMap: Record<string, { default: string; hover: string }> = {
    red: {
      default: "bg-red-950",
      hover: "hover:bg-red-900",
    },
    neutral: {
      default: "bg-neutral-700",
      hover: "hover:bg-neutral-800",
    },
  };
  

export const DashboardBtn = ({
    buttonText,
    icon: Icon,
    color = "neutral",
    onClick,
  }: {
    buttonText: string;
    icon: IconType;
    color?: "red" | "gray" | "neutral";
    onClick: (() => void) | null;
  }) => {
    const colorClasses = colorMap[color];
  
    return (
      <div className="mx-2 w-20 h-40 flex flex-col items-center">
        <div className="w-20 h-20 flex justify-center items-center">
          <button
            className={`w-[75%] h-[75%] rounded-full flex justify-center items-center font-extrabold text-neutral-300 cursor-pointer ${colorClasses.default} ${colorClasses.hover} shadow-neutral-800 group`}
            onClick={onClick || (() => {})}
          >
            <div className="flex justify-center items-center w-[35%] h-[35%]">
              <Icon className={`w-full h-full ${color ==="red" ? "text-red-800 group-hover:text-neutral-300" : "text-neutral-200"}`} />
            </div>
          </button>
        </div>
        <div className="font-medium text-sm text-neutral-400">{buttonText}</div>
      </div>
    );
  };
  