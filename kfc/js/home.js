  // btn host
  const btnHost = document.getElementById("btn-create");
  const imgHost = document.getElementById("img-create-game");
  btnHost.addEventListener("mouseover", () => {
    imgHost.style.transform = "rotate(-20deg)";
  });
  btnHost.addEventListener("mouseout", () => {
    imgHost.style.transform = "rotate(20deg)";
  });

  // btn join
  const btnJoin = document.getElementById("btn-join");
  const imgJoin = document.getElementById("img-join-game");
  btnJoin.addEventListener("mouseover", () => {
    imgJoin.style.transform = "rotate(-20deg)";
  });
  btnJoin.addEventListener("mouseout", () => {
    imgJoin.style.transform = "rotate(20deg)";
  });

// title
  const btnTitle = document.getElementById("btn-title");
  const img1 = document.getElementById("img-title-1");
  const img2 = document.getElementById("img-title-2");
  btnTitle.addEventListener("mouseover", () => {
    img1.style.transform = "rotate(20deg)";
    img2.style.transform = "rotate(-20deg)";
  });
  btnTitle.addEventListener("mouseout", () => {
    img1.style.transform = "rotate(-20deg)";
    img2.style.transform = "rotate(20deg)";
  });

document.addEventListener('DOMContentLoaded', function () {
    const btnTitle = document.getElementById('btn-title');
    btnTitle.addEventListener('click', reloadHome);
});

function reloadHome() {
    location.reload();
}