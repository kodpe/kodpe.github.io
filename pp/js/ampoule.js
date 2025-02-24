const christmasColors = ['#FF0000', '#00FF00', '#FFFF00', '#0000FF', '#FF00FF'];

const ampoules = document.querySelectorAll('.ampoule');

ampoules.forEach((ampoule, index) => {
    const colorIndex = index % christmasColors.length;
    ampoule.style.setProperty('--color1', christmasColors[colorIndex]);
    ampoule.style.setProperty('--color2', christmasColors[(colorIndex + 1) % christmasColors.length]);
    ampoule.style.setProperty('--color3', christmasColors[(colorIndex + 2) % christmasColors.length]);
    ampoule.style.setProperty('--color4', christmasColors[(colorIndex + 3) % christmasColors.length]);
    ampoule.style.setProperty('--color5', christmasColors[(colorIndex + 4) % christmasColors.length]);
});
