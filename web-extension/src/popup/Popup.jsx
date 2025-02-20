import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import {
  AiOutlineSecurityScan,
  AiOutlineHistory,
  AiOutlineSetting,
} from "react-icons/ai";
import { BiScan } from "react-icons/bi";
import { TbReport } from "react-icons/tb";

const Popup = () => {
  const [activeTab, setActiveTab] = useState("scan");
  const [activeMode, setActiveMode] = useState("scan");
  const [isLoading, setIsLoading] = useState(false);
  const [reportResult, setReportResult] = useState(null);

  const handleSearch = (query) => {
    setIsLoading(true);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab?.id) {
        chrome.tabs.sendMessage(activeTab.id, {
          type: "SEARCH_QUERY",
          query: query,
        });
      }
      setTimeout(() => setIsLoading(false), 1500);
    });
  };

  const TabButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center p-2 ${
        activeTab === id
          ? "text-blue-600 border-t-2 border-blue-600"
          : "text-gray-500 hover:text-blue-600 transition-colors"
      }`}
    >
      <Icon className="text-xl mb-1" />
      <span className="text-xs">{label}</span>
    </button>
  );

  const ModeSwitcher = () => (
    <div className="bg-white/10 p-1.5 rounded-xl shadow-inner">
      <div className="relative flex items-center gap-1">
        {/* Background Slider */}
        <div
          className={`absolute h-full transition-all duration-300 ease-out rounded-lg ${
            activeMode === "scan" ? "left-0 w-1/2" : "left-1/2 w-1/2"
          } bg-white shadow-lg`}
        />

        {/* Mode Buttons */}
        <button
          onClick={() => setActiveMode("scan")}
          className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-all duration-200 z-10 ${
            activeMode === "scan"
              ? "text-blue-600 font-semibold scale-105"
              : "text-white hover:text-white/90"
          }`}
        >
          <BiScan
            className={`text-xl transition-transform ${
              activeMode === "scan" ? "scale-110" : ""
            }`}
          />
          <span
            className={`font-medium ${
              activeMode === "scan" ? "text-blue-600" : "text-white"
            }`}
          >
            Scan
          </span>
        </button>

        <button
          onClick={() => setActiveMode("report")}
          className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-all duration-200 z-10 ${
            activeMode === "report"
              ? "text-indigo-600 font-semibold scale-105"
              : "text-white hover:text-white/90"
          }`}
        >
          <TbReport
            className={`text-xl transition-transform ${
              activeMode === "report" ? "scale-110" : ""
            }`}
          />
          <span
            className={`font-medium ${
              activeMode === "report" ? "text-indigo-600" : "text-white"
            }`}
          >
            Report
          </span>
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">
            {activeMode === "scan"
              ? "Scanning address..."
              : "Generating report..."}
          </p>
        </div>
      );
    }

    if (activeMode === "scan") {
      return (
        <div className="text-center text-gray-600 mt-6">
          <div className="bg-gradient-to-b from-blue-50 to-white rounded-lg p-6 mb-4 shadow-sm border border-blue-100">
            <BiScan className="text-5xl text-blue-600 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              Security Scanner
            </h2>
            <p className="text-sm">
              Enter a contract or wallet address above to scan for potential
              security risks and vulnerabilities.
            </p>
          </div>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Contract or Wallet Address..."
          />
        </div>
      );
    }

    return (
      <div className="text-center text-gray-600 mt-6">
        <div className="bg-gradient-to-b from-indigo-50 to-white rounded-lg p-6 mb-4 shadow-sm border border-indigo-100">
          <TbReport className="text-5xl text-indigo-600 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-indigo-800 mb-2">
            Report Generator
          </h2>
          <p className="text-sm">
            Enter a contract or wallet address above to generate a detailed
            security report.
          </p>
        </div>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Contract or Wallet Address..."
        />
      </div>
    );
  };

  return (
    <div className="w-[350px] min-h-[400px] bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Units Scanner</h1>
          <button className="p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <AiOutlineSetting className="text-xl" />
          </button>
        </div>
        <div className="mt-4">
          <ModeSwitcher />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">{renderContent()}</div>

      {/* Footer Navigation */}
      <div className="border-t flex justify-around bg-white mt-auto py-8">
        <TabButton
          id="scan"
          icon={AiOutlineSecurityScan}
          label="Scan History"
        />
        <TabButton
          id="history"
          icon={AiOutlineHistory}
          label="Report History"
        />
      </div>
    </div>
  );
};

export default Popup;
