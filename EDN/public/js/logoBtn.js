document.addEventListener('click', e => {
  const logo = e.target.closest('.edn-logo')
  if (!logo) return

  const params = new URLSearchParams(window.location.search)
  const token = params.get("token")

  window.location.href = `?token=${encodeURIComponent(token)}`
})

/*
document.addEventListener('click', e => {
  const logo = e.target.closest('.edn-logo')
  if (!logo) return

  window.location.reload()
})
*/