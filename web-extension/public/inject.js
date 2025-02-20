window.addEventListener("message", async (event) => {
  if (event.source !== window) return;

  if (event.data.type && event.data.type === "METAMASK_REQUEST") {
    try {
      if (typeof window.ethereum !== "undefined") {
        const result = await window.ethereum.request(event.data.payload);
        window.postMessage(
          {
            type: "METAMASK_RESPONSE",
            success: true,
            data: result,
          },
          "*"
        );
      } else {
        window.postMessage(
          {
            type: "METAMASK_RESPONSE",
            success: false,
            error: "MetaMask bulunamadı!",
          },
          "*"
        );
      }
    } catch (error) {
      window.postMessage(
        {
          type: "METAMASK_RESPONSE",
          success: false,
          error: error.message,
        },
        "*"
      );
    }
  }
});
