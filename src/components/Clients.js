import distSq from '/utils/distance-squared'
import { map } from 'missing-math'

export const selector = '.clients'

const STICKY_DISTANCE = 100 // px
const STICKY_FACTOR = 0.5 // %

export function hydrate (element) {
  const clients = Array.from(element.querySelectorAll('.clients__client'))

  document.documentElement.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('resize', handleResize)

  let px, py, nextFrame

  return {
    destroy: () => {
      window.cancelAnimationFrame(nextFrame)
      window.removeEventListener('resize', handleResize)
      document.documentElement.removeEventListener('mousemove', handleMouseMove)
    }
  }

  function handleResize () {
    // Store normal DOM position, so that we can disrupt it later
    for (const client of clients) {
      client.initialBoundingBox = getDocumentBbox(client)
    }
  }

  function handleMouseMove (e) {
    nextFrame = window.requestAnimationFrame(() => {
      px ??= e.pageX
      py ??= e.pageY

      // Compute sticky factor based on mouse speed
      const factor = map(distSq([px, py], [e.pageX, e.pageY]), 0, STICKY_DISTANCE ** 2, STICKY_FACTOR, 1, true)

      for (const client of clients) {
        client.initialBoundingBox ??= getDocumentBbox(client)

        // Adjust initial bounding box to current document scroll
        const top = client.initialBoundingBox.top - document.documentElement.scrollTop
        const left = client.initialBoundingBox.left - document.documentElement.scrollLeft
        const bottom = top + client.initialBoundingBox.height
        const right = left + client.initialBoundingBox.width
        const hit = element.contains(e.target) && e.clientX > left && e.clientX < right && e.clientY > top && e.clientY < bottom

        client.classList.toggle('is-sticked', hit)

        if (hit) {
          // Define origin of the hit
          client.initialHit ??= {
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

  /**
   * Compute a bounding-box relative to the whole document
   * @param {Element} element
   * @return {<{ top, left, width, height }>}
   */
  function getDocumentBbox (element) {
    const { top, left, width, height } = element.getBoundingClientRect()
    return {
      top: top + document.documentElement.scrollTop,
      left: left + document.documentElement.scrollLeft,
      width,
      height
    }
  }
}
