const terms = [
    "Art", "Music", "Science", "Technology", "Learning", "Fun", "Adventure", "Nature", "Books", "Movies", "Travel", "Games"
];

const spanElement = document.querySelector('.size-span');
function updateChange(event) {
    const value = event.target.value;
    spanElement.innerText = value;
    // console.log(value);
    if (!value)
        document.getElementById('input-wrp').classList.remove("ui-selector");
    if (value)
    {
        btnLearn.parentElement.classList.remove("ui-selector");
        btnFun.parentElement.classList.remove("ui-selector");
        btnArt.parentElement.classList.remove("ui-selector");
        btnAdd.classList.remove("ui-selector");
        document.getElementById('input-wrp').classList.add("ui-selector");
        submitPageElement.classList.add("disabled");
        grid.classList.remove("disabled");
    }
    generateWebsiteGrid(value);
}

function showSuggestions() {
    return; // depr
    const input = document.getElementById('myinput');
    const suggestionsList = document.getElementById('suggestionsList');
    const query = input.innerHTML.toLowerCase();
    console.log(query);
    const inp = document.getElementById('inp');

    suggestionsList.innerHTML = '';

    if (query.length > 1) {
        const filteredTerms = terms.filter(term => term.toLowerCase().includes(query));

        // console.log(filteredTerms);

        // Display filtered suggestions
        filteredTerms.forEach(term => {
            const li = document.createElement('li');
            li.textContent = term.toLowerCase();
            li.onclick = function () {
                inp.value = term.toLowerCase();
                suggestionsList.innerHTML = '';
            };
            suggestionsList.appendChild(li);
        });
    }
}
