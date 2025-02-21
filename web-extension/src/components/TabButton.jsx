import React from "react";

const TabButton = ({ id, icon: Icon, label, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`flex flex-col items-center p-2 ${
      activeTab === id
        ? "text-white bg-[#ED6A5A] rounded-xl"
        : "text-white/80 hover:text-white bg-[#ed7363] transition-all duration-300"
    }`}
  >
    <Icon className="text-xl mb-1" />
    <span className="text-xs font-pixelify">{label}</span>
  </button>
);

export default TabButton;
