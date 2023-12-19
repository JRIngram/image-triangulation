import { triangulateImage } from './imageProcessing/imageTriangulation'
//
import { parentPort } from 'node:worker_threads'

const path = process.argv[2]
const id = process.argv[3]
const niblackK = parseFloat(process.argv[4])
const blurRadius = parseInt(process.argv[5])

triangulateImage(id, path, niblackK, blurRadius, async (progress: number) => {
    console.log('Updating progress', progress)
    if (parentPort === null) {
        throw new Error('parentPort is undefined')
    }
    parentPort.postMessage(`${progress}`)
}).catch((err) => { console.error('Error triangulating image', { err }) })
