const canvas = document.getElementById('gap1')
const ctx = canvas.getContext('2d')
const w = canvas.width, h = canvas.height

const dpr = Math.max(window.devicePixelRatio || 1, 2)
canvas.style.width = `${w}px`
canvas.style.height = `${h}px`
canvas.width = w * dpr
canvas.height = h * dpr
ctx.scale(dpr, dpr)

// ---- Slinky settings ----
const slinky = {
    steps: 4,               // flips across the canvas
    startX: w * 0.3,
    endX: w * 0.6,
    ground: h * 0.7,
    rings: 8,
    radius: 22,
    depth: 0.2,
    gap: 5,
    lag: 0.6,
    samplesPerRing: 24,
}

const STEP_LEN = (slinky.endX - slinky.startX) / slinky.steps
const ARCH_H = Math.min(STEP_LEN * 0.6, h * 0.55)

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const easeInOut = (t) => t * t * (3 - 2 * t)

let target = 0, progress = 0

const updateTarget = () => {
    const r = canvas.getBoundingClientRect()
    const vh = window.innerHeight
    target = clamp01((vh - r.top) / (vh + r.height)) * slinky.steps
}

window.addEventListener('scroll', updateTarget, { passive: true })
window.addEventListener('resize', updateTarget)
updateTarget()
progress = target

const drawSlinky = (P) => {
    const { steps, startX, ground, rings, radius, depth, gap, lag, samplesPerRing } = slinky

    let n = Math.floor(P)
    if (n >= steps) n = steps - 1
    const p = P - n
    const ax = startX + n * STEP_LEN
    const cx = ax + STEP_LEN / 2
    const headSwap = n % 2 === 1

    const total = rings * samplesPerRing
    ctx.beginPath()
    for (let j = 0; j <= total; j++) {
        const u = j / total                     // position along the wire
        const order = headSwap ? 1 - u : u      // 0 = leaves first

        // each ring departs a bit later than the one before it
        const s = easeInOut(clamp01((p - order * lag) / (1 - lag)))

        // point on the arch + its tangent
        const a = Math.PI * s
        let px = cx - Math.cos(a) * STEP_LEN / 2
        let py = ground - Math.sin(a) * ARCH_H
        let tx = Math.sin(a) * STEP_LEN / 2
        let ty = -Math.cos(a) * ARCH_H
        const len = Math.hypot(tx, ty) || 1
        tx /= len; ty /= len
        const nx = -ty, ny = tx

        // stack height: ring sits on top of the rings still below it at either end
        const stack = ((1 - s) * (1 - order) + s * order) * rings * gap
        py -= stack

        // coil around the arch
        const theta = Math.PI * 2 * rings * u
        const across = Math.sin(theta) * radius
        const along = Math.cos(theta) * radius * depth

        const x = px + nx * across + tx * along
        const y = py + ny * across + ty * along
        if (j === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
    }
    ctx.lineWidth = 1.5
    ctx.lineJoin = 'round'
    ctx.strokeStyle = 'black'
    ctx.stroke()
}

const draw = () => {
    ctx.clearRect(0, 0, w, h)
    drawSlinky(progress)
}

const tick = () => {
    progress += (target - progress) * 0.15   // ease toward the scroll position
    draw()
    requestAnimationFrame(tick)
}
tick()
