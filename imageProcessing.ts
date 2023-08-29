import { Image } from 'image-js'

export const loadImage = async (path: string): Promise<Image> => {
    const image = await Image.load(path)
    console.log(getPixelGrid(image))
    return image
}

const getPixelGrid = (image: Image): number[][][] => {
    const { height, width } = image;
    const pixelArray = image.getPixelsArray()
    const pixelGrid = []
    for (let i = 0; i < height; i++) {
        const pixelRow = []
        for (let j = 0; j < width; j++) {
            pixelRow.push(pixelArray[i * j])
        }
        pixelGrid.push(pixelRow)
    }

    return pixelGrid
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
        const threshold = edgeDetectedImage.getThreshold()
        const thesholdedImage = edgeDetectedImage.mask({
            algorithm: 'threshold',
            threshold
        })
        await thesholdedImage.save('thresholdedImage.png')
        return thesholdedImage
    } catch (err) {
        console.log('error during edge detection')
        console.log(err)
        throw new Error('Error during image pipeline, during edge detection step')
    }
}

export const getEdgeDetectedPixelGrid = async (path: string): Promise<number[][][]> => {
    const image = await loadImage(path)
    const greyedImage = await greyscaleImage(image)
    console.log(getPixelGrid(greyedImage))
    const edgeDetectedImage = await edgeDetect(greyedImage)
    const pixelGrid = getPixelGrid(edgeDetectedImage)
    return pixelGrid
}
