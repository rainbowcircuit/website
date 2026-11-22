export const setupCanvas = (canvas) => {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    return { ctx, w, h };
};

const hoverAnimate = (canvas, draw, speed = 0.05, trigger = canvas, leaveSpeed = speed) => {
    let mouseState = "idle"
    let hoverVal = 0

    draw(hoverVal)
    const tick = () => {
        if (mouseState === "enter") {
            hoverVal = Math.min(1, hoverVal + speed)
            draw(hoverVal)
            if (hoverVal < 1) requestAnimationFrame(tick)
        } else if (mouseState === "leave") {
            hoverVal = Math.max(0, hoverVal - leaveSpeed)
            draw(hoverVal)
            if (hoverVal > 0) requestAnimationFrame(tick)
        }
    }

    const setState = (state) => {
        const running = mouseState !== "idle" && hoverVal > 0 && hoverVal < 1
        mouseState = state
        if (!running) tick()
    }

    trigger.addEventListener("mouseenter", () => setState("enter"))
    trigger.addEventListener("mouseleave", () => setState("leave"))
}

// R and C letter shapes shared by the logo and the home button; hoverVal pulls them together
const logoPaths = (w, h, hoverVal) => {
    const norm = Math.sin(hoverVal * Math.PI / 2)
    const cxR = w * 0.325 + (w * 0.025 * norm)
    const cxC = w * 0.675 - (w * 0.025 * norm)
    const cy = h / 2
    const letterSize = w * 0.45
    const dimpleSize = letterSize * 0.1
    const half = letterSize / 2
    const top = cy - half, bottom = cy + half

    // R
    const pathR = new Path2D()
    pathR.moveTo(cxR, top)
    pathR.arc(cxR, cy, half, Math.PI * 1.5, Math.PI * 2, false)

    pathR.arcTo(cxR + half, bottom, cxR + dimpleSize, bottom, dimpleSize)
    pathR.arcTo(cxR + dimpleSize, bottom, cxR, bottom - dimpleSize, dimpleSize)
    pathR.lineTo(cxR, bottom - dimpleSize)
    pathR.arcTo(cxR - dimpleSize, bottom, cxR - half, bottom, dimpleSize)

    pathR.arcTo(cxR - half, bottom, cxR - half, top, dimpleSize)
    pathR.arcTo(cxR - half, top, cxR, top, dimpleSize)
    pathR.closePath()

    // C
    const pathC = new Path2D()
    pathC.moveTo(cxC, bottom)
    pathC.arc(cxC, cy, half, Math.PI * 0.5, Math.PI * 1.5, false)

    pathC.arcTo(cxC + half, top, cxC + half, cy - dimpleSize, dimpleSize)
    pathC.arcTo(cxC + half, cy - dimpleSize, cxC + half - dimpleSize, cy, dimpleSize)
    pathC.lineTo(cxC + half - dimpleSize, cy)
    pathC.arcTo(cxC + half, cy + dimpleSize, cxC + half, bottom, dimpleSize)

    pathC.arcTo(cxC + half, bottom, cxC, bottom, dimpleSize)
    pathC.closePath()

    return { pathR, pathC }
}

// Filled logo: a standalone canvas drawing, not a button
export const drawLogo = (canvas, aux = {}) => {
    const { isDark = false } = aux
    const { ctx, w, h } = setupCanvas(canvas)

    const draw = (hoverVal) => {
        ctx.clearRect(0, 0, w, h)
        const { pathR, pathC } = logoPaths(w, h, hoverVal)

        ctx.fillStyle = isDark ? 'white' : 'black'
        ctx.fill(pathR)
        ctx.fill(pathC)

        // clip
        ctx.save()
        ctx.clip(pathR)
        ctx.clip(pathC)
        ctx.fillStyle = isDark ? "black" : "white"
        ctx.fillRect(0, 0, w, h)
        ctx.restore()
    }

    hoverAnimate(canvas, draw, 0.05, canvas, 0.015)
}

// Outlined logo for the home button
export const drawHome = (canvas, trigger = canvas, aux = {}) => {
    const { isDark = false } = aux
    const { ctx, w, h } = setupCanvas(canvas)

    const draw = (hoverVal) => {
        ctx.clearRect(0, 0, w, h)
        const { pathR, pathC } = logoPaths(w, h, hoverVal)

        ctx.strokeStyle = isDark ? 'white' : 'black'
        ctx.lineWidth = 1.5
        ctx.stroke(pathR)
        ctx.stroke(pathC)
    }

    hoverAnimate(canvas, draw, 0.05, trigger, 0.015)
}

