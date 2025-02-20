const injectScript = () => {
  try {
    const container = document.head || document.documentElement;
    const scriptTag = document.createElement("script");
    scriptTag.src = chrome.runtime.getURL("inject.js");
    container.insertBefore(scriptTag, container.children[0]);
    container.removeChild(scriptTag);
  } catch (error) {
    console.error("Script injection failed:", error);
  }
};

injectScript();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Content script received message:", request);

  if (request.type === "GET_ETHEREUM_PROVIDER") {
    console.log("Checking for ethereum provider...");

    if (typeof window.ethereum !== "undefined") {
      console.log("Ethereum provider found");
      sendResponse({
        success: true,
        ethereum: window.ethereum,
      });
    } else {
      console.log("Ethereum provider not found");
      sendResponse({
        success: false,
        error: "MetaMask bulunamadı",
      });
    }
    return true;
  }
});
