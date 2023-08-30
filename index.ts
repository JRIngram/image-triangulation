import { bowyerWatson } from './triangulation'
import { getEdgeDetectedPixelGrid, manualThreshold, getPixelGrid, convertPixelGridToVerticies } from './imageProcessing'

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
    console.log('start')
    const edgeDetectedImage = await getEdgeDetectedPixelGrid('testImage.png')
    const thresholdedImage = await manualThreshold(edgeDetectedImage)
    const pixelGrid = getPixelGrid(thresholdedImage)
    const imageEdgeVerticies = convertPixelGridToVerticies(pixelGrid)
    // console.log(imageEdgeVerticies)
    const edgeDetectedTriangulation = bowyerWatson(imageEdgeVerticies)
    // console.log(edgeDetectedTriangulation.length)
    console.log('fin')
}

execute().catch((err) => {
    console.log(err)
})