export const drawAbout = (canvas, trigger = canvas, aux = {}) => {
    const { isDark = false } = aux
    const { ctx, w, h } = setupCanvas(canvas)

    const draw = (hoverVal) => {
        ctx.clearRect(0, 0, w, h)
        ctx.beginPath()
        ctx.strokeStyle = isDark ? 'white' : 'black'
        ctx.fillStyle = isDark ? 'white' : 'black'
        const r = 10
        ctx.moveTo(w * 0.05 + r, h * 0.05)
        ctx.arcTo(w * 0.95, h * 0.05, w * 0.95, h * 0.75, r)
        ctx.arcTo(w * 0.95, h * 0.75, w * 0.35, h * 0.75, r)
        ctx.lineTo(w * 0.35, h * 0.75)
        ctx.lineTo(w * 0.05, h * 0.95)
        ctx.lineTo(w * 0.05, h * 0.05 + r)
        ctx.arcTo(w * 0.05, h * 0.05, w * 0.05 + r, h * 0.05, r)
        ctx.lineWidth = 1.5
        ctx.closePath()
        ctx.stroke();

        ctx.beginPath();
        [0.35, 0.5, 0.65].forEach((x, i) => {
            const t = Math.min(1, Math.max(0, hoverVal * 1.5 - i * 0.25))
            const bounce = Math.sin(t * Math.PI) * h * 0.1
            ctx.moveTo(w * x + 2, h * 0.4 - bounce)
            ctx.arc(w * x, h * 0.4 - bounce, 2, 0, Math.PI * 2)
        })
        ctx.fill()
    }

    hoverAnimate(canvas, draw, 0.05, trigger)
}

export const drawDevices = (canvas, trigger = canvas, aux = {}) => {
    const { isDark = false } = aux
    const { ctx, w, h } = setupCanvas(canvas)

    const draw = (hoverVal) => {
        ctx.clearRect(0, 0, w, h)
        ctx.strokeStyle = isDark ? 'white' : 'black'
        ctx.fillStyle = isDark ? 'white' : 'black'

        const freq = 4 + hoverVal * 2;

        const point = (i) => {
            const angle = Math.PI / 2 + (Math.PI * freq * i / 128);
            return [
                w / 2 + Math.cos(angle) * w * 0.4,
                h * 0.25 + h * 0.5 * i / 128 + Math.sin(angle) * h * 0.125,
            ]
        }

        ctx.beginPath()
        for (let i = 0; i <= 128; i++) {
            const [x, y] = point(i)
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
        }
        ctx.lineWidth = 1.5
        ctx.stroke();

        const [bx, by] = point(128)
        ctx.beginPath()
        ctx.arc(bx, by, w * 0.0625, 0, Math.PI * 2)
        ctx.fill()
    }

    hoverAnimate(canvas, draw, 0.05, trigger)
}

export const drawSupport = (canvas, trigger = canvas, aux = {}) => {
    const { isDark = false } = aux
    const { ctx, w, h } = setupCanvas(canvas)

    const draw = (hoverVal) => {
        ctx.clearRect(0, 0, w, h)
        ctx.strokeStyle = isDark ? 'white' : 'black'

        ctx.save()
        ctx.translate(w / 2, h / 2)   
        ctx.rotate(Math.PI / 4)
        ctx.translate(-w / 2, -h / 2) 

        const endsX = Math.cos(Math.PI * 0.95 + (hoverVal * Math.PI * 0.1)) * w * 0.4
        const endsY = Math.sin(Math.PI * 0.95 + (hoverVal * Math.PI * 0.1)) * h * 0.4

        ctx.beginPath()
        ctx.moveTo(w / 2, 0)
        ctx.lineTo(w / 2 - endsX, h * 0.7 + endsY)
        ctx.lineTo(w / 2, h * 0.8)

        ctx.lineTo(w / 2 + endsX, h * 0.7 + endsY)
        ctx.closePath()

        ctx.moveTo(w / 2, 0)
        ctx.lineTo(w / 2, h * 0.9)
        ctx.lineTo(w / 2 - endsX * 0.28, h * 0.78 + endsY * 0.28)

        ctx.lineWidth = 1.5
        ctx.stroke()
        ctx.restore()
    }

    hoverAnimate(canvas, draw, 0.05, trigger)
}

