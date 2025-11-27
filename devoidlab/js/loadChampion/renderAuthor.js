function renderAuthor(json) {
    logCALL("renderAuthor() <- json");
    //
    const element = document.getElementById("champion-author-text");
    //
    element.textContent = "created: "+json.project.created+" / "
    element.textContent += "updated: "+json.project.updated
    //
    authorList = json.project.author;
    for (const author of authorList) {
        element.textContent += " / @"+author;
    }
    logOK("renderAuthor()");
}