import React, { useState, useEffect } from "react";
import { AiOutlineSecurityScan, AiOutlineHistory } from "react-icons/ai";
import { ethers } from "ethers";
import { useWeb3 } from "../context/Web3Context";

import ModeSwitcher from "../components/ModeSwitcher";
import SearchBar from "../components/SearchBar";
import TabButton from "../components/TabButton";
import ResultView from "../components/ResultView";
import LoadingSpinner from "../components/LoadingSpinner";

const Popup = () => {
  const { contract } = useWeb3();
  const [activeTab, setActiveTab] = useState("scan");
  const [activeMode, setActiveMode] = useState("scan");
  const [isLoading, setIsLoading] = useState(false);
  const [reportResult, setReportResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [threatTypes, setThreatTypes] = useState([]);
  const [selectedThreats, setSelectedThreats] = useState([]);

  useEffect(() => {
    fetchThreatTypes();
  }, [contract]);

  const fetchThreatTypes = async () => {
    try {
      if (!contract) return;
      const types = await contract.getThreatTypes();
      setThreatTypes(types);
    } catch (error) {
      console.error("Error fetching threat types:", error);
    }
  };

  const handleThreatChange = (threat) => {
    setSelectedThreats((prev) =>
      prev.includes(threat)
        ? prev.filter((t) => t !== threat)
        : [...prev, threat]
    );
  };

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

    if (!searchQuery || !searchQuery.trim()) {
      setReportResult({
        error: true,
        message: "Please enter a valid contract address",
      });
      return;
    }

    if (!ethers.utils.isAddress(searchQuery)) {
      setReportResult({
        error: true,
        message: "Invalid Ethereum address format",
      });
      return;
    }

    if (selectedThreats.length === 0) {
      setReportResult({
        error: true,
        message: "Please select at least one threat type",
      });
      return;
    }

    const encodedThreats = encodeURIComponent(selectedThreats.join(","));
    window.open(
      `http://localhost:5173/#/report?address=${searchQuery}&threats=${encodedThreats}`,
      "_blank"
    );
  };

  const calculateThreatDistribution = (reports) => {
    const threatCount = {};
    let totalThreats = 0;

    reports.forEach((report) => {
      report.threats.forEach((threat) => {
        threatCount[threat] = (threatCount[threat] || 0) + 1;
        totalThreats++;
      });
    });

    return Object.entries(threatCount).map(([threat, count]) => ({
      threat,
      count,
      percentage: ((count / totalThreats) * 100).toFixed(1),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || isLoading) return;
    activeMode === "scan" ? handleScanSubmit(e) : handleReportSubmit(e);
  };

  return (
    <div className="w-[350px] h-[600px] flex flex-col bg-gradient-to-b from-[#c6d5d3] to-[#8d908f] text-white">
      <header className="bg-[#ED6A5A] backdrop-blur-sm shadow-lg p-2">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl text-center font-pixelify bg-gradient-to-r from-white to-white/80 text-transparent bg-clip-text text-center">
            MineGuard
          </h1>
        </div>
      </header>
      <ModeSwitcher activeMode={activeMode} setActiveMode={setActiveMode} />

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex flex-col items-center justify-start space-y-4">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isLoading={isLoading}
            activeMode={activeMode}
            onSubmit={handleSubmit}
          />

          {activeMode === "report" && (
            <div className="w-full bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3 text-sm">
                Select Threat Types:
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {threatTypes.map((threat) => (
                  <button
                    key={threat}
                    type="button"
                    onClick={() => handleThreatChange(threat)}
                    className={`p-2 rounded-lg text-sm text-center transition-all ${
                      selectedThreats.includes(threat)
                        ? "bg-[#ED6A5A] text-white"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    {threat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading && <LoadingSpinner activeMode={activeMode} />}

          <ResultView reportResult={reportResult} isLoading={isLoading} />
        </div>
      </main>

      <footer className="bg-[#ED6A5A] border-t border-white/10 shadow-lg mt-auto flex justify-center items-center">
        <nav className="flex justify-around items py-2 w-3/4">
          <TabButton
            id="scan"
            icon={AiOutlineSecurityScan}
            label="Scan"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <TabButton
            id="history"
            icon={AiOutlineHistory}
            label="History"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </nav>
      </footer>
    </div>
  );
};

export default Popup;
