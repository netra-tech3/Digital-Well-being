// // const express = require("express");
// // const cors = require("cors");
// // const bodyParser = require("body-parser");
// // const axios = require("axios");

// // const app = express();
// // const PORT = 5000;
// // const API_KEY = "AIzaSyDqk-xjLPJqL0IGZsMQx5_9Lgva9SHcm9A";

// // app.use(cors());
// // app.use(bodyParser.json());

// // let latestReport = { text: "", toxicity: 0 };

// // const analyzeToxicity = async (text) => {
// //   try {
// //     const response = await axios.post(
// //       `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${API_KEY}`,
// //       {
// //         comment: { text },
// //         languages: ["en"],
// //         requestedAttributes: { TOXICITY: {} },
// //       }
// //     );
// //     return response.data.attributeScores.TOXICITY.summaryScore.value;
// //   } catch (error) {
// //     console.error("Error analyzing toxicity:", error);
// //     return null;
// //   }
// // };

// // app.post("/analyze", async (req, res) => {
// //   const { text } = req.body;
// //   if (!text) {
// //     return res.status(400).json({ error: "No text provided" });
// //   }

// //   const toxicity = await analyzeToxicity(text);
// //   latestReport = { text, toxicity };
// //   res.json({ toxicity });
// // });

// // app.get("/latest-report", (req, res) => {
// //   res.json(latestReport);
// // });

// // app.listen(PORT, () => {
// //   console.log(`Server is running on http://localhost:${PORT}`);
// // });


// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const axios = require("axios");

// const app = express();
// const PORT = 5000;
// const API_KEY = "AIzaSyDqk-xjLPJqL0IGZsMQx5_9Lgva9SHcm9A";

// app.use(cors());
// app.use(bodyParser.json());



// let toxicityData = []; // Store toxicity levels for the last 4 days

// const analyzeToxicity = async (text) => {
//   try {
//     const response = await axios.post(
//       `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${API_KEY}`,
//       {
//         comment: { text },
//         languages: ["en"],
//         requestedAttributes: { TOXICITY: {} },
//       }
//     );
//     return response.data.attributeScores.TOXICITY.summaryScore.value;
//   } catch (error) {
//     console.error("Error analyzing toxicity:", error);
//     return null;
//   }
// };

// // Store toxicity data for last 4 days
// app.post("/analyze", async (req, res) => {
//   const { text } = req.body;
//   if (!text) return res.status(400).json({ error: "No text provided" });

//   const toxicity = await analyzeToxicity(text);
//   toxicityData.push({ date: new Date().toISOString().split("T")[0], toxicity });

//   // Keep only last 4 days of data
//   if (toxicityData.length > 4) toxicityData.shift();

//   res.json({ toxicity, last4Days: toxicityData });
// });

// // Get latest report
// app.get("/latest-report", (req, res) => {
//   const latest = toxicityData[toxicityData.length - 1] || { text: "", toxicity: 0 };
//   res.json(latest);
// });


// app.get("/daily-report", (req, res) => {
//   // Filter today's data
//   const today = new Date().toISOString().split("T")[0];
//   const dailyToxicityData = toxicityData.filter(entry => entry.date === today);

//   res.json({ dailyToxicityData });
// });


// // Get 4-day toxicity report
// app.get("/report", (req, res) => {
//   const averageToxicity =
//     toxicityData.reduce((sum, entry) => sum + entry.toxicity, 0) /
//     (toxicityData.length || 1);

//   const recommendation =
//     averageToxicity > 0.5
//       ? "Your toxicity level is high. Reduce exposure to negative content and engage in positive digital activities."
//       : "You are maintaining a balanced digital well-being. Keep it up!";

//   res.json({ toxicityData, averageToxicity, recommendation });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 5000;

// API Keys
const PERSPECTIVE_API_KEY = "AIzaSyDqk-xjLPJqL0IGZsMQx5_9Lgva9SHcm9A";
const GEMINI_API_KEY = "AIzaSyBaWZv5dojNuCN-OGQSnk47HaaNZW9i5hc"; // Replace with your Gemini API Key

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

