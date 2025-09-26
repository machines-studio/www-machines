import { raf } from '@internet/raf'
import DebugCanvas from '/utils/DebugCanvas'
import { clamp, lerp, lerpRadians } from 'missing-math'

let Z_INDEX = 1
const PRECISION = 3
const DEADZONE_FALLOFF = 3 // Lower moves more
const DRAG_THRESHOLD = 10 // px
const FRICTION_CORNERS = 0.01
const FRICTION_DEADZONE = 0.005
const MIN_VELOCITY = 0.01

export const selector = '.project-card'

const debug = (new URLSearchParams(window.location.search)).has('debug')
  ? new DebugCanvas(document.body)
  : undefined

// TODO offsetTop/left wrong at hydration when coming from barba
export function hydrate (element) {
  const container = element.offsetParent

  const Mouse = {
    x: 0,
    y: 0,
    px: 0,
    py: 0,
    velocity: [0, 0],
    pressed: false
  }

  const Handle = {
    origin: undefined,
    position: undefined,
    distance: 0,
    theta: 0
  }

  const Card = (() => {
    const origin = (() => {
      const main = element.closest('main') // Offset to handle dual <main> because of Barba
      const { top, left } = element.getBoundingClientRect()
      const x = left - main.offsetLeft
      const y = top - main.offsetTop
      const width = element.clientWidth
      const height = element.clientHeight

      return [x + width / 2, y + height / 2]
    })()

    return {
      origin,
      position: [...origin],
      deadzone: Math.min(element.clientWidth, element.clientHeight) / 2,
      theta: 0
    }
  })()

  // Bind events
  element.addEventListener('click', handleClick)
  element.addEventListener('pointerdown', handleDown)
  document.documentElement.addEventListener('pointermove', handleMove)
  element.addEventListener('pointerup', handleUp)
  window.addEventListener('resize', handleResize)

  return {
    destroy: () => {
      raf.remove(tick)
    }
  }

  function handleClick (e) {
    // Abort mouse click when card has been dragged
    if (distance(Handle.origin, Handle.position) > DRAG_THRESHOLD) {
      e.stopPropagation()
      e.preventDefault()
    }
  }

  function handleDown (e) {
    e.preventDefault()

    Mouse.pressed = Date.now()
    element.classList.add('is-dragged')
    element.style.zIndex = ++Z_INDEX // TODO improve to avoid too high z-index

    // Compute Handle initial state for this drag
    Handle.origin = [Mouse.x, Mouse.y]
    Handle.distance = distance(Card.position, Handle.origin)
    Handle.theta = Card.theta - Math.atan2(Card.position[1] - Handle.origin[1], Card.position[0] - Handle.origin[0])

    element.setPointerCapture(e.pointerId)
    raf.add(tick)
  }

  function handleMove (e) {
    Mouse.px = Mouse.x
    Mouse.py = Mouse.y
    Mouse.x = e.clientX + document.documentElement.scrollLeft
    Mouse.y = e.clientY + document.documentElement.scrollTop
  }

  function handleUp (e) {
    debug?.clear()
    element.classList.remove('is-dragged')
    window.setTimeout(() => { Mouse.pressed = null }, 0)
  }

  function tick (dt) {
    // Compute normalized distance to deadzone
    const tdead = Math.min(1, Handle.distance / Card.deadzone) ** DEADZONE_FALLOFF
    const friction = lerp(FRICTION_DEADZONE, FRICTION_CORNERS, tdead)

    // Apply drag and compute velocity
    if (Mouse.pressed) {
      Handle.position = [
        clamp(Mouse.x, container.offsetLeft, container.offsetLeft + container.clientWidth),
        clamp(Mouse.y, container.offsetTop, container.offsetTop + container.clientHeight)
      ]
      Mouse.velocity = [
        Mouse.x - (Mouse.px ?? Mouse.x),
        Mouse.y - (Mouse.py ?? Mouse.y)
      ]
    } else {
      // Apply velocity to position
      Handle.position = [
        Handle.position[0] + Mouse.velocity[0],
        Handle.position[1] + Mouse.velocity[1]
      ]

      // Apply friction to velocity
      Mouse.velocity = [
        Mouse.velocity[0] * Math.exp(-friction * dt),
        Mouse.velocity[1] * Math.exp(-friction * dt)
      ]

      // Stop when no more velocity
      if (Math.abs(Mouse.velocity[0]) <= MIN_VELOCITY && Math.abs(Mouse.velocity[1]) <= MIN_VELOCITY) {
        raf.remove(tick)
      }
    }

    // Compute card position
    Card.position = (() => {
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
    if (Card.position[0] < container.offsetLeft || Card.position[0] > container.offsetLeft + container.clientWidth) Mouse.velocity[0] = -Mouse.velocity[0]
    if (Card.position[1] < container.offsetTop || Card.position[1] > container.offsetTop + container.clientHeight) Mouse.velocity[1] = -Mouse.velocity[1]

    // Compute card rotation
    Card.theta = Handle.theta + Math.atan2(Card.position[1] - Handle.position[1], Card.position[0] - Handle.position[0])

    // Apply card transformation
    element.style.transform = ([
      `translate(${[
        Card.position[0] - Card.origin[0],
        Card.position[1] - Card.origin[1]
      ].map(v => v.toFixed(PRECISION) + 'px')})`,
      `rotate(${Card.theta}rad)`
    ].join(' '))

    // Render debug
    if (debug) {
      debug.resize()
      debug.clear()
      debug.rect(container.offsetLeft, container.offsetTop, container.clientWidth, container.clientHeight, { fillStyle: 'rgba(255 0 0 / 5%)' })
      debug.point(...Card.position, Card.deadzone, { fillStyle: 'rgba(255 0 0 / 30%)' })
      debug.point(...Handle.position)
      debug.point(...Handle.origin)
      debug.line(...Handle.position, ...Card.position)
    }
  }

  function handleResize () {
    Card.deadzone = Math.min(element.clientWidth, element.clientHeight) / 2
  }

  function distance ([x1, y1], [x2, y2]) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
  }
}
