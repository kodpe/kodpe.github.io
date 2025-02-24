// TELEVISION ROLL
// TODO faire nouvelle television
img1 = document.getElementById("t1");
img2 = document.getElementById("t2");
img3 = document.getElementById("t3");
img4 = document.getElementById("t4");
img5 = document.getElementById("t5");
img6 = document.getElementById("t6");
img7 = document.getElementById("t7");
img8 = document.getElementById("t8");
img9 = document.getElementById("t9");
img10 = document.getElementById("t10");
img11 = document.getElementById("t11");
img12 = document.getElementById("t12");
img13 = document.getElementById("t13");
var imgsTV = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13];

function tv_roll() {
    // console.log('tv_roll()');
    for (var i = 0; i < imgsTV.length; i++) {
        imgsTV[i].classList.add('disabled');
    }
    var randomId = Math.floor(Math.random() * imgsTV.length);
    imgsTV[randomId].classList.remove('disabled');
    setTimeout(function () {
        tv_roll();
    }, 3000);
}

tv_roll();