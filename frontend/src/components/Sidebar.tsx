import { FaAirbnb, FaChartLine } from "react-icons/fa6";

const Sidebar = () => {
  return (
    <div id="sidebar" className="h-dvh w-96">
      <header
        id="header-sidebar"
        className="flex w-full items-center justify-start gap-2 border-b-1 border-b-neutral-300 px-2 py-4"
      >
        <FaChartLine className="size-8" />
        <span id="title" className="text-3xl">
          Protótipo
        </span>
      </header>
      <div id="principal" className="flex flex-col">
        <span className="px-4 py-4 text-[0.9rem] text-neutral-500">
          PRINCIPAL
        </span>
        <button className="relative flex h-14 w-full cursor-pointer flex-row items-center justify-start border-solid border-r-sky-500 bg-blue-100 px-3 transition-all hover:border-r-3">
          <span className="absolute left-5 flex h-full w-full flex-row items-center gap-1 transition-all hover:left-6 hover:text-blue-800">
            <FaAirbnb /> Teste
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
