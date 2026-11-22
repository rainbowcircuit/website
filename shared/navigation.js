import { LitElement, html, css } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm'
import './button.js'

const link = (path) => new URL(`../${path}`, import.meta.url).href

const menuItems = [
    { icon: "about", label: "About", href: link("about.html") },
    { icon: "devices", label: "Devices", href: link("devices/index.html") },
    { icon: "support", label: "Support", href: link("support.html") },
]

class Menu extends LitElement {
    static properties = {
        isDark: { type: Boolean, attribute: "is-dark" },
        size: { type: Number },
        hideText: { type: Boolean, attribute: "hide-text" },
        home: { type: Boolean },
        homeSize: { type: Number, attribute: "home-size" },
    }

    constructor() {
        super()
        this.isDark = false
        this.size = 50
        this.hideText = false
        this.home = false
        this.homeSize = 80
    }

    static styles = css`
        :host {
            display: block;
            min-width: 0;
            font-family: 'Outfit', sans-serif;
        }

        .bar {
            display: flex;
            justify-content: space-between;
            align-items: var(--menu-align, center);
        }

        .bar .menu {
            flex: 1;
        }

        .menu {
            display: flex;
            justify-content: space-around;
        }

        .menu--icons {
            justify-content: flex-end;
            gap: clamp(16px, 5vw, 56px);
        }
    `

    render() {
        const menu = html`
            <nav class="menu ${this.hideText ? "menu--icons" : ""}">
                ${menuItems.map(({ icon, label, href }) => html`
                    <rc-button icon=${icon} label=${label} href=${href} size=${this.size}
                        same-tab ?hide-label=${this.hideText} ?is-dark=${this.isDark}></rc-button>
                `)}
            </nav>
        `
        if (!this.home) return menu
        return html`
            <div class="bar">
                <rc-button icon="home" label="Rainbow Circuit home" hide-label same-tab
                    href=${link("index.html")} size=${this.homeSize} ?is-dark=${this.isDark}></rc-button>
                ${menu}
            </div>
        `
    }
}

customElements.define("rc-menu", Menu)
