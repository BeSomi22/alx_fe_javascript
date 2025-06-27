let quotes = [];

// Load from localStorage or default
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    quotes = [
      {
        text: "The only limit to our realization of tomorrow is our doubts of today.",
        category: "Motivation",
      },
      {
        text: "Life is really simple, but we insist on making it complicated.",
        category: "Philosophy",
      },
      {
        text: "In the middle of every difficulty lies opportunity.",
        category: "Inspiration",
      },
    ];
    saveQuotes();
  }
}

// Save to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate category select
function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map((q) => q.category))];

  // Category used when adding new quotes
  const categorySelect = document.getElementById("categorySelect");
  categorySelect.innerHTML = "";
  uniqueCategories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  // Category filter dropdown
  const categoryFilter = document.getElementById("categoryFilter");
  const savedFilter = localStorage.getItem("selectedFilter") || "all";

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  categoryFilter.value = savedFilter;
}

function filterQuotes() {
  const filterValue = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedFilter", filterValue); // Persist the filter

  const filteredQuotes =
    filterValue === "all"
      ? quotes
      : quotes.filter((q) => q.category === filterValue);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
  } else {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}"`;
    sessionStorage.setItem("lastQuote", filteredQuotes[randomIndex].text);
  }
}

// Add quote
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document
    .getElementById("newQuoteCategory")
    .value.trim();

  if (!quoteText || !quoteCategory) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });
  saveQuotes();
  postQuoteToServer({ text: quoteText, category: quoteCategory });

  // Refresh categories and dropdowns
  populateCategories();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  document.getElementById("categorySelect").value = quoteCategory;
  document.getElementById("categoryFilter").value = quoteCategory;

  filterQuotes(); // Show filtered quote from new category
}

// Create the form dynamically
function createAddQuoteForm() {
  const container = document.getElementById("formContainer");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const button = document.createElement("button");
  button.textContent = "Add Quote";
  button.onclick = addQuote;

  container.appendChild(quoteInput);
  container.appendChild(categoryInput);
  container.appendChild(button);
}

// Export quotes to JSON
function exportToJson() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}

// Import quotes from JSON
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format. Must be an array.");
      }
    } catch (err) {
      alert("Error reading JSON file: " + err.message);
    }
  };
  reader.readAsText(file);
}

// Load everything
document.getElementById("newQuote").addEventListener("click", filterQuotes);

async function fetchQuotesFromServer() {
  // Simulated API: using placeholder posts
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=5"
  );
  const data = await res.json();

  // Simulate each "post" as a quote with category "Server"
  const serverQuotes = data.map((item) => ({
    text: item.title,
    category: "Server",
  }));

  return serverQuotes;
}

// Sync with local storage (every 15 seconds)
function quoteExistsLocally(serverQuote) {
  return quotes.some(
    (local) =>
      local.text === serverQuote.text && local.category === serverQuote.category
  );
}

async function syncQuotesWithServer() {
  const serverQuotes = await fetchQuotesFromServer();
  let changesMade = false;

  serverQuotes.forEach((serverQuote) => {
    if (!quoteExistsLocally(serverQuote)) {
      quotes.push(serverQuote);
      changesMade = true;
    }
  });

  if (changesMade) {
    saveQuotes();
    populateCategories();
    filterQuotes();
    showSyncNotification("Quotes synced with server!");
  }
}

// Sync Notification System
function showSyncNotification(message) {
  const statusDiv = document.getElementById("syncStatus");
  statusDiv.textContent = message;
  setTimeout(() => (statusDiv.textContent = ""), 5000);
}

async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: quote.text,
        body: quote.category,
        userId: 1, // optional placeholder data
      }),
    });

    const result = await response.json();
    console.log("Quote posted to server:", result);
    showSyncNotification("Quote sent to server (simulated).");
  } catch (error) {
    console.error("Failed to post quote:", error);
    showSyncNotification("Error sending quote to server.");
  }
}

loadQuotes();
populateCategories();
createAddQuoteForm();
filterQuotes();
// Start Sync Interval After Page Load
setInterval(syncQuotesWithServer, 15000); // Every 15 seconds
