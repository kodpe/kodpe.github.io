function logWARN(...args) {
    console.warn('%c[  WARN  ]', 'color: #ffff00; font-weight: normal;', ...args);
}

function logINFO(...args) {
    console.log('%c[  INFO  ]', 'color: #00ffff; font-weight: normal;', ...args);
}

function logCALL(...args) {
    console.log('  %c[  CALL  ]', 'color: #00ff00; font-weight: normal;', ...args);
}

function logCREATE(...args) {
    console.log('  %c[ CREATE ]', 'color: #00ff00; font-weight: normal;', ...args);
}

function logOK(...args) {
    console.log('  %c[   OK   ]', 'color: #00ff00; font-weight: normal;', ...args);
}
