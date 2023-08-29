import { Triangle } from './types'
import type { Edge, Vertex } from './types'

const pointsToTest = [
    { x: 0, y: 1 },
    { x: 0, y: 3 },
    { x: 3, y: 3 },
    { x: 3, y: 1 },
    { x: 2, y: 4 },
    { x: 4, y: 2 },
]

const t = new Triangle(pointsToTest[0], pointsToTest[1], pointsToTest[2])
console.log(t)

console.log(t.circumcircle)
console.log(t.circumcircle.isVertexWithinCircumcircle(pointsToTest[0]))
console.log(t.circumcircle.isVertexWithinCircumcircle(pointsToTest[1]))
console.log(t.circumcircle.isVertexWithinCircumcircle(pointsToTest[2]))
console.log(t.getTriangleEdges())
console.log(t.areTrianglesEqual(t))

const createSupertriangle = (vertices: Vertex[]): Triangle => {
    let minX = 0
    let maxX = 0
    let minY = 0
    let maxY = 0

    vertices.forEach((vertex) => {
        minX = vertex.x < minX ? vertex.x : minX
        maxX = vertex.x > maxX ? vertex.x : maxX
        minY = vertex.y < minY ? vertex.y : minY
        maxY = vertex.y > maxX ? vertex.y : maxY
    })

    const supertriangle = new Triangle(
        { x: -maxX * 10, y: -maxY * 10 },
        { x: (maxX * 10 + -maxX * 10) / 2, y: maxY * 10 },
        { x: maxX * 10, y: -maxY * 10 }
    )

    return supertriangle
}

const bowyerWatson = (pointList: Vertex[]): Triangle[] => {
    const supertriangle = createSupertriangle(pointList)
    let triangulation: Triangle[] = [supertriangle]

    pointList.forEach((point) => {
        const badTriangles: Triangle[] = [] // a set of bad triangles

        triangulation.forEach((triangle) => {
            const { circumcircle } = triangle
            if (circumcircle.isVertexWithinCircumcircle(point)) {
                // check if triangle already within set
                // if not, push
                let triangleAlreadyInSet = false
                badTriangles.forEach((badTriangle) => {
                    if (badTriangle.areTrianglesEqual(triangle)) {
                        triangleAlreadyInSet = true
                    }
                })
                if (!triangleAlreadyInSet) {
                    badTriangles.push(triangle)
                }
            }
        })

        const polygon: Edge[] = [] // a set of edges

        badTriangles.forEach((triangle, index) => {
            const triangleEdges = triangle.getTriangleEdges()
            triangleEdges.forEach((edge) => {
                // check if edge shared with any other triangle in bad triangles
                let edgeSharedWithOtherTriangle = false
                badTriangles.forEach((otherBadTriangle, otherBadTriangleIndex) => {
                    if (index !== otherBadTriangleIndex) {
                        const otherBadTriangleEdges = otherBadTriangle.getTriangleEdges()
                        otherBadTriangleEdges.forEach((otherEdge) => {
                            if (edge.isEdgeEqual(otherEdge)) {
                                edgeSharedWithOtherTriangle = true
                            }
                        })
                    }
                })

                if (!edgeSharedWithOtherTriangle) {
                    // enforce uniqueness of set
                    let edgeAlreadyInSet = false
                    polygon.forEach((polygonEdge) => {
                        if (edge.isEdgeEqual(polygonEdge)) {
                            edgeAlreadyInSet = true
                        }
                    })
                    if (!edgeAlreadyInSet) {
                        polygon.push(edge)
                    }
                }
            })
        })

        // remove bad triangles from triangulation
        badTriangles.forEach((triangle) => {
            const indexOfBadTriangle = triangulation.findIndex((element) => triangle.areTrianglesEqual(element))
            triangulation.splice(indexOfBadTriangle, 1)
        })

        polygon.forEach((polygonEdge) => {
            const newTriangle = new Triangle(point, polygonEdge.a, polygonEdge.b)
            triangulation.push(newTriangle)
        })
    })

    triangulation = triangulation.filter((triangle): boolean => {
        const triangleVertices = [triangle.a, triangle.b, triangle.c]
        const supertriangleVertices = [supertriangle.a, supertriangle.b, supertriangle.c]
        let sharesSupertriangleVertex = false
        triangleVertices.forEach((triangleVerex) => {
            supertriangleVertices.forEach((supertriangleVertex) => {
                if (triangleVerex.x === supertriangleVertex.x && triangleVerex.y === supertriangleVertex.y) {
                    sharesSupertriangleVertex = true
                }
            })
        })

        return !sharesSupertriangleVertex
    })

    return triangulation
}

const triangulation = bowyerWatson(pointsToTest)
console.log('*****')
console.log(triangulation)
console.log('RESULT')
triangulation.forEach((triangle) => {
    console.log(triangle.getTriangleEdges())
})
