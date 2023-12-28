import { Vertex } from "./types";

export class Edge {
    a: Vertex
    b: Vertex

    // sorts vertices so left-most and lower is 'a'.
    constructor (a: Vertex, b: Vertex) {
        if (a.x < b.x || (a.x === b.x && a.y < b.y)) {
            this.a = a
            this.b = b
        } else {
            this.a = b
            this.b = a
        }
    }

    isEdgeEqual (externalEdge: Edge): boolean {
        if (this.a.x === externalEdge.a.x &&
            this.a.y === externalEdge.a.y &&
            this.b.x === externalEdge.b.x &&
            this.b.y === externalEdge.b.y) {
            return true
        } else {
            return false
        }
    }

    getEdgeLength (): number {
        const xLength = Math.abs(this.a.x - this.b.x)
        const yLength = Math.abs(this.a.y - this.b.y)
        const length = Math.sqrt(Math.pow(xLength, 2) + Math.pow(yLength, 2))
        return length
    }
}