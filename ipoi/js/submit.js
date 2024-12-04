const mailFormElement = document.getElementById("mailForm");
const thankyouElement = document.getElementById("thankyou");
thankyouElement.classList.add("disabled");

mailFormElement.addEventListener("submit", function (event) {
    event.preventDefault(); // Empêche le rechargement de la page
    const email = document.getElementById("email").value;
    const url = document.getElementById("url").value;
    const content = `email: ${email || "no-mail"} URL: ${url}`;
    sendMail(content);
    // alert("Thank you!");
    document.getElementById("mailForm").reset();
    mailFormElement.classList.add("disabled");
    thankyouElement.classList.remove("disabled");
});

btnAdd.addEventListener('click', function () {
    resetUIselector();
    document.getElementById("mailForm").reset();
    btnAdd.classList.add("ui-selector");
    grid.classList.add("disabled");
    submitPageElement.classList.remove("disabled");
    thankyouElement.classList.add("disabled");
    mailFormElement.classList.remove("disabled");
});