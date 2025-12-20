document.addEventListener('click', e => {
  const logo = e.target.closest('.edn-logo')
  if (!logo) return

  window.location.href = 'index.html'
})