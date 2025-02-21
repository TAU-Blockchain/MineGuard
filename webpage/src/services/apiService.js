const UNITS_API = "https://explorer-testnet.unit0.dev/api/v2";

export const apiService = {
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
