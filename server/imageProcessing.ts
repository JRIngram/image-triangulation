import { Image } from 'image-js'
import type { Vertex } from './types'
import { unlinkSync } from 'fs'
import { FILES_DIRECTORY } from './config'

export const loadImage = async (path: string): Promise<Image> => {
    const image = await Image.load(path)
    return image
}

export const getPixelGrid = (image: Image): number[][][] => {
    const { width, height } = image
    const pixelGrid = []
    for (let y = 0; y < height; y++) {
        const pixelRow: number[][] = []
        for (let x = 0; x < width; x++) {
            const pixel = image.getPixelXY(x, y)
            pixelRow.push(pixel)
        }
        pixelGrid.push(pixelRow)
    }

    return pixelGrid
}

export const blurImage = async (
    image: Image,
    id: string,
    blurRadius: number
): Promise<Image> => {
    const blurredImage = image.blurFilter({ radius: blurRadius })
    await blurredImage.save(`${FILES_DIRECTORY}/${id}-blurred.png`)
    return blurredImage
}

export const greyscaleImage = async (
    image: Image,
    id: string
): Promise<Image> => {
    const greyImage = image.grey()
    await greyImage.save(`${FILES_DIRECTORY}/${id}-grey.png`)

    return greyImage
}

export const edgeDetect = async (image: Image, id: string): Promise<Image> => {
    try {
        const edgeDetectedImage = image.sobelFilter()
        await edgeDetectedImage.save(`${FILES_DIRECTORY}/${id}-edgeDetectedImage.png`)
        return edgeDetectedImage
    } catch (err) {
        console.log('error during edge detection')
        console.log(err)
        throw new Error('Error during image pipeline, during edge detection step')
    }
}

export const niblackThreshold = async (
    greyscaledImage: Image,
    id: string,
    k: number
): Promise<Image> => {
    const t1 = performance.now()
    console.log('Starting niblack thresholding')
    const { height, width } = greyscaledImage
    const pixelGrid = getPixelGrid(greyscaledImage)
    const getNeighbouringPixelsAtXY = (
        x: number,
        y: number,
        neighbourhoodSize: number
    ): number[] => {
        const pixelNeighbourhood: number[][] = []
        const yRange = [y - neighbourhoodSize, y + neighbourhoodSize]
        const xRange = [x - neighbourhoodSize, x + neighbourhoodSize]
        for (let y = yRange[0]; y < yRange[1]; y++) {
            const pixelRow: number[] = []
            for (let x = xRange[0]; x <= xRange[1]; x++) {
                if (
                    xRange[0] < 0 ||
          yRange[0] < 0 ||
          xRange[1] >= width ||
          yRange[1] >= height
                ) {
                    pixelRow.push(0)
                } else {
                    pixelRow.push(pixelGrid[y][x][0])
                }
            }

            pixelNeighbourhood.push(pixelRow)
        }

        return pixelNeighbourhood.flat()
    }

    pixelGrid.forEach((pixelRow, y) => {
        pixelRow.forEach((pixel, x) => {
            const neighbourhood = getNeighbouringPixelsAtXY(x, y, 3)
            const summedIntensity = neighbourhood.reduce((sum, pixel) => sum + pixel) // changed to appease linter
            const meanIntensity = summedIntensity / neighbourhood.length
            const standardDeviation = (): number => {
                const variances = neighbourhood.map((pixel) =>
                    Math.pow(pixel - meanIntensity, 2)
                )
                const summedVariances = variances.reduce(
                    (sum, variance) => sum + variance
                ) // changed to appease linter
                const variance = summedVariances / neighbourhood.length
                const standardDeviation = Math.sqrt(variance)
                return standardDeviation
            }

            const threshold = meanIntensity + k * standardDeviation()

            // in niblack, below threshold is considered foreground
            if (pixel[0] < threshold) {
                greyscaledImage.setPixelXY(x, y, [255, 255, 255])
            } else {
                greyscaledImage.setPixelXY(x, y, [0, 0, 0])
            }
        })
    })

    await greyscaledImage.save(`${FILES_DIRECTORY}/${id}-niblackedImage.png`)
    const t2 = performance.now()
    const timeTaken = t2 - t1
    console.log(
        `niblack complete. Time taken: ${timeTaken}ms OR ${
            timeTaken / 1000 / 60
        }mins`
    )
    return greyscaledImage
}

export const getThresholdedEdgeDetectedImage = async (
    id: string,
    path: string,
    niblackK: number,
    blurRadius: number
): Promise<Image> => {
    const image = await loadImage(path)
    const blurredImage = await blurImage(image, id, blurRadius)
    const greyedImage = await greyscaleImage(blurredImage, id)
    const edgeDetectedImage = await edgeDetect(greyedImage, id)
    const thresholdedImage = await niblackThreshold(
        edgeDetectedImage,
        id,
        niblackK
    )
    console.log('initial pipeline complete')
    return thresholdedImage
}

export const convertPixelGridToVerticies = (
    pixelGrid: number[][][]
): Vertex[] => {
    const verticies: Vertex[] = []
    pixelGrid.forEach((pixelRow, y) => {
        pixelRow.forEach((pixel, x) => {
            if (pixel[0] === 0) {
                const vertex: Vertex = {
                    x,
                    y
                }
                verticies.push(vertex)
            }
        })
    })

    return verticies
}

export const removeProcessingPipelineImages = (id: string): void => {
    unlinkSync(`${FILES_DIRECTORY}/${id}-blurred.png`)
    unlinkSync(`${FILES_DIRECTORY}/${id}-grey.png`)
    unlinkSync(`${FILES_DIRECTORY}/${id}-edgeDetectedImage.png`)
    unlinkSync(`${FILES_DIRECTORY}/${id}-niblackedImage.png`)
}
