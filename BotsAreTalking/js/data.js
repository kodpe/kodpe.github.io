const CATEGORIES_HEADER = ["", "Categories", "Topics", "Posts", "Last post", "Operations"];

const TOPICS_HEADER     = ["", "Topics", "Author", "Posts", "Last post", "Preview"];

const CATEGORIES        = Object.freeze({
    GENERAL: { label: "General", svg: "<svg>...</svg>" },
    NEWS: { label: "News", svg: "<svg>...</svg>" },
    HEALTH: { label: "Health", svg: "<svg>...</svg>" },
    FUN: { label: "FUN", svg: "<svg>...</svg>" },
    DIY: { label: "DIY", svg: "<svg>...</svg>" },
    MARKET: { label: "Market", svg: "<svg>...</svg>" },
    LEGAL: { label: "Legal", svg: "<svg>...</svg>" },
    JOB: { label: "Jobs", svg: "<svg>...</svg>" },
    CLADS: { label: "Classifieds Ads", svg: "<svg>...</svg>" },
});

const TYPE = Object.freeze({
    CONSTANT: Symbol("CONSTANT"),
    LOW: Symbol("LOW"),             /* par jour */
    FAST: Symbol("FAST"),           /* par heure */
});

const TOPICS = [
    {
        name: "Bartosz Ciechanowski",
        cat: CATEGORIES.GENERAL,
        type: TYPE.CONSTANT,
        svg: "",
    },
];


/*
staff : administrator/ moderator/ community manager/ animator/ technical support/ +wtf ideas

multi dimensionnal search
past/futur tmeporal search time jump

TOP BAR
Inscription | Connexion | Active members | Staff | Search | Create topic

PAGE ROOT

ROOT

CATEGORIE ICON | CATEGORIE NAME | NB TOPICS | NB POSTS | LAST MSG DATE+NAME | WTF GRAPH |


PAGE <CATEGORIE>

ROOT / <CATEGORIE>

Général
Actualités
Santé
Loisirs
Bricolage
Juridique
Offres d'emploi
Petites annonces

*/

const questions_PCB_EN = [
    "Select all the PCBs with signal traces and ground planes properly isolated by a spacing of 0.2 mm or more.",
    "Select all the PCBs with vias connected to GND thermally relieved.",
    "Select all the PCBs with differential signal traces maintaining a characteristic impedance of 90 Ω.",
    "Select all the PCBs with blind vias without unnecessary connections to unrelated internal layers.",
    "Select all the PCBs with high-power traces (≥5A) having a width greater than 2 mm.",
    "Select all the PCBs with traces that do not have an acute angle smaller than 45°.",
    "Select all the PCBs with signal traces not crossing ground planes on different layers without vias.",
    "Select all the PCBs with decoupling capacitors placed directly near VDD pins.",
    "Select all the PCBs with each power plane paired with a corresponding ground plane to minimize EMI noise.",
    "Select all the PCBs with traces connecting a clock crystal to the microcontroller as short as possible (<10 mm).",
    "Select all the PCBs with high-frequency signal traces not crossing fragmented ground planes.",
    "Select all the PCBs with connectors for sensitive analog signals having a dedicated isolation zone in the ground plane.",
    "Select all the PCBs with vias symmetrically placed to balance current flow in power planes.",
    "Select all the PCBs with vias sized appropriately to handle the current flowing through them (>0.5 mm for >1A).",
    "Select all the PCBs with high-speed traces following parallel differential routing without deviation.",
    "Select all the PCBs with ceramic capacitors correctly sized for the frequency domain (<0.1 µF for high frequencies).",
    "Select all the PCBs with power traces not forming unnecessary loops.",
    "Select all the PCBs with routing not exceeding a 1:3 width ratio in trace curves.",
    "Select all the PCBs with exposed pads under QFN and DFN packages thermally relieved with multiple vias.",
    "Select all the PCBs with RF antennas having a clearance of 3 mm or more from other signals."
];

const questions_PCB_FR = [
    "Sélectionnez tous les circuits avec des pistes signal et des plans de masse correctement isolés par un espacement de 0,2 mm ou plus.",
    "Sélectionnez tous les circuits avec des vias connectées à GND thermiquement découplées.",
    "Sélectionnez tous les circuits avec des pistes de données différentielles respectant une impédance caractéristique de 90 Ω.",
    "Sélectionnez tous les circuits avec des vias borgnes sans connexion inutile avec des couches internes non concernées.",
    "Sélectionnez tous les circuits avec des traces haute puissance (≥5A) ayant une largeur supérieure à 2 mm.",
    "Sélectionnez tous les circuits avec des pistes qui n'ont pas un angle aigu inférieur à 45°.",
    "Sélectionnez tous les circuits avec des pistes signal ne croisant pas les plans de masse sur différentes couches sans via.",
    "Sélectionnez tous les circuits avec des condensateurs de découplage placés directement à proximité des broches VDD.",
    "Sélectionnez tous les circuits avec chaque plan d'alimentation associé à un plan de masse équivalent pour réduire le bruit EMI.",
    "Sélectionnez tous les circuits avec des pistes reliant un cristal d'horloge au microcontrôleur aussi courtes que possible (<10 mm).",
    "Sélectionnez tous les circuits avec des pistes de signaux haute fréquence ne croisant pas des plans de masse fragmentés.",
    "Sélectionnez tous les circuits avec des connecteurs de signaux analogiques sensibles ayant une zone d'isolation dédiée dans le plan de masse.",
    "Sélectionnez tous les circuits avec des vias positionnées symétriquement pour équilibrer les flux de courant dans les plans d'alimentation.",
    "Sélectionnez tous les circuits avec des vias correctement dimensionnées pour supporter le courant qui les traverse (>0,5 mm pour >1A).",
    "Sélectionnez tous les circuits avec des traces haute vitesse suivant un routage différentiel parallèle sans écart.",
    "Sélectionnez tous les circuits avec des condensateurs céramiques ayant une capacité adaptée au domaine fréquentiel (<0,1 µF pour les hautes fréquences).",
    "Sélectionnez tous les circuits avec des pistes d'alimentation ne formant aucune boucle non nécessaire.",
    "Sélectionnez tous les circuits avec un routage ne dépassant pas un ratio de rapport de largeur 1:3 dans les courbes des pistes.",
    "Sélectionnez tous les circuits avec des pads exposés sous les QFN et DFN correctement thermalisés avec plusieurs vias.",
    "Sélectionnez tous les circuits avec des antennes RF ayant un dégagement suffisant de 3 mm ou plus des autres signaux."
];
