import React from "react";
import { BiScan } from "react-icons/bi";
import { TbReport } from "react-icons/tb";

const ModeSwitcher = ({ activeMode, setActiveMode }) => (
  <div className="bg-[#8AA6A3] p-2 rounded-full shadow-lg">
    <div className="relative flex items-center justify-center gap-x-2">
      <button
        onClick={() => setActiveMode("scan")}
        className={`relative flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full transition-all duration-300 ${
          activeMode === "scan"
            ? "text-white bg-[#ef5e4b] font-semibold scale-105 shadow-lg"
            : "text-white/90 hover:text-white bg-[#ED6A5A] hover:bg-[#ef5e4b] hover:scale-102"
        }`}
      >
        <BiScan
          className={`text-xl transition-transform ${
            activeMode === "scan" ? "scale-110" : ""
          }`}
        />
        <span className="font-pixelify">Scan</span>
      </button>

      <button
        onClick={() => setActiveMode("report")}
        className={`relative flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full transition-all duration-300 ${
          activeMode === "report"
            ? "text-white bg-[#ef5e4b] font-semibold scale-105 shadow-lg"
            : "text-white/90 hover:text-white bg-[#ED6A5A] hover:bg-[#ef5e4b] hover:scale-102"
        }`}
      >
        <TbReport
          className={`text-xl transition-transform ${
            activeMode === "report" ? "scale-110" : ""
          }`}
        />
        <span className="font-pixelify">Report</span>
      </button>
    </div>
  </div>
);

export default ModeSwitcher;
