export interface Vertex {
    x: number
    y: number
}

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
}

class Circumcircle {
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

export class Triangle {
    a: Vertex
    b: Vertex
    c: Vertex
    circumcircle: Circumcircle

    // need to add logic to order vertecies
    constructor (a: Vertex, b: Vertex, c: Vertex) {
        const vertices: Vertex[] = [a, b, c]
        // ensures standard ordering of verticies for easier comparison
        const compareVerticies = (vertexA: Vertex, vertexB: Vertex): number => {
            if (vertexA.x < vertexB.x || (vertexA.x === vertexB.x && vertexA.y < vertexB.y)) {
                return -1
            } else {
                return 1
            }
        }

        vertices.sort(compareVerticies)
        this.a = vertices[0]
        this.b = vertices[1]
        this.c = vertices[2]

        this.circumcircle = this.findCircumcircle()
    }

    findCircumcircle (): Circumcircle {
        const d = ((this.a.x * (this.b.y - this.c.y)) +
            (this.b.x * (this.c.y - this.a.y)) +
            (this.c.x * (this.a.y - this.b.y))) * 2

        const x = (1 / d) * ((Math.pow(this.a.x, 2) + Math.pow(this.a.y, 2)) * (this.b.y - this.c.y) +
            (Math.pow(this.b.x, 2) + Math.pow(this.b.y, 2)) * (this.c.y - this.a.y) +
            (Math.pow(this.c.x, 2) + Math.pow(this.c.y, 2)) * (this.a.y - this.b.y))

        const y = (1 / d) * ((Math.pow(this.a.x, 2) + Math.pow(this.a.y, 2)) * (this.c.x - this.b.x) +
            (Math.pow(this.b.x, 2) + Math.pow(this.b.y, 2)) * (this.a.x - this.c.x) +
            (Math.pow(this.c.x, 2) + Math.pow(this.c.y, 2)) * (this.b.x - this.a.x))

        const circumradius = Math.sqrt(Math.pow(this.a.x - x, 2) + Math.pow(this.a.y - y, 2))

        return new Circumcircle({ x, y }, circumradius)
    }

    getTriangleEdges (): Edge[] {
        const ab = new Edge(this.a, this.b)
        const bc = new Edge(this.b, this.c)
        const ac = new Edge(this.a, this.c)

        return [ab, bc, ac]
    }

    areTrianglesEqual (otherTriangle: Triangle): boolean {
        const edges = this.getTriangleEdges()
        const otherTriangleEdges = otherTriangle.getTriangleEdges()
        const equalEdges = edges.filter((edge, index) => {
            return edge.isEdgeEqual(otherTriangleEdges[index])
        })

        if (equalEdges.length === 3) {
            return true
        } else {
            return false
        }
    }
}
