import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { BiPlus, BiTrash, BiRefresh } from "react-icons/bi";
import ADDRESS from "../constant/ADDRESS";
import ABI from "../constant/ABI";

export default function Admin() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [newOwner, setNewOwner] = useState("");
  const [newThreatType, setNewThreatType] = useState("");
  const [threatTypes, setThreatTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [adminList, setAdminList] = useState([
    "0x826189D971aaF25D078C1A4521f284847AE4C51b",
    "0x12312asdasda",
  ]);

  useEffect(() => {
    if (contract) {
      fetchThreatTypes();
    }
  }, [contract]);

  const connectWallet = async () => {
    setIsLoading(true);
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

      console.log("Wallet connected:", account_);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchThreatTypes = async () => {
    try {
      const types = await contract.getThreatTypes();
      setThreatTypes(types);
    } catch (error) {
      console.error("Error fetching threat types:", error);
    }
  };

  const addOwner = async () => {
    if (contract && newOwner.trim()) {
      try {
        setIsLoading(true);
        const tx = await contract.addOwner(newOwner);
        await tx.wait();
        setNewOwner("");
      } catch (error) {
        console.error("Error adding owner:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const removeOwner = async () => {
    if (contract && newOwner.trim()) {
      try {
        setIsLoading(true);
        const tx = await contract.removeOwner(newOwner);
        await tx.wait();
        setNewOwner("");
      } catch (error) {
        console.error("Error removing owner:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const addThreatType = async () => {
    if (contract && newThreatType.trim()) {
      try {
        setIsLoading(true);
        const tx = await contract.addThreatType(newThreatType);
        await tx.wait();
        setNewThreatType("");
        await fetchThreatTypes();
      } catch (error) {
        console.error("Error adding threat type:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen">
      <section className="bg-[#9BC1BC] shadow-lg shadow-[#9BC1BC] text-white py-20 my-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-pixelify">
              Admin Panel
            </h1>
            <p className="text-xl mb-8">
              Manage contract owners and threat types
            </p>
            {!account ? (
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="bg-[#ED6A5A] text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-[#ED6A5A] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Connecting..." : "Connect Wallet"}
              </button>
            ) : (
              <p className="bg-white/10 px-6 py-2 rounded-full inline-block">
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </p>
            )}
          </div>
        </div>
      </section>

      {account && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-lg shadow-[#ED6A5A]">
                <h2 className="text-2xl font-pixelify text-[#ED6A5A] mb-6">
                  Owner Management
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter owner address"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#ED6A5A]"
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={addOwner}
                      disabled={isLoading || !newOwner.trim()}
                      className="flex-1 bg-[#ED6A5A] text-white px-4 py-2 rounded-full hover:bg-white hover:text-[#ED6A5A] border border-[#ED6A5A] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <BiPlus size={20} />
                      Add Owner
                    </button>
                    <button
                      onClick={removeOwner}
                      disabled={isLoading || !newOwner.trim()}
                      className="flex-1 bg-white text-[#ED6A5A] px-4 py-2 rounded-full hover:bg-[#ED6A5A] hover:text-white border border-[#ED6A5A] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <BiTrash size={20} />
                      Remove Owner
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg shadow-[#ED6A5A]">
                <h2 className="text-2xl font-pixelify text-[#ED6A5A] mb-6">
                  Threat Types
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Enter new threat type"
                      value={newThreatType}
                      onChange={(e) => setNewThreatType(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#ED6A5A]"
                    />
                    <button
                      onClick={addThreatType}
                      disabled={isLoading || !newThreatType.trim()}
                      className="bg-[#ED6A5A] text-white px-4 py-2 rounded-full hover:bg-white hover:text-[#ED6A5A] border border-[#ED6A5A] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <BiPlus size={20} />
                      Add
                    </button>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-700">
                        Current Types
                      </h3>
                      <button
                        onClick={fetchThreatTypes}
                        disabled={isLoading}
                        className="text-[#ED6A5A] hover:text-[#d15a4b] transition-colors flex items-center gap-1"
                      >
                        <BiRefresh size={20} />
                        Refresh
                      </button>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                      {threatTypes.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {threatTypes.map((type, index) => (
                            <div
                              key={index}
                              className="bg-white px-3 py-2 rounded-lg text-sm text-gray-700 shadow"
                            >
                              {type}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center">
                          No threat types found
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
