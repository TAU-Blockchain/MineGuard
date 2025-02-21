import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaTrophy,
  FaExclamationTriangle,
  FaChartBar,
  FaCopy,
} from "react-icons/fa";
import { apiService } from "../services/apiService";

const Leaderboard = () => {
  const [popularThreats, setPopularThreats] = useState([]);
  const [reportedContracts, setReportedContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const [threats, contracts] = await Promise.all([
          apiService.getPopularThreatTypes(),
          apiService.getMostReportedContracts(5),
        ]);
        setPopularThreats(threats || []);
        setReportedContracts(contracts || []);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleCopyAddress = (e, address) => {
    e.preventDefault(); // Link'e tıklamayı engelle
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000); // 2 saniye sonra notification'ı kaldır
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ED6A5A]"></div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 py-12">
      {/* Popular Threat Types */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <FaExclamationTriangle className="text-2xl text-[#ED6A5A]" />
          <h3 className="text-xl font-bold text-gray-800">
            Popular Threat Types
          </h3>
        </div>
        <div className="space-y-4">
          {popularThreats.slice(0, 5).map((threat, index) => (
            <div
              key={threat.threat}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl text-[#ED6A5A]">
                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : "#" + (index + 1)}
                </span>
                <span className="font-medium">{threat.threat}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaChartBar className="text-[#ED6A5A]" />
                <span className="text-gray-600">{threat.count} reports</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Most Reported Contracts */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <FaTrophy className="text-2xl text-[#ED6A5A]" />
          <h3 className="text-xl font-bold text-gray-800">
            Most Reported Contracts
          </h3>
        </div>
        <div className="space-y-4">
          {reportedContracts.map((contract, index) => (
            <Link
              key={contract.contractAddress}
              to={`/scan?address=${contract.contractAddress}`}
              className="flex flex-col p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-[#ED6A5A]">
                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : "#" + (index + 1)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium font-mono">
                      {formatAddress(contract.contractAddress)}
                    </span>
                    <button
                      onClick={(e) =>
                        handleCopyAddress(e, contract.contractAddress)
                      }
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <FaCopy className="text-[#ED6A5A] text-sm" />
                    </button>
                    {copiedAddress === contract.contractAddress && (
                      <span className="text-xs text-green-600 font-medium">
                        Copied!
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-600">
                  {contract.reportCount} reports
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {contract.uniqueThreats.slice(0, 3).map((threat) => (
                  <span
                    key={threat}
                    className="px-2 py-1 text-xs bg-[#ED6A5A] text-white rounded-full"
                  >
                    {threat}
                  </span>
                ))}
                {contract.uniqueThreats.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                    +{contract.uniqueThreats.length - 3} more
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
