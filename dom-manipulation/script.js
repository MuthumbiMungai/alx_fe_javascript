// ===============================
// Dynamic Quote Generator Script
// ===============================

// -------------------------------
// Global Variables
// -------------------------------
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
let currentQuote = null;

// -------------------------------
// DOM Elements
// -------------------------------
const quoteDisplay = document.getElementById("quoteDisplay");
const authorDisplay = document.getElementById("authorDisplay");
const categoryDisplay = document.getElementById("categoryDisplay");
const notificationBar = document.getElementById("notification");

// -------------------------------
// Helper: Show Notification
// -------------------------------
function showNotification(message) {
  if (notificationBar) {
    notificationBar.innerText = message;
    notificationBar.style.display = "block";
    setTimeout(() => {
      notificationBar.style.display = "none";
    }, 3000);
  } else {
    alert(message);
  }
}

// -------------------------------
// Display a Quote
// -------------------------------
function displayQuote(quote) {
  if (!quote) return;
  quoteDisplay.innerText = `"${quote.text}"`;
  authorDisplay.innerText = `- ${quote.author}`;
  categoryDisplay.innerText = `[${quote.category}]`;
  currentQuote = quote;

  // Save last viewed quote in session storage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// -------------------------------
// Show Random Quote
// -------------------------------
function showRandomQuote() {
  if (quotes.length === 0) {
    displayQuote({ text: "No quotes available.", author: "System", category: "Info" });
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  displayQuote(quotes[randomIndex]);
}

// -------------------------------
// Add New Quote
// -------------------------------
function addQuote() {
  const text = document.getElementById("quoteText").value.trim();
  const author = document.getElementById("quoteAuthor").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (text && author && category) {
    const newQuote = { text, author, category };
    quotes.push(newQuote);
    localStorage.setItem("quotes", JSON.stringify(quotes));

    // Post to server
    postQuoteToServer(newQuote);

    showNotification("Quote added successfully!");
    displayQuote(newQuote);

    document.getElementById("quoteText").value = "";
    document.getElementById("quoteAuthor").value = "";
    document.getElementById("quoteCategory").value = "";
  } else {
    showNotification("Please fill in all fields before adding a quote.");
  }
}

// -------------------------------
// Export Quotes as JSON File
// -------------------------------
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// -------------------------------
// Import Quotes from JSON File
// -------------------------------
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = importedQuotes;
        localStorage.setItem("quotes", JSON.stringify(quotes));
        showNotification("Quotes imported successfully!");
        showRandomQuote();
      } else {
        showNotification("Invalid file format.");
      }
    } catch (error) {
      showNotification("Error reading JSON file.");
    }
  };
  reader.readAsText(file);
}

// -------------------------------
// Server: Fetch Quotes
// -------------------------------
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();

    // Simulate server quotes
    return data.slice(0, 5).map((item, index) => ({
      text: item.title,
      author: `Server Author ${index + 1}`,
      category: "Server"
    }));
  } catch (error) {
    console.error("Error fetching from server:", error);
    return [];
  }
}

// -------------------------------
// Server: Post New Quote
// -------------------------------
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });

    const result = await response.json();
    console.log("Quote posted to server:", result);
    showNotification("New quote synced to server.");
  } catch (error) {
    console.error("Error posting quote:", error);
  }
}

// -------------------------------
// Sync Quotes (Server Wins)
// -------------------------------
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  if (serverQuotes.length > 0) {
    quotes = serverQuotes;
    localStorage.setItem("quotes", JSON.stringify(quotes));
    showNotification("Quotes synced with server (server wins).");
    showRandomQuote();
  }
}

// -------------------------------
// Periodic Sync (every 60s)
// -------------------------------
setInterval(syncQuotes, 60000);

// -------------------------------
// Initialization
// -------------------------------
window.onload = function() {
  const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
  if (lastQuote) {
    displayQuote(lastQuote);
  } else {
    showRandomQuote();
  }
  syncQuotes(); // initial sync
};
