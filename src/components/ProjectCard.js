import { $ } from '@tooooools/ui/state'
import { raf } from '@internet/raf'
import { lerp, lerpRadians, degrees, normalize, map } from 'missing-math'
import { createDraggable, utils } from 'animejs'

export const selector = '.project-card'

export function hydrate (element) {
  // TODO randomize initial position
  const canvas = element.querySelector('canvas')
  canvas.width = element.clientWidth
  canvas.height = element.clientHeight
  const ctx = canvas.getContext('2d')

  const center = [0, 0] // TODO single source of truth
  // ctx.fillRect(canvas.width / 2 - 5, canvas.height / 2 - 5, 10, 10)

  const draggable = createDraggable(element, {
    x: true,
    y: true,
    // trigger: logo.querySelector('path'),
    scrollThreshold: Number.POSITIVE_INFINITY,
    container: document.querySelector('main'),
    containerPadding: 20,
    containerFriction: 1,
    releaseEase: 'outExpo',
    onDrag: () => element.classList.add('is-active'),
    onUpdate: draggable => {
      const x = lerp(draggable.containerBounds[3], draggable.containerBounds[1], draggable.progressX)
      const y = lerp(draggable.containerBounds[0], draggable.containerBounds[2], draggable.progressY)
      const width = element.clientWidth
      const height = element.clientHeight
      const handleX = draggable.pointer[0]
      const handleY = draggable.pointer[1]

      log('x', x, draggable.x, draggable.angle)
      dot(width / 2, height / 2)
      dot(x - handleX, y - handleY)

      // const theta = Math.atan2(draggable.y - handleY, draggable.x - handleX)
      // // const width = draggable.containerBounds[1] - draggable.containerBounds[3]
      // utils.set(element, {
      //   rotate: degrees(draggable.angle),
      //   // 'transform-origin': [
      //   //   normalize(handleX, 0, draggable.width),
      //   //   normalize(handleY, 0, draggable.height)
      //   // ].map(v => v * 100 + '%').join(' ')
      // })
    },
    onSettle: () => {
      element.classList.remove('is-active')
      clear()
    }
  })

  function log (...args) {
    element.dataset.log = args
      .map(arg => typeof arg === 'number' ? arg.toFixed(2) : arg)
      .join(' ')
  }

  function clear () {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  function dot (x, y, r = 5) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.fill()
  }

  // const $grabbed = $(false)
  // const $mouseX = $(0)
  // const $mouseY = $(0)
  // const $handle = $(undefined)
  // const $length = $(0)
  // const $theta = $(0)
  // const $thetaOffset = $(0)

  // const $target = $([$handle, $length], (
  //   [curr, length],
  //   prev = [0, 0]
  // ) => {
  //   if (!curr) return prev

  //   const dx = curr[0] - prev[0]
  //   const dy = curr[1] - prev[1]
  //   const theta = Math.atan2(dy, dx)

  //   return [
  //     curr[0] - (Math.cos(theta) * length),
  //     curr[1] - (Math.sin(theta) * length)
  //   ]
  // })

  // const $transformation = $([$target, $theta], ([point, theta]) => ([
  //   `translate(${point[0].toFixed(2)}px, ${point[1].toFixed(2)}px)`,
  //   `rotate(${theta}rad)`
  // ]))

  // element.addEventListener('pointerdown', handleDown)
  // element.addEventListener('pointerup', handleUp)
  // document.documentElement.addEventListener('pointermove', handleMove)
  // element.addEventListener('click', handleClick)

  // return {
  //   destroy: () => {
  //     raf.remove(tick)
  //   }
  // }

  // function handleClick (e) {
  //   // TODO do not prevent on label
  //   e.preventDefault()
  //   e.stopPropagation()
  // }

  // function handleDown (e) {
  //   e.preventDefault()

  //   $grabbed.value = true
  //   $handle.value = [$mouseX.value, $mouseY.value]
  //   $length.value = distance($handle.value, $target.value)
  //   $thetaOffset.value = $theta - Math.atan2($target.value[1] - $handle.value[1], $target.value[0] - $handle.value[0])

  //   element.setPointerCapture(e.pointerId)
  //   raf.add(tick)
  // }

  // function handleMove (e) {
  //   $mouseX.value = e.clientX - document.documentElement.scrollTop
  //   $mouseY.value = e.clientY - document.documentElement.scrollLeft
  // }

  // function handleUp (e) {
  //   $grabbed.value = false
  //   raf.remove(tick)
  // }

  // function tick (dt) {
  //   if ($grabbed.value) {
  //     $handle.value = [$mouseX.value, $mouseY.value]

  //     // Rotate around center, based on distance from center
  //     const maxlen = Math.sqrt(element.clientWidth ** 2 + element.clientHeight ** 2) / 2
  //     const t = normalize($length, 0, maxlen, true)
  //     $theta.value = $thetaOffset + lerpRadians(
  //       $theta.value - $thetaOffset,
  //       Math.atan2($target.value[1] - $handle.value[1], $target.value[0] - $handle.value[0]),
  //       t ** 3
  //     )
  //   }

  //   console.log($transformation.value.join(' '))
  //   element.style.transform = $transformation.value.join(' ')
  // }

  // function distance ([x1, y1], [x2, y2]) {
  //   return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
  // }
}
