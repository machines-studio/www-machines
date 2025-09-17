import EmblaCarousel from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'

export const selector = '.slideshow'

export function hydrate (element) {
  if (element.querySelectorAll('.slideshow__slide').length <= 1) return

  const dots = element.querySelectorAll('.slideshow__dot')
  const delay = +(element.dataset.delay ?? 4000)

  const embla = EmblaCarousel(element, {
    container: '.slideshow__container',
    loop: true
  }, [
    Autoplay({ delay })
  ])

  embla.on('pointerDown', e => element.classList.add('is-active'))
  embla.on('pointerUp', e => element.classList.remove('is-active'))
  embla.on('init', updateDots)
  embla.on('select', updateDots)

  // Set dot progress bar animation
  element.style.setProperty('--slideshow-delay', delay + 'ms')
  embla.on('autoplay:timerset', () => element.style.setProperty('--slideshow-delay', delay + 'ms'))
  embla.on('autoplay:timerstopped', () => element.style.setProperty('--slideshow-delay', Number.MAX_SAFE_INTEGER + 'ms'))

  for (let index = 0; index < dots.length; index++) {
    dots[index].addEventListener('click', e => {
      e.preventDefault()
      embla.scrollTo(index)
    })
  }

  return {
    destroy: () => embla.destroy()
  }

  function updateDots () {
    const current = embla.selectedScrollSnap()
    for (let index = 0; index < dots.length; index++) {
      dots[index].classList.toggle('is-active', index === current)
    }
  }
}
