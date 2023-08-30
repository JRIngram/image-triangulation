import { bowyerWatson } from './triangulation'
import { getEdgeDetectedPixelGrid, manualThreshold, getPixelGrid, convertPixelGridToVerticies, loadImage } from './imageProcessing'
import { Triangle, Vertex, Pixel } from './types'

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

// const firstTriangle = triangulation[0]
// console.log(firstTriangle)
// console.log(firstTriangle.getTriangleArea())
// const testPoint = { x: 1, y: 2 }
// console.log(firstTriangle.pointLiesWithinTriangle(testPoint))


const execute = async (): Promise<void> => {
    const startTime = performance.now()
    console.log('start')

    const imagePath = 'testImage.png'
    const edgeDetectedImage = await getEdgeDetectedPixelGrid(imagePath)
    const thresholdedImage = await manualThreshold(edgeDetectedImage)
    const pixelGrid = getPixelGrid(thresholdedImage)
    const imageEdgeVerticies = convertPixelGridToVerticies(pixelGrid)
    const edgeDetectedTriangulation = bowyerWatson(imageEdgeVerticies)
    const originalImage = await loadImage(imagePath)
    const originalImagePixelGrid = getPixelGrid(originalImage)

    // create averagedPixelList = []
    // for each triangle, determine if all points are within the triangle
    // calculate the average R,G and B value for each point within the triangle from the original image
    // add average RGB to a list of pixels with the coords
    const averagedPixelList: Pixel[] = []
    edgeDetectedTriangulation.forEach((triangle) => {
        const summedRGBValue: number[] = [0, 0, 0]
        const pixelCoordinatesInTriangle: Vertex[] = []

        originalImagePixelGrid.forEach((pixelRow, y) => {
            pixelRow.forEach((pixel, x) => {
                // console.log(pixel)
                const pixelCoorindates = { x, y }
                const pixelIsInTriangle = triangle.pointLiesWithinTriangle(pixelCoorindates)
                if (pixelIsInTriangle) {
                    pixelCoordinatesInTriangle.push(pixelCoorindates)
                    const r = pixel[0]
                    const g = pixel[1]
                    const b = pixel[2]

                    summedRGBValue[0] += r
                    summedRGBValue[1] += g
                    summedRGBValue[2] += b
                }
            })
        })
        const pixelsInTriangleCount = pixelCoordinatesInTriangle.length
        const averageRGBValue = {
            r: summedRGBValue[0] / pixelsInTriangleCount,
            g: summedRGBValue[1] / pixelsInTriangleCount,
            b: summedRGBValue[2] / pixelsInTriangleCount
        }

        const averagedPixelsInTriangle: Pixel[] = pixelCoordinatesInTriangle.map(pixel => {
            return {
                x: pixel.x,
                y: pixel.y,
                colour: averageRGBValue
            }
        })

        averagedPixelList.push(...averagedPixelsInTriangle)

        // console.log(averageRGBValue)
    })

    // for each point change the colour to that average value
    averagedPixelList.forEach((pixel) => {
        const { r, g, b } = pixel.colour
        originalImage.setPixelXY(pixel.x, pixel.y, [r, g, b])
    })

    await originalImage.save('triangulatedImage.png')

    console.log(`fin. Took ${performance.now() - startTime}ms to run`)
}

execute().catch((err) => {
    console.log(err)
})
