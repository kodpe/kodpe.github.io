// Mock data for search suggestions
const mockData = [
    "Anatomy",
    "Physiology",
    "Pathology",
    "Pharmacology",
    "Neurology",
    "Endocrinology",
    "Epidemiology",
    "Surgery",
    "Genetics",
    "Oncology"
];

// Elements
const searchField = document.getElementById("searchField");
const resultsList = document.getElementById("resultsList");

// Function to filter results based on input
function filterResults(query) {
    return mockData.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
    );
}

// Update the results list
function updateResults() {
    const query = searchField.value.trim();
    const results = filterResults(query);

    // Clear existing results
    resultsList.innerHTML = "";

    // Add new results
    results.forEach(result => {
        const li = document.createElement("li");
        li.textContent = result;
        resultsList.appendChild(li);
    });
}

// Event listener for input
searchField.addEventListener("input", updateResults);
