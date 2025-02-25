import shuffle from '/utils/array-shuffle'

export const selector = '.splashscreen'

export function hydrate (element) {
  const images = shuffle([...element.querySelectorAll('figure')])
  const logo = element.querySelector('h1 > svg')
  if (!images?.length) return
  if (!logo) return

  let index = 0

  window.addEventListener('touchstart', show)
  window.addEventListener('touchend', hide)
  window.addEventListener('mousedown', show)
  window.addEventListener('mouseup', hide)

  function show () {
    hide()

    index = (index + 1) % images.length
    images[index]?.classList.add('is-visible')
  }

  function hide () {
    images[index]?.classList.remove('is-visible')
  }
}
