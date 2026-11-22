import { LitElement, html } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm'

const link = (path) => /^https?:/.test(path) ? path : new URL(`../${path}`, import.meta.url).href

export const products = [
    {
        name: "Petal",
        price: "$55 USD",
        tagline: "Welcome to the garden of earthly delays",
        type: "Audio Effect",
        formats: "VST | AU | M4L",
        image: "images/webp/petal/petal_horizontal.webp",
        href: "devices/petal.html",
    },
    {
        name: "Gleam",
        price: "$15 USD",
        tagline: "Modal resonator, in collaboration with Lunacy Audio",
        type: "Audio Effect",
        formats: "VST | AU | M4L",
        image: "images/webp/gleam/gleam_horizontal.webp",
        href: "https://lunacy.audio/products/gleam",
    },
    {
        name: "Hopscotch",
        price: "$28 USD",
        tagline: "Step sequencer and modulator for Max for Live",
        type: "Audio Effect",
        formats: "M4L",
        image: "images/webp/hopscotch/hopscotch_1440x800.webp",
        href: "devices/hopscotch.html",
    },
    {
        name: "Tinge",
        price: "$32 USD",
        tagline: "A colorful performance arpeggiator",
        type: "MIDI Effect",
        formats: "VST | AU",
        image: "images/webp/tinge/tinge_website_horizontal.webp",
        href: "devices/tinge.html",
    },
    {
        name: "Motherly",
        price: "$49 USD",
        tagline: "Percussion synthesizer with a semi-modular patch bay",
        type: "Instrument",
        formats: "VST | AU",
        image: "images/webp/motherly/Motherly_website_1.1.webp",
        href: "devices/motherly.html",
    },
    {
        name: "Sands",
        price: "$22 USD",
        tagline: "Simulating, then abusing, old digital samplers",
        type: "Audio Effect",
        formats: "M4L",
        image: "images/webp/sands/sands_horizontal.webp",
        href: "devices/sands.html",
    },
    {
        name: "Peaks",
        price: "$32 USD",
        tagline: "A modal resonator you can play like an instrument",
        type: "Audio Effect",
        formats: "VST | AU",
        image: "images/webp/peaks/Peaks_main.webp",
        href: "devices/peaks.html",
    },
    {
        name: "Failure",
        price: "$10 USD",
        tagline: "Overload bass, imagined by Daedelus",
        type: "Instrument",
        formats: "M4L",
        image: "images/webp/failure/failure_main.webp",
        href: "devices/failure.html",
    },
]

const PAGE_SIZE = 3
class Products extends LitElement {
    static properties = {
        index: { type: Number },
        descriptions: { state: true },
    }

    constructor() {
        super()
        this.index = 0
        this.descriptions = {}
    }

    connectedCallback() {
        super.connectedCallback()
        this.loadDescriptions()
    }

    // Use each device page's <meta name="description"> as its tagline.
    // External pages (e.g. Gleam) can't be fetched cross-origin, so they keep the hardcoded tagline.
    async loadDescriptions() {
        const local = products.filter((p) => !/^https?:/.test(p.href))
        await Promise.all(local.map(async (p) => {
            try {
                const res = await fetch(link(p.href))
                if (!res.ok) return
                const doc = new DOMParser().parseFromString(await res.text(), "text/html")
                const content = doc.querySelector('meta[name="description"]')?.content?.trim()
                if (content) this.descriptions = { ...this.descriptions, [p.name]: content }
            } catch {}
        }))
    }

    next() {
        if (this.index + PAGE_SIZE < products.length) this.index += PAGE_SIZE
    }

    prev() {
        this.index = Math.max(0, this.index - PAGE_SIZE)
    }

    createRenderRoot() {
        return this
    }

    render() {
        const visible = products.slice(this.index, this.index + PAGE_SIZE)
        const atStart = this.index === 0
        const atEnd = this.index + PAGE_SIZE >= products.length
        return html`${visible.map((product, i) => html`
            <a href=${link(product.href)}><img class="card-img" src=${link(product.image)} alt=${product.name}></a>
            <div class="card-caption" style=${i === visible.length - 1 ? "margin-bottom: 0px;" : ""}>
                <div class="card-info">
                    <h1>${product.name} <span class="price">${product.price}</span></h1>
                    <p>${this.descriptions[product.name] ?? product.tagline}</p>
                </div>
                <div class="card-meta">
                    <p>${product.type}</p>
                    <p>${product.formats}</p>
                </div>
            </div>
        `)}
            <div class="pager">
                <a href="#" aria-label="Previous" ?hidden=${atStart}
                    @click=${(e) => { e.preventDefault(); this.prev() }}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
                </a>
                <a href="#" aria-label="Next" ?hidden=${atEnd}
                    @click=${(e) => { e.preventDefault(); this.next() }}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
                </a>
            </div>
        `
    }
}

customElements.define("rc-products", Products)
