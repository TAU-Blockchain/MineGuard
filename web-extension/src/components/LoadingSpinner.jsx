import React from "react";

const LoadingSpinner = ({ activeMode }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#ED6A5A] border-t-transparent mb-4 shadow-lg"></div>
    <p className="text-white font-pixelify text-lg animate-pulse">
      {activeMode === "scan" ? "Scanning..." : "Reporting..."}
    </p>
  </div>
);

export default LoadingSpinner;
