export interface Vertex {
    x: number
    y: number
}

export interface Pixel {
    x: number
    y: number
    colour: {
        r: number
        g: number
        b: number
    }
}

export interface PixelInTriangle {
    pixel: Pixel
    triangleId: number
}


