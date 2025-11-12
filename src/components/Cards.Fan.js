import IS_MOBILE from '/utils/is-mobile'
import distSq from '/utils/distance-squared'
import { normalize, lerp } from 'missing-math'

export const selector = '.cards[data-layout="fan"]'

const SWIPE_THRESHOLD = 50 // px
const SWIPE_MAX_DISTANCE = 300 // px
const SWIPE_START_TIMING = { duration: 300, easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)' }
const SWIPE_END_TIMING = { duration: 300, easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)' }

export function hydrate (element) {
  // Only on mobile
  if (!IS_MOBILE) return

  const Swipe = { start: [0, 0] }
  const slots = Array.from(element.querySelectorAll('.card-slot'))

  for (let index = 0; index < slots.length; index++) {
    const slot = slots[index]

    // Set z-index as JS prop so that we can easily increment
    slot.style.zIndex = index

    // Bind swipe event
    slot.style.touchAction = 'none'
    slot.addEventListener('touchstart', handleTouchStart, { passive: true })
    slot.addEventListener('touchend', handleTouchEnd, { passive: true })
  }

  let index = slots.length - 1

  async function update ({
    angle = 0, // rad
    strength = 0, // n%
  } = {}) {
    const curr = slots[index]

    // Immediately advance index so that multiple swipes can occur during animation
    index = (index + slots.length - 1) % slots.length

    const from = { transform: 'translate(0)' }
    const to = {
      transform: `
        rotate(${angle}rad)
        translateX(${lerp(150, 180, strength * Math.abs(Math.sin(angle)))}%)
        rotate(${-angle + Math.random()}rad)
      `
    }

    await curr.animate([from, to], SWIPE_START_TIMING).finished

    // Update z-index
    for (const slot of slots) {
      slot.style.zIndex = (slot === curr) ? 0 : (slot.style.zIndex + 1)
    }

    curr.animate([to, from], SWIPE_END_TIMING)
  }

  function handleTouchStart (e) {
    const touch = e.touches[0]
    Swipe.start[0] = touch.clientX
    Swipe.start[1] = touch.clientY
  }

  function handleTouchEnd (e) {
    const touch = e.changedTouches[0]
    const d = distSq([Swipe.start[0], touch.clientX], [Swipe.start[1], touch.clientY])
    if (d < SWIPE_THRESHOLD ** 2) return

    update({
      angle: Math.atan2(touch.clientY - Swipe.start[1], touch.clientX - Swipe.start[0]),
      strength: normalize(d, SWIPE_THRESHOLD ** 2, SWIPE_MAX_DISTANCE ** 2, true)
    })
  }
}
