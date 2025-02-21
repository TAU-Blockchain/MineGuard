const UNITS_API = "https://explorer-testnet.unit0.dev/api/v2";
const API_URL = "http://localhost:3000/api";
export const apiService = {
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
};
