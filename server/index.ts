import express from 'express'
import cors from 'cors'
import multer from 'multer'
import {
    Status,
    getImageById,
    getMostRecentImage,
    initialiseDatabase,
    insertImage,
    updateImageStatus,
    updateImageToComplete,
    updateImageTriangulationProgress,
    updateTriangulationParams
} from './src/db'
import { Worker } from 'node:worker_threads'
import path from 'node:path'
import { FILES_DIRECTORY } from './src/config'

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

initialiseDatabase()
    .then(() => {
        console.log('Database initialised')
    })
    .catch((err) => {
        console.error('Error initialising database', { err })
    })

const storage = multer.diskStorage({
    destination: `${FILES_DIRECTORY}`,
    filename: async (req, file, callback) => {
        const path = `${Date.now()}-${file.originalname}`
        callback(null, path)
        await insertImage(path)
    }
})

const upload = multer({
    storage
})

app.get('/', async (req, res) => {
    res.json({ message: 'hello world', status: 200 })
})

app.post('/image', upload.single('image'), async (req, res) => {
    console.log('Image uploaded')
    const niblackK = parseFloat(req.body.niblackK)
    const blurRadius = parseInt(req.body.blurRadius)
    const { id, status } = await getMostRecentImage()
    await updateTriangulationParams(id, niblackK, blurRadius)
    res.json({ success: true, id, uploadStatus: status }).status(200)
})

app.put('/image/:id', async (req, res) => {
    const id = req.params.id
    await updateImageStatus(id, Status.PENDING)
    const image = await getImageById(id)
    const { originalPath, status, niblackK, blurRadius } = image

    const worker = new Worker('./src/worker.ts', {
        argv: [originalPath, id, niblackK, blurRadius],
        execArgv: ['--require', 'ts-node/register']
    })

    worker.on('message', async (progress) => {
        console.log('Updating progress to ', progress)
        const roundedProgress = Math.floor(progress)
        if (roundedProgress === 100) {
            await updateImageToComplete(id)
        } else {
            await updateImageTriangulationProgress(id, roundedProgress)
        }
    })

    res.json({ success: true, imageStatus: status }).status(200)
})

app.get('/image/:id/original', async (req, res) => {
    const imageId = req.params.id
    const image = await getImageById(imageId)
    const { originalPath } = image
    const absolutePath = path.join(__dirname, `${FILES_DIRECTORY}`, originalPath)

    res.sendFile(absolutePath)
})

app.get('/image/:id/triangulated', async (req, res) => {
    const imageId = req.params.id
    const image = await getImageById(imageId)
    const { triangulatedPath, status } = image

    if (status !== Status.COMPLETE) {
        return res.json({}).status(404)
    }

    const absolutePath = path.join(__dirname, `${FILES_DIRECTORY}`, triangulatedPath)

    res.sendFile(absolutePath)
})

app.get('/image/:id/status', async (req, res) => {
    const id = req.params.id
    const image = await getImageById(id)
    const { status, triangulationProgress } = image
    return res
        .json({ success: true, triangulationProgress, imageStatus: status })
        .status(200)
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
