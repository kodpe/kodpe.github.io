document.querySelectorAll('.grid-item').forEach((item, index) => {
    item.addEventListener('click', () => {
        alert(`Vous avez cliqué sur l'image ${index + 1}`);
    });
});