app.use(cors());
app.use(bodyParser.json({ limit: "0.1mb" }));
let toxicityData = []; // Store toxicity levels for the last 4 days

// Function to analyze toxicity
const analyzeToxicity = async (text) => {
  // try {
  //   const response = await axios.post(
  //     `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${PERSPECTIVE_API_KEY}`,
  //     {
  //       comment: { text },
  //       languages: ["en"],
  //       requestedAttributes: { TOXICITY: {} },
  //     }
  //   );
  //   return response.data.attributeScores.TOXICITY.summaryScore.value;
  // } catch (error) {
  //   console.error("Error analyzing toxicity:", error);
  //   return null;
  // }

  try {
    // Ensure text is not too long (Perspective API may reject long inputs)
    const maxCharacters = 5000; // Adjust based on API limits
    const trimmedText = text.length > maxCharacters ? text.substring(0, maxCharacters) : text;

    const response = await axios.post(
      `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${PERSPECTIVE_API_KEY}`,
      {
        comment: { text: trimmedText }, // Send only trimmed text
        
        languages: ["en"],
        requestedAttributes: { TOXICITY: {} },
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data.attributeScores.TOXICITY.summaryScore.value;
  } catch (error) {
    console.error("Error analyzing toxicity:", error.response?.data || error);
    return null;
  }

};

// Store toxicity data for last 4 days
app.post("/analyze", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "No text provided" });

  const toxicity = await analyzeToxicity(text);

  // Store correctly formatted data
  toxicityData.push({ 
    date: new Date().toISOString().split("T")[0], 
    text: text,  // Store actual text
    toxicity: toxicity
  });

  // Keep only last 4 days of data
  if (toxicityData.length > 4) toxicityData.shift();

  res.json({ toxicity, last4Days: toxicityData });
});



// Get latest report
app.get("/latest-report", (req, res) => {
  const latest = toxicityData[toxicityData.length - 1] || { text: "", toxicity: 0 };
  res.json(latest);
});

// Get daily toxicity report
app.get("/daily-report", (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const dailyToxicityData = toxicityData.filter(entry => entry.date === today);

  res.json({ dailyToxicityData });
});

// Get 4-day toxicity report
app.get("/report", (req, res) => {
  const averageToxicity =
    toxicityData.reduce((sum, entry) => sum + entry.toxicity, 0) / (toxicityData.length || 1);

  const recommendation =
    averageToxicity > 0.5
      ? "Your toxicity level is high. Reduce exposure to negative content and engage in positive digital activities."
      : "You are maintaining a balanced digital well-being. Keep it up!";

  res.json({ toxicityData, averageToxicity, recommendation });
});

// Generate Summary with Gemini AI
app.post("/summary", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.length < 50) {
      return res.status(400).json({ error: "Content is too short for a meaningful summary." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Or gemini-1.0-pro / flash

    const prompt = `
      Summarize the following content in 200 words:
      "${content}"

      Also, based on this content, provide 5 actionable recommendations for improving digital well-being.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Optional: Console log to debug raw response
    console.log("AI Raw Response:", text);

    // Extracting structured data
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const summary = lines[0]; // First line is usually the summary
    const recommendations = lines.slice(1).filter(line => line.length > 5).slice(0, 5);

    res.json({
      summary: summary || "Summary not available.",
      recommendations: recommendations.length > 0 ? recommendations : ["No recommendations available."],
    });
  } catch (error) {
    console.error("Error generating summary:", error);
    res.status(500).json({ error: "Failed to generate summary due to server error." });
  }
});


const pastFourDaysData = [
  { day: "Day 1", avgToxicity: 0.35 },
  { day: "Day 2", avgToxicity: 0.52 },
  { day: "Day 3", avgToxicity: 0.48 },
  { day: "Day 4", avgToxicity: 0.41 },
];

app.get("/toxicity-four-days", (req, res) => {
  res.json(pastFourDaysData);
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
