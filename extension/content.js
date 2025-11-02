
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
  if (message.toxicityScore > 0.40) {
    showToxicityWarning(message.toxicityScore);
  }
});

// Enhanced Alert UI
function showToxicityWarning(toxicityScore) {
  const existing = document.getElementById("toxicity-alert-container");
  if (existing) return;

  const container = document.createElement("div");
  container.id = "toxicity-alert-container";
  container.innerHTML = `
    <div id="toxicity-alert-popup">
      <h3>⚠️ Toxicity Alert</h3>
      <p>High Toxic Content Detected<br/>Toxicity Score: ${toxicityScore.toFixed(2)}</p>
      <button id="toxicity-alert-close">Dismiss</button>
    </div>
  `;

  const styles = `
    #toxicity-alert-container {
      position: fixed;
      top: 30px;
      right: 30px;
      z-index: 999999;
      animation: fadeInUp 0.6s ease-out;
    }
    #toxicity-alert-popup {
      background: linear-gradient(135deg, #ff4e50, #f9d423);
      color: white;
      padding: 20px 30px;
      border-radius: 15px;
      box-shadow: 0 0 15px rgba(255, 0, 0, 0.6);
      font-family: 'Segoe UI', sans-serif;
      max-width: 300px;
      text-align: center;
      animation: pulse 2s infinite;
    }
    #toxicity-alert-popup h3 {
      margin: 0 0 10px;
      font-size: 1.2rem;
    }
    #toxicity-alert-popup p {
      margin: 0 0 15px;
    }
    #toxicity-alert-close {
      background: white;
      color: #ff4e50;
      border: none;
      padding: 8px 16px;
      border-radius: 10px;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.3s ease;
    }
    #toxicity-alert-close:hover {
      background: #fff3f3;
    }
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 10px rgba(255, 0, 0, 0.4); }
      50% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.9); }
      100% { box-shadow: 0 0 10px rgba(255, 0, 0, 0.4); }
    }
  `;

  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
  document.body.appendChild(container);

  // Dismiss alert
  document.getElementById("toxicity-alert-close").addEventListener("click", () => {
    container.remove();
    styleSheet.remove();
  });

  // Auto-remove after 10 seconds
  setTimeout(() => {
    container.remove();
    styleSheet.remove();
  }, 10000);
}

