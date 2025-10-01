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
    return RECTANGLES.get(element)
  }

  const $offsetLeft = $(element.offsetLeft)
  const $offsetTop = $(element.offsetTop)
  const $offsetWidth = $(element.offsetWidth)
  const $offsetHeight = $(element.offsetHeight)
  const $clientLeft = $(element.clientLeft)
  const $clientTop = $(element.clientTop)
  const $clientWidth = $(element.clientWidth)
  const $clientHeight = $(element.clientHeight)
  const $boundingClientRect = $(element.getBoundingClientRect())

  const api = {
    $offsetLeft,
    $offsetTop,
    $offsetWidth,
    $offsetHeight,
    $clientLeft,
    $clientTop,
    $clientWidth,
    $clientHeight,
    $boundingClientRect,

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
    $offsetLeft.value = element.offsetLeft
    $offsetTop.value = element.offsetTop
    $offsetWidth.value = element.offsetWidth
    $offsetHeight.value = element.offsetHeight
    $clientLeft.value = element.clientLeft
    $clientTop.value = element.clientTop
    $clientWidth.value = element.clientWidth
    $clientHeight.value = element.clientHeight
    $boundingClientRect.value = element.getBoundingClientRect()
  }
}
