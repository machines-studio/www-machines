import Barba from '@barba/core'
import { Viewport, getElementRectangle } from '/utils/less-layout-trashing'

export const selector = '.menu'

export function hydrate (element) {
  let nextFrame

  const Rect = getElementRectangle(element)
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

  Viewport.$scrollTop.subscribe(handleScroll)
  handleScroll()
  bounce()

  return {
    destroy: () => {
      Rect.destroy()
      cancelAnimationFrame(nextFrame)
      Viewport.$scrollTop.unsubscribe(handleScroll)
    }
  }

  function handleScroll () {
    nextFrame = requestAnimationFrame(() => {
      const y = Viewport.$scrollTop
      element.classList.toggle('is-on-top', y < Rect.$height)
      element.classList.toggle('is-sticky', (y.previous ?? y) >= y && y < Viewport.$scrollHeight - Viewport.$innerHeight)
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
