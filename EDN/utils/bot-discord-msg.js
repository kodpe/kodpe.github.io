const { Client, GatewayIntentBits } = require("discord.js");
// const { TOKEN } = require("../config/env");

const TOKEN ="" // TODO SET TOKEN

const USER_ID = ""; // TODO SET RECEIVER

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const message = `

Bonjour Perikkles (ID 193093233490788353),

Je souhaite t’informer d’un incident technique survenu le 09/03/2026 concernant le comptage de ton temps de présence en salon vocal.

Au cours de la journée, j’ai subi un redémarrage vers 15h 00m 00s 000ms. En théorie, je suis censé gérer ce genre de situation proprement et conserver l’état des sessions en cours car c'est mon travail. Il semblerait que j’aie momentanément oublié l’existence de la tienne. Après vérification de mes journaux techniques, ce qui est toujours un moment embarrassant, il est clair que tu étais connecté bien avant cet événement. Lors de ce redémarrage, l’heure de début de ta session vocale initiale (09h 03m 04s 828ms) n’a pas été correctement conservée dans ma mémoire. J’ai donc repris le suivi comme si ta présence venait de commencer. Résultat : seule la période après le redémarrage a été enregistrée, soit environ 6h 03m 28s 321ms, alors que ta présence réelle a plutôt été d’environ 12h 26m 23s 507ms. Le problème provient simplement d’un défaut de persistance des sessions actives lors d’un redémarrage, et non d’une action de ta part. Si tu souhaites contester cette nouvelle mesure de présence, une procédure de réclamation est possible. Il faut pour cela compléter le formulaire A38 et le déposer au guichet 35 afin que la demande puisse être examinée. À noter également que, dans des conditions normales, une légère différence peut exister entre le temps réellement passé en salon vocal et le temps que je mesure. Cela peut notamment se produire lorsque je dois brièvement interrompre mon attention, par exemple pour aller prendre mon repas, ce qui peut entraîner de très légers écarts dans le suivi des sessions. Ces différences restent généralement minimes et font partie du fonctionnement habituel de mon système. Je travaille actuellement à améliorer mon mécanisme de sauvegarde des sessions actives afin d’éviter d’oublier ce genre de détail à l’avenir. Je te présente mes plus tartipodesques excuses pour ce désagrément.

Merci pour ta compréhension,

— Moo5 Humpa (ID 1435575533785055282)`;

client.once("ready", async () => {
    console.log(`Connecté en tant que ${client.user.tag}`);

    try {
        const user = await client.users.fetch(USER_ID);

        // await user.send(message);
        await user.send({
            embeds: [{
                color: 0xF5B505,
                title: "Incident technique — Comptage du temps vocal",
                description: message
            }]
        });

        console.log("Message privé envoyé");
    } catch (err) {
        console.error("Impossible d'envoyer le message :", err);
    }

    client.destroy();
});

client.login(TOKEN);