export const drawManual = (canvas, trigger = canvas, aux = {}) => {
    const { isDark = false } = aux
    const { ctx, w, h } = setupCanvas(canvas)

    const draw = (hoverVal) => {
        ctx.clearRect(0, 0, w, h)

        const eased = hoverVal * hoverVal * (3 - 2 * hoverVal)
        const scale = 1 + eased
        const rad = w * 0.35
        const cx = w / 2, cy = h * 0.675

        ctx.beginPath()
        for (let i = 0; i <= 8; i++) {
            const angle = Math.PI + (Math.PI * 0.25 * scale * i / 8)
            const end = { x: cx + Math.cos(angle) * rad, y: cy + Math.sin(angle) * rad }
            if (i === 0) {
                ctx.moveTo(cx + rad, cy)
                ctx.lineTo(cx, cy)
            } else {
                ctx.moveTo(cx, cy)
            }
            ctx.lineTo(end.x, end.y)
        }
        ctx.strokeStyle = isDark ? 'white' : 'black'
        ctx.lineWidth = 1.5
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()
    }

    hoverAnimate(canvas, draw, 0.05, trigger)
}


export const drawBuy = (canvas, trigger = canvas, aux = {}) => {
    const { isDark = false, price } = aux
    const { ctx, w, h } = setupCanvas(canvas)

    const draw = (hoverVal) => {
        ctx.clearRect(0, 0, w, h)

        let eased = hoverVal * hoverVal * (3 - 2 * hoverVal)
        eased = 1 - eased;

        const coords = {
            tl: { x: w * 0.25, y: h * 0.35 },
            bl: { x: w * 0.25 + w * 0.05 * eased, y: h * 0.65 },
            br: { x: w * 0.75, y: h * 0.65 },
            tr: { x: w * 0.75, y: h * 0.35 },
        }

        const rad = Math.min(w, h) * 0.12

        ctx.beginPath()
        ctx.moveTo(coords.tl.x - w * 0.1, coords.tl.y)
        ctx.lineTo(coords.tl.x, coords.tl.y)
        ctx.lineTo(coords.bl.x, coords.bl.y)
        ctx.lineTo(coords.br.x - rad, coords.br.y)
        ctx.arc(coords.br.x - rad, coords.br.y - rad, rad, Math.PI / 2, 0, true)
        ctx.lineTo(coords.tr.x, coords.tr.y)
        ctx.lineWidth = 1.5
        ctx.lineCap = 'round'
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(coords.bl.x + w * 0.1, coords.bl.y + h * 0.075, w * 0.035, 0, Math.PI * 2)
        ctx.arc(coords.br.x - w * 0.1, coords.br.y + h * 0.075, w * 0.035, 0, Math.PI * 2)
        ctx.fillStyle = isDark ? 'white' : 'black'
        ctx.fill()

        if (price) {
            ctx.font = `${Math.round(h * 0.185)}px 'Outfit', sans-serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(price, (coords.bl.x + coords.br.x - rad * 0.5) / 2, (coords.tl.y + coords.bl.y) / 2)
        }
    }

    hoverAnimate(canvas, draw, 0.05, trigger)
}

export const drawDemo = (canvas, trigger = canvas, aux = {}) => {
    const { isDark = false } = aux
    const { ctx, w, h } = setupCanvas(canvas)

    const draw = (hoverVal) => {
        ctx.clearRect(0, 0, w, h)

        const eased = hoverVal * hoverVal * (3 - 2 * hoverVal)
        const drop = eased * h * 0.08
        const cx = w / 2
        const rad = Math.min(w, h) * 0.06

        ctx.strokeStyle = isDark ? 'white' : 'black'
        ctx.lineWidth = 1.5
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        // tray
        const left = w * 0.25, right = w * 0.75
        const lip = h * 0.55, floor = h * 0.72
        ctx.beginPath()
        ctx.moveTo(left, lip)
        ctx.arcTo(left, floor, cx, floor, rad)
        ctx.arcTo(right, floor, right, lip, rad)
        ctx.lineTo(right, lip)
        ctx.stroke()

        // arrow, dropping into the tray on hover
        const tip = h * 0.56 + drop
        const head = w * 0.1
        ctx.beginPath()
        ctx.moveTo(cx, h * 0.28 + drop * 0.5)
        ctx.lineTo(cx, tip)
        ctx.moveTo(cx - head, tip - head)
        ctx.lineTo(cx, tip)
        ctx.lineTo(cx + head, tip - head)
        ctx.stroke()
    }

    hoverAnimate(canvas, draw, 0.05, trigger)
}
