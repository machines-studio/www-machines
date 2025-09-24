import { bootstrap } from '/core/Barba'

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
      // Reset scroll position
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  })
})()
