import { bowyerWatson } from './triangulation'
import { getThresholdedEdgeDetectedImage, getPixelGrid, convertPixelGridToVerticies, loadImage } from './imageProcessing'
import type { Vertex, Pixel } from './types'

const execute = async (): Promise<void> => {
    const startTime = performance.now()
    console.log('start')

    const imagePath = 'testImage.png'
    const thresholdedImage = await getThresholdedEdgeDetectedImage(imagePath)
    console.log('starting triangulation')
    const pixelGrid = getPixelGrid(thresholdedImage)
    const imageEdgeVerticies = convertPixelGridToVerticies(pixelGrid)
    // add pixels to four corners to ensure whole image is triangulated
    const { width, height } = thresholdedImage
    imageEdgeVerticies.push({ x: 0, y: 0 })
    imageEdgeVerticies.push({ x: width, y: 0 })
    imageEdgeVerticies.push({ x: 0, y: height })
    imageEdgeVerticies.push({ x: width, y: height })

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
    })

    // for each point change the colour to that average value
    averagedPixelList.forEach((pixel) => {
        const { r, g, b } = pixel.colour
        originalImage.setPixelXY(pixel.x, pixel.y, [r, g, b])
    })

    await originalImage.save('triangulatedImage.png')

    console.log(`fin. Took ${performance.now() - startTime}ms / ${((performance.now() - startTime) / 1000) / 60} minutes to run`)
}

execute().catch((err) => {
    console.log(err)
})
