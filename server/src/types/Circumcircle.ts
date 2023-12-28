import { Vertex } from "./types"

export class Circumcircle {
    circumcentre: Vertex
    circumradius: number

    constructor (circumcentre: Vertex, circumradius: number) {
        this.circumcentre = circumcentre
        this.circumradius = circumradius
    }

    isVertexWithinCircumcircle (vertex: Vertex): boolean {
        const distanceFromCircumcentre = Math.sqrt(Math.pow(vertex.x - this.circumcentre.x, 2) + Math.pow(vertex.y - this.circumcentre.y, 2))
        if (distanceFromCircumcentre <= this.circumradius) {
            return true
        } else {
            return false
        }
    }
}
