import { LitElement, html, css, nothing } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm'
import { drawHome, drawAbout, drawDevices, drawSupport, drawManual, drawBuy, drawDemo } from './drawing.js'

const icons = {
    home: { draw: drawHome, aspect: 1.9 },
    about: { draw: drawAbout },
    devices: { draw: drawDevices },
    support: { draw: drawSupport },
    manual: { draw: drawManual },
    buy: { draw: drawBuy },
    demo: { draw: drawDemo },
}

export class Button extends LitElement {
    static properties = {
        label: { type: String },
        icon: { type: String },
        href: { type: String },
        size: { type: Number },
        price: { type: String },
        isDark: { type: Boolean, attribute: "is-dark" },
        hideLabel: { type: Boolean, attribute: "hide-label" },
        sameTab: { type: Boolean, attribute: "same-tab" },
        // Extra values for the draw function, e.g. aux='{"key": "value"}'
        aux: { type: Object },
    }

    constructor() {
        super()
        this.label = ""
        this.icon = "manual"
        this.href = ""
        this.size = 80
        this.price = ""
        this.isDark = false
        this.hideLabel = false
        this.sameTab = false
        this.aux = {}
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
        const icon = icons[this.icon]
        if (!icon) return
        const trigger = this.shadowRoot.querySelector(".button")
        const aux = { isDark: this.isDark, price: this.price, ...this.aux }
        icon.draw(this.shadowRoot.querySelector("canvas"), trigger, aux)
    }

    render() {
        const aspect = icons[this.icon]?.aspect ?? 1
        const showLabel = this.label && !this.hideLabel
        const ariaLabel = showLabel ? nothing : this.label || nothing
        const color = `color: ${this.isDark ? "white" : "black"}`
        const content = html`
            ${showLabel ? html`<p class="label">${this.label}</p>` : ""}
            <canvas width=${Math.round(this.size * aspect)} height=${this.size}></canvas>
        `
        if (!this.href) {
            return html`<button class="button" type="button" aria-label=${ariaLabel} style=${color}>${content}</button>`
        }
        return this.sameTab
            ? html`<a class="button" href=${this.href} aria-label=${ariaLabel} style=${color}>${content}</a>`
            : html`<a class="button" href=${this.href} target="_blank" rel="noopener" aria-label=${ariaLabel} style=${color}>${content}</a>`
    }
}

customElements.define("rc-button", Button)
