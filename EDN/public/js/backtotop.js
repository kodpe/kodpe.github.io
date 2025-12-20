const btn = document.getElementById('backToTop')

window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        btn.classList.add('show')
        btn.classList.remove('hide')
    } else {
        btn.classList.remove('show')
        btn.classList.add('hide')
    }
})

btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
})
