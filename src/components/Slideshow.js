import EmblaCarousel from 'embla-carousel'
import raf from '@internet/raf'
import { normalize } from 'missing-math'

export const selector = '.slideshow'

export function hydrate (element) {
  if (element.querySelectorAll('.slideshow__slide').length <= 1 && !element.querySelectorAll('.slideshow__slide[data-type="video"]').length) return
  element.classList.add('is-ready')

  let currentSlide, currentVideo, currentDot

  const [prev, next] = element.querySelectorAll('.slideshow__button')
  const dots = element.querySelectorAll('.slideshow__dot')
  const slides = element.querySelectorAll('.slideshow__slide')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion)').matches

  const embla = EmblaCarousel(element.querySelector('.slideshow__viewport'), {
    container: '.slideshow__container',
    loop: true,
    duration: reducedMotion ? 0 : 25
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
      currentDot?.style.setProperty('--slideshow-dot-progress', (ellapsed / delay).toFixed(3))
      if (ellapsed <= delay) return

      scrollTo(+1)
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

  prev?.addEventListener('click', e => scrollTo(-1, { cancelAutoplay: true }))
  next?.addEventListener('click', e => scrollTo(+1, { cancelAutoplay: true }))

  // Handle dots
  for (let index = 0; index < dots.length; index++) {
    dots[index].addEventListener('click', e => {
      autoplay.stop()
      e.preventDefault()

      // Scroll to target
      if (e.target !== currentDot) return embla.scrollTo(index)

      // Act as a progress bar if current slide is video
      if (e.target.dataset.type !== 'video' || !currentVideo) return
      const { left, width } = e.target.getBoundingClientRect()
      const progress = normalize(e.clientX, left, left + width, true)
      currentVideo.currentTime = progress * currentVideo.duration
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

  function scrollTo (dir, { cancelAutoplay = false } = {}) {
    if (cancelAutoplay) autoplay.stop()

    const index = embla.selectedScrollSnap()
    const next = dir < 0
      ? (index + dots.length + dir) % dots.length
      : (index + dir) % dots.length

    if (next !== index) embla.scrollTo(next)
    else handleSlideChange()
  }

  function handleSlideChange () {
    // Cleanup
    raf.remove(handleVideoTick)
    currentDot?.style.setProperty('--slideshow-dot-progress', 0)
    currentVideo?.removeEventListener('ended', handleVideoEnd)
    currentVideo?.pause()
    currentVideo = null

    // Update current state
    const index = embla.selectedScrollSnap()
    currentSlide = slides[index]
    currentDot = dots[index]
    currentDot.style.setProperty('--slideshow-dot-progress', 0)

    // Handle current video if any
    currentVideo = currentSlide.querySelector('video')
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
    if (!currentVideo?.duration) return
    currentDot?.style.setProperty('--slideshow-dot-progress', (currentVideo.currentTime / currentVideo.duration).toFixed(3))
  }

  function handleVideoEnd (e) {
    if (autoplay.isRunning) scrollTo(+1)
    else e.target.play() // Loop back
  }
}
