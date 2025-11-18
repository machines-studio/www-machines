import IS_MOBILE from '/utils/is-mobile'

export const selector = '.projects'

export function hydrate (element) {
  if (IS_MOBILE) return

  const cards = Array.from(element.querySelectorAll('.card'))
  const search = element.querySelector('input[type="search"]')

  const tags = Array.from(element.querySelectorAll('[data-tag]'))
  const clearFilter = element.querySelector('#clear-filter')
  const toggleFilter = element.querySelector('#toggle-filter')

  // Focus search
  toggleFilter.addEventListener('click', e => {
    search.focus()
    handleSearch()
  })

  // Hide search on blur
  search.addEventListener('blur', e => {
    if (search.value) return
    toggleFilter.checked = false
  })

  // Bind tags click
  for (const tag of tags) {
    tag.addEventListener('click', e => {
      if (e.metaKey) return
      e.preventDefault()
      e.stopPropagation()

      tags.forEach(t => t !== tag && t.classList.remove('is-active'))
      tag.classList.toggle('is-active')

      if (tag.classList.contains('is-active')) filter(tag.dataset.tag)
      else clear()
    })
  }

  // Bind clear search
  clearFilter.addEventListener('click', clear)

  // Bind search input
  search.addEventListener('input', handleSearch)
  handleSearch()

  return {}

  function clear () {
    toggleFilter.checked = false
    search.value = ''

    for (const tag of tags) {
      tag.classList.remove('is-active')
    }

    handleSearch()
  }

  function handleSearch () {
    return filter(toggleFilter.checked
      ? search.value
      : tags.filter(tag => tag.classList.contains('is-active'))
        .map(tag => tag.dataset.tag)
    )
  }

  function sanitize (string, { uppercase = true } = {}) {
    string = string
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/’/g, "'")
      .trim()

    return uppercase ? string.toUpperCase() : string
  }

  function filter (needle = []) {
    needle = (Array.isArray(needle)
      ? needle
      : [
          ...needle.includes(',')
            ? needle.split(',')
            : [needle]
        ]
    ).filter(Boolean).map(sanitize)

    for (const card of cards) {
      const match = needle.find(n => sanitize(card.dataset.filter).includes(n))
      card.parentNode.classList.toggle('filtered-out', needle.length && !match)
    }
  }
}
