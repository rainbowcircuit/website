import { LitElement, html, css } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm'
import { drawAbout, drawDevices, drawSupport } from './drawing.js'

const link = (path) => new URL(`../${path}`, import.meta.url).href

const items = [
    { id: "about", label: "About", href: link("about.html"), draw: drawAbout },
    { id: "devices", label: "Devices", href: link("devices/index.html"), draw: drawDevices },
    { id: "support", label: "Support", href: link("support.html"), draw: drawSupport },
]

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
        for (const { id, draw } of items) {
            draw(this.shadowRoot.getElementById(id), this.isDark)
        }
    }

    render() {
        return html`
            <nav class="menu" style="width: ${this.width}">
                ${items.map(({ id, label, href }) => html`
                    <a class="menu-item" href=${href}>
                        ${this.hideText ? "" : html`<p>${label}</p>`}
                        <canvas id=${id} width=${this.size} height=${this.size}></canvas>
                    </a>
                `)}
            </nav>
        `
    }
}

customElements.define("rc-menu", Menu);
