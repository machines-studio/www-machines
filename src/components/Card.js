import { raf } from '@internet/raf'
import { $ } from '@tooooools/ui/state'
import { clamp, lerp, lerpRadians } from 'missing-math'

import DebugCanvas from '/utils/DebugCanvas'
import Pointer from '/utils/Pointer'
import { getElementRectangle } from '/utils/less-layout-trashing'
import IS_MOBILE from '/utils/is-mobile'

let Z_INDEX = 1
const PRECISION = 3
const DEADZONE_FALLOFF = 5 // Lower moves more
const DRAG_THRESHOLD = 10 // px
const FRICTION_CORNERS = 0.01
const FRICTION_DEADZONE = 0.008
const MIN_VELOCITY = 0.01

export const selector = '.card'

const debug = (new URLSearchParams(window.location.search)).has('debug')
  ? new DebugCanvas(document.body)
  : undefined

export function hydrate (element) {
  if (IS_MOBILE) return

  const Rect = getElementRectangle(element.closest('.card-slot') ?? element)
  const Container = getElementRectangle(element.closest('.cards') ?? element.offsetParent)

  const Handle = {
    active: false,
    origin: undefined,
    position: undefined,
    distance: 0,
    theta: 0,
    velocity: [0, 0]
  }

  const Card = {
    origin: [Rect.$centerX.value, Rect.$centerY.value],
    position: [Rect.$centerX.value, Rect.$centerY.value],
    $deadzone: $([Rect.$width, Rect.$height], ([w, h]) => Math.max(w, h) / 2),
    theta: 0
  }

  // Bind events
  element.addEventListener('click', handleClick)
  element.addEventListener('pointerdown', handleDown)
  element.addEventListener('pointerup', handleUp)
  window.addEventListener('resize', handleResize)

  return {
    destroy: () => {
      raf.remove(tick)
      Rect.destroy()
      window.removeEventListener('resize', handleResize)
    }
  }

  function handleClick (e) {
    // Abort mouse click when card has been dragged or hold for too long
    const tooFar = distance(Handle.origin, Handle.position) > DRAG_THRESHOLD
    const tooLong = Pointer.$lastPressed.value - Date.now() > 1_000 // ms
    if (tooFar || tooLong) {
      e.stopPropagation()
      e.preventDefault()
    }
  }

  function handleDown (e) {
    if (e.button > 0) return
    e.preventDefault()

    Handle.active = true
    element.classList.add('is-dragged')
    element.style.zIndex = ++Z_INDEX // TODO improve to avoid too high z-index

    // Compute Handle initial state for this drag
    Handle.origin = [+Pointer.$pageX, +Pointer.$pageY]
    Handle.distance = distance(Card.position, Handle.origin)
    Handle.theta = Card.theta - Math.atan2(Card.position[1] - Handle.origin[1], Card.position[0] - Handle.origin[0])

    element.setPointerCapture(e.pointerId)
    raf.add(tick)
  }

  function handleUp (e) {
    Handle.active = false
    debug?.clear()
    element.classList.remove('is-dragged')
  }

  function tick (dt) {
    // Compute normalized distance to deadzone
    const tdead = Math.min(1, Handle.distance / Card.$deadzone) ** DEADZONE_FALLOFF
    const friction = lerp(FRICTION_DEADZONE, FRICTION_CORNERS, tdead)

    // Apply drag and compute velocity
    if (Handle.active) {
      Handle.position = [
        clamp(Pointer.$pageX, Container.$left, Container.$left + Container.$width),
        clamp(Pointer.$pageY, Container.$top, Container.$top + Container.$height)
      ]
      Handle.velocity = [
        Pointer.$pageX - (Pointer.$pageX.previous ?? Pointer.$pageX.value),
        Pointer.$pageY - (Pointer.$pageY.previous ?? Pointer.$pageY.value)
      ]
    } else if (Handle.position) {
      // Apply velocity to position
      Handle.position = [
        Handle.position[0] + Handle.velocity[0],
        Handle.position[1] + Handle.velocity[1]
      ]

      // Apply friction to velocity
      Handle.velocity = [
        Handle.velocity[0] * Math.exp(-friction * dt),
        Handle.velocity[1] * Math.exp(-friction * dt)
      ]

      // Stop when no more velocity
      if (Math.abs(Handle.velocity[0]) <= MIN_VELOCITY && Math.abs(Handle.velocity[1]) <= MIN_VELOCITY) {
        raf.remove(tick)
      }
    }

    // Compute card position
    Card.position = (() => {
      if (!Handle.position) return Card.position

      const theta = lerpRadians(
        // Static current angle
        Math.PI - Handle.theta + Card.theta,
        // Aligned on movement
        Math.atan2(Handle.position[1] - Card.position[1], Handle.position[0] - Card.position[0]),
        tdead
      )

      return [
        Handle.position[0] - (Math.cos(theta) * Handle.distance),
        Handle.position[1] - (Math.sin(theta) * Handle.distance)
      ]
    })()

    // Bounce on boundaries
    if (Card.position[0] < Container.$left || Card.position[0] > Container.$right) Handle.velocity[0] = -Handle.velocity[0]
    if (Card.position[1] < Container.$top || Card.position[1] > Container.$bottom) Handle.velocity[1] = -Handle.velocity[1]

    // Compute card rotation
    Card.theta = Handle.position
      ? Handle.theta + Math.atan2(Card.position[1] - Handle.position[1], Card.position[0] - Handle.position[0])
      : Card.theta

    // Apply card transformation
    element.style.setProperty('--card-angle', Card.theta + 'rad')
    element.style.setProperty('--card-x', (Card.position[0] - Card.origin[0]).toFixed(PRECISION) + 'px')
    element.style.setProperty('--card-y', (Card.position[1] - Card.origin[1]).toFixed(PRECISION) + 'px')

    // Render debug
    if (debug) {
      debug.resize()
      debug.clear()
      debug.rect(Container.$left, Container.$top, Container.$width, Container.$height, { fillStyle: 'rgba(255 0 0 / 5%)' })
      debug.point(...Card.position, Card.$deadzone, { fillStyle: 'rgba(255 0 0 / 30%)' })
      Handle.origin && debug.point(...Handle.origin)
      Handle.position && debug.point(...Handle.position)
      Handle.position && debug.line(...Handle.position, ...Card.position)
    }
  }

  function handleResize () {
    reset()
  }

  function reset () {
    Card.theta = 0
    Card.origin = [Rect.$centerX.value, Rect.$centerY.value]
    Card.position = Array.from(Card.origin)
    Handle.origin = undefined
    Handle.position = undefined
    tick()
  }

  function distance ([x1, y1], [x2, y2]) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
  }
}
