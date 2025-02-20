import React, { useState } from "react";
import {
  AiOutlineSecurityScan,
  AiOutlineHistory,
  AiOutlineSetting,
} from "react-icons/ai";
import { BiScan } from "react-icons/bi";
import { TbReport } from "react-icons/tb";
import { useContract } from "../hooks/useContract";
import { BiSearch } from "react-icons/bi";
import { ethers } from "ethers";
import { useWeb3 } from "../context/Web3Context";

const Popup = () => {
  const contract = useContract();
  const { connectWallet } = useWeb3();
  const [activeTab, setActiveTab] = useState("scan");
  const [activeMode, setActiveMode] = useState("scan");
  const [isLoading, setIsLoading] = useState(false);
  const [reportResult, setReportResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setReportResult(null);

    try {
      if (!contract) {
        throw new Error(
          "Contract is not initialized yet. Please try again in a moment."
        );
      }

      if (!searchQuery || !searchQuery.trim()) {
        throw new Error("Please enter a valid contract address");
      }

      if (!ethers.utils.isAddress(searchQuery)) {
        throw new Error("Invalid Ethereum address format");
      }

      console.log("Contract instance:", contract);
      console.log("Scanning address:", searchQuery);

      const scanResult = await contract.getReports(searchQuery);
      console.log("Raw scan result:", scanResult);

      const formattedResult = {
        address: searchQuery,
        reports: scanResult,
        timestamp: new Date().toISOString(),
      };

      console.log("Formatted result:", formattedResult);
      setReportResult(formattedResult);
    } catch (error) {
      console.error("Scan error:", error);
      setReportResult({
        error: true,
        message:
          error.message ||
          "An error occurred while scanning. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const connected = await connectWallet();
      if (!connected) {
        throw new Error("Failed to connect wallet. Please try again.");
      }

      if (!contract) {
        throw new Error(
          "Contract is not initialized yet. Please try again in a moment."
        );
      }

      if (!searchQuery || !searchQuery.trim()) {
        throw new Error("Please enter a valid contract address");
      }

      if (!ethers.utils.isAddress(searchQuery)) {
        throw new Error("Invalid Ethereum address format");
      }

      console.log("Contract instance:", contract);
      console.log("Reporting address:", searchQuery);

      const tx = await contract.report(
        searchQuery,
        ["Phishing", "Rug Pull", "Scam"],
        "This is a test report"
      );

      console.log("Transaction sent:", tx.hash);

      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      setReportResult({
        success: true,
        message: "Report submitted successfully!",
        txHash: tx.hash,
      });
    } catch (error) {
      console.error("Report generation error:", error);
      setReportResult({
        error: true,
        message: error.message || "Failed to submit report. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
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

  const SearchForm = ({ onSubmit, placeholder }) => (
    <form onSubmit={onSubmit} className="w-full relative">
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-4 pr-12 py-2.5 bg-white/10 text-gray-600 placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 p-2 text-gray-600 bg-transparent hover:text-gray-600 border-none transition-colors"
          disabled={!searchQuery.trim()}
        >
          <BiSearch className="text-xl" />
        </button>
      </div>
    </form>
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
          <SearchForm
            onSubmit={handleScanSubmit}
            placeholder="Enter contract address to scan..."
          />
          {reportResult && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-800">
                  Scan Results
                </h3>
                <span className="text-xs text-gray-500">
                  {new Date(reportResult.timestamp).toLocaleString()}
                </span>
              </div>

              {reportResult.error ? (
                <div className="text-red-500 text-sm">
                  {reportResult.message}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Address Section */}
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Scanned Address:</span>
                      <div className="mt-1 font-mono text-xs break-all">
                        {reportResult.address}
                      </div>
                    </div>
                  </div>

                  {/* Reports Section */}
                  {reportResult.reports.map((report, index) => {
                    const [threats, description, reporter, timestamp] = report;
                    return (
                      <div
                        key={index}
                        className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm"
                      >
                        {/* Threat Types */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {threats.map((threat, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 text-xs font-medium rounded-full bg-red-50 text-red-600"
                            >
                              {threat}
                            </span>
                          ))}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-700 mb-3">
                          {description}
                        </p>

                        {/* Reporter & Time */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="font-mono">Reporter: {reporter}</div>
                          <div>
                            {new Date(Number(timestamp.hex)).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
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
            security report. You'll need to connect your wallet to submit a
            report.
          </p>
        </div>
        <SearchForm
          onSubmit={handleReportSubmit}
          placeholder="Enter contract address for report..."
        />
        {reportResult && (
          <div
            className={`mt-4 p-4 rounded-lg shadow-sm border ${
              reportResult.error
                ? "bg-red-50 border-red-100"
                : "bg-green-50 border-green-100"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              {reportResult.error ? (
                <div className="text-red-600 text-sm font-medium">
                  {reportResult.message}
                </div>
              ) : (
                <>
                  <div className="text-green-600 text-sm font-medium">
                    {reportResult.message}
                  </div>
                  <a
                    href={`https://testnet.units.explorer.co/tx/${reportResult.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-600 hover:text-indigo-800 underline"
                  >
                    View Transaction
                  </a>
                </>
              )}
            </div>
          </div>
        )}
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
