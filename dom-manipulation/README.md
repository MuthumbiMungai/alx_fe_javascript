# 📜 Dynamic Quote Generator

An interactive **Dynamic Quote Generator** built with **HTML, CSS, and JavaScript**.  
This project is part of the **ALX Front-End Engineering Curriculum** and demonstrates DOM manipulation, local & session storage, JSON import/export, category filtering, and server data synchronization with conflict resolution.

---

## 🚀 Project Overview

The Dynamic Quote Generator allows users to:
- View and generate random quotes.
- Add their own quotes with categories.
- Persist quotes locally using **Web Storage (localStorage & sessionStorage)**.
- Import and export quotes in **JSON format**.
- Filter quotes by category dynamically.
- Sync quotes with a mock server and handle conflicts where **server data takes precedence**.

This project grows incrementally through tasks, each focusing on specific front-end skills.

---

## 📂 Repository Structure

alx_fe_javascript/
└── dom-manipulation/
├── index.html
├── style.css
├── script.js
└── README.md

---

## 📝 Features Implemented

### ✅ Task 0 – Dynamic Quote Generator (Base)
- Randomly display a quote from a predefined array.
- Add new quotes dynamically via user input.
- DOM manipulation to update displayed quotes.

### ✅ Task 1 – Web Storage & JSON Handling
- Save and load quotes using **localStorage**.
- Track the **last viewed quote** with **sessionStorage**.
- Export quotes as a downloadable `.json` file.
- Import quotes from a `.json` file to extend the collection.

### ✅ Task 2 – Dynamic Content Filtering
- Added a **category system** for quotes.
- Dropdown filter dynamically populated with unique categories.
- Users can filter quotes by category.
- Last selected filter is **persisted in localStorage**.

### ✅ Task 3 – Server Sync & Conflict Resolution
- Integrated with [JSONPlaceholder](https://jsonplaceholder.typicode.com/) mock API.
- Periodic syncing to fetch quotes from a simulated server.
- **Conflict resolution strategy**: *Server data always wins*.
- Local storage automatically updates with the latest server data.

---

## ⚙️ How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/alx_fe_javascript.git
   cd alx_fe_javascript/dom-manipulation
Open index.html in your browser.
(No server required, since it’s pure front-end.)

🧪 Testing the Features
Quote Management

Add a new quote → confirm it persists after reload (localStorage).

Refresh the page → last viewed quote should remain (sessionStorage).

Import & Export

Click Export Quotes → download a quotes.json.

Modify or create a JSON file with quotes → import it back.

Filtering

Add quotes with different categories.

Use the dropdown filter → only matching quotes should appear.

Reload → last selected filter should be remembered.

Server Sync

Open DevTools console → you should see periodic fetches to the mock API.

If local data conflicts with server → server data overrides.

🛠️ Technologies Used

HTML5 – structure & markup

CSS3 – styling

JavaScript (ES6+) – logic & DOM manipulation

Web Storage API – localStorage & sessionStorage

FileReader API – JSON import

Blob API – JSON export

Fetch API – server sync simulation

📌 Commit Messages (Conventional)

feat(quotes): add base dynamic quote generator

feat(storage): integrate localStorage, sessionStorage, and JSON import/export

feat(filter): add category-based filtering with persistence

feat(sync): add server sync with conflict resolution (server wins)

🌟 Milestone Achieved

With this project, you’ve successfully:

Practiced DOM manipulation.

Worked with Web Storage APIs.

Learned JSON import/export handling.

Implemented category-based filtering.

Simulated server sync with conflict resolution.

📧 Author

👤 Andrew Mungai
📍 Nairobi, Kenya