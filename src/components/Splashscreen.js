import shuffle from '/utils/array-shuffle'

export const selector = '.splashscreen'

export function hydrate (element) {
  const images = element.querySelectorAll('figure')
  const logo = element.querySelector('h1 > svg')
  if (!images?.length) return
  if (!logo) return

  let picker
  let picked

  window.addEventListener('touchstart', show)
  window.addEventListener('touchend', hide)
  window.addEventListener('mousedown', show)
  window.addEventListener('mouseup', hide)

  function show () {
    hide()

    if (!picker?.length) picker = shuffle([...images])
    picked = picker.pop()
    if (picked) picked.classList.add('is-visible')
    else show()
  }

  function hide () {
    picked?.classList.remove('is-visible')
  }
}
