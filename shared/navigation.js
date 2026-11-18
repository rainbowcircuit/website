import { LitElement, html, css } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm'
import { drawLogo, drawAbout, drawDevices, drawSupport } from './drawing.js'

// Resolve links relative to this file (shared/), so they work from any page depth.
const link = (path) => new URL(`../${path}`, import.meta.url).href

const LOGO_WIDTH_PER_HEIGHT = 1.9

const homeItem = { id: "logo", label: "Rainbow Circuit home", href: link("index.html"), draw: (canvas, isDark) => drawLogo(canvas, isDark, true) }

const menuItems = [
    { id: "about", label: "About", href: link("about.html"), draw: drawAbout },
    { id: "devices", label: "Devices", href: link("devices/index.html"), draw: drawDevices },
    { id: "support", label: "Support", href: link("support.html"), draw: drawSupport },
]

class Home extends LitElement {
    static properties = {
        isDark: { type: Boolean, attribute: "is-dark" },
        size: { type: Number },
        href: { type: String },
    }

    constructor() {
        super()
        this.isDark = false
        this.size = 50
        this.href = homeItem.href
    }

    static styles = css`
        :host {
            display: inline-block;
            line-height: 0;
        }

        .home-item {
            display: inline-block;
        }
    `

    firstUpdated() {
        const { id, draw } = homeItem
        draw(this.shadowRoot.getElementById(id), this.isDark)
    }

    render() {
        const { id, label } = homeItem
        return html`
            <a class="home-item" href=${this.href} aria-label=${label}>
                <canvas id=${id} width=${Math.round(this.size * LOGO_WIDTH_PER_HEIGHT)} height=${this.size}></canvas>
            </a>
        `
    }
}

class Menu extends LitElement {
    static properties = {
        isDark: { type: Boolean, attribute: "is-dark" },
        size: { type: Number },
        width: { type: String },
        hideText: { type: Boolean, attribute: "hide-text" },
    }

    constructor() {
        super()
        this.isDark = false
        this.size = 50
        this.width = "auto"
        this.hideText = false
    }

    static styles = css`
        :host {
            display: block;
            font-family: 'Outfit', sans-serif;
        }

        .menu {
            display: flex;
            justify-content: space-around;
        }

        .menu-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-decoration: none;
            color: black;
        }
    `

    firstUpdated() {
        for (const { id, draw } of menuItems) {
            draw(this.shadowRoot.getElementById(id), this.isDark)
        }
    }

    render() {
        return html`
            <nav class="menu" style="width: ${this.width}">
                ${menuItems.map(({ id, label, href }) => html`
                    <a class="menu-item" href=${href} aria-label=${label}>
                        ${this.hideText ? "" : html`<p>${label}</p>`}
                        <canvas id=${id} width=${this.size} height=${this.size}></canvas>
                    </a>
                `)}
            </nav>
        `
    }
}

customElements.define("rc-home", Home)
customElements.define("rc-menu", Menu)
