import { useState, useEffect } from "react";
import { BiPlus, BiTrash, BiRefresh } from "react-icons/bi";
import { useWeb3 } from "../context/Web3Context";

export default function Admin() {
  const {
    connectWallet,
    account,
    getThreatTypes,
    addThreatType,
    addOwner,
    removeOwner,
    isLoading: walletLoading,
  } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);
  const [newOwner, setNewOwner] = useState("");
  const [newThreatType, setNewThreatType] = useState("");
  const [threatTypes, setThreatTypes] = useState([]);

  useEffect(() => {
    if (account) {
      fetchThreatTypes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const fetchThreatTypes = async () => {
    try {
      const types = await getThreatTypes();
      setThreatTypes(types);
    } catch (error) {
      console.error("Error fetching threat types:", error);
    }
  };

  const handleAddOwner = async () => {
    if (newOwner.trim()) {
      try {
        setIsLoading(true);
        await addOwner(newOwner);
        setNewOwner("");
      } catch (error) {
        console.error("Error adding owner:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRemoveOwner = async () => {
    if (newOwner.trim()) {
      try {
        setIsLoading(true);
        await removeOwner(newOwner);
        setNewOwner("");
      } catch (error) {
        console.error("Error removing owner:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddThreatType = async () => {
    if (newThreatType.trim()) {
      try {
        setIsLoading(true);
        await addThreatType(newThreatType);
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
                disabled={walletLoading}
                className="bg-[#ED6A5A] text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-[#ED6A5A] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {walletLoading ? "Connecting..." : "Connect Wallet"}
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
                      onClick={handleAddOwner}
                      disabled={isLoading || !newOwner.trim()}
                      className="flex-1 bg-[#ED6A5A] text-white px-4 py-2 rounded-full hover:bg-white hover:text-[#ED6A5A] border border-[#ED6A5A] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <BiPlus size={20} />
                      Add Owner
                    </button>
                    <button
                      onClick={handleRemoveOwner}
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
                      onClick={handleAddThreatType}
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
