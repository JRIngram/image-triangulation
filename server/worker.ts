const { parentPort } = require("node:worker_threads")
import { triangulateImage } from "./imageTriangulation"

const path = process.argv[2]
const id = process.argv[3]
triangulateImage(path, async (progress: number) => {
    console.log("Updating progress", progress)
    parentPort.postMessage(`${progress}`)
})