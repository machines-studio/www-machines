import { $ } from '@tooooools/ui/state'

const Pointer = {
  $pageX: $(-1),
  $pageY: $(-1),
  $clientX: $(-1),
  $clientY: $(-1),
  $pressed: $(false),
  $lastPressed: $(undefined),
  $target: $(undefined)
}

export default Pointer

function move (e) {
  Pointer.$pageX.value = e.pageX
  Pointer.$pageY.value = e.pageY
  Pointer.$clientX.value = e.clientX
  Pointer.$clientY.value = e.clientY
  Pointer.$target.value = e.target
}

document.documentElement.addEventListener('pointermove', move, { passive: true })
document.documentElement.addEventListener('pointerdown', e => {
  move(e)
  Pointer.$pressed.value = true
  Pointer.$lastPressed.value = Date.now()
})

document.documentElement.addEventListener('pointerup', e => {
  Pointer.$pressed.value = false
})

document.documentElement.addEventListener('pointercancel', () => {
  Pointer.$pressed.value = false
})
