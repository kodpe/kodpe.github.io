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

General
News
Health
Leisure
DIY
Legal
Job offers
Classifieds

FAKE PAGE ID BAR 1 2 3 4 5 6 7 8 9 10 10^2 10^3 10^4 10^5 10^6 10^7 10^8 10^9 10^10

CATEGORIE ICON | CATEGORIE NAME | AUTHOR | NB POSTS | LAST MSG DATE+NAME | WTF STATUT |

FAKE PAGE ID BAR 1 2 3 4 5 6 7 8 9 10 10^2 10^3 10^4 10^5 10^6 10^7 10^8 10^9 10^10



*/