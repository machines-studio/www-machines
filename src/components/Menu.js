import Barba from '@barba/core'

export const selector = '.menu'

export function hydrate (element) {
  let nextFrame
  let py = document.documentElement.scrollTop

  const links = Array.from(element.querySelectorAll('a'))
  const logo = element.querySelector('h1 svg')

  // Leave mobile menu
  const toggle = document.querySelector('#toggle-menu')
  Barba.hooks.beforeLeave(() => { toggle.checked = false })
  for (const link of links) {
    link.addEventListener('click', e => { toggle.checked = false })
  }

  // Act on page change
  Barba.hooks.enter((data) => {
    // Animate logo once
    bounce({ once: true })

    // Update links state
    for (const { url, a } of links.map(a => ({ a, url: new URL(a.href) }))) {
      a.classList.remove('is-active')
      a.classList.toggle('is-active', url.href.startsWith(window.location.href) && data.next.url.path === url.pathname)
    }
  })

  document.addEventListener('scroll', handleScroll)

  return {
    destroy: () => {
      cancelAnimationFrame(nextFrame)
      document.removeEventListener('scroll', handleScroll)
    }
  }

  function handleScroll () {
    nextFrame = window.requestAnimationFrame(() => {
      const y = document.documentElement.scrollTop
      element.classList.toggle('is-on-top', y < element.clientHeight)
      // element.classList.toggle('is-sticky', py >= y) // ???
      py = y
    })
  }

  function bounce ({ once = true } = {}) {
    logo.classList.add('is-bouncing')
    if (once) bounceStop()
  }

  function bounceStop () {
    logo.parentNode.addEventListener('animationiteration', e => logo.classList.remove('is-bouncing'), { once: true })
    logo.exitBounce = true
  }
}
