import { bootstrap } from '/core/Barba'
import lozad from 'lozad'

;(async () => {
  bootstrap({
    views: [
      await import('/views/default')
    ],

    components: {
      // Outside barba wrapper
      global: [
        await import('/components/Menu'),
        await import('/components/HueShifter')
      ],

      // Inside barba wrapper
      local: [
        await import('/components/Clients'),
        await import('/components/HueShifter'),
        await import('/components/Projects'),
        await import('/components/Slideshow')
      ]
    },

    afterEnter: next => {
      // Lazyload
      const lazys = next.container.querySelectorAll('[data-lazyload]')
      lozad(lazys).observe()
      // Lozad set a [data-loaded] attribute when loading image, but does not detect
      // when image is fully loaded, which can cause incoherent animations
      for (const image of lazys) image.onload = () => image.setAttribute('data-decoded', true)

      // Reset scroll position
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  })
})()
