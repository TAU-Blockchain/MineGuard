import React, { useState } from "react";
import { AiOutlineSecurityScan, AiOutlineHistory } from "react-icons/ai";
import { ethers } from "ethers";
import { useWeb3 } from "../context/Web3Context";

import ModeSwitcher from "../components/ModeSwitcher";
import SearchBar from "../components/SearchBar";
import TabButton from "../components/TabButton";
import ResultView from "../components/ResultView";
import LoadingSpinner from "../components/LoadingSpinner";

const Popup = () => {
  const { connectWallet, contract } = useWeb3();
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
    <div className="w-[350px] min-h-[500px] bg-gradient-to-b from-[#9BC1BC] to-[#8AA6A3] text-white">
      <header className="bg-[#9BC1BC]/90 backdrop-blur-sm shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-pixelify bg-gradient-to-r from-white to-white/80 text-transparent bg-clip-text text-center">
            MineGuard
          </h1>
        </div>
        <ModeSwitcher activeMode={activeMode} setActiveMode={setActiveMode} />
      </header>

      <main className="p-6 flex flex-col items-center justify-start space-y-4">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isLoading={isLoading}
          activeMode={activeMode}
          onSubmit={handleSubmit}
        />

        {isLoading && <LoadingSpinner activeMode={activeMode} />}

        <ResultView reportResult={reportResult} isLoading={isLoading} />
      </main>

      <footer className="fixed bottom-0 w-full bg-[#ED6A5A] border-t border-white/10 shadow-lg">
        <nav className="flex justify-around py-2">
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
