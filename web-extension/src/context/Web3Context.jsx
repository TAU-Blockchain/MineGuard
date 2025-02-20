import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { ethers } from "ethers";
import ADDRESS from "../../constant/Address";
import ABI from "../../constant/ABI";

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initializeProvider = async () => {
      try {
        const defaultProvider = new ethers.providers.JsonRpcProvider(
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

  const connectWallet = useCallback(async () => {
    //TODO: We cant use this function because we are cant reach the ethereum provider from the meta mask extension from using another extension(its about the window.ethereum element)
    try {
      const ethereum = await new Promise((resolve) => {
        if (typeof window.ethereum !== "undefined") {
          console.log("MetaMask window.ethereum üzerinden bulundu");
          resolve(window.ethereum);
          return;
        }

        chrome.tabs.query(
          { active: true, currentWindow: true },
          async (tabs) => {
            try {
              const response = await chrome.tabs.sendMessage(tabs[0].id, {
                type: "GET_ETHEREUM_PROVIDER",
              });
              console.log("MetaMask tab message üzerinden bulundu", response);
              resolve(response.ethereum);
            } catch (error) {
              console.log(
                "Tab message başarısız, chrome extension API deneniyor"
              );
              try {
                await chrome.runtime.sendMessage(
                  "nkbihfbeogaeaoehlefnkodbefgpgknn",
                  {
                    type: "metamask_getProviderState",
                  }
                );
                resolve(window.ethereum);
              } catch (err) {
                console.error("MetaMask bağlantısı başarısız:", err);
                resolve(null);
              }
            }
          }
        );
      });

      if (!ethereum) {
        throw new Error(
          "MetaMask bulunamadı! Lütfen MetaMask'ı yükleyin ve oturum açın."
        );
      }

      const provider = new ethers.providers.Web3Provider(ethereum);

      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const network = await provider.getNetwork();
      const walletAddress = accounts[0];

      console.log("Bağlantı başarılı:", {
        address: walletAddress,
        chainId: network.chainId,
        network: network.name,
      });

      const walletContract = new ethers.Contract(ADDRESS, ABI, signer);

      setProvider(provider);
      setSigner(signer);
      setAddress(walletAddress);
      setChainId(network.chainId.toString(16));
      setContract(walletContract);

      ethereum.on("accountsChanged", (newAccounts) => {
        setAddress(newAccounts[0]);
      });

      ethereum.on("chainChanged", (newChainId) => {
        setChainId(newChainId);
        window.location.reload();
      });

      return walletAddress;
    } catch (error) {
      console.error("Cüzdan bağlantı hatası:", error);
      setError(error.message || "Bilinmeyen bir hata oluştu");
      throw error;
    }
  }, []);

  const scanContract = useCallback(
    async (contractAddress) => {
      try {
        if (!provider) throw new Error("Provider not initialized");

        const code = await provider.getCode(contractAddress);
        if (code === "0x") throw new Error("Not a contract address");

        const balance = await provider.getBalance(contractAddress);
        const txCount = await provider.getTransactionCount(contractAddress);

        return {
          isContract: true,
          balance: ethers.utils.formatEther(balance),
          txCount,
          code,
        };
      } catch (err) {
        setError(err.message);
        console.error("Contract scan error:", err);
        return null;
      }
    },
    [provider]
  );

  const generateReport = useCallback(
    async (contractAddress) => {
      try {
        if (!provider) throw new Error("Provider not initialized");

        const scanResult = await scanContract(contractAddress);
        if (!scanResult) throw new Error("Scan failed");

        return {
          ...scanResult,
          timestamp: new Date().toISOString(),
          riskLevel: "Analyzing...",
          recommendations: [],
        };
      } catch (err) {
        setError(err.message);
        console.error("Report generation error:", err);
        return null;
      }
    },
    [provider, scanContract]
  );

  const value = {
    provider,
    signer,
    address,
    chainId,
    error,
    connectWallet,
    scanContract,
    generateReport,
    contract,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
