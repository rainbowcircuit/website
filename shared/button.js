import { LitElement, html, css } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm'
import { drawManual, drawBuy, drawDemo } from './drawing.js'

// Icons available to <rc-button icon="...">.
const icons = {
    manual: drawManual,
    buy: drawBuy,
    demo: drawDemo,
}

class Button extends LitElement {
    static properties = {
        label: { type: String },
        icon: { type: String },
        href: { type: String },
        size: { type: Number },
        price: { type: String },
        isDark: { type: Boolean, attribute: "is-dark" },
    }

    constructor() {
        super()
        this.label = ""
        this.icon = "manual"
        this.href = ""
        this.size = 80
        this.price = ""
        this.isDark = false
    }

    static styles = css`
        :host {
            display: inline-block;
            font-family: 'Outfit', sans-serif;
        }

        .button {
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            padding: 0;
            border: none;
            background: none;
            font: inherit;
            color: inherit;
            text-decoration: none;
            cursor: pointer;
        }

        .label {
            margin: 0 0 4px;
            font-size: 16px;
            white-space: nowrap;
        }

        canvas {
            display: block;
        }
    `

    firstUpdated() {
        const draw = icons[this.icon]
        if (!draw) return
        const trigger = this.shadowRoot.querySelector(".button")
        const aux = { price: this.price }
        draw(this.shadowRoot.querySelector("canvas"), this.isDark, trigger, aux)
    }

    render() {
        const content = html`
            <p class="label">${this.label}</p>
            <canvas width=${this.size} height=${this.size}></canvas>
        `
        return this.href
            ? html`<a class="button" href=${this.href} target="_blank" rel="noopener" style="color: ${this.isDark ? "white" : "black"}">${content}</a>`
            : html`<button class="button" type="button" style="color: ${this.isDark ? "white" : "black"}">${content}</button>`
    }
}

customElements.define("rc-button", Button)
