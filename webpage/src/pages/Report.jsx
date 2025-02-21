import { useEffect, useState, useRef } from "react";
import { TbReport } from "react-icons/tb";
import { BiSearch, BiScan } from "react-icons/bi";
import { useWeb3 } from "../context/Web3Context";
import { ethers } from "ethers";
import { useNavigate, useSearchParams } from "react-router-dom";

function Report() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    connectWallet,
    account,
    submitReport,
    getThreatTypes,
    isLoading: walletLoading,
  } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);
  const [reportResult, setReportResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThreats, setSelectedThreats] = useState([]);
  const [threatTypes, setThreatTypes] = useState([]);
  const [isRequestSended, setIsRequestSended] = useState(false);
  const submitButtonRef = useRef(null);

  useEffect(() => {
    fetchThreatTypes();

    const addressFromQuery = searchParams.get("address");
    const threatsFromQuery = searchParams.get("threats");

    if (addressFromQuery && ethers.isAddress(addressFromQuery)) {
      setSearchQuery(addressFromQuery);
    }

    if (threatsFromQuery) {
      try {
        const decodedThreats = decodeURIComponent(threatsFromQuery).split(",");
        setSelectedThreats(decodedThreats);
      } catch (error) {
        console.error("Error parsing threats from URL:", error);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const autoSubmit = async () => {
      if (
        searchQuery &&
        ethers.isAddress(searchQuery) &&
        selectedThreats.length > 0 &&
        submitButtonRef.current &&
        !isLoading &&
        !walletLoading &&
        !isRequestSended
      ) {
        try {
          setIsRequestSended(true);
          if (!account) {
            await connectWallet();
          }
          submitButtonRef.current.click();
        } catch (error) {
          console.error("Auto-submit failed:", error);
          setIsRequestSended(false);
        }
      }
    };

    autoSubmit();
  }, [
    searchQuery,
    selectedThreats,
    account,
    isLoading,
    walletLoading,
    isRequestSended,
  ]);

  const fetchThreatTypes = async () => {
    try {
      const types = await getThreatTypes();
      setThreatTypes(types);
    } catch (error) {
      console.error("Error fetching threat types:", error);
    }
  };

  const handleThreatChange = (threat) => {
    setReportResult(null);
    setSelectedThreats((prev) =>
      prev.includes(threat)
        ? prev.filter((t) => t !== threat)
        : [...prev, threat]
    );
  };

  const handleSearchQueryChange = (e) => {
    setReportResult(null);
    setSearchQuery(e.target.value);
  };

  const handleViewScan = () => {
    navigate(`/scan?address=${searchQuery}`);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setReportResult(null);

    try {
      if (!account) {
        await connectWallet();
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

      const receipt = await submitReport(searchQuery, selectedThreats);

      setReportResult({
        success: true,
        message: "Report submitted successfully!",
        txHash: receipt.hash,
        address: searchQuery,
      });

      setSelectedThreats([]);
    } catch (error) {
      console.error("Report generation error:", error);

      if (error.message.includes("You have already reported")) {
        setReportResult({
          error: true,
          message:
            "You have already reported this address. Each address can only be reported once per wallet.",
        });
      } else if (error.message.includes("user rejected transaction")) {
        setReportResult({
          error: true,
          message: "Transaction was rejected. Please try again.",
        });
        setIsRequestSended(false);
      } else {
        setReportResult({
          error: true,
          message:
            error.message || "Failed to submit report. Please try again.",
        });
        setIsRequestSended(false);
      }
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
                    onChange={handleSearchQueryChange}
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
                    ref={submitButtonRef}
                    type="submit"
                    disabled={
                      isLoading ||
                      walletLoading ||
                      !searchQuery.trim() ||
                      selectedThreats.length === 0
                    }
                    className="w-full bg-[#ED6A5A] text-white py-4 rounded-full hover:bg-white hover:text-[#ED6A5A] border border-[#ED6A5A] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading || walletLoading ? (
                      <p className="inline-flex items-center">
                        Generating Report
                      </p>
                    ) : (
                      "Submit Report"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {(isLoading || walletLoading) && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ED6A5A] mb-4"></div>
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
                  <button
                    onClick={handleViewScan}
                    className="mt-4 inline-flex items-center gap-2 bg-[#ED6A5A] text-white px-6 py-2 rounded-full hover:bg-white hover:text-[#ED6A5A] border border-[#ED6A5A] transition duration-300"
                  >
                    <BiScan className="text-xl" />
                    View Scan Results
                  </button>
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
