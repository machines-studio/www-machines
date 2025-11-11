import distSq from '/utils/distance-squared'
import { map } from 'missing-math'
import { raf } from '@internet/raf'
import Pointer from '/utils/Pointer'
import { getElementRectangle } from '/utils/less-layout-trashing'
import IS_MOBILE from '/utils/is-mobile'

export const selector = '.clients'

const STICKY_DISTANCE = 100 // px
const STICKY_FACTOR = 0.3 // %

export function hydrate (element) {
  if (IS_MOBILE) return

  const clients = Array.from(element.querySelectorAll('.clients__client'))
  raf.add(tick)

  return {
    destroy: () => raf.remove(tick)
  }

  function tick () {
    // Compute sticky factor based on mouse speed
    const factor = map(
      distSq(
        [Pointer.$pageX.previous ?? Pointer.$pageX.value, Pointer.$pageY.previous ?? Pointer.$pageY.value],
        [Pointer.$pageX, Pointer.$pageY]
      ),
      0,
      STICKY_DISTANCE ** 2,
      STICKY_FACTOR,
      1,
      true
    )

    for (const client of clients) {
      const {
        $top,
        $left,
        $bottom,
        $right
      } = getElementRectangle(client)

      // Adjust initial bounding box to current document scroll
      const hit = element.contains(Pointer.$target.value) &&
        Pointer.$pageX > $left &&
        Pointer.$pageX < $right &&
        Pointer.$pageY > $top &&
        Pointer.$pageY < $bottom

      client.classList.toggle('is-sticked', hit)

      if (hit) {
        // Define origin of the hit
        client.initialHit ??= {
          x: Pointer.$clientX.value,
          y: Pointer.$clientY.value
        }

        // Update position
        client.dx = (Pointer.$clientX - client.initialHit.x) * factor
        client.dy = (Pointer.$clientY - client.initialHit.y) * factor
        client.style.setProperty('--stick-x', client.dx.toFixed(3) + 'px')
        client.style.setProperty('--stick-y', client.dy.toFixed(3) + 'px')
      } else {
        // Delete hit origin
        delete client.initialHit

        // Reset position
        client.dx = 0
        client.dy = 0
        client.style.setProperty('--stick-x', 0)
        client.style.setProperty('--stick-y', 0)
      }
    }
  }
}
