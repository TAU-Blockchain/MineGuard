import React from "react";

const TabButton = ({ id, icon: Icon, label, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`group flex items-center mx-2 gap-3 px-4 py-2.5 w-full transition-all duration-300 bg-white border rounded text-[#ED6A5A] ${
      activeTab === id
        ? " text-black rounded-lg shadow-md border-[#ED6A5A]"
        : "border-none"
    }`}
  >
    <Icon
      className={`text-lg text-[#ED6A5A] transition-transform duration-300 ${
        activeTab === id ? "transform scale-110" : "group-hover:scale-110"
      }`}
    />
    <span
      className={`text-sm text-[#ED6A5A] font-medium tracking-wide transition-all duration-300 ${
        activeTab === id ? "opacity-100" : "opacity-70 group-hover:opacity-100"
      }`}
    >
      {label}
    </span>
  </button>
);

export default TabButton;
