// =====================================================
//  Predict.js — Flood Risk Predictor
//  Sends city input to Flask backend and displays result
// =====================================================
 
// ── CONFIG ────────────────────────────────────────────
// Change this if your Flask app runs on a different port
const FLASK_URL = "/calculate";
 
 
// ── GRAB ELEMENTS ─────────────────────────────────────
const cityInput   = document.querySelector(".city-input");
const predictBtn  = document.querySelector(".btn-predict");
const resultBox   = document.getElementById("result-box");
const resultText  = document.getElementById("result-text");
 
 
// ── MAIN FUNCTION ─────────────────────────────────────
async function predict() {
 
  // 1. Read and validate input
  const city = cityInput.value.trim();
 
  if (!city) {
    showResult("⚠️ Please enter a city name.", "warning");
    return;
  }
 
  // 2. Show loading state on button
  setLoading(true);
 
  try {
 
    // 3. Send POST request to Flask
    const response = await fetch(FLASK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ city: city })
    });
 
    // 4. Handle HTTP errors (e.g. 404, 500)
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
 
    // 5. Parse JSON response from Flask
    // Expected format: { "result": "High Risk" } or { "error": "..." }
    const data = await response.json();
 
    if (data.error) {
      showResult(`❌ ${data.error}`, "error");
    } else {
      showResult(`📍 ${city}: ${data.result}`, "success");
    }
 
  } catch (err) {
 
    // 6. Network / fetch error (e.g. Flask not running)
    console.error("Fetch error:", err);
    showResult("❌ Could not connect to server. Is Flask running?", "error");
 
  } finally {
 
    // 7. Always restore button
    setLoading(false);
  }
}
 
 
// ── HELPERS ───────────────────────────────────────────
 
// Show / update the result box below the form
function showResult(message, type) {
  resultText.textContent = message;
  resultBox.className = "result-box visible " + type;
}
 
// Toggle loading state on the Predict button
function setLoading(isLoading) {
  if (isLoading) {
    predictBtn.textContent = "Loading...";
    predictBtn.disabled = true;
    predictBtn.style.opacity = "0.6";
  } else {
    predictBtn.textContent = "Predict";
    predictBtn.disabled = false;
    predictBtn.style.opacity = "1";
  }
}
 
 
// ── EVENT LISTENERS ───────────────────────────────────
 
// Click the Predict button
predictBtn.addEventListener("click", predict);
 
// Press Enter inside the input field
cityInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") predict();
});
