const UNITS_API = "https://explorer-testnet.unit0.dev/api/v2";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const apiService = {
  // Scan endpoints
  async logScan(address, scannerAddress, verificationData, contractDetails) {
    const scanData = {
      contractAddress: address,
      scannedBy: scannerAddress,
      isContract: verificationData?.isContract || false,
      isVerified: verificationData?.isVerified || false,
      isScam: verificationData?.isScam || false,
      contractDetails: {
        status: {
          isSelfDestructed: contractDetails?.status?.isSelfDestructed || false,
          isProxy: contractDetails?.status?.isProxy || false,
        },
        contractType: {
          canWrite: contractDetails?.contractType?.canWrite || false,
        },
      },
    };
    const response = await fetch(`${API_URL}/scans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scanData),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to log scan");
    }

    return response.json();
  },

  async getLatestScan(contractAddress) {
    try {
      const response = await fetch(
        `${API_URL}/scans/${contractAddress}/latest`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch latest scan");
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Error fetching latest scan:", error);
      throw error;
    }
  },

  async getScanHistory(contractAddress, page = 1, limit = 10) {
    try {
      const response = await fetch(
        `${API_URL}/scans/${contractAddress}/history?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch scan history");
      }

      const data = await response.json();
      return data.success
        ? {
            scans: data.data,
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalScans: data.totalScans,
          }
        : null;
    } catch (error) {
      console.error("Error fetching scan history:", error);
      throw error;
    }
  },

  // Report endpoints
  async logReport(contractAddress, reporterAddress, threats) {
    try {
      const response = await fetch(`${API_URL}/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractAddress,
          reporter: reporterAddress,
          threats,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit report");
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Error submitting report:", error);
      throw error;
    }
  },

  async getContractReports(contractAddress, page = 1, limit = 10) {
    try {
      const response = await fetch(
        `${API_URL}/reports/contract/${contractAddress}?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch contract reports");
      }

      const data = await response.json();
      return data.success
        ? {
            reports: data.data,
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalReports: data.totalReports,
          }
        : null;
    } catch (error) {
      console.error("Error fetching contract reports:", error);
      throw error;
    }
  },

  async getReporterHistory(reporterAddress, page = 1, limit = 10) {
    try {
      const response = await fetch(
        `${API_URL}/reports/reporter/${reporterAddress}?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reporter history");
      }

      const data = await response.json();
      return data.success
        ? {
            reports: data.data,
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalReports: data.totalReports,
          }
        : null;
    } catch (error) {
      console.error("Error fetching reporter history:", error);
      throw error;
    }
  },

  async getContractThreatStats(contractAddress) {
    try {
      const response = await fetch(
        `${API_URL}/reports/contract/${contractAddress}/stats`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch threat statistics");
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Error fetching threat statistics:", error);
      throw error;
    }
  },

  // UNITS REST API
  async getContractVerificationStatus(address) {
    try {
      const response = await fetch(`${UNITS_API}/addresses/${address}`);
      const data = await response.json();

      if (!data || !data.address) {
        return {
          isVerified: false,
          isContract: false,
          isScam: false,
        };
      }

      return {
        isVerified: data.address.is_verified || false,
        isContract: data.address.is_contract || false,
        isScam: data.address.is_scam || false,
      };
    } catch (error) {
      console.error("Error fetching contract verification:", error);
      return {
        isVerified: false,
        isContract: false,
        isScam: false,
      };
    }
  },

  async getContractDetails(address) {
    try {
      const response = await fetch(`${UNITS_API}/smart-contracts/${address}`);
      const data = await response.json();

      if (!data) {
        return null;
      }

      return {
        contractType: {
          isReadOnly:
            data.hasCustomMethods?.read === false &&
            data.hasCustomMethods?.write === false,
          canRead: data.hasCustomMethods?.read || false,
          canWrite: data.hasCustomMethods?.write || false,
        },
        status: {
          isSelfDestructed: data.isSelfDestructed || false,
          isProxy: data.isProxy || false,
        },
        securityLevel: data.hasCustomMethods?.write
          ? "Warning: Writable Contract"
          : "Read Only Contract",
        description: [
          data.isSelfDestructed
            ? "This contract has self-destructed and is no longer usable."
            : null,
          data.isProxy
            ? "This is a proxy contract, it may point to another contract."
            : null,
          !data.hasCustomMethods?.read && !data.hasCustomMethods?.write
            ? "This contract has no custom methods."
            : null,
          data.hasCustomMethods?.read
            ? "This contract has read methods."
            : null,
          data.hasCustomMethods?.write
            ? "This contract has write methods."
            : null,
        ].filter(Boolean),
      };
    } catch (error) {
      console.error("Error fetching contract details:", error);
      return null;
    }
  },

  async getDiscussions(contractAddress = null, page = 1, limit = 10) {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (contractAddress) {
        queryParams.append("contractAddress", contractAddress);
      }

      const response = await fetch(`${API_URL}/discussions?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch discussions");
      }

      const data = await response.json();
      return data.success
        ? {
            discussions: data.data,
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalDiscussions: data.totalDiscussions,
          }
        : null;
    } catch (error) {
      console.error("Error fetching discussions:", error);
      throw error;
    }
  },

  async getDiscussion(discussionId) {
    try {
      const response = await fetch(`${API_URL}/discussions/${discussionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch discussion");
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Error fetching discussion:", error);
      throw error;
    }
  },

  async createDiscussion(discussionData) {
    try {
      const response = await fetch(`${API_URL}/discussions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discussionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create discussion");
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Error creating discussion:", error);
      throw error;
    }
  },

  async addReply(discussionId, replyData) {
    try {
      const response = await fetch(
        `${API_URL}/discussions/${discussionId}/replies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(replyData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add reply");
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Error adding reply:", error);
      throw error;
    }
  },

  async voteDiscussion(discussionId, walletAddress, voteType) {
    try {
      const response = await fetch(
        `${API_URL}/discussions/${discussionId}/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            walletAddress,
            voteType,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to vote on discussion");
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Error voting on discussion:", error);
      throw error;
    }
  },

  async voteReply(discussionId, replyId, walletAddress, voteType) {
    try {
      const response = await fetch(
        `${API_URL}/discussions/${discussionId}/replies/${replyId}/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            walletAddress,
            voteType,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to vote on reply");
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Error voting on reply:", error);
      throw error;
    }
  },
};
