const button = document.getElementById('toggleButton');
const panel = document.getElementById('panel');
let panelOpen = false;
button.addEventListener('click', async () => {
    if (!panelOpen) {
        try {
            const response = await fetch('doc/BLUE.2511.txt');
            const text = await response.text();
            panel.textContent = text;
        } catch (e) {
            panel.textContent = "Failed to load content.";
        }
        panel.style.top = '10vh';
        button.textContent = "CLOSE";
        panelOpen = true;
    } else {
        panel.style.top = '-100%';
        button.textContent = "GENERAL GUIDE";
        panelOpen = false;
    }
});