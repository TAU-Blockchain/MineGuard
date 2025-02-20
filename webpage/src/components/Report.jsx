import { useEffect, useState } from "react";
import { TbReport } from "react-icons/tb";
import { BiSearch } from "react-icons/bi";
import { useContract } from "../hooks/useContract";
import { useWeb3 } from "../context/Web3Context";
import { ethers } from "ethers";

function Report() {
  const contract = useContract();
  const { connectWallet, account } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);
  const [reportResult, setReportResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThreats, setSelectedThreats] = useState([]);
  const [threatTypes, setThreatTypes] = useState([]);

  useEffect(() => {
    fetchThreatTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchThreatTypes = async () => {
    try {
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

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!account) {
        await connectWallet();
      }

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

      if (selectedThreats.length === 0) {
        throw new Error("Please select at least one threat type");
      }

      console.log("Contract instance:", contract);
      console.log("Reporting address:", searchQuery);
      console.log("Selected threats:", selectedThreats);

      const tx = await contract.report(searchQuery, selectedThreats);

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

  return (
    <div className="min-h-screen">
      <section className="bg-[#9BC1BC] shadow-lg shadow-[#9BC1BC] text-white py-20 my-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-pixelify">
              Report Generator
            </h1>
            <p className="text-xl mb-8">
              Submit security reports for suspicious contracts or wallets
            </p>
            <form onSubmit={handleReportSubmit} className="w-full">
              <div className="space-y-6">
                <div className="relative flex items-center max-w-2xl mx-auto">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter contract address to report..."
                    className="w-full pl-6 pr-12 py-4 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ED6A5A]"
                  />
                  <BiSearch className="absolute right-4 text-2xl text-gray-400" />
                </div>

                <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto">
                  <h3 className="text-[#ED6A5A] font-semibold mb-4 text-left">
                    Select Threat Types:
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {threatTypes.map((threat) => (
                      <button
                        key={threat}
                        type="button"
                        onClick={() => handleThreatChange(threat)}
                        className={`p-3 rounded-lg text-center transition-all ${
                          selectedThreats.includes(threat)
                            ? "bg-[#ED6A5A] text-white shadow-md transform scale-105"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {threat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="max-w-2xl mx-auto">
                  <button
                    type="submit"
                    disabled={
                      isLoading ||
                      !searchQuery.trim() ||
                      selectedThreats.length === 0
                    }
                    className="w-full bg-[#ED6A5A] text-white py-4 rounded-full hover:bg-white hover:text-[#ED6A5A] border border-[#ED6A5A] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Submitting Report..." : "Submit Report"}
                  </button>
                </div>
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
              <p className="text-gray-600">Generating report...</p>
            </div>
          )}

          {reportResult && (
            <div className="bg-white p-8 rounded-lg shadow-lg shadow-[#ED6A5A] text-center max-w-2xl mx-auto">
              {reportResult.error ? (
                <div className="text-[#ED6A5A] text-lg font-medium">
                  {reportResult.message}
                </div>
              ) : (
                <>
                  <TbReport className="text-5xl text-[#ED6A5A] mx-auto mb-4" />
                  <div className="text-[#ED6A5A] text-xl font-medium mb-4">
                    {reportResult.message}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Report;
