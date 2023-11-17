import express from "express";
import cors from "cors";
import multer from "multer";
import { triangulateImage } from "./imageTriangulation";
import { getImageById, getMostRecentImage, initialiseDatabase, insertImage } from "./db";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

initialiseDatabase()

const storage = multer.diskStorage({
  destination: "files/",
  filename: async (req, file, callback) => {
    const path = `${Date.now()}-${file.originalname}`;
    callback(null, path);
    await insertImage(path)
  },
});

const upload = multer({
  storage,
});

app.get("/", async (req, res) => {
  res.json({ message: 'hello world', status: 200 })
});

// TODO change to /image
app.post("/", upload.single("image"), async (req, res) => {
  console.log('Image uploaded');
  const image = await getMostRecentImage()
  res.json({ success: true, id: image.id, uploadStatus: image.status }).status(200);
});

app.get("/image/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id
  const image = await getImageById(id);
  console.log(image);
  const { originalPath } = image;

  await triangulateImage(originalPath).catch((err) => {
    console.log(err);
  });
  res.json({ success: true }).status(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});