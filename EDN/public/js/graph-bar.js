const ctx = document.getElementById('revisionsChart').getContext('2d');

const data = {
    labels: [
        'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
        'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'
    ],
    datasets: [
        {
            label: "Items",
            data: [10, 150, 120, 80, 20, 100, 20, 45, 31, 120, 131, 140],
            backgroundColor: '#80f',
            barPercentage: 0.9,
            categoryPercentage: 0.8

        },
        {
            label: "Heures",
            data: [15, 138, 140, 85, 22, 109, 22, 47, 21, 129, 131, 110],
            backgroundColor: '#088',
            barPercentage: 0.9,
            categoryPercentage: 0.8

        },
    ]
};

let delayed = false;
const config = {
    type: 'bar',
    data: data,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        devicePixelRatio: window.devicePixelRatio || 1,
        animation: {
            onComplete: () => {
                delayed = true;
            },
            delay: (context) => {
                let delay = 0;
                if (context.type === 'data' && context.mode === 'default' && !delayed) {
                    delay = context.dataIndex * 300 + context.datasetIndex * 100;
                }
                return delay;
            },
        },
        scales: {
            y: {
                ticks: {
                    color: '#fff',
                    font: { family: 'system-ui', size: 12, weight: 'normal' }
                },
                beginAtZero: true,
                title: {
                    display: false,
                    text: 'Heures',
                    color: '#fff',
                }
            },
            x: {
                ticks: {
                    color: '#fff',
                    font: { family: 'system-ui', size: 12, weight: 'normal' }
                },
                title: {
                    display: false,
                    text: 'Mois',
                    color: '#fff'
                }
            }
        },
        plugins: {
            tooltip: {
                titleColor: '#fff',
                bodyColor: '#ddd',
                backgroundColor: '#222',
                borderColor: '#ddd',
                cornerRadius: 0,
                borderRadius: 0, // next version
                borderWidth: 1,
            },
            title: {
                display: true,
                text: "Activité mensuelle",
                align: 'end',
                color: '#fff',
                font: { family: 'system-ui', size: 12, weight: 'normal' },
                padding: {
                    top: 0
                } 
            },
            legend: {
                display: true,
                labels: {
                    color: '#fff',
                    font: { family: 'system-ui', size: 12, weight: 'normal' }
                }
            }
        }
    }
};

const revisionsChart = new Chart(ctx, config);
