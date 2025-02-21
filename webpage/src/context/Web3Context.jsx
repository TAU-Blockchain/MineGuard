import { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import ADDRESS from "../constant/ADDRESS";
import ABI from "../constant/ABI";

const Web3Context = createContext();

// eslint-disable-next-line react/prop-types
export function Web3Provider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
      window.ethereum.on("connect", handleConnect);
      window.ethereum.on("disconnect", handleDisconnect);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        window.ethereum.removeListener("connect", handleConnect);
        window.ethereum.removeListener("disconnect", handleDisconnect);
      };
    }
  }, []);

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      handleDisconnect();
    } else {
      try {
        const provider_ = new ethers.BrowserProvider(window.ethereum);
        const signer_ = await provider_.getSigner();
        const account_ = await signer_.getAddress();
        const contract_ = new ethers.Contract(ADDRESS, ABI, signer_);

        setProvider(provider_);
        setSigner(signer_);
        setAccount(account_);
        setContract(contract_);
        setError(null);

        console.log("Wallet changed:", account_);
      } catch (error) {
        console.error("Error updating wallet:", error);
        setError(error.message);
      }
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const handleConnect = () => {
    console.log("MetaMask connected");
    setError(null);
  };

  const handleDisconnect = () => {
    console.log("MetaMask disconnected");
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setContract(null);
    setError("Wallet disconnected");
    initializeProvider();
  };

  useEffect(() => {
    initializeProvider();
  }, []);

  const initializeProvider = async () => {
    try {
      const defaultProvider = new ethers.JsonRpcProvider(
        "https://rpc-testnet.unit0.dev"
      );

      await defaultProvider.ready;
      setProvider(defaultProvider);

      const defaultContract = new ethers.Contract(
        ADDRESS,
        ABI,
        defaultProvider
      );
      setContract(defaultContract);

      console.log(
        "Contract initialized with network:",
        await defaultProvider.getNetwork()
      );
      console.log("Contract address:", ADDRESS);
    } catch (err) {
      console.error("Provider initialization error:", err);
      setError(err.message);
    }
  };

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to connect a wallet");
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const provider_ = new ethers.BrowserProvider(window.ethereum);
      const signer_ = await provider_.getSigner();
      const account_ = await signer_.getAddress();

      const contract_ = new ethers.Contract(ADDRESS, ABI, signer_);

      setProvider(provider_);
      setSigner(signer_);
      setAccount(account_);
      setContract(contract_);
      setError(null);

      console.log("Wallet connected:", account_);
      return true;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getReports = async (address) => {
    try {
      if (!contract) {
        throw new Error("Contract is not initialized");
      }
      const reports = await contract.getReports(address);
      return formatReports(reports);
    } catch (error) {
      console.error("Get reports error:", error);
      throw error;
    }
  };

  const submitReport = async (address, threats) => {
    try {
      if (!account) {
        throw new Error("Please connect your wallet first");
      }

      if (!contract || !signer) {
        const connected = await connectWallet();
        if (!connected) {
          throw new Error("Failed to connect wallet");
        }
      }

      const signerContract = contract.connect(signer);
      const tx = await signerContract.report(address, threats);
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error("Submit report error:", error);
      throw error;
    }
  };

  const getThreatTypes = async () => {
    try {
      if (!contract) {
        throw new Error("Contract is not initialized");
      }
      return await contract.getThreatTypes();
    } catch (error) {
      console.error("Get threat types error:", error);
      throw error;
    }
  };

  const addThreatType = async (threatType) => {
    try {
      if (!account) {
        throw new Error("Please connect your wallet first");
      }

      if (!contract || !signer) {
        const connected = await connectWallet();
        if (!connected) {
          throw new Error("Failed to connect wallet");
        }
      }

      const signerContract = contract.connect(signer);
      const tx = await signerContract.addThreatType(threatType);
      return await tx.wait();
    } catch (error) {
      console.error("Add threat type error:", error);
      throw error;
    }
  };

  const addOwner = async (address) => {
    try {
      if (!account) {
        throw new Error("Please connect your wallet first");
      }

      if (!contract || !signer) {
        const connected = await connectWallet();
        if (!connected) {
          throw new Error("Failed to connect wallet");
        }
      }

      const signerContract = contract.connect(signer);
      const tx = await signerContract.addOwner(address);
      return await tx.wait();
    } catch (error) {
      console.error("Add owner error:", error);
      throw error;
    }
  };

  const removeOwner = async (address) => {
    try {
      if (!account) {
        throw new Error("Please connect your wallet first");
      }

      if (!contract || !signer) {
        const connected = await connectWallet();
        if (!connected) {
          throw new Error("Failed to connect wallet");
        }
      }

      const signerContract = contract.connect(signer);
      const tx = await signerContract.removeOwner(address);
      return await tx.wait();
    } catch (error) {
      console.error("Remove owner error:", error);
      throw error;
    }
  };

  const formatReports = (reports) => {
    return reports.map((report) => {
      const [threats, reporter, timestamp] = report;
      const dateTimestamp = Number(timestamp.toString()) * 1000;
      return {
        threats,
        reporter,
        timestamp: new Date(dateTimestamp).toISOString(),
      };
    });
  };

  const value = {
    account,
    provider,
    contract,
    signer,
    error,
    isLoading,
    connectWallet,
    getReports,
    submitReport,
    getThreatTypes,
    addThreatType,
    addOwner,
    removeOwner,
    isConnected: !!account,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}
