const terminalOutput = document.getElementById('output');
const commandInput = document.getElementById('command-input');
const powerGauge = document.getElementById('power-gauge');

let powerLevel = 200; // Puissance initiale

const commands = {
    status: () => {
        appendOutput("System Status:\n- Reactor: Stable\n- Cooling Pool: Nominal\n- Power Level: " + powerLevel);
    },
    "increase power": () => {
        if (powerLevel >= 250) {
            appendOutput("Power is already at maximum!");
        } else {
            powerLevel += 10;
            updatePowerGauge();
            appendOutput("Power increased to " + powerLevel);
        }
    },
    "decrease power": () => {
        if (powerLevel <= 150) {
            appendOutput("Power is already at minimum!");
        } else {
            powerLevel -= 10;
            updatePowerGauge();
            appendOutput("Power decreased to " + powerLevel);
        }
    },
    clear: () => {
        terminalOutput.textContent = '';
    },
    shutdown: () => {
        appendOutput("EMERGENCY SHUTDOWN INITIATED.\nReactor cooling...");
        powerLevel = 150;
        updatePowerGauge();
    }
};

commandInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const input = commandInput.value.trim();
        const command = commands[input];
        if (command) {
            command();
        } else {
            appendOutput(`Unknown command: ${input}`);
        }
        commandInput.value = '';
    }
});

function appendOutput(text) {
    terminalOutput.textContent += `$ ${text}\n`;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function updatePowerGauge() {
    powerGauge.setAttribute("y2", 200 + (250 - powerLevel) / 10);
}
