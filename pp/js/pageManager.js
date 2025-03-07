// PAGE MANAGER // DEPRECATED
// THIS FILE IS DEPRECATED
let page = {
    id: 0,
    name: 'Cuisine',
    found: true,
    volume: 0.8,
}
let pages = {
    kitchen: 1,
    park: 1,
    street: 1,
    domain: 1
};

// THIS FILE IS DEPRECATED

//
const urlCuisinePage = window.location.origin + '/' + window.location.pathname.split('/')[1] + "?on=1";
const urlStreetPage = window.location.origin + '/' + window.location.pathname.split('/')[1] + '/street.html';
const urlParkPage = window.location.origin + '/' + window.location.pathname.split('/')[1] + '/park.html';
//
const currentUrl = window.location.href;
console.log(currentUrl);
let btnLeft = document.getElementById('btn-place-left');
let btnRight = document.getElementById('btn-place-right');

// THIS FILE IS DEPRECATED

if (currentUrl.includes('park')) {
    if (pages.street === 0) {
        btnRight.classList.add('disabled');
    }
    btnLeft.addEventListener('click', function () {
        window.location.href = urlCuisinePage;
    });
    btnRight.addEventListener('click', function () {
        window.location.href = urlStreetPage;
    });
}
else if (currentUrl.includes('street')) {
    if (pages.park === 0) {
        btnLeft.classList.add('disabled');
    }
    btnLeft.addEventListener('click', function () {
        window.location.href = urlParkPage;
    });
    btnRight.addEventListener('click', function () {
        window.location.href = urlCuisinePage;
    });
}
else { // cuisine
    if (pages.street === 0) {
        btnLeft.classList.add('disabled');
    }
    if (pages.park === 0) {
        btnRight.classList.add('disabled');
    }
    btnLeft.addEventListener('click', function () {
        window.location.href = urlStreetPage;
    });
    btnRight.addEventListener('click', function () {
        window.location.href = urlParkPage;
    });
}

// THIS FILE IS DEPRECATED