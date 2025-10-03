import distSq from '/utils/distance-squared'
import { map } from 'missing-math'
import { raf } from '@internet/raf'
import Pointer from '/utils/Pointer'
import { getElementRectangle } from '/utils/less-layout-trashing'

export const selector = '.clients'

const STICKY_DISTANCE = 100 // px
const STICKY_FACTOR = 0.5 // %

export function hydrate (element) {
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
      const bbox = getElementRectangle(client).$boundingClientRect.value

      // Adjust initial bounding box to current document scroll
      const top = bbox.top - document.documentElement.scrollTop
      const left = bbox.left - document.documentElement.scrollLeft
      const bottom = top + bbox.height
      const right = left + bbox.width
      const hit = element.contains(Pointer.$target.value) && Pointer.$clientX > left && Pointer.$clientX < right && Pointer.$clientY > top && Pointer.$clientY < bottom

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
