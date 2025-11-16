const viewport = document.getElementById('viewport');
const mapWrapper = document.getElementById('map-wrapper');
const mapMarkers = document.getElementById('map-markers');

let panX = 0, panY = 0;
let scale = 1;
let isPanning = false;
let startX = 0, startY = 0, startPanX = 0, startPanY = 0;

// Apply transform to map and markers
function updateTransform() {
  const t = `translate(${panX}px, ${panY}px) scale(${scale})`;
  mapWrapper.style.transform = t;
  mapMarkers.style.transform = t;
}

// Drag pan
mapWrapper.addEventListener('pointerdown', e=>{
  isPanning = true;
  startX = e.clientX;
  startY = e.clientY;
  startPanX = panX;
  startPanY = panY;
  mapWrapper.setPointerCapture(e.pointerId);
});

mapWrapper.addEventListener('pointermove', e=>{
  if(!isPanning) return;
  panX = startPanX + (e.clientX - startX);
  panY = startPanY + (e.clientY - startY);
  updateTransform();
});

mapWrapper.addEventListener('pointerup', e=>{
  isPanning = false;
  mapWrapper.releasePointerCapture(e.pointerId);
});

// Zoom avec molette
document.getElementById('viewport').addEventListener('wheel', e=>{
  e.preventDefault();
  const zoomFactor = 1.1;
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  const prevScale = scale;
  scale *= (e.deltaY < 0 ? zoomFactor : 1/zoomFactor);

  // Ajuster le pan pour garder le point sous le curseur fixe
  panX -= (mouseX - panX) * (scale/prevScale - 1);
  panY -= (mouseY - panY) * (scale/prevScale - 1);

  updateTransform();
}, { passive:false });

// Add markers
function addMapMarker(x, y) {
  const marker = document.createElement('button');
  marker.className = 'map-marker';
  marker.style.left = x + 'px';
  marker.style.top = y + 'px';
  marker.addEventListener('click', () => alert(`Marker cliqué à ${x},${y}`));
  mapMarkers.appendChild(marker);
}

// Example markers
addMapMarker(400,400);
addMapMarker(5000,5000);

const mapWidth = 6600;
const mapHeight = 6600;

// initial transform with fit map to viewport
function fitMapToViewport() {
  const vw = viewport.clientWidth;
  const vh = viewport.clientHeight;
  scale = Math.min(vw / mapWidth, vh / mapHeight);
  // panX = 0;
  // panY = 0;
   // centrer la carte
  panX = (vw - mapWidth * scale) / 2;
  panY = (vh - mapHeight * scale) / 2;
  updateTransform();
}

// initial transform
fitMapToViewport();

// Re-fit si on redimensionne la fenêtre
window.addEventListener('resize', fitMapToViewport);

///////////
  // Convert viewport client coords to image coordinates (pre-scale)
  function clientToImage(clientX, clientY) {
    const rect = viewport.getBoundingClientRect();
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;

    // Compute image pos prior to scaling and pan transform:
    // local = center + ( (imgCoord - imgCenter) * scale ) + (pan*scale)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const imgCx = mapWidth / 2;
    const imgCy = mapHeight / 2;

    const imgX = ((localX - centerX) / scale) + imgCx - panX;
    const imgY = ((localY - centerY) / scale) + imgCy - panY;
    return { x: imgX, y: imgY };
  }


  const minScale = 0.05;
  const maxScale = 1;
  const clamp = (v,a,b) => Math.max(a, Math.min(b, v));

  // Zoom keeping the image point (imgX,imgY) fixed under cursor
  function zoomAt(zoomFactor, clientX, clientY) {
    const before = clientToImage(clientX, clientY);
    scale = clamp(scale * zoomFactor, minScale, maxScale);
    const after = clientToImage(clientX, clientY);

    // adjust pan so that before == after
    panX += (after.x - before.x);
    panY += (after.y - before.y);
    updateTransform();
  }

  // Buttons
  document.getElementById('zoom-in').addEventListener('click', () => {
    // zoom at center
    const rect = viewport.getBoundingClientRect();
    zoomAt(1.25, rect.left + rect.width/2, rect.top + rect.height/2);
  });
  document.getElementById('zoom-out').addEventListener('click', () => {
    const rect = viewport.getBoundingClientRect();
    zoomAt(1/1.25, rect.left + rect.width/2, rect.top + rect.height/2);
  });
  document.getElementById('fit').addEventListener('click', fitMapToViewport);
