import EmblaCarousel from 'embla-carousel'
import raf from '@internet/raf'

export const selector = '.slideshow'

export function hydrate (element) {
  if (element.querySelectorAll('.slideshow__slide').length <= 1) return

  let currentVideo

  const dots = element.querySelectorAll('.slideshow__dot')
  const slides = element.querySelectorAll('.slideshow__slide')

  const embla = EmblaCarousel(element, {
    container: '.slideshow__container',
    loop: true
  })

  const autoplay = (() => {
    let isRunning
    let isPaused = false
    let ellapsed = 0
    const delay = +(element.dataset.delay ?? 1000)

    return {
      get isRunning () { return isRunning },
      get isPaused () { return isPaused },

      pause: () => { isPaused = true },

      start: () => {
        isPaused = false
        isRunning = true
        raf.add(tick)
      },

      stop: () => {
        isRunning = false
        raf.remove(tick)
      }
    }

    function tick (dt) {
      if (!isRunning) return
      if (isPaused) return

      ellapsed += dt
      element.style.setProperty('--slideshow-dot-progress', (ellapsed / delay).toFixed(3))
      if (ellapsed <= delay) return

      embla.scrollNext()
      ellapsed = 0
    }
  })()

  // Bind events
  embla.on('init', handleSlideChange)
  embla.on('select', handleSlideChange)
  embla.on('pointerDown', e => element.classList.add('is-active'))
  embla.on('pointerUp', e => {
    element.classList.remove('is-active')
    autoplay.stop()
  })

  // Handle dots
  for (let index = 0; index < dots.length; index++) {
    dots[index].addEventListener('click', e => {
      e.preventDefault()
      embla.scrollTo(index)
    })
  }

  autoplay.start()

  return {
    destroy: () => {
      embla.destroy()
      autoplay.stop()
      raf.remove(handleVideoTick)
    }
  }

  function handleSlideChange () {
    const index = embla.selectedScrollSnap()
    const slide = slides[index]

    // Cleanup
    raf.remove(handleVideoTick)
    element.style.setProperty('--slideshow-dot-progress', 0)
    currentVideo?.removeEventListener('ended', handleVideoEnd)
    currentVideo?.pause()
    currentVideo = null

    // Handle current video if any
    currentVideo = slide.querySelector('video')
    if (currentVideo) {
      raf.add(handleVideoTick)
      currentVideo.play()
      currentVideo.removeAttribute('loop') // Loop is done in handleVideoEnd
      currentVideo.addEventListener('ended', handleVideoEnd)
    }

    // Handle autoplay
    if (autoplay.isRunning) {
      if (currentVideo) {
        currentVideo.currentTime = 0
        autoplay.pause()
      } else {
        autoplay.start()
      }
    }

    // Handle dots
    for (let i = 0; i < dots.length; i++) {
      dots[i].classList.toggle('is-active', i === index)
    }
  }

  function handleVideoTick (e) {
    if (!currentVideo) return
    element.style.setProperty('--slideshow-dot-progress', (currentVideo.currentTime / currentVideo.duration).toFixed(3))
  }

  function handleVideoEnd (e) {
    if (autoplay.isRunning) embla.scrollNext()
    else e.target.play() // Loop back
  }
}
