export class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    add(v) {
        this.x = this.x + v.x
        this.y = this.y + v.y
    }

    mult(d) {
        this.x = this.x * d
        this.y = this.y * d
    }
}
