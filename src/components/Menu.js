import Barba from '@barba/core'
export const selector = '.menu'

export function hydrate (element) {
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

  // Sticky menu when scrolling up
  let py = document.documentElement.scrollTop
  document.addEventListener('scroll', e => {
    const y = document.documentElement.scrollTop
    const dy = py - y
    element.classList.toggle('is-sticky', dy > 0)
    py = y
  })

  function bounce ({ once = true } = {}) {
    // TODO disable animation for prefers-reduce-motion
    logo.classList.add('is-bouncing')
    if (once) bounceStop()
  }

  function bounceStop () {
    logo.parentNode.addEventListener('animationiteration', e => logo.classList.remove('is-bouncing'), { once: true })
    logo.exitBounce = true
  }
}
