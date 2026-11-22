import { Vector } from './vector.js'

await document.fonts.load("35px Outfit")

const canvas = document.getElementById("support")
const ctx = canvas.getContext("2d")
const w = canvas.width, h = canvas.height

const dpr = Math.max(window.devicePixelRatio || 1, 2)
canvas.style.width = `${w}px`
canvas.style.height = `${h}px`
canvas.width = w * dpr
canvas.height = h * dpr
ctx.scale(dpr, dpr)

class Plane {
    constructor() {
        this.pos = new Vector(w / 2, h / 2)
        this.vel = new Vector(0, 0)
        this.angle = Math.PI / 4
    }

    reset(x, y) {
        this.pos.x = x
        this.pos.y = y
        this.vel.x = (Math.random() - 0.5) * 2 * 8
        this.vel.y = (Math.random() - 0.5) * 2 * 10
    }

    update() {
        this.pos.add(this.vel)
        if (clickPos === 'up') {
            this.vel.y += Math.random() * 0.2
        } else if (clickPos === 'down') {
            this.vel.y -= Math.random() * 0.2
        }

        if (Math.hypot(this.vel.x, this.vel.y) > 0.01) {
            this.angle = Math.atan2(this.vel.y, this.vel.x) + Math.PI / 2
        }
    }

    draw(ctx) {
        if (clickPos != 'none') {
            ctx.strokeStyle = '#2d2d2d'
            const cx = this.pos.x, cy = this.pos.y
            const size = 35

            ctx.save()
            ctx.translate(cx, cy)
            ctx.rotate(this.angle)

            ctx.beginPath()
            ctx.moveTo(0, -size * 0.45)
            ctx.lineTo(-size * 0.35, size * 0.35)
            ctx.lineTo(size * 0.35, size * 0.35)
            ctx.closePath()
            ctx.fillStyle = '#efefef'
            ctx.fill()

            ctx.moveTo(0, -size * 0.45)
            ctx.lineTo(0, size * 0.45)
            ctx.lineTo(size * 0.1, size * 0.35)

            ctx.lineWidth = 1.5
            ctx.fill()
            ctx.stroke()
            ctx.restore()
        }
    }
}

let clickPos = 'none'
const planes = []
for (let i = 0; i < 24; i++) {
    planes.push(new Plane())
}

const draw = () => {
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#efefef'
    ctx.fillRect(0, 0, w, h)

    for (const plane of planes) {
        plane.draw(ctx)
        plane.update()
    }

    ctx.font = "35px Outfit, sans-serif"
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText("Support", w / 2, h / 2)
}

canvas.addEventListener('click', (e) => {
    const x = e.offsetX, y = e.offsetY

    clickPos = y > h / 2 ? 'down' : 'up'
    for (const plane of planes) {
        plane.reset(x, y)
    }
})

const tick = () => {
    draw()
    requestAnimationFrame(tick)
}
tick()
