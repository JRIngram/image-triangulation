import { bowyerWatson } from '../triangulation'
import {
    getThresholdedEdgeDetectedImage,
    getPixelGrid,
    convertPixelGridToVerticies,
    loadImage,
    removeProcessingPipelineImages
} from './imageProcessing'
import type { Vertex, Pixel, PixelInTriangle } from '../types/types'
import { updateImageTriangulationPath } from '../db'
import { FILES_DIRECTORY } from '../config'

export const triangulateImage = async (
    id: string,
    imagePath: string,
    niblackK: number,
    blurRadius: number,
    updateProgressCallback: (progress: number) => Promise<void> | void
): Promise<void> => {
    console.log('params', { niblackK, blurRadius })
    const startTime = performance.now()
    console.log('start')

    const fullPath = `${FILES_DIRECTORY}/${imagePath}`

    const thresholdedImage = await getThresholdedEdgeDetectedImage(id, fullPath, niblackK, blurRadius)
    console.log('starting triangulation')
    console.log('getting pixel grid')
    const pixelGrid = getPixelGrid(thresholdedImage)
    console.log('Converting to verticies')
    const imageEdgeVerticies = convertPixelGridToVerticies(pixelGrid)
    // add pixels to four corners to ensure whole image is triangulated
    const { width, height } = thresholdedImage
    imageEdgeVerticies.push({ x: 0, y: 0 })
    imageEdgeVerticies.push({ x: width, y: 0 })
    imageEdgeVerticies.push({ x: 0, y: height })
    imageEdgeVerticies.push({ x: width, y: height })
    await updateProgressCallback(10)
    console.log('performing bowyer-watson')
    const edgeDetectedTriangulation = bowyerWatson(imageEdgeVerticies)
    const imageEdgeVerticiesLength = imageEdgeVerticies.length
    const totalStepsToProcess =
    imageEdgeVerticiesLength + edgeDetectedTriangulation.length

    await updateProgressCallback(
        Math.floor((imageEdgeVerticies.length / totalStepsToProcess) * 100)
    )
    console.log('applying trinagulation to image')
    const originalImage = await loadImage(fullPath)
    const originalImagePixelGrid = getPixelGrid(originalImage)

    // create averagedPixelList = []
    // for each triangle, determine if all points are within the triangle
    // calculate the average R,G and B value for each point within the triangle from the original image
    // add average RGB to a list of pixels with the coords
    const pixelCoordinateGrid: PixelInTriangle[] = originalImagePixelGrid.flatMap(
        (pixelRow, y) => {
            return pixelRow.map((pixel, x) => {
                const coordinatedPixel = {
                    x,
                    y,
                    colour: {
                        r: pixel[0],
                        g: pixel[1],
                        b: pixel[2]
                    }
                }

                return {
                    pixel: coordinatedPixel,
                    triangleId: -1
                }
            })
        }
    )

    const averagedPixelList: Pixel[] = []
    console.log('triangle count: ', edgeDetectedTriangulation.length)

    edgeDetectedTriangulation.forEach(async (triangle, triangleMeshIndex) => {
        if (triangleMeshIndex % 100 === 0) {
            const progress = triangleMeshIndex + imageEdgeVerticiesLength
            const progressPercent = (progress / totalStepsToProcess) * 100
            await updateProgressCallback(progressPercent)
        }

        if (triangleMeshIndex % 10 === 0) {
            console.log(
                `triangle ${triangleMeshIndex} of ${edgeDetectedTriangulation.length}`
            )
        }
        const summedRGBValue: number[] = [0, 0, 0]
        const pixelCoordinatesInTriangle: Vertex[] = []

        pixelCoordinateGrid.forEach((pixelWithTriangleId) => {
            const { triangleId } = pixelWithTriangleId
            if (triangleId === -1) {
                const { pixel } = pixelWithTriangleId
                const { x, y } = pixel
                const pixelCoorindates = { x, y }
                const pixelIsInTriangle =
                    triangle.pointLiesWithinTriangle(pixelCoorindates)

                if (pixelIsInTriangle) {
                    pixelCoordinatesInTriangle.push(pixelCoorindates)
                    pixelWithTriangleId.triangleId = triangleMeshIndex
                    const { colour } = pixel

                    summedRGBValue[0] += colour.r
                    summedRGBValue[1] += colour.g
                    summedRGBValue[2] += colour.b
                }
            }
        })

        const pixelsInTriangleCount = pixelCoordinatesInTriangle.length
        const averageRGBValue = {
            r: summedRGBValue[0] / pixelsInTriangleCount,
            g: summedRGBValue[1] / pixelsInTriangleCount,
            b: summedRGBValue[2] / pixelsInTriangleCount
        }

        const averagedPixelsInTriangle: Pixel[] = pixelCoordinatesInTriangle.map(
            (pixel) => {
                return {
                    x: pixel.x,
                    y: pixel.y,
                    colour: averageRGBValue
                }
            }
        )

        averagedPixelList.push(...averagedPixelsInTriangle)
    })

    // for each point change the colour to that average value
    averagedPixelList.forEach((pixel) => {
        const { r, g, b } = pixel.colour
        originalImage.setPixelXY(pixel.x, pixel.y, [r, g, b])
    })

    const triangulationPath = `${id}-triangulated.png`
    await originalImage.save(`${FILES_DIRECTORY}/${triangulationPath}`)
    console.log('saved')
    await updateImageTriangulationPath(id, triangulationPath)
    console.log('updated')
    removeProcessingPipelineImages(id)

    console.log(
        `fin. Took ${performance.now() - startTime}ms / ${
            (performance.now() - startTime) / 1000 / 60
        } minutes to run`
    )

    await updateProgressCallback(100)
}
