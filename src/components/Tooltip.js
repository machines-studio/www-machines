import { raf } from '@internet/raf'
import { clamp } from 'missing-math'
import Pointer from '/utils/Pointer'
import { Viewport, getElementRectangle } from '/utils/less-layout-trashing'
import IS_MOBILE from '/utils/is-mobile'

export const selector = '.tooltip'

const OFFSET_X = 0 // %
const OFFSET_Y = 0.5 // %

// Singleton
const tooltip = document.createElement('div')
tooltip.id = 'tooltip'
document.body.appendChild(tooltip)
const Rect = getElementRectangle(tooltip)

if (!IS_MOBILE) raf.add(tick)

function tick () {
  const x = clamp(Pointer.$clientX + OFFSET_X * Rect.$width, 0, Viewport.$innerWidth - Rect.$width)
  const y = clamp(Pointer.$clientY + OFFSET_Y * Rect.$height, 0, Viewport.$innerHeight - Rect.$height)
  document.body.style.setProperty('--tooltip-x', x.toFixed(2) + 'px')
  document.body.style.setProperty('--tooltip-y', y.toFixed(2) + 'px')
}

export function hydrate (element) {
  if (IS_MOBILE) return

  const container = element.offsetParent ?? element.parentNode
  const text = element.innerText

  // Remove to use only singleton
  element.remove()

  container.addEventListener('mouseenter', handleEnter)
  container.addEventListener('mouseleave', handleLeave)

  return {
    destroy: handleLeave
  }

  function handleEnter () {
    tooltip.innerText = text
    tooltip.classList.add('is-active')
    Rect.update()
  }

  function handleLeave () {
    tooltip.classList.remove('is-active')
  }
}
