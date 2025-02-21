import { useState } from "react";
import { BiSearch, BiChevronDown } from "react-icons/bi";
import { HiCode, HiShieldExclamation } from "react-icons/hi";
import { MdVerified, MdWarning } from "react-icons/md";
import { useWeb3 } from "../context/Web3Context";
import { ethers } from "ethers";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { apiService } from "../services/apiService";
import Badge from "../components/Badge";
import Discussion from "../components/Discussion";

ChartJS.register(ArcElement, Tooltip, Legend);

function Scan() {
  const { getReports, account } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);
  const [reportResult, setReportResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleReports, setVisibleReports] = useState(5);
  const [contractInfo, setContractInfo] = useState(null);

  const calculateThreatDistribution = (reports) => {
    const threatCount = {};
    let totalThreats = 0;

    reports.forEach((report) => {
      report.threats.forEach((threat) => {
        threatCount[threat] = (threatCount[threat] || 0) + 1;
        totalThreats++;
      });
    });

    const labels = Object.keys(threatCount);
    const data = Object.values(threatCount);
    const percentages = data.map((count) =>
      ((count / totalThreats) * 100).toFixed(1)
    );

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "#ED6A5A",
            "#F4F1BB",
            "#9BC1BC",
            "#5CA4A9",
            "#E6EBE0",
            "#FF9B85",
            "#FFD7D2",
            "#B8E0DC",
          ],
          borderColor: "white",
          borderWidth: 2,
        },
      ],
      percentages,
    };
  };

  const handleSearchQueryChange = (e) => {
    setReportResult(null);
    setSearchQuery(e.target.value);
  };

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setReportResult(null);
    setContractInfo(null);

    try {
      if (!searchQuery || !searchQuery.trim()) {
        throw new Error("Please enter a valid contract address");
      }

      if (!ethers.isAddress(searchQuery)) {
        throw new Error("Invalid Ethereum address format");
      }

      const [verificationStatus, contractDetails] = await Promise.all([
        apiService.getContractVerificationStatus(searchQuery),
        apiService.getContractDetails(searchQuery),
      ]);

      setContractInfo({
        ...verificationStatus,
        contractDetails,
      });

      const reports = await getReports(searchQuery);

      const formattedResult = {
        address: searchQuery,
        reports: reports,
        timestamp: new Date().toISOString(),
      };
      await apiService.logScan(
        searchQuery,
        account,
        verificationStatus.isVerified,
        contractDetails
      );

      setReportResult(formattedResult);
      setSearchQuery("");
    } catch (error) {
      console.error("Scan error:", error);

      if (error.message.includes("contract not found")) {
        setReportResult({
          error: true,
          message:
            "Contract not found at this address. Please verify the address and try again.",
        });
      } else if (error.message.includes("network error")) {
        setReportResult({
          error: true,
          message:
            "Network error occurred. Please check your connection and try again.",
        });
      } else {
        setReportResult({
          error: true,
          message:
            error.message ||
            "An error occurred while scanning. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowMore = () => {
    setVisibleReports((prev) => prev + 5);
  };

  const sortReportsByTimestamp = (reports) => {
    return [...reports].sort((a, b) => {
      const timestampA = new Date(a.timestamp).getTime();
      const timestampB = new Date(b.timestamp).getTime();
      return timestampB - timestampA;
    });
  };

  return (
    <div className="min-h-screen">
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
                  onChange={handleSearchQueryChange}
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
                  {reportResult.reports.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow-lg shadow-[#ED6A5A]">
                      <div className="flex flex-col items-center gap-4">
                        <h3 className="text-xl text-[#ED6A5A] font-semibold">
                          Scanned Address
                        </h3>
                        <div className="font-mono text-sm break-all text-gray-600">
                          {reportResult.address}
                        </div>
                        {contractInfo && (
                          <div className="flex flex-wrap gap-2">
                            {contractInfo.isContract ? (
                              <Badge
                                icon={HiCode}
                                text="Contract"
                                color="bg-yellow-100 text-yellow-700"
                                tooltipText="This address contains a smart contract"
                              />
                            ) : (
                              <Badge
                                icon={HiCode}
                                text="Not a Contract"
                                color="bg-gray-100 text-gray-700"
                                tooltipText="This is a wallet address, not a smart contract"
                              />
                            )}

                            {contractInfo.isVerified ? (
                              <Badge
                                icon={MdVerified}
                                text="Verified"
                                color="bg-green-100 text-green-700"
                                tooltipText="This contract's source code is verified and trusted"
                              />
                            ) : (
                              <Badge
                                icon={HiShieldExclamation}
                                text="Unverified"
                                color="bg-red-100 text-red-700"
                                tooltipText="This contract's source code is not verified, be cautious"
                              />
                            )}

                            {contractInfo.isVerified && contractInfo.isScam && (
                              <Badge
                                icon={MdWarning}
                                text="Scam"
                                color="bg-red-100 text-red-700"
                                tooltipText="This contract has been flagged as potentially fraudulent"
                              />
                            )}

                            {contractInfo.contractDetails && (
                              <>
                                {contractInfo.contractDetails.status
                                  .isSelfDestructed && (
                                  <Badge
                                    icon={MdWarning}
                                    text="Self Destructed"
                                    color="bg-red-100 text-red-700"
                                    tooltipText="This contract has self-destructed and is no longer usable"
                                  />
                                )}
                                {contractInfo.contractDetails.status
                                  .isProxy && (
                                  <Badge
                                    icon={HiCode}
                                    text="Proxy"
                                    color="bg-blue-100 text-blue-700"
                                    tooltipText="This is a proxy contract, it may point to another contract"
                                  />
                                )}
                                {contractInfo.contractDetails.contractType
                                  .canWrite ? (
                                  <Badge
                                    icon={HiCode}
                                    text="Writable"
                                    color="bg-yellow-100 text-yellow-700"
                                    tooltipText="This contract has write permissions, use with caution"
                                  />
                                ) : (
                                  <Badge
                                    icon={HiCode}
                                    text="Read Only"
                                    color="bg-green-100 text-green-700"
                                    tooltipText="This contract has read-only permissions, more secure"
                                  />
                                )}
                              </>
                            )}
                          </div>
                        )}
                        <div className="text-[#ED6A5A] text-lg font-medium mt-4">
                          No reports found for this address.
                        </div>
                        <div className="text-sm text-[#ed6b5aa1]">
                          Last Scan:{" "}
                          {new Date(reportResult.timestamp).toLocaleString(
                            "tr-TR",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white p-8 rounded-lg shadow-lg shadow-[#ED6A5A]">
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="flex flex-col justify-start items-start">
                            <div className="flex items-center gap-3 mb-4">
                              <h3 className="text-xl text-[#ED6A5A] font-semibold">
                                Scanned Address
                              </h3>
                              {contractInfo && (
                                <div className="flex flex-wrap gap-2">
                                  {contractInfo.isContract ? (
                                    <Badge
                                      icon={HiCode}
                                      text="Contract"
                                      color="bg-yellow-100 text-yellow-700"
                                      tooltipText="This address contains a smart contract"
                                    />
                                  ) : (
                                    <Badge
                                      icon={HiCode}
                                      text="Not a Contract"
                                      color="bg-gray-100 text-gray-700"
                                      tooltipText="This is a wallet address, not a smart contract"
                                    />
                                  )}

                                  {contractInfo.isVerified ? (
                                    <Badge
                                      icon={MdVerified}
                                      text="Verified"
                                      color="bg-green-100 text-green-700"
                                      tooltipText="This contract's source code is verified and trusted"
                                    />
                                  ) : (
                                    <Badge
                                      icon={HiShieldExclamation}
                                      text="Unverified"
                                      color="bg-red-100 text-red-700"
                                      tooltipText="This contract's source code is not verified, be cautious"
                                    />
                                  )}
                                  {contractInfo.isVerified &&
                                    contractInfo.isScam && (
                                      <Badge
                                        icon={MdWarning}
                                        text="Scam"
                                        color="bg-red-100 text-red-700"
                                        tooltipText="This contract has been flagged as potentially fraudulent"
                                      />
                                    )}

                                  {contractInfo.contractDetails && (
                                    <>
                                      {contractInfo.contractDetails.status
                                        .isSelfDestructed && (
                                        <Badge
                                          icon={MdWarning}
                                          text="Self Destructed"
                                          color="bg-red-100 text-red-700"
                                          tooltipText="This contract has self-destructed and is no longer usable"
                                        />
                                      )}
                                      {contractInfo.contractDetails.status
                                        .isProxy && (
                                        <Badge
                                          icon={HiCode}
                                          text="Proxy"
                                          color="bg-blue-100 text-blue-700"
                                          tooltipText="This is a proxy contract, it may point to another contract"
                                        />
                                      )}
                                      {contractInfo.contractDetails.contractType
                                        .canWrite ? (
                                        <Badge
                                          icon={HiCode}
                                          text="Writable"
                                          color="bg-yellow-100 text-yellow-700"
                                          tooltipText="This contract has write permissions, use with caution"
                                        />
                                      ) : (
                                        <Badge
                                          icon={HiCode}
                                          text="Read Only"
                                          color="bg-green-100 text-green-700"
                                          tooltipText="This contract has read-only permissions, more secure"
                                        />
                                      )}
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="font-mono text-sm break-all text-gray-600 mb-4">
                              {reportResult.address}
                            </div>
                            <div className="text-sm text-[#ed6b5aa1]">
                              <div className="mb-2">
                                Total Reports: {reportResult.reports.length}
                              </div>
                              <div className="mt-2">
                                Last Scan:{" "}
                                {new Date(
                                  reportResult.timestamp
                                ).toLocaleString("tr-TR", {
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

                          <div className="flex flex-col items-center">
                            <h3 className="text-xl text-[#ED6A5A] font-semibold mb-6">
                              Threat Distribution
                            </h3>
                            <div className="flex items-start gap-8">
                              <div className="w-64 h-64">
                                <Pie
                                  data={calculateThreatDistribution(
                                    reportResult.reports
                                  )}
                                  options={{
                                    plugins: {
                                      legend: {
                                        display: false,
                                      },
                                      tooltip: {
                                        enabled: false,
                                      },
                                    },
                                    maintainAspectRatio: true,
                                  }}
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                {calculateThreatDistribution(
                                  reportResult.reports
                                ).labels.map((label, index) => {
                                  const dataset = calculateThreatDistribution(
                                    reportResult.reports
                                  ).datasets[0];
                                  const value = dataset.data[index];
                                  const total = dataset.data.reduce(
                                    (acc, data) => acc + data,
                                    0
                                  );
                                  const percentage = (
                                    (value / total) *
                                    100
                                  ).toFixed(1);
                                  const backgroundColor =
                                    dataset.backgroundColor[index];

                                  return (
                                    <div
                                      key={label}
                                      className="flex items-center gap-2 text-sm"
                                    >
                                      <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor }}
                                      />
                                      <span className="font-medium">
                                        {label}:
                                      </span>
                                      <span className="text-[#ed6b5aa1]">
                                        {value} ({percentage}%)
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Reports Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 auto-rows-fr">
                        {sortReportsByTimestamp(reportResult.reports)
                          .slice(0, visibleReports)
                          .map((report, index, array) => {
                            const isFullWidth = array.length === 1;

                            const isLastItemFullWidth =
                              array.length > 2 &&
                              array.length % 2 === 1 &&
                              index === array.length - 1;

                            return (
                              <div
                                key={index}
                                className={`bg-white p-8 rounded-lg shadow-lg shadow-[#ED6A5A] text-center ${
                                  isFullWidth || isLastItemFullWidth
                                    ? "md:col-span-2"
                                    : ""
                                }`}
                              >
                                <div className="flex flex-wrap gap-2 justify-center mb-4">
                                  {report.threats.map((threat, i) => (
                                    <span
                                      key={i}
                                      className="px-4 py-1 text-sm font-medium rounded-full bg-[#ED6A5A] text-white"
                                    >
                                      {threat}
                                    </span>
                                  ))}
                                </div>
                                <div className="text-sm text-[#ed6b5aa1]">
                                  <div>Reporter: {report.reporter}</div>
                                  <div>
                                    Report Time:{" "}
                                    {new Date(report.timestamp).toLocaleString(
                                      "tr-TR",
                                      {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                      }
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>

                      {/* Show More Button */}
                      {reportResult.reports.length > visibleReports && (
                        <div className="flex justify-center mt-8">
                          <button
                            onClick={handleShowMore}
                            className="flex items-center gap-2 bg-white text-[#ED6A5A] px-6 py-3 rounded-full hover:bg-[#ED6A5A] hover:text-white border border-[#ED6A5A] transition duration-300"
                          >
                            <BiChevronDown className="text-xl" />
                            Show More (
                            {reportResult.reports.length - visibleReports}{" "}
                            reports remaining)
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {reportResult && !reportResult.error && (
            <Discussion contractAddress={reportResult.address} />
          )}
        </div>
      </section>
    </div>
  );
}

export default Scan;
