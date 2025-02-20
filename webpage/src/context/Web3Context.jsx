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

  useEffect(() => {
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

    initializeProvider();
  }, []);

  const connectWallet = async () => {
    try {
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
    }
  };

  const value = {
    account,
    provider,
    contract,
    signer,
    error,
    connectWallet,
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
