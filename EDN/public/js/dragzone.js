const zones = [
  new Packery('#zoneA', {
    itemSelector: '.itemd',
    gutter: 10
  }),
  new Packery('#zoneB', {
    itemSelector: '.itemd',
    gutter: 10
  })
]

// Map item → packery courant
const itemZone = new Map()

zones.forEach(packery => {
  packery.getItemElements().forEach(el => {
    makeDraggable(el, packery)
  })
})

function makeDraggable(element, packery) {
  const draggie = new Draggabilly(element)

  itemZone.set(element, packery)
  packery.bindDraggabillyEvents(draggie)

  draggie.on('dragEnd', () => {
    const target = getZoneUnder(element)

    if (!target) return

    const currentPackery = itemZone.get(element)

    if (currentPackery !== target) {
      // retirer de l’ancienne zone
      currentPackery.remove(element)
      currentPackery.layout()

      // ajouter à la nouvelle
      target.element.appendChild(element)
      target.appended(element)
      target.layout()

      itemZone.set(element, target)
    }
  })
}

function getZoneUnder(el) {
  const rect = el.getBoundingClientRect()

  return zones.find(p => {
    const r = p.element.getBoundingClientRect()
    return (
      rect.left > r.left &&
      rect.right < r.right &&
      rect.top > r.top &&
      rect.bottom < r.bottom
    )
  })
}
