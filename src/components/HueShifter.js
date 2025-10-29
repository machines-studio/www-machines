export const selector = '.hue-shifter'

let GLOBAL_HUE = 0

const EVENTS = [
  'mouseenter',
  'focus',
  'click'
]

export function hydrate (element) {
  update()
  for (const event of EVENTS) element.addEventListener(event, shift)

  function shift () {
    GLOBAL_HUE = (GLOBAL_HUE + 2) % 360
    update()
  }

  function update () {
    element.style.setProperty('--hue-shift', GLOBAL_HUE + 'deg')
  }
}
