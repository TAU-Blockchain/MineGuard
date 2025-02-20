chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    console.log("Background script received message:", request);
    console.log("From sender:", sender);

    if (request.method === "ethereum.request") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            {
              type: "METAMASK_REQUEST",
              payload: request.params,
            },
            (response) => {
              if (chrome.runtime.lastError) {
                console.error(
                  "Content script error:",
                  chrome.runtime.lastError
                );
                sendResponse({
                  success: false,
                  error: "MetaMask iletişim hatası",
                });
              } else {
                sendResponse(response);
              }
            }
          );
        } else {
          sendResponse({
            success: false,
            error: "Aktif sekme bulunamadı",
          });
        }
      });

      return true;
    }

    return false;
  }
);

chrome.management.onInstalled.addListener((info) => {
  if (info.id === "nkbihfbeogaeaoehlefnkodbefgpgknn") {
    console.log("MetaMask installed");
  }
});

chrome.management.onUninstalled.addListener((id) => {
  if (id === "nkbihfbeogaeaoehlefnkodbefgpgknn") {
    console.log("MetaMask uninstalled");
  }
});
