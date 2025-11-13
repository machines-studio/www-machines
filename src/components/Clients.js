import { raf } from '@internet/raf'
import Pointer from '/utils/Pointer'
import { map, normalize, lerpRadians } from 'missing-math'
import { getElementRectangle } from '/utils/less-layout-trashing'
import IS_MOBILE from '/utils/is-mobile'

export const selector = '.clients'

const STICKY_DISTANCE = 40 // px
const STICKY_ANGLE_FACTOR = 0.5 // %
const STICKY_FRICTION_X = 0.3 // %
const STICKY_FRICTION_Y = 0.6 // %

export function hydrate (element) {
  if (IS_MOBILE) return

  const clients = Array.from(element.querySelectorAll('.clients__client'))
  for (const client of clients) client.Rect = getElementRectangle(client)

  raf.add(tick)

  return {
    destroy: () => raf.remove(tick)
  }

  function tick () {
    for (const client of clients) {
      const hit = Pointer.$pageX > client.Rect.$left - STICKY_DISTANCE &&
        Pointer.$pageX < client.Rect.$right + STICKY_DISTANCE &&
        Pointer.$pageY > client.Rect.$top - STICKY_DISTANCE &&
        Pointer.$pageY < client.Rect.$bottom + STICKY_DISTANCE

      if (hit) {
        client.initialHit ??= {
          x: Pointer.$pageX.value,
          y: Pointer.$pageY.value
        }

        const dx = (Pointer.$pageX - client.initialHit.x) * STICKY_FRICTION_X
        const dy = (Pointer.$pageY - client.initialHit.y) * STICKY_FRICTION_Y

        const theta =
          lerpRadians(
            lerpRadians(
              -Math.atan2(dy, client.Rect.$centerX - Pointer.$pageX),
              -Math.atan2(dy, client.Rect.$centerX - Pointer.$pageX) - Math.PI,
              // Normalized left to right
              normalize(Pointer.$pageX, client.Rect.$left, client.Rect.$right, true)
            ),
            0,
            // Normalized distance to x center
            Math.abs(Math.sin(map(Pointer.$pageX, client.Rect.$left, client.Rect.$right, 0, Math.PI, true)))
          ) * STICKY_ANGLE_FACTOR

        client.classList.add('is-sticked')
        client.style.setProperty('--stick-x', dx.toFixed(3) + 'px')
        client.style.setProperty('--stick-y', dy.toFixed(3) + 'px')
        client.style.setProperty('--stick-angle', theta + 'rad')
      } else {
        delete client.initialHit

        client.classList.remove('is-sticked')
        client.style.setProperty('--stick-x', 0)
        client.style.setProperty('--stick-y', 0)
        client.style.setProperty('--stick-angle', 0)
      }
    }
  }
}
