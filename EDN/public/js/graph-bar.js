const ctx = document.getElementById('revisionsChart').getContext('2d');

async function fetchMonthlyActivityChart() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const res = await fetch(`/api/user/monthly-activity-chart?token=${encodeURIComponent(token)}`);

    if (!res.ok) {
        throw new Error("Impossible de charger les données du chart");
    }

    return await res.json();
}

/*
const data = {
    labels: [
        'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
        'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'
    ],
    datasets: [
        {
            label: "Pratiques",
            data: [20, 150, 45, 70, 10, 50, 20, 40, 31, 12, 57, 28],
            backgroundColor: 'rgb(191, 19, 197)',
            barPercentage: 0.9,
            categoryPercentage: 0.8

        },
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
*/

let revisionsChart
async function initGraphBar() {

    const data = await fetchMonthlyActivityChart();

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

    revisionsChart = new Chart(ctx, config);
}

document.addEventListener("DOMContentLoaded", initGraphBar);