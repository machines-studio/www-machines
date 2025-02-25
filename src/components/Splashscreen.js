import shuffle from '/utils/array-shuffle'

export const selector = '.splashscreen'

export function hydrate (element) {
  const images = element.querySelectorAll('figure')
  const nut = element.querySelector(':scope > svg')
  if (!images?.length) return
  if (!nut) return

  let picker
  let picked

  nut.addEventListener('touchstart', show)
  nut.addEventListener('touchend', hide)
  nut.addEventListener('mouseenter', show)
  nut.addEventListener('mouseleave', hide)

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
