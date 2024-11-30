const terminalOutput = document.getElementById('output');
const commandInput = document.getElementById('command-input');

const commands = {
    help: "Available commands:\n- help: Display available commands\n- about: Learn about this terminal\n- clear: Clear the terminal",
    about: "This is a simple terminal emulator built with HTML, CSS, and JavaScript.",
    clear: "clear"
};

// Listen for keypress events
commandInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const input = commandInput.value.trim();
        handleCommand(input);
        commandInput.value = '';
    }
});

function handleCommand(input) {
    if (input === 'clear') {
        terminalOutput.textContent = '';
        return;
    }

    const response = commands[input] || `Command not found: ${input}\nType 'help' for a list of commands.`;
    terminalOutput.textContent += `$ ${input}\n${response}\n`;
}
