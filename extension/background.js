chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.text) {
    fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message.text }),
    })
      .then((response) => response.json())
      .then((data) => {
        const toxicityScore = data.toxicity;
        chrome.storage.local.set({ toxicityScore });

        // Notify content.js if toxicity is high
        if (toxicityScore > 0.45) {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              function: showToxicityWarning,
              args: [toxicityScore],
            });
          });
        }
      })
      .catch((error) => console.error("Error:", error));
  }
});

// Function to inject warning popup
function showToxicityWarning(toxicityScore) {
  const existingWarning = document.getElementById("toxicity-warning");
  if (!existingWarning) {
    const warning = document.createElement("div");
    warning.id = "toxicity-warning";
    warning.style.position = "fixed";
    warning.style.top = "20px";
    warning.style.right = "20px";
    warning.style.backgroundColor = "red";
    warning.style.color = "white";
    warning.style.padding = "10px";
    warning.style.borderRadius = "5px";
    warning.style.zIndex = "9999";
    warning.style.fontSize = "16px";
    warning.innerText = `⚠️ Warning: High Toxicity Detected (Score: ${toxicityScore.toFixed(
      2
    )})`;

    document.body.appendChild(warning);
    setTimeout(() => warning.remove(), 5000); // Remove after 5 seconds
  }
}
