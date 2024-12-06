const terms = [
    "Art", "Music", "Science", "Technology", "Learning", "Fun", "Adventure", "Nature", "Books", "Movies", "Travel", "Games"
];

const inputWrapper = document.getElementById('input-wrp');
const spanElement = document.querySelector('.size-span');
const input = document.getElementById("inp");

function updateChange(event) {
    const value = event.target.value;
    spanElement.innerText = value;
    if (!value)
        inputWrapper.classList.remove("ui-selector");
    if (value)
    {
        if (!inputWrapper.classList.contains('ui-selector'))
        {
            resetUIselector();
            inputWrapper.classList.add("ui-selector");
        }
    }
    generateWebsiteGrid(value);
}

input.addEventListener("focus", () => {
    // console.log("L'input a le focus !");
    if (!inputWrapper.classList.contains('ui-selector'))
    {
        resetUIselector();
        document.getElementById('input-wrp').classList.add("ui-selector");
    }
});

input.addEventListener("blur", () => {
//   console.log("L'input a perdu le focus !");
    if (input.value.trim() == "")
        inputWrapper.classList.remove("ui-selector");
});

inputWrapper.addEventListener('click', () => {
        input.focus();
});