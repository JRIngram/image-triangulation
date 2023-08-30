export interface Vertex {
    x: number
    y: number
}

export interface Pixel {
    x: number
    y: number
    colour: {
        r: number
        g: number
        b: number
    }
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

    getEdgeLength (): number {
        const xLength = Math.abs(this.a.x - this.b.x)
        const yLength = Math.abs(this.a.y - this.b.y)
        const length = Math.sqrt(Math.pow(xLength, 2) + Math.pow(yLength, 2))
        return length
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

    getTriangleArea (): number {
        // uses Heron's formula to calculate area
        const edges = this.getTriangleEdges()
        const edgeLengths = edges.map(edge => edge.getEdgeLength())
        const a = edgeLengths[0]
        const b = edgeLengths[1]
        const c = edgeLengths[2]

        const s = (a + b + c) / 2
        const area = parseFloat(Math.sqrt(s * (s - a) * (s - b) * (s - c)).toFixed(3))

        return area
    }

    // Lague method:
    // Px = Ax + w1(Bx - Ax) + w2(Cx - Ax)
    // Py = Ay + w1(By - Ay) + w2(Cy - Ay)
    // w1 = Ax(Cy-Ay) + (Py - Ay)(Cx - Ax) - Px(Cy - Ay)
    //        / (By - Ay)(Cx - Ax) - (Bx - Ax)(Cy - Ay)
    // w2 = (Py-Ay - w1(By - Ay))
    //          / Cy - Ay
    pointLiesWithinTriangle (point: Vertex): boolean {
        const { a, b, c } = { a: this.a, b: this.b, c: this.c }
        // From Sebastian Lague video
        // todo need to add special case handling:
        //  1) If the 3 vertices of the triangle are collinear. In this case p can't be inside since the triangle has no area (it's a degenerate triangle). You can determine collinearity by comparing the edge gradient pairs, but note that you have to compare all 3 pairs to handle the case where 2 vertices are on top of each other. Be mindful of floating point precision error and division by zero.
        //  2) If C.y == A.y. If you rule out collinearity as per special case 1, then simply swap B and C.

        // const weightOne = ((a.x * (c.y - a.y)) + ((point.y - a.y) * (c.x - a.x)) - (point.x * (c.y - a.y))) /
        //     (((b.y - a.y) * (c.x - a.x)) - ((b.x - a.x) * (c.y - a.y)))

        // const weightTwo = (point.y - a.y - (weightOne * (b.y - a.y))) / (c.y - a.y)

        // console.log(weightOne, weightTwo)

        // if (weightOne >= 0 && weightTwo >= 0 && (weightOne + weightTwo) <= 1) {
        //     return true
        // } else {
        //     return false
        // }

        // Baeldung area method https://www.baeldung.com/cs/check-if-point-is-in-2d-triangle
        const area = this.getTriangleArea()
        const aTriangle = new Triangle(a, b, point)
        const bTriangle = new Triangle(b, c, point)
        const cTriangle = new Triangle(c, a, point)

        const aArea = aTriangle.getTriangleArea()
        const bArea = bTriangle.getTriangleArea()
        const cArea = cTriangle.getTriangleArea()

        if (area === (aArea + bArea + cArea)) {
            return true
        } else {
            return false
        }
    }
}
