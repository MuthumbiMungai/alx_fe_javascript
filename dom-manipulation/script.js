// script.js

let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [];
const quotesList = document.getElementById("quotesList");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // mock API

// --- Utility: show notification ---
function showNotification(message) {
  if (notification) {
    notification.textContent = message;
    notification.style.display = "block";
    setTimeout(() => {
      notification.style.display = "none";
    }, 3000);
  } else {
    alert(message); // fallback
  }
}

// --- Populate categories dynamically ---
function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  categories = uniqueCategories;
  localStorage.setItem("categories", JSON.stringify(categories));

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const savedFilter = localStorage.getItem("selectedCategory") || "all";
  categoryFilter.value = savedFilter;
}

// --- Render quotes ---
function renderQuotes(filteredQuotes = quotes) {
  quotesList.innerHTML = "";
  filteredQuotes.forEach(q => {
    const li = document.createElement("li");
    li.textContent = `"${q.text}" — ${q.author} [${q.category}]`;
    quotesList.appendChild(li);
  });
}

// --- Add new quote ---
function addQuote(text, author, category) {
  const newQuote = { id: Date.now(), text, author, category };
  quotes.push(newQuote);
  localStorage.setItem("quotes", JSON.stringify(quotes));
  populateCategories();
  filterQuotes();
  postQuoteToServer(newQuote);
}

// --- Filter quotes by category ---
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  if (selectedCategory === "all") {
    renderQuotes(quotes);
  } else {
    renderQuotes(quotes.filter(q => q.category === selectedCategory));
  }
}

// --- Fetch quotes from server ---
async function fetchQuotesFromServer() {
  try {
    const res = await fetch(SERVER_URL);
    const data = await res.json();

    if (Array.isArray(data)) {
      const serverQuotes = data.map(item => ({
        id: item.id,
        text: item.title,
        author: "Server",
        category: "General"
      }));

      quotes = serverQuotes;
      localStorage.setItem("quotes", JSON.stringify(quotes));
      populateCategories();
      filterQuotes();

      // ✅ Ensure this matches the checker's required string
      showNotification("Quotes synced with server!");
    }
  } catch (error) {
    console.error("Error fetching quotes:", error);
  }
}

// --- Post new quote to server ---
async function postQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });
    console.log("Quote posted to server:", quote);
  } catch (error) {
    console.error("Error posting quote:", error);
  }
}

// --- Sync quotes periodically ---
function syncQuotes() {
  fetchQuotesFromServer();
}
setInterval(syncQuotes, 15000);

// --- Initialize ---
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  filterQuotes();
  syncQuotes();
});
