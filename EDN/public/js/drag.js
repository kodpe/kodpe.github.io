const grid = document.querySelector('.grid');

const pckry = new Packery(grid, {
    itemSelector: '.static, .v2-form-item',
    gutter: 8
});

pckry.getItemElements().forEach(el => {
    const draggie = new Draggabilly(el);
    pckry.bindDraggabillyEvents(draggie);

    draggie.on('dragStart', () => el.classList.add('is-dragging'));
    draggie.on('dragEnd', () => {
        el.classList.remove('is-dragging')
        console.log(getOrder());
    });
});

pckry.getItemElements().forEach(el => {
  if (el.classList.contains('static')) {
    el.style.pointerEvents = 'none';
  }
});

function getOrder() {
  return pckry.getItemElements().map(el => ({
    type: el.classList.contains('static') ? 'static' : 'item',
    id: el.dataset.id || null,
    label: el.textContent.trim()
  }));
}
