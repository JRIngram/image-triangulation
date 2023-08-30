import { Image } from 'image-js'
import type { Vertex } from './types'

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

export const blurImage = async (image: Image): Promise<Image> => {
    const blurredImage = image.blurFilter()
    await blurredImage.save('blurred.png')
    return blurredImage
}

export const greyscaleImage = async (image: Image): Promise<Image> => {
    const greyImage = image.grey()
    await greyImage.save('grey.png')

    return greyImage
}

export const edgeDetect = async (image: Image): Promise<Image> => {
    try {
        const edgeDetectedImage = image.sobelFilter()
        await edgeDetectedImage.save('edgeDetectedImage.png')
        return edgeDetectedImage
    } catch (err) {
        console.log('error during edge detection')
        console.log(err)
        throw new Error('Error during image pipeline, during edge detection step')
    }
}

export const manualThreshold = async (image: Image): Promise<Image> => {
    // TODO add smart thresholding thresholding
    //      threshholding caused issues with getting image pixel data
    // const threshold = edgeDetectedImage.getThreshold()
    // const thesholdedImage = edgeDetectedImage.mask({
    //     algorithm: 'threshold',
    //     threshold
    // })
    const threshold = 128 // arbitrary number
    const { width, height } = image
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const pixel = image.getPixelXY(x, y)
            const thresholdedPixel = pixel[0] < threshold ? 0 : 255
            image.setPixelXY(x, y, [thresholdedPixel])
        }
    }
    await image.save('thresholdedImage.png')
    return image
}

export const getEdgeDetectedPixelGrid = async (path: string): Promise<Image> => {
    const image = await loadImage(path)
    const blurredImage = await blurImage(image)
    const greyedImage = await greyscaleImage(blurredImage)
    const thesholdedImage = await edgeDetect(greyedImage)
    return thesholdedImage
}

export const convertPixelGridToVerticies = (pixelGrid: number[][][]): Vertex[] => {
    const verticies: Vertex[] = []
    pixelGrid.forEach((pixelRow, y) => {
        pixelRow.forEach((pixel, x) => {
            if (pixel[0] > 0) {
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
