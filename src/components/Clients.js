import distSq from '/utils/distance-squared'
import { map } from 'missing-math'

export const selector = '.clients'

const STICKY_DISTANCE = 100 // px
const STICKY_FACTOR = 0.5 // %

export function hydrate (element) {
  const clients = Array.from(element.querySelectorAll('.clients__client'))
  document.documentElement.addEventListener('mousemove', handleMouseMove)

  let px, py, nextFrame

  return {
    destroy: () => {
      window.cancelAnimationFrame(nextFrame)
      document.documentElement.removeEventListener('mousemove', handleMouseMove)
    }
  }

  function handleMouseMove (e) {
    nextFrame = window.requestAnimationFrame(() => {
      px ??= e.pageX
      py ??= e.pageY

      // Compute sticky factor based on mouse speed
      const factor = map(distSq([px, py], [e.pageX, e.pageY]), 0, STICKY_DISTANCE ** 2, STICKY_FACTOR, 1, true)

      for (const client of clients) {
        const rect = client.initialHit?.rect ?? client.getBoundingClientRect()

        const hit = e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom
        client.classList.toggle('is-sticked', hit)

        if (hit) {
          // Define origin of the hit
          client.initialHit ??= {
            rect,
            x: e.clientX,
            y: e.clientY
          }

          // Update position
          client.dx = (e.clientX - client.initialHit.x) * factor
          client.dy = (e.clientY - client.initialHit.y) * factor
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

      px = e.pageX
      py = e.pageY
    })
  }
}
