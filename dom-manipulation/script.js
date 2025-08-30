/**
 * quotes array stores initial data
 * each quote has text and category
 */
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Motivation" },
];

/**
 * showRandomQuote - displays a random quote from the array
 */
function showRandomQuote() {
  const display = document.getElementById("quoteDisplay");

  if (quotes.length === 0) {
    display.innerHTML = "No quotes available!";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  display.innerHTML = `
    "${quote.text}"
    <div class="quote-category">— ${quote.category}</div>
  `;
}

/**
 * addQuote - retrieves input values, validates them,
 *            pushes new quote into array, and clears form
 */
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text: newText, category: newCategory });

  textInput.value = "";
  categoryInput.value = "";

  alert("Quote added successfully!");
}

/**
 * createAddQuoteForm - dynamically creates the add-quote form
 * and attaches it to #formContainer
 */
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  // Create input for quote text
  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";

  // Create input for category
  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  // Create add button
  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  // Append all to formContainer
  formContainer.appendChild(document.createElement("h2"))
    .textContent = "Add a New Quote";
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

/**
 * Event Listeners
 */
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initialize form dynamically
createAddQuoteForm();
