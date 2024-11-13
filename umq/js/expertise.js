const weightCorrect = 0.7;
const weightAnswered = 0.3;

function getUserData() {
    const totalQuestions = 200;
    const answeredQuestions = 180;
    const correctAnswers = 150;
    const expertiseScore = calculateExpertiseScore(totalQuestions, answeredQuestions, correctAnswers);
}

function calculateExpertiseScore(totalQuestions, answeredQuestions, correctAnswers) {
    // Calcul du winrate (proportion de bonnes réponses parmi les questions répondues)
    const winrate = correctAnswers / answeredQuestions;
    // Proportion de questions répondues parmi le total
    if (answeredQuestions > totalQuestions) {
        answeredQuestions = totalQuestions;
    }
    const proportionAnswered = answeredQuestions / totalQuestions;
    // Calcul du score d'expertise
    let expertiseScore = (winrate * weightCorrect) + (proportionAnswered * weightAnswered);
    expertiseScore *= 100;
    console.log(`Score d'expertise: ${expertiseScore.toFixed(2)}%`);
    return expertiseScore;
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

// Appel de la fonction pour compter les questions
countQuestionsInPools();

