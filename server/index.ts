import express from 'express'
import cors from 'cors'
import multer from 'multer';
import { triangulateImage } from './imageTriangulation'

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

const storage = multer.diskStorage({
    destination: 'files/',
    filename: (
        req,
        file,
        callback
    ) => {
        callback(null, file.originalname)
    }
})

const upload = multer({
    storage
})

app.get('/', (req, res) => {
    console.log('request got!')
    console.log(`file name: ${req.body}`)
    triangulateImage().catch((err) => {
        console.log(err)
    })
})

app.post('/', upload.single('image'), (req, res) => {
    console.log('request got')
    console.log(`file name: ${JSON.stringify(req.file)}`)
    res.json({ success: true }).status(200)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
