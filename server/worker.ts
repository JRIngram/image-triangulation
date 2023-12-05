const { parentPort } = require("node:worker_threads")
import { triangulateImage } from "./imageTriangulation"

const path = process.argv[2]
const id = process.argv[3]
const niblackK = parseFloat(process.argv[4]);
const blurRadius = parseInt(process.argv[5]);

triangulateImage(id, path, niblackK, blurRadius, async (progress: number) => {
    console.log("Updating progress", progress)
    parentPort.postMessage(`${progress}`)
})