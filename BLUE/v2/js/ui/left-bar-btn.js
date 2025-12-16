const vt_offset = parseInt(getComputedStyle(document.documentElement)
                               .getPropertyValue("--hz-top-bar-height"));

// BUTTON VT LEFT BAR - SCROLL TO MEMORY GRID
{
    const btn = document.getElementById("scroll-btn-top");
    const target = document.getElementById("top-cnt");
    btn.addEventListener("click", () => {
        const offset = vt_offset;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
    });
}

// BUTTON VT LEFT BAR - SCROLL TO CODE EDITORS
{
    const btn = document.getElementById("scroll-btn-mid");
    const target = document.getElementById("mid-cnt");
    btn.addEventListener("click", () => {
        const offset = vt_offset;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
    });

}

// BUTTON VT LEFT BAR - SCROLL TO WARRIORS CLASS PRESENTATIONS
{
    const btn = document.getElementById("scroll-btn-bot");
    const target = document.getElementById("bot-cnt");
    btn.addEventListener("click", () => {
        const offset = vt_offset;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
    });
}

// BUTTON VT LEFT BAR - SCROLL TO MAIN GUIDE
{
    const btn = document.getElementById("scroll-btn-bot");
    const target = document.getElementById("bot-cnt");
    btn.addEventListener("click", () => {
        const offset = vt_offset;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
    });
}
