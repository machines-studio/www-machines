/**
 * This file provides singletons and helpers function to wrap in Signal
 * properties causing layout trashing, improving performances
 */

import Barba from '@barba/core'
import { $ } from '@tooooools/ui/state'

export const Viewport = {
  $innerWidth: $(window.innerWidth),
  $innerHeight: $(window.innerHeight),
  $scrollLeft: $(document.documentElement.scrollLeft),
  $scrollTop: $(document.documentElement.scrollTop),
  $scrollHeight: $(document.documentElement.scrollHeight),
}

window.Viewport = Viewport

window.addEventListener('resize', e => {
  Viewport.$innerWidth.value = window.innerWidth
  Viewport.$innerHeight.value = window.innerHeight
  Viewport.$scrollLeft.value = document.documentElement.scrollLeft
  Viewport.$scrollTop.value = document.documentElement.scrollTop
  Viewport.$scrollHeight = document.documentElement.scrollHeight
})

document.addEventListener('scroll', e => {
  Viewport.$scrollLeft.value = document.documentElement.scrollLeft
  Viewport.$scrollTop.value = document.documentElement.scrollTop
})

Barba.hooks.after(() => {
  Viewport.$scrollHeight.value = document.documentElement.scrollHeight
})

/**
 * Return various element properties which caused reflow/repaint, in the form of
 * signals updated only on viewport resize
 * @param {Element} element
 * @return {Object}
 */
const RECTANGLES = new Map()
export function getElementRectangle (element) {
  if (RECTANGLES.has(element)) {
    const rectangle = RECTANGLES.get(element)
    rectangle.update()
    return rectangle
  }

  const main = element.closest('main') ?? document.documentElement
  const $boundingClientRect = $(element.getBoundingClientRect())

  const api = {
    // Relative to the viewport top-left corner
    $boundingClientRect,

    // Relative to the document top-left corner
    $top: $($boundingClientRect, rect => rect.top + window.scrollY - main.offsetTop),
    $right: $($boundingClientRect, rect => rect.left + rect.width + window.scrollX - main.offsetLeft),
    $bottom: $($boundingClientRect, rect => rect.top + rect.height + window.scrollY - main.offsetTop),
    $left: $($boundingClientRect, rect => rect.left + window.scrollX - main.offsetLeft),
    $width: $($boundingClientRect, rect => rect.width),
    $height: $($boundingClientRect, rect => rect.height),
    $centerX: $($boundingClientRect, rect => rect.left + window.scrollX - main.offsetLeft + rect.width / 2),
    $centerY: $($boundingClientRect, rect => rect.top + window.scrollY - main.offsetTop + rect.height / 2),

    update,
    destroy: () => {
      RECTANGLES.delete(update)
      window.removeEventListener('resize', update)
    }
  }

  window.addEventListener('resize', update)
  RECTANGLES.set(element, api)

  return api

  function update () {
    $boundingClientRect.value = element.getBoundingClientRect()
  }
}
