console.log("Content script loaded");

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SEARCH_QUERY") {
    console.log("--------------------------------");
    console.log("Search query:", message.query);
    console.log("--------------------------------");
  }
});
