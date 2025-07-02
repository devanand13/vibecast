export const DashboardTopBar = ({
    isSidebarVisible,
    setSidebarVisible
  }: {
    isSidebarVisible: boolean;
    setSidebarVisible: (val: boolean) => void;
  }) => {
    return (
      <div className="h-15 bg-black flex items-center">
        <div className="w-60 flex items-center">
          {isSidebarVisible && (
            <div className="px-8 font-extrabold text-white">VIBECAST</div>
          )}
          <div
            className={`w-4 h-4 border border-2 text-stone-500 font-extrabold text-md flex items-center justify-center text-center p-3 pt-2 pb-3 rounded-sm border-stone-500 cursor-pointer hover:text-white hover:border-white ${
              isSidebarVisible ? "ml-9" : "ml-3"
            }`}
            onClick={() => {
              setSidebarVisible(!isSidebarVisible);
            }}
          >
            {isSidebarVisible ? "<" : ">"}
          </div>
        </div>
  
        <div className="flex justify-center w-full h-4/8 text-white">
          <input
            type="text"
            placeholder="🔍 Search"
            className="bg-stone-800 w-3/8 rounded-lg placeholder-white text-center focus:text-left focus:outline focus:outline-2 focus:outline-gray-500 px-3"
          />
        </div>
      </div>
    );
  };
  