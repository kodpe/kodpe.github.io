// DATA MANAGER
// THIS FILE IS DEPRECATED
let tartipod = {
    id: -1,
    name: "name",
    birthdate: new Date("2025-02-27"),
    age: 0, // nb de jours depuis birthdate
    status: "status",
    think: "think",
    favorite: "favorite", // pain or fromage
    need: 0, // consommation par heure
    lvl: 1,
    xp: 0,
};
// THIS FILE IS DEPRECATED

// let tartipods_tables = tartipod[35];

function countTartipodsNeedPain() {
    let painNeed = 0;
    // TODO : parcourir tous les tartipods, si leur favorite est pain, alors ajoute le need a painNeed
    // (c'est la consommation de pain par heure)
    return painNeed;
}

function countTartipodsNeedFromage() {
    let painFromage = 0;
    // TODO : parcourir tous les tartipods, si leur favorite est fromage, alors ajoute le need a painFromage
    // (c'est la consommation de fromage par heure)
    return painNeed;
}

// THIS FILE IS DEPRECATED

function tartipodsNeeds() {
    setInterval(() => {
        let pain_need = countTartipodsNeedPain() / 360; // on div par 360 car on call une fois / 10 s
        let fromage_need = countTartipodsNeedFromage() / 360;
        cnt_nb_pain -= pain_need;
        cnt_nb_fromage -= fromage_need;
        // TODO changer la think de tous les tartipods avec une think aleatoire
    }, 10000); // toutes les 10 secondes
}

// THIS FILE IS DEPRECATED