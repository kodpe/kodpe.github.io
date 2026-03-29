const input = document.getElementById("customTextInput");

input.addEventListener("input", () => {
    input.style.width = "auto";
    input.style.width = input.scrollWidth + "px";
});