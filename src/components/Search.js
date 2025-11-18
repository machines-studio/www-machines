import Barba from '@barba/core'
import mediaReady from '/utils/media-ready'
import { clamp } from 'missing-math'

export const selector = '.search'

export function hydrate (element) {
  const input = element.querySelector('input[type="search"]')
  const results = Array.from(element.querySelectorAll('.search__result'))
  const toggle = document.getElementById('toggle-search')

  // Bind results
  for (const result of results) {
    result.addEventListener('mouseenter', e => focusElement(result))
  }

  Barba.hooks.beforeLeave(() => { toggle.checked = false })

  // Ensure thumbnails are correctly flag as loaded
  Promise.all(Array.from(element.querySelectorAll('[loading="lazy"]')).map(async el => {
    await mediaReady(el)
    el.classList.add('is-loaded')
  }))

  // Bind keyboard
  input.addEventListener('input', handleSearch)
  window.addEventListener('keydown', handleKey)

  return {
    destroy: () => {
      window.removeEventListener('keydown', handleKey)
    }
  }

  function handleKey (e) {
    if (e.key === 'k' && e.metaKey) {
      toggle.checked = true
      input.select()
      focusAbsolute(-1)
    }

    if (!toggle.checked) return
    if (e.key === 'Escape') toggle.checked = false

    if (e.key === 'Enter') {
      e.preventDefault()
      const link = element.querySelector('.search__result.is-active:not(.filtered-out) a')
      if (link) Barba.go(link.href, link)
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      focusRelative(+1)
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      focusRelative(-1)
    }
  }

  function focusElement (element) {
    results.forEach(result => result.classList.remove('is-active'))
    if (!element) return
    element.classList.add('is-active')
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  function focusAbsolute (index = 0, pool = null) {
    pool ??= results.filter(result => !result.classList.contains('filtered-out'))
    focusElement(pool[index])
  }

  function focusRelative (dir = +1, pool = null) {
    pool ??= results.filter(result => !result.classList.contains('filtered-out'))
    const index = pool.findIndex(result => result.classList.contains('is-active'))
    focusAbsolute(clamp(index + dir, 0, pool.length - 1), pool)
  }

  function handleSearch (e) {
    const needle = sanitize(input.value)

    for (const result of results) {
      const match = sanitize(result.dataset.filter).includes(needle)
      result.classList.toggle('filtered-out', !match)
    }

    focusAbsolute(0)
  }

  function sanitize (string, { uppercase = true } = {}) {
    string = string
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/’/g, "'")
      .trim()

    return uppercase ? string.toUpperCase() : string
  }
}
