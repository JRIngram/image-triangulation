import { bowyerWatson } from './triangulation'
import { Triangle } from './types'

const pointsToTest = [
    { x: 0, y: 1 },
    { x: 0, y: 3 },
    { x: 3, y: 3 },
    { x: 3, y: 1 },
    { x: 2, y: 4 },
    { x: 4, y: 2 },
]

const t = new Triangle(pointsToTest[0], pointsToTest[1], pointsToTest[2])
const triangulation = bowyerWatson(pointsToTest)
console.log('*****')
console.log('RESULT')
triangulation.forEach((triangle) => {
    console.log(triangle.getTriangleEdges())
})
