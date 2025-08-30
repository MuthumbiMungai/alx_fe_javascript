// ---------------- Quotes Data ----------------
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to invent it.", category: "Motivation", id: 1 },
  { text: "Life is what happens when you're busy making other plans.", category: "Life", id: 2 },
  { text: "Knowledge is power.", category: "Wisdom", id: 3 }
];

// ---------------- DOM Elements ----------------
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const syncStatus = document.getElementById("syncStatus");

// ---------------- Display Functions ----------------
function displayQuote() {
  let selectedCategory = categoryFilter.value;
  let filteredQuotes = (selectedCategory === "all") 
    ? quotes 
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  let randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  let quote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — (${quote.category})`;

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// ---------------- Add Quote ----------------
function addQuote() {
  let text = document.getElementById("quoteInput").value;
  let category = document.getElementById("categoryInput").value || "General";

  if (!text) return alert("Please enter a quote!");

  let newQuote = {
    text,
    category,
    id: Date.now() // unique ID
  };

  quotes.push(newQuote);
  localStorage.setItem("quotes", JSON.stringify(quotes));
  populateCategories();
  displayQuote();
}

// ---------------- Populate Categories ----------------
function populateCategories() {
  let categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    let option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last filter
  let savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) categoryFilter.value = savedFilter;
}

function filterQuotes() {
  localStorage.setItem("selectedCategory", categoryFilter.value);
  displayQuote();
}

// ---------------- Export & Import ----------------
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
}

function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes = [...quotes, ...importedQuotes];
      localStorage.setItem("quotes", JSON.stringify(quotes));
      populateCategories();
      displayQuote();
    } catch (err) {
      alert("Invalid JSON file!");
    }
  };
  reader.readAsText(file);
}

// ---------------- Server Sync (Task 3) ----------------
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
const SYNC_INTERVAL = 30000; // 30s for demo

function syncWithServer() {
  syncStatus.textContent = "🔄 Syncing with server...";

  fetch(SERVER_URL)
    .then(res => res.json())
    .then(serverData => {
      const serverQuotes = serverData.slice(0, 5).map(item => ({
        text: item.title,
        category: "Server",
        id: item.id
      }));

      const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

      // Conflict resolution: server wins if same ID exists
      const mergedQuotes = [
        ...serverQuotes,
        ...localQuotes.filter(lq => !serverQuotes.some(sq => sq.id === lq.id))
      ];

      localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
      quotes = mergedQuotes;

      populateCategories();
      displayQuote();

      syncStatus.textContent = "✅ Sync complete. Server data merged.";
    })
    .catch(err => {
      console.error("Sync failed:", err);
      syncStatus.textContent = "❌ Sync failed. Try again later.";
    });
}

// Auto-sync every interval
setInterval(syncWithServer, SYNC_INTERVAL);

// ---------------- Initialization ----------------
window.onload = function() {
  populateCategories();
  let lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
  if (lastQuote) {
    quoteDisplay.textContent = `"${lastQuote.text}" — (${lastQuote.category})`;
  } else {
    displayQuote();
  }
};
