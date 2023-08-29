import { bowyerWatson } from './triangulation'
import { getEdgeDetectedPixelGrid } from './imageProcessing'

const pointsToTest = [
    { x: 0, y: 1 },
    { x: 0, y: 3 },
    { x: 3, y: 3 },
    { x: 3, y: 1 },
    { x: 2, y: 4 },
    { x: 4, y: 2 }
]

const triangulation = bowyerWatson(pointsToTest)
console.log('*****')
console.log('RESULT')
triangulation.forEach((triangle) => {
    console.log(triangle.getTriangleEdges())
})

const execute = async (): Promise<void> => {
    await getEdgeDetectedPixelGrid('testImage.png')
}

execute().catch(() => 0)
