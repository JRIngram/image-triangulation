import express from "express";
import cors from "cors";
import multer from "multer";
import {
  Status,
  getImageById,
  getMostRecentImage,
  initialiseDatabase,
  insertImage,
  updateImageStatus,
  updateImageToComplete,
  updateImageTriangulationProgress,
} from "./db";
import { Worker } from "node:worker_threads";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

initialiseDatabase();

const storage = multer.diskStorage({
  destination: "files/",
  filename: async (req, file, callback) => {
    const path = `${Date.now()}-${file.originalname}`;
    callback(null, path);
    await insertImage(path);
  },
});

const upload = multer({
  storage,
});

app.get("/", async (req, res) => {
  res.json({ message: "hello world", status: 200 });
});

app.post("/image", upload.single("image"), async (req, res) => {
  console.log("Image uploaded");
  const image = await getMostRecentImage();
  res
    .json({ success: true, id: image.id, uploadStatus: image.status })
    .status(200);
});

app.put("/image/:id", async (req, res) => {
  const id = req.params.id;
  await updateImageStatus(id, Status.PENDING);
  const image = await getImageById(id);
  const { originalPath, status } = image;

  const worker = new Worker("./worker.ts", {
    argv: ["testImage.png", id],
    execArgv: ["--require", "ts-node/register"],
  });

  worker.on("message", async (progress) => {
    console.log("Updating progress to ", progress);
    const roundedProgress = Math.floor(progress);
    if (roundedProgress === 100) {
      await updateImageToComplete(id);
    } else {
      await updateImageTriangulationProgress(id, roundedProgress);
    }
  });

  res.json({ success: true, imageStatus: status }).status(200);
});

app.get("/image/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id;
  const image = await getImageById(id);
  const { status, triangulationProgress, triangulatedPath } = image;
  if (status === Status.COMPLETE) {
    return res
      .json({ success: true, triangulatedPath, imageStatus: status })
      .status(200);
  }
  return res
    .json({ success: true, triangulationProgress, imageStatus: status })
    .status(200);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
