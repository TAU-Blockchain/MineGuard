import React from "react";
import { BiScan } from "react-icons/bi";
import { TbReport } from "react-icons/tb";

const ModeSwitcher = ({ activeMode, setActiveMode }) => (
  <div className="bg-[#8AA6A3] p-2  shadow-lg">
    <div className="relative flex items-center justify-center gap-x-2">
      <button
        onClick={() => setActiveMode("scan")}
        className={`relative flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full transition-all duration-300 ${
          activeMode === "scan"
            ? "text-black bg-[#F4F1BB] font-semibold scale-105 shadow-lg"
            : "text-black hover:text-gray-800 bg-[#f6f4c3] hover:bg-[#F4F1BB] hover:scale-102"
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
            ? "text-black bg-[#F4F1BB] font-semibold scale-105 shadow-lg"
            : "text-black hover:text-gray-800 bg-[#f6f4c3] hover:bg-[#F4F1BB] hover:scale-102"
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
