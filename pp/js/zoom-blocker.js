//
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && 
      (e.key === '+' || e.key === '-' || e.key === '0')) {
    e.preventDefault(); // Empêche le zoom
  }
});

document.addEventListener('wheel', function(e) {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault(); // Empêche le zoom
  }
}, { passive: false });