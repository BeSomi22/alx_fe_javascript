// const quotes = [
//   {
//     text: "The only limit to our realization of tomorrow is our doubts of today.",
//     category: "Motivation",
//   },
//   {
//     text: "Life is really simple, but we insist on making it complicated.",
//     category: "Philosophy",
//   },
//   {
//     text: "In the middle of every difficulty lies opportunity.",
//     category: "Inspiration",
//   },
// ];

// const quoteDisplay = document.getElementById("quoteDisplay");
// const categorySelect = document.getElementById("categorySelect");
// const newQuoteBtn = document.getElementById("newQuote");

// function populateCategories() {
//   const categories = [...new Set(quotes.map((q) => q.category))];
//   categorySelect.innerHTML = "";
//   categories.forEach((category) => {
//     const option = document.createElement("option");
//     option.value = category;
//     option.textContent = category;
//     categorySelect.appendChild(option);
//   });
// }

// function showRandomQuote() {
//   const selectedCategory = categorySelect.value;
//   const filteredQuotes = quotes.filter((q) => q.category === selectedCategory);
//   if (filteredQuotes.length === 0) {
//     quoteDisplay.textContent = "No quotes available for this category.";
//     return;
//   }
//   const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
//   quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}"`;
// }

// function addQuote() {
//   const quoteText = document.getElementById("newQuoteText").value.trim();
//   const quoteCategory = document
//     .getElementById("newQuoteCategory")
//     .value.trim();

//   if (!quoteText || !quoteCategory) {
//     alert("Please enter both quote text and category.");
//     return;
//   }

//   quotes.push({ text: quoteText, category: quoteCategory });

//   document.getElementById("newQuoteText").value = "";
//   document.getElementById("newQuoteCategory").value = "";

//   populateCategories();
//   categorySelect.value = quoteCategory;
//   showRandomQuote();
// }

// // ✅ Dynamically creates the quote form
// function createAddQuoteForm() {
//   const formContainer = document.getElementById("formContainer");

//   const quoteInput = document.createElement("input");
//   quoteInput.id = "newQuoteText";
//   quoteInput.type = "text";
//   quoteInput.placeholder = "Enter a new quote";

//   const categoryInput = document.createElement("input");
//   categoryInput.id = "newQuoteCategory";
//   categoryInput.type = "text";
//   categoryInput.placeholder = "Enter quote category";

//   const addButton = document.createElement("button");
//   addButton.textContent = "Add Quote";
//   addButton.onclick = addQuote;

//   formContainer.appendChild(quoteInput);
//   formContainer.appendChild(categoryInput);
//   formContainer.appendChild(addButton);
// }

// // Event listener for showing quotes
// newQuoteBtn.addEventListener("click", showRandomQuote);

// // Initialize on load
// populateCategories();
// showRandomQuote();
// createAddQuoteForm();
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

// function populateCategories() {
//   const categories = [...new Set(quotes.map((q) => q.category))];
//   const categorySelect = document.getElementById("categorySelect");
//   categorySelect.innerHTML = "";
//   categories.forEach((category) => {
//     const option = document.createElement("option");
//     option.value = category;
//     option.textContent = category;
//     categorySelect.appendChild(option);
//   });
// }

// Show a random quote
// function showRandomQuote() {
//   const selectedCategory = document.getElementById("categorySelect").value;
//   const filtered = quotes.filter((q) => q.category === selectedCategory);
//   const quoteDisplay = document.getElementById("quoteDisplay");

//   if (filtered.length === 0) {
//     quoteDisplay.textContent = "No quotes available for this category.";
//     return;
//   }

//   const randomIndex = Math.floor(Math.random() * filtered.length);
//   const chosen = filtered[randomIndex];
//   quoteDisplay.textContent = `"${chosen.text}"`;

//   // Save last shown quote in sessionStorage
//   sessionStorage.setItem("lastQuote", chosen.text);
// }

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

  // Refresh categories and dropdowns
  populateCategories();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  document.getElementById("categorySelect").value = quoteCategory;
  document.getElementById("categoryFilter").value = quoteCategory;

  filterQuotes(); // Show filtered quote from new category
}
// function addQuote() {
//   const quoteText = document.getElementById("newQuoteText").value.trim();
//   const quoteCategory = document
//     .getElementById("newQuoteCategory")
//     .value.trim();

//   if (!quoteText || !quoteCategory) {
//     alert("Please enter both quote and category.");
//     return;
//   }

//   quotes.push({ text: quoteText, category: quoteCategory });
//   saveQuotes();
//   populateCategories();

//   document.getElementById("newQuoteText").value = "";
//   document.getElementById("newQuoteCategory").value = "";

//   document.getElementById("categorySelect").value = quoteCategory;
//   showRandomQuote();
// }

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
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// loadQuotes();
// populateCategories();
// createAddQuoteForm();
// showRandomQuote();
loadQuotes();
populateCategories();
createAddQuoteForm();
filterQuotes();
