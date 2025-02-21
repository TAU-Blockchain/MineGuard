import React from "react";
import { MdWarning, MdVerified } from "react-icons/md";
import { HiCode } from "react-icons/hi";
import Badge from "./Badge";

const ResultView = ({ reportResult, isLoading }) => {
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

  if (!reportResult || isLoading) return null;

  return (
    <div className="w-full mt-4 p-4 bg-[#8AA6A3] backdrop-blur-sm rounded-2xl shadow-lg">
      {reportResult.error ? (
        <div className="flex items-center gap-2 text-[#ef5e4b] font-pixelify">
          <MdWarning className="text-2xl" />
          <span>{reportResult.message}</span>
        </div>
      ) : (
        <div className="space-y-4 py-8">
          {/* Contract Info */}
          <div className="flex flex-col gap-2">
            <h3 className="font-pixelify text-xl text-white">Contract Info</h3>
            <div className="font-mono text-sm break-all bg-white/10 p-2 rounded-lg">
              {reportResult.address}
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                icon={HiCode}
                text="Contract"
                color="bg-yellow-100 text-yellow-700"
                tooltipText="This address contains a smart contract"
              />
              <Badge
                icon={MdVerified}
                text="Verified"
                color="bg-green-100 text-green-700"
                tooltipText="Contract is verified"
              />
            </div>
          </div>

          {/* Reports Section */}
          {reportResult.reports.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-pixelify text-xl text-white">Reports</h3>
                <span className="text-sm text-white/80">
                  Total: {reportResult.reports.length}
                </span>
              </div>

              {/* Threat Distribution */}
              {reportResult.reports.length > 0 && (
                <div className="bg-white/10 p-3 rounded-xl">
                  <h4 className="font-pixelify text-sm mb-2">
                    Threat Distribution
                  </h4>
                  <div className="space-y-2">
                    {calculateThreatDistribution(reportResult.reports)
                      .slice(0, 3)
                      .map(({ threat, count, percentage }) => (
                        <div
                          key={threat}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-white/90">{threat}</span>
                          <span className="text-white/70">
                            {count} ({percentage}%)
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Report List */}
              <div className="space-y-3">
                {reportResult.reports.slice(0, 2).map((report, index) => (
                  <div key={index} className="bg-white/10 p-3 rounded-xl">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {report.threats.map((threat, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs font-medium rounded-full bg-[#ED6A5A] text-white"
                        >
                          {threat}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-white/70">
                      <div className="flex justify-between">
                        <span>
                          Reporter: {report.reporter.slice(0, 6)}...
                          {report.reporter.slice(-4)}
                        </span>
                        <span>
                          {new Date(Number(report.timestamp)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href={`http://localhost:5173/scan`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 group"
              >
                <div className="text-white/90 font-pixelify text-sm group-hover:text-white">
                  View Full Report on Website
                </div>
                <div className="text-white/60 text-xs mt-1 group-hover:text-white/80">
                  {reportResult.reports.length - 2} more reports and detailed
                  analysis
                </div>
              </a>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-white/80">
                No reports found for this address.
              </p>
              <p className="text-sm text-white/60 mt-1">
                Last Scan: {new Date(reportResult.timestamp).toLocaleString()}
              </p>
              <a
                href={`https://mineguard.vercel.app/scan/${reportResult.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-white/90 hover:text-white text-sm underline decoration-dotted underline-offset-4"
              >
                View Detailed Analysis on Website
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultView;
