let labelsNames = []; // Tableau pour stocker les noms des pools

// const globalExpertiseElement = document.getElementById('expertise-value');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomArray(size, min, max) {
    const randomArray = [];
    for (let i = 0; i < size; i++) {
        randomArray.push(getRandomInt(min, max));
    }
    return randomArray;
}

function upperFirstChar(str) {
    if (!str) return ''; // Vérifie si la chaîne est vide ou null
    return str.charAt(0).toUpperCase() + str.slice(1);
}

async function loadLabels() {
    const configResponse = await fetch('../q-data/config.json');
    let cfg = await configResponse.json();
    cfg.pools.forEach(pool => {
        // labelsNames.push(upperFirstChar(pool.name));
    });

    labelsNames.push("Anatomy");
    labelsNames.push("Hematology");
    labelsNames.push("Dermatology");
    labelsNames.push("Histology");
    labelsNames.push("Cell biology");
    labelsNames.push("Immuno.");

    labelsNames.push("Genetics");
    labelsNames.push("Oncology");
    labelsNames.push("Pathology");
    labelsNames.push("Traumatology");
    labelsNames.push("Epidemiology");
    labelsNames.push("Various");

    labelsNames.push("Psychiatry");
    labelsNames.push("Toxicology");
    labelsNames.push("Neurology");
    labelsNames.push("Endocrinology");
    labelsNames.push("Nephrology");
    labelsNames.push("Gastro.");

    labelsNames.push("Nutrition");
    labelsNames.push("ORL");
    labelsNames.push("Pneumo.");
    labelsNames.push("Cardiology");
    labelsNames.push("Rheumatology");
    labelsNames.push("Physiology");
    fillData();
}

async function fillData() {
    const scores = await getExpertises();
    const scoresArray = Object.values(scores);
    // const average = scoresArray.reduce((sum, value) => sum + value, 0) / scoresArray.length;
    // const roundedAverage = Math.round(average);
    // globalExpertiseElement.innerText = average.toFixed(2);
    console.log(scoresArray);
    const data = {
        labels: labelsNames,
        datasets: [{
            label: 'Expertise',
            data: scoresArray,
            // data: generateRandomArray(labelsNames.length, 1, 99),
            backgroundColor: 'rgba(80, 20, 180, 0.3)',
            borderColor: 'rgba(180, 20, 180, 1)',
            borderWidth: 1,
            pointBackgroundColor: 'rgba(0, 255, 255, 1)',
        }]
    };

    // Configuration du graphique radar
    const config = {
        type: 'radar',
        data: data,
        options: {
            responsive: true,
            animations: {
                tension: {
                    duration: 3000,
                    easing: 'linear',
                    from: 0.4,
                    to: -0.2,
                    loop: true
                },
            },
            scales: {
                r: {
                    min: 0,
                    max: 100,
                    ticks: {
                        display: false,
                        stepSize: 25,
                    },
                    grid: {
                        color: 'rgba(80, 255, 180, 0.4)',
                    },
                    angleLines: {
                        color: 'rgba(80, 255, 180, 0.1)',
                    },
                    pointLabels: {
                        color: 'rgba(25, 255, 255, 1)',
                        font: {
                            size: 13,
                        }
                    }
                },
            },
            elements: {
                line: {
                    tension: 0,
                },
                point: {
                    radius: 3,
                    hoverRadius: 8,
                    hitRadius: 12,
                }
            },
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        color: 'rgba(255, 255, 255, 1)',
                    }
                },
                title: {
                    display: false,
                    text: 'SKILLS',
                    color: 'rgba(25, 255, 255, 1)',
                },
            }
        }
    };

    const myChart = new Chart(document.getElementById('myChart'), config);
}


loadLabels();
console.log(labelsNames);