function generatePagination(idElement) {
    const pagesBar = document.getElementById(idElement);

    const values = [
        "<<", "<", ">", ">>",
        1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192,
        "2^14", "2^15", "2^16", //"2^18", "2^19", "2^20", "2^21", "2^22"
    ];

    const b1 = document.createElement("div"); b1.textContent = "page:"; pagesBar.appendChild(b1);

    // Générer les éléments de pagination
    values.forEach(value => {
        const pageElement = document.createElement("div");
        pageElement.textContent = value;
        pagesBar.appendChild(pageElement);
    });

}

generatePagination("pages-bar-top");
generatePagination("pages-bar-bottom");


/*
-> 2^22 (=) 4.194.304 pages
-> (x50) 209.715.200 topics
-> (x10000) 2.097.152.000.000 posts

-> 2^16 (=) 65.536 pages
-> (x50) 3.276.800 topics
-> (x10000) 32.768.000.000 posts
*/


function generateCategoriesBar(idElement) {
    const pagesBar = document.getElementById(idElement);

    Object.values(CATEGORIES).forEach(({ label, svg }) => {
        const pageElement = document.createElement("div");
        pageElement.textContent = label;
        pagesBar.appendChild(pageElement);
    });

}
generateCategoriesBar("categories-bar");

function randomArray(allArrays) {
    const randomArrayIndex = Math.floor(Math.random() * allArrays.length);
    return allArrays[randomArrayIndex];
}

function randomUnicode(n) {
    const ub1 = [
        ...'🬀🬁🬂🬃🬄🬅🬆🬇🬈🬉🬊🬋🬌🬍🬎🬐🬑🬒🬓🬔🬕🬖🬗🬘🬙🬚🬛🬜🬝🬞🬟',
        ...'🬠🬡🬢🬣🬤🬥🬦🬧🬨🬩🬪🬫🬬🬭🬮🬯🬰🬱🬲🬳🬴🬵🬶🬷🬸🬹🬺🬻',
    ];

    const ub2 = [
        ...'🮠🮡🮢🮣🮤🮥🮦🮧🮨🮩🮪🮫🮬🮭🮮',
    ];

    const ub3 = [
        ...'🭰🭱🭲🭳🭴🭵🭶🭷🭸🭹🭺🭻🭼🭽🭾🭿',
    ];

    const ub4 = [
        ...'🭀🭁🭂🭃🭄🭅🭆🭇🭈🭉🭊🭋🭌🭍🭎🭏🭐🭑🭒🭓🭔🭕🭖🭗🭘🭙🭚🭛🭜🭝🭞🭟',
        ...'🭠🭡🭢🭣🭤🭥🭦🭧🭨🭩🭪🭫🭬🭭🭮🭯🬼🬽🬾🬿',
    ];

    const ub5 = [
        ...'⠀⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿⡀⡁⡂⡃⡄⡅⡆⡇⡈⡉⡊⡋⡌⡍⡎⡏⡐⡑⡒⡓⡔⡕⡖⡗⡘⡙⡚⡛⡜⡝⡞⡟⡠⡡⡢⡣⡤⡥⡦⡧⡨⡩⡪⡫⡬⡭⡮⡯⡰⡱⡲⡳⡴⡵⡶⡷⡸⡹⡺⡻⡼⡽⡾⡿⢀⢁⢂⢃⢄⢅⢆⢇⢈⢉⢊⢋⢌⢍⢎⢏⢐⢑⢒⢓⢔⢕⢖⢗⢘⢙⢚⢛⢜⢝⢞⢟⢠⢡⢢⢣⢤⢥⢦⢧⢨⢩⢪⢫⢬⢭⢮⢯⢰⢱⢲⢳⢴⢵⢶⢷⢸⢹⢺⢻⢼⢽⢾⢿⣀⣁⣂⣃⣄⣅⣆⣇⣈⣉⣊⣋⣌⣍⣎⣏⣐⣑⣒⣓⣔⣕⣖⣗⣘⣙⣚⣛⣜⣝⣞⣟⣠⣡⣢⣣⣤⣥⣦⣧⣨⣩⣪⣫⣬⣭⣮⣯⣰⣱⣲⣳⣴⣵⣶⣷⣸⣹⣺⣻⣼⣽⣾⣿',
    ];

    const ub = randomArray([ub1, ub2, ub3, ub4, ub5]);
    // Générer une chaîne aléatoire
    let result = '';
    for (let i = 0; i < n; i++) {
        const randomIndex = Math.floor(Math.random() * ub.length);
        result += ub[randomIndex];
    }
    return result;
}

// Exemple d'utilisation
const randomString = randomUnicode(10);
console.log(randomString);
