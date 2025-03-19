function extractTextFromPage() {
  return document.body.innerText;
}

// Send extracted text to background.js every 5 seconds
setInterval(() => {
  const extractedText = extractTextFromPage();
  chrome.runtime.sendMessage({ text: extractedText });
}, 5000);

// Listen for toxicity alerts from background.js
chrome.runtime.onMessage.addListener((message) => {
  if (message.toxicityScore > 0.45) {
    showToxicityWarning(message.toxicityScore);
  }
});

// Function to display a warning popup
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
