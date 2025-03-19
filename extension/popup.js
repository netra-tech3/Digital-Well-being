fetch("http://localhost:5000/latest-report")
  .then(response => response.json())
  .then(data => {
    document.getElementById("result").innerText = `Toxicity Score: ${data.toxicity}`;
  })
  .catch(error => console.error("Error fetching report:", error));
