import { $ } from '@tooooools/ui/state'

const Pointer = {
  $pageX: $(-1),
  $pageY: $(-1),
  $clientX: $(-1),
  $clientY: $(-1),
  $pressed: $(false),
  $target: $(undefined)
}

export default Pointer

document.documentElement.addEventListener('pointermove', e => {
  Pointer.$pageX.value = e.pageX
  Pointer.$pageY.value = e.pageY
  Pointer.$clientX.value = e.clientX
  Pointer.$clientY.value = e.clientY
  Pointer.$target.value = e.target
})

document.documentElement.addEventListener('pointerdown', e => {
  Pointer.$pressed.value = Date.now()
})

document.documentElement.addEventListener('pointerup', e => {
  window.setTimeout(() => {
    Pointer.$pressed.value = false
  })
})
