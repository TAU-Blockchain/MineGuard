console.log("Content script loaded");

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SEARCH_QUERY") {
    console.log("--------------------------------");
    console.log("Search query:", message.query);
    console.log("--------------------------------");
  }
});

const handleMetaMaskConnection = async () => {
  if (!window.ethereum) {
    chrome.runtime.sendMessage({
      type: "METAMASK_ERROR",
      error: "MetaMask not detected",
    });
    return;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    chrome.runtime.sendMessage({
      type: "METAMASK_CONNECTED",
      account: accounts[0],
      chainId: chainId,
    });

    window.ethereum.on("accountsChanged", (accounts) => {
      chrome.runtime.sendMessage({
        type: "ACCOUNTS_CHANGED",
        accounts,
      });
    });

    window.ethereum.on("chainChanged", (chainId) => {
      chrome.runtime.sendMessage({
        type: "CHAIN_CHANGED",
        chainId,
      });
    });
  } catch (error) {
    chrome.runtime.sendMessage({
      type: "METAMASK_ERROR",
      error: error.message,
    });
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "CONNECT_METAMASK") {
    handleMetaMaskConnection();
  }
  return true;
});
