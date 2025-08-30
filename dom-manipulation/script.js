// ===============================
// Dynamic Quote Generator
// ===============================

// Global quotes array
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay", category: "Inspiration" },
  { text: "Life is what happens when you’re busy making other plans.", author: "John Lennon", category: "Life" },
  { text: "Knowledge is power.", author: "Francis Bacon", category: "Wisdom" }
];

// -------------------------------
// Task 0 & 1: Basic Quote Display + LocalStorage
// -------------------------------

// Load and display all quotes
function loadQuotes() {
  const container = document.getElementById("quoteContainer");
  container.innerHTML = "";

  quotes.forEach((quote, index) => {
    const div = document.createElement("div");
    div.className = "quote";
    div.innerHTML = `
      <p>"${quote.text}"</p>
      <small>- ${quote.author} (${quote.category})</small>
    `;
    container.appendChild(div);
  });

  populateCategories();
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("quoteText").value.trim();
  const author = document.getElementById("quoteAuthor").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (text && author && category) {
    quotes.push({ text, author, category });
    localStorage.setItem("quotes", JSON.stringify(quotes));
    loadQuotes();
    clearInputs();
  } else {
    alert("Please fill in all fields!");
  }
}

function clearInputs() {
  document.getElementById("quoteText").value = "";
  document.getElementById("quoteAuthor").value = "";
  document.getElementById("quoteCategory").value = "";
}

// -------------------------------
// Task 2: Dynamic Category Filtering
// -------------------------------

// Populate dropdown with unique categories
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const currentValue = localStorage.getItem("selectedCategory") || "all";

  // Clear existing except "All"
  select.innerHTML = `<option value="all">All Categories</option>`;

  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    if (cat === currentValue) option.selected = true;
    select.appendChild(option);
  });

  // Restore filter
  filterQuotes();
}

// Filter quotes by category
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);

  const container = document.getElementById("quoteContainer");
  container.innerHTML = "";

  quotes
    .filter(q => selected === "all" || q.category === selected)
    .forEach(quote => {
      const div = document.createElement("div");
      div.className = "quote";
      div.innerHTML = `
        <p>"${quote.text}"</p>
        <small>- ${quote.author} (${quote.category})</small>
      `;
      container.appendChild(div);
    });
}

// -------------------------------
// Task 3: Server Sync & Conflict Resolution
// -------------------------------

// Fetch quotes from mock API (simulate server)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();

    // Convert mock data → quotes
    return data.slice(0, 5).map(item => ({
      text: item.title,
      author: "Server",
      category: "API"
    }));
  } catch (error) {
    console.error("Error fetching server quotes:", error);
    return [];
  }
}

// Sync local quotes with server
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  if (serverQuotes.length === 0) return;

  // Conflict resolution: server always wins
  quotes = serverQuotes;
  localStorage.setItem("quotes", JSON.stringify(quotes));

  loadQuotes();
  showNotification("Quotes synced with server (server data wins).");
}

// Simple UI notification
function showNotification(message) {
  const notice = document.createElement("div");
  notice.className = "notification";
  notice.textContent = message;
  document.body.appendChild(notice);

  setTimeout(() => notice.remove(), 3000);
}

// Periodic sync every 30s
setInterval(syncQuotes, 30000);

// -------------------------------
// In
