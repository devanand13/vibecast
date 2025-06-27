export const ServicesButton = ({ buttonText }: { buttonText: string }) => {
    return (
      <div className="rounded-3xl px-2 mr-2 mt-1 border-gray-500 border flex items-center gap-2 hover:border-violet-300">
        <div className="border border-gray-400 rounded-sm w-3 h-3 my-3"></div>
        <button className="text-xs">{buttonText}</button>
      </div>
    );
  };
  