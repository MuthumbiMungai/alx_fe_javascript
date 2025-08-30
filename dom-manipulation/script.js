/**
 * Storage keys
 */
const LS_QUOTES_KEY = "dm_quotes_v1";
const SS_LAST_QUOTE_KEY = "dm_last_quote_v1";

/**
 * Default quotes used when localStorage is empty or invalid
 */
const defaultQuotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Motivation" },
];

/**
 * quotes - in-memory working array
 */
let quotes = [];

/**
 * isQuoteValid - validates quote object shape and content
 * @q: any
 * Return: boolean
 */
function isQuoteValid(q) {
  return (
    q &&
    typeof q.text === "string" &&
    typeof q.category === "string" &&
    q.text.trim().length > 0 &&
    q.category.trim().length > 0
  );
}

/**
 * loadQuotes - loads quotes from localStorage or falls back to default
 */
function loadQuotes() {
  const saved = localStorage.getItem(LS_QUOTES_KEY);
  if (!saved) {
    quotes = [...defaultQuotes];
    return;
  }

  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      quotes = parsed.filter(isQuoteValid);
      if (quotes.length === 0) quotes = [...defaultQuotes];
    } else {
      quotes = [...defaultQuotes];
    }
  } catch (err) {
    quotes = [...defaultQuotes];
  }
}

/**
 * saveQuotes - persists quotes to localStorage
 */
function saveQuotes() {
  localStorage.setItem(LS_QUOTES_KEY, JSON.stringify(quotes));
}

/**
 * renderQuote - updates the quote display area with a quote
 * @quote: { text, category }
 */
function renderQuote(quote) {
  const display = document.getElementById("quoteDisplay");
  if (!quote) {
    display.textContent = "No quotes available!";
    return;
  }
  display.innerHTML = `
    "${quote.text}"
    <div class="quote-category">— ${quote.category}</div>
  `;
}

/**
 * showRandomQuote - selects a random quote and displays it
 *                   also stores last-viewed quote in sessionStorage
 */
function showRandomQuote() {
  if (quotes.length === 0) {
    renderQuote(null);
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  renderQuote(quote);
  sessionStorage.setItem(SS_LAST_QUOTE_KEY, JSON.stringify(quote));
}

/**
 * addQuote - reads inputs, validates, pushes to quotes, saves to storage
 */
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text: newText, category: newCategory });
  saveQuotes(); /* persist after any change */

  textInput.value = "";
  categoryInput.value = "";

  alert("Quote added successfully!");
}

/**
 * createAddQuoteForm - dynamically creates the add-quote form
 */
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  const title = document.createElement("h2");
  title.textContent = "Add a New Quote";

  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(title);
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

/**
 * exportToJsonFile - downloads current quotes as quotes.json
 */
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * importFromJsonFile - reads uploaded JSON, validates, merges, de-dupes, saves
 * @event: change event from <input type="file">
 */
function importFromJsonFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);

      if (!Array.isArray(imported)) {
        alert("Invalid file format: expected an array of quotes.");
        event.target.value = "";
        return;
      }

      const validNew = imported.filter(isQuoteValid);

      /* Merge + de-duplicate by text|category (case-insensitive, trimmed) */
      const map = new Map();
      const all = [...quotes, ...validNew];
      all.forEach((q) => {
        const key = `${q.text.trim().toLowerCase()}|${q.category.trim().toLowerCase()}`;
        if (!map.has(key)) map.set(key, { text: q.text.trim(), category: q.category.trim() });
      });
      quotes = Array.from(map.values());

      saveQuotes();
      alert(`Quotes imported successfully! Total quotes: ${quotes.length}`);
      event.target.value = ""; /* reset file input */
    } catch (err) {
      alert("Failed to parse JSON file.");
      event.target.value = "";
    }
  };
  fileReader.readAsText(file);
}

/**
 * createIOControls - builds Export button and Import file input dynamically
 */
function createIOControls() {
  const io = document.getElementById("ioContainer");

  const exportBtn = document.createElement("button");
  exportBtn.id = "exportBtn";
  exportBtn.textContent = "Export Quotes (JSON)";
  exportBtn.addEventListener("click", exportToJsonFile);

  const importLabel = document.createElement("label");
  importLabel.setAttribute("for", "importFile");
  importLabel.textContent = " Import Quotes: ";

  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.id = "importFile";
  importInput.accept = ".json";
  importInput.addEventListener("change", importFromJsonFile);

  io.appendChild(exportBtn);
  io.appendChild(importLabel);
  io.appendChild(importInput);
}

/**
 * init - bootstraps the app:
 *  - loads quotes from localStorage
 *  - restores last viewed quote from sessionStorage if present
 *  - wires up UI
 */
function init() {
  loadQuotes();
  createAddQuoteForm();
  createIOControls();

  const newQuoteBtn = document.getElementById("newQuote");
  newQuoteBtn.addEventListener("click", showRandomQuote);

  const last = sessionStorage.getItem(SS_LAST_QUOTE_KEY);
  if (last) {
    try {
      const q = JSON.parse(last);
      if (isQuoteValid(q)) {
        renderQuote(q);
        return;
      }
    } catch (err) { /* ignore and fall through */ }
  }

  /* Optional: show a random quote on first load */
  // showRandomQuote();
}

init();
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dynamic Quote Generator</title>
</head>
<body>
  <h1>Dynamic Quote Generator</h1>

  <!-- Quote display area -->
  <div id="quoteDisplay"></div>
  <button id="newQuote">Show New Quote</button>

  <!-- Add new quote form -->
  <div>
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
  </div>

  <!-- Import/Export controls -->
  <div>
    <button id="exportQuotes" onclick="exportToJsonFile()">Export Quotes</button>
    <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
  </div>

  <script src="script.js"></script>
</body>
</html>
