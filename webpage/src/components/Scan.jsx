import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { useContract } from "../hooks/useContract";
import { ethers } from "ethers";

function Scan() {
  const contract = useContract();
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

      if (!ethers.isAddress(searchQuery)) {
        throw new Error("Invalid Ethereum address format");
      }

      console.log("Contract instance:", contract);
      console.log("Scanning address:", searchQuery);

      const scanResult = await contract.getReports(searchQuery);
      console.log("Raw scan result:", scanResult);

      const formattedReports = scanResult.map((report) => {
        const [threats, reporter, timestamp] = report;
        const dateTimestamp = Number(timestamp.toString()) * 1000;
        return [threats, reporter, new Date(dateTimestamp).toISOString()];
      });

      const formattedResult = {
        address: searchQuery,
        reports: formattedReports,
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#9BC1BC] shadow-lg shadow-[#9BC1BC] text-white py-20 my-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-pixelify">
              Security Scanner
            </h1>
            <p className="text-xl mb-8">
              Enter a contract or wallet address to scan for potential security
              risks
            </p>
            <form onSubmit={handleScanSubmit} className="w-full relative">
              <div className="relative flex items-center max-w-2xl mx-auto">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter contract address to scan..."
                  className="w-full pl-6 pr-12 py-4 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ED6A5A]"
                />
                <button
                  type="submit"
                  className="absolute right-2 p-2 bg-[#ED6A5A] text-white rounded-full hover:bg-white hover:text-[#ED6A5A] transition duration-300"
                  disabled={!searchQuery.trim()}
                >
                  <BiSearch className="text-2xl" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ED6A5A] mb-4"></div>
              <p className="text-gray-600">Scanning address...</p>
            </div>
          )}

          {reportResult && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-5xl font-bold mb-4 font-pixelify text-[#ED6A5A]">
                  Scan Results
                </h2>
              </div>

              {reportResult.error ? (
                <div className="bg-white p-8 rounded-lg shadow-lg shadow-[#ED6A5A] text-center">
                  <div className="text-[#ED6A5A] text-lg font-medium">
                    {reportResult.message}
                  </div>
                </div>
              ) : (
                <div className="grid gap-8">
                  <div className="bg-white p-8 rounded-lg shadow-lg shadow-[#ED6A5A] text-center">
                    <h3 className="text-xl text-[#ED6A5A] font-semibold mb-4">
                      Scanned Address
                    </h3>
                    <div className="font-mono text-sm break-all text-gray-600">
                      {reportResult.address}
                    </div>
                  </div>

                  {reportResult.reports.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow-lg shadow-[#ED6A5A] text-center">
                      <div className="text-[#ED6A5A] text-lg font-medium">
                        No reports found for this address.
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {reportResult.reports.map((report, index) => {
                        const [threats, reporter, timestamp] = report;
                        return (
                          <div
                            key={index}
                            className="bg-white p-8 rounded-lg shadow-lg shadow-[#ED6A5A] text-center"
                          >
                            <div className="flex flex-wrap gap-2 justify-center mb-4">
                              {threats.map((threat, i) => (
                                <span
                                  key={i}
                                  className="px-4 py-1 text-sm font-medium rounded-full bg-[#ED6A5A] text-white"
                                >
                                  {threat}
                                </span>
                              ))}
                            </div>
                            <div className="text-sm text-[#ed6b5aa1]">
                              <div>Reporter: {reporter}</div>
                              <div>
                                Scan Time:{" "}
                                {new Date(timestamp).toLocaleString("tr-TR", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })}
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
          )}
        </div>
      </section>
    </div>
  );
}

export default Scan;
