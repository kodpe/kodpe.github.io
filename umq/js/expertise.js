const weightCorrect = 0.7;
const weightAnswered = 0.3;
const sigmoideCurveControl = 4;

function getExpScore(totalQuestions, answeredQuestions, correctAnswers) {
    const winrate = correctAnswers / answeredQuestions;
    if (answeredQuestions > totalQuestions) {
        answeredQuestions = totalQuestions;
    }
    const proportionAnswered = answeredQuestions / totalQuestions;
    let expertiseScore = (winrate * weightCorrect) + (proportionAnswered * weightAnswered);
    expertiseScore *= 100;
    if (Number.isNaN(expertiseScore))
        expertiseScore = 0;
    return expertiseScore;
}

function getScoreSigmoide(score) {
    let sigval = 100 * (1 - 1 / (1 + Math.pow(score / 100, sigmoideCurveControl)));
    if (Number.isNaN(sigval))
        sigval = 0;
    return sigval;
}

function getExpertiseForDomain(domainName, questionsCounts) {
    return new Promise((resolve, reject) => {
        // Supposons que db est déjà ouvert
        openDB().then((db) => {
            const transaction = db.transaction("domains", "readonly");
            const store = transaction.objectStore("domains");

            const request = store.get(domainName);
            request.onsuccess = (event) => {
                const data = event.target.result;
                console.log(data);

                if (data) {
                    const totalQuestions = questionsCounts[domainName];
                    // const expertiseScore = getScoreSigmoide(getExpScore(totalQuestions, data.nbAnswered, data.nbCorrectAnswers));
                    const expertiseScore = getExpScore(totalQuestions, data.nbAnswered, data.nbCorrectAnswers);
                    if (Number.isNaN(expertiseScore))
                        expertiseScore = 0;
                    resolve({ domainName, expertiseScore }); // Résoudre avec le résultat
                } else {
                    reject(`Données non trouvées pour ${domainName}`);
                }
            };

            request.onerror = (event) => {
                reject(`Erreur lors de la récupération des données pour ${domainName}: ${event.target.error}`);
            };
        }).catch(reject); // Si openDB échoue, rejeter la promesse
    });
}

function getAllExpertisesScores(questionsCounts) {
    const domains = [
        "Anatomy",
        "Physiology",
        "Pathology",
        "Surgery",
        "Pharmacology",
        "Genetics",
        "Neurology",
        "Epidemiology",
        "Endocrinology",
        "Miscellaneous",
        "Oncology",
        "Cardiology"
    ];
    const scores = {};  // Objet pour stocker les scores

    // Créer un tableau de Promises pour récupérer les scores pour chaque domaine
    const promises = domains.map(domainName => {
        return getExpertiseForDomain(domainName, questionsCounts)
            .then(result => {
                scores[result.domainName] = result.expertiseScore;  // Ajouter le score à l'objet scores
            })
            .catch(error => {
                console.error(error);  // Gérer les erreurs si le domaine n'a pas pu être récupéré
            });
    });

    // Attendre que toutes les Promises soient résolues
    return Promise.all(promises).then(() => {
        console.log("Tous les scores ont été récupérés:", scores);
        return scores;  // Retourner l'objet avec les scores
    }).catch(error => {
        console.error("Erreur lors de la récupération des scores:", error);
    });
}

async function countQuestionsInPools() {
    try {
        // Charger le fichier de configuration
        const configResponse = await fetch('../q-data/config.json');

        // Vérifier si la réponse est valide
        if (!configResponse.ok) {
            throw new Error(`Erreur de chargement de config.json: ${configResponse.status}`);
        }

        const config = await configResponse.json();

        // Un objet pour stocker le nombre de questions pour chaque pool
        const questionCounts = {};

        // Parcourir chaque pool et charger son fichier de questions
        for (const pool of config.pools) {
            const poolFileResponse = await fetch(pool.file);

            // Vérifier si la réponse est valide
            if (!poolFileResponse.ok) {
                console.warn(`Fichier introuvable ou erreur de chargement pour ${pool.name}`);
                continue;  // Passer au prochain pool si le fichier ne peut pas être chargé
            }

            // Essayer de parser le fichier JSON
            try {
                const poolData = await poolFileResponse.json();

                // Vérifier si le fichier contient des données (tableau non vide)
                if (Array.isArray(poolData) && poolData.length > 0) {
                    const questionCount = poolData.length;  // Compter le nombre de questions
                    questionCounts[pool.name] = questionCount;
                } else {
                    console.warn(`Le fichier de pool ${pool.name} est vide`);
                }
            } catch (e) {
                console.error(`Erreur de parsing JSON pour ${pool.name}:`, e);
            }
        }

        console.log(questionCounts);
        const totalQuestions = Object.values(questionCounts).reduce((total, count) => total + count, 0);
        console.log('Nombre total de questions:', totalQuestions);
        return questionCounts;
    } catch (e) {
        console.error("Erreur lors de la récupération des données:", e);
    }
}

async function getExpertises() {
    const nbQuestions = await countQuestionsInPools(); // Attendez que les données soient prêtes
    let scores = await getAllExpertisesScores(nbQuestions); // Utilisez nbQuestions une fois qu'il est défini
    return scores;
}

// let scores = getExpertises();
