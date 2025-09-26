export default class DebugCanvas {
  container
  canvas
  context

  constructor (container) {
    this.container = container

    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')
    this.canvas.style.position = 'absolute'
    this.canvas.style.inset = 0
    this.canvas.style.pointerEvents = 'none'

    this.resize()
    this.container.appendChild(this.canvas)
  }

  resize () {
    this.canvas.width = this.container.clientWidth
    this.canvas.height = this.container.clientHeight
  }

  pushStyle (props = {}) {
    this.context.save()
    for (const key in props) {
      this.context[key] = props[key]
    }
  }

  popStyle () {
    this.context.restore()
  }

  clear (color = null) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    if (color) this.rect(0, 0, this.canvas.width, this.canvas.height, { fillStyle: color })
  }

  point (x, y, r = 5, style) {
    this.pushStyle(style)
    this.context.beginPath()
    this.context.arc(x, y, r, 0, 2 * Math.PI)
    this.context.fill()
    this.popStyle()
  }

  line (x1, y1, x2, y2, style) {
    this.pushStyle(style)
    this.context.beginPath()
    this.context.moveTo(x1, y1)
    this.context.lineTo(x2, y2)
    this.context.stroke()
    this.popStyle()
  }

  rect (x, y, width, height, style = {}) {
    this.pushStyle(style)
    this.context[Object.keys(style).includes('fillStyle') ? 'fillRect' : 'strokeRect'](x, y, width, height)
    this.popStyle()
  }
}
