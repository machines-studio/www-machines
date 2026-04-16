import { Viewport } from '/utils/less-layout-trashing'
import mediaReady from '/utils/media-ready'
import IS_MOBILE from '/utils/is-mobile'

export const selector = '.lightbox'

const FIGURE_SELECTOR = '.gallery figure'
const PLACEHOLDER_TIMING = { duration: 300, easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)' }

export function hydrate (element) {
  if (IS_MOBILE) return

  let current

  const reducedMotion = window.matchMedia('(prefers-reduced-motion)').matches

  const placeholder = element.querySelector('.lightbox__placeholder')
  const slides = Array.from(
    document.querySelectorAll(FIGURE_SELECTOR)
  ).map((figure, index) => {
    // Bind
    figure.classList.add('has-lightbox')
    figure.addEventListener('click', async e => {
      e.preventDefault()
      figure.classList.add('has-lightbox-loading')
      await open(index)
      figure.classList.remove('has-lightbox-loading')
    })

    const element = figure.querySelector('img, video')
    return element && { element }
  }).filter(Boolean)

  element.addEventListener('click', handleClick)
  window.addEventListener('keydown', handleKey)

  return {
    destroy: () => {
      window.removeEventListener('keydown', handleKey)
    }
  }

  async function open (index = 0) {
    cleanup(slides[current])
    placeholder.classList.remove('is-ready')

    current = index
    const slide = slides[current]
    if (!slide) return

    // Create a filler to replace slide media
    slide.filler = document.createElement('div')
    slide.filler.classList.add('filler')
    slide.filler.style.aspectRatio = slide.element.width / slide.element.height
    slide.element.replaceWith(slide.filler)

    // Insert slide media into the lightbox
    placeholder.append(slide.element)

    // Transition to fullscreen
    if (!reducedMotion && !element.classList.contains('is-open')) {
      // Avoid flash
      await mediaReady(slide.element)
      placeholder.classList.add('is-ready')

      // Compute transformation
      const from = slide.filler.getBoundingClientRect()
      const to = contain(from, { width: Viewport.$innerWidth, height: Viewport.$innerHeight }, {
        padding: parseInt(window.getComputedStyle(placeholder).paddingInline)
      })
      const scale = from.width / to.width

      // Prepare CSS border-radius animation
      placeholder.style.setProperty('--scale', scale)
      void placeholder.offsetWidth // eslint-disable-line no-void
      placeholder.classList.add('is-animating')

      // Animate transition
      placeholder.animate([
        {
          transform: [
            `translateX(${from.left - to.left * scale}px)`,
            `translateY(${from.top - to.top * scale}px)`,
            `scale(${scale})`
          ].join(' ')
        },
        {
          transform: 'none'
        }
      ], PLACEHOLDER_TIMING)
    }

    element.classList.add('is-open')
  }

  function cleanup (slide) {
    slide?.filler.replaceWith(slide.element)
  }

  function close () {
    cleanup(slides[current])

    element.classList.remove('is-open')
    placeholder.classList.remove('is-ready')
    placeholder.classList.remove('is-animating')
  }

  function handleClick (e) {
    if (e.target.matches('video[controls]')) return
    close()
  }

  function handleKey (e) {
    if (!element.classList.contains('is-open')) return

    if (e.key === 'Escape') close()
    if (e.key === 'ArrowRight') open((current + 1) % slides.length)
    if (e.key === 'ArrowLeft') open((current + slides.length - 1) % slides.length)
  }
}

function contain (source, target, {
  padding = 0
} = {}) {
  const containerWidth = target.width - padding * 2
  const containerHeight = target.height - padding * 2
  const ratio = source.width / source.height
  const targetRatio = containerWidth / containerHeight

  let width, height

  if (ratio > targetRatio) {
    width = containerWidth
    height = containerWidth / ratio
  } else {
    height = containerHeight
    width = containerHeight * ratio
  }

  return {
    top: (target.height - height) / 2,
    left: (target.width - width) / 2,
    width,
    height
  }
}
