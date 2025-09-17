import distSq from '/utils/distance-squared'
import { map } from 'missing-math'

export const selector = '.clients'

export function hydrate (element) {
  const clients = Array.from(element.querySelectorAll('.clients__client'))
  document.documentElement.addEventListener('mousemove', handleMouseMove)

  let px
  let py

  return {
    destroy: () => {
      document.documentElement.removeEventListener('mousemove', handleMouseMove)
    }
  }

  function handleMouseMove (e) {
    px ??= e.pageX
    py ??= e.pageY

    window.requestAnimationFrame(() => {
      // Compute sticky factor based on mouse speed
      const factor = map(distSq([px, py], [e.pageX, e.pageY]), 0, 50 ** 2, 0.2, 1, true)

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
          const dx = (e.clientX - client.initialHit.x) * factor
          const dy = (e.clientY - client.initialHit.y) * factor
          client.style.setProperty('--stick-x', Math.floor(dx) + 'px')
          client.style.setProperty('--stick-y', Math.floor(dy) + 'px')
        } else {
          // Delete hit origin
          delete client.initialHit

          // Reset position
          client.style.setProperty('--stick-x', 0)
          client.style.setProperty('--stick-y', 0)
        }
      }

      px = e.pageX
      py = e.pageY
    })
  }
}
