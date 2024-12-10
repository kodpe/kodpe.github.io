function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomIntNotMod10(min, max) {
    let value;
    do {
        value = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (value % 10 === 0);
    return value;
}

function randomCounterConfig(maxValue) {
    return {
        startValue: randomInt(10, maxValue/10000),
        maxValue: randomInt(maxValue/100 + maxValue/10000, maxValue),
        increment: randomIntNotMod10(1, maxValue/10000),
        interval: randomInt(100, 300),
    };
}

function startCounter(counterConfig, element, tsElement, opElement) {
    let currentValue = counterConfig.startValue;
    const timer = setInterval(() => {
        if (currentValue >= counterConfig.maxValue) {
            clearInterval(timer);
        } else {
            currentValue += counterConfig.increment;
            element.querySelector('.counter-value').textContent = currentValue.toString();
            if (tsElement)
                tsElement.innerHTML = randomTimestamp();
            if (opElement)
                opElement.innerHTML = randomUnicode(5);
        }
    }, counterConfig.interval);
}

function createCounter(parentElement, maxValue, tsElement, opElement) {
    const config = randomCounterConfig(maxValue);
    const element = document.createElement('div');
    element.classList.add('counter');
    element.innerHTML = `<div class="counter-value">${config.startValue.toString()}</div>`;
    // console.log("parentElement:", parentElement);
    parentElement.appendChild(element);
    startCounter(config, element, tsElement, opElement);
}