import sqlite3 from "sqlite3";
import { open } from "sqlite";
import type { Database } from "sqlite";

export enum Status {
  UPLOADED = "UPLOADED",
  PENDING = "PENDING",
  ERROR = "ERROR",
  COMPLETE = "COMPLETE",
}

type Image = {
  id: number;
  originalPath: string;
  triangulatedPath: string;
  status: Status;
  triangulationProgress: number;
};

export const openDb = async () => {
  return await open<sqlite3.Database, sqlite3.Statement>({
    filename: "tmp/database.db",
    driver: sqlite3.Database,
  });
};

export const closeDb = async (
  db: Database<sqlite3.Database, sqlite3.Statement>
) => {
  await db.close();
};

export const initialiseDatabase = async () => {
  const db = await openDb();
  await db.exec(`CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    originalPath TEXT NOT NUll,
    triangulatedPath TEXT,
    status TEXT NOT NULL,
    triangulationProgress INTEGER NOT NULL)`);
  await db.close();
};

export const insertImage = async (filePath: string) => {
  const db = await openDb();

  await db.run(
    `INSERT INTO images(originalPath, status, triangulationProgress) VALUES (?, 'UPLOADED', 0)`,
    filePath
  );

  await db.close();
};

export const getMostRecentImage = async () => {
  let latestImage = {
    id: -1,
    status: Status.ERROR,
  };

  const db = await openDb();

  const res = await db.get(
    "SELECT id, status FROM images ORDER BY id DESC LIMIT 1"
  );
  console.log(res);

  await db.close();

  latestImage = {
    id: res.id,
    status: res.status,
  };

  return latestImage;
};

export const getImageById = async (imageId: string) => {
  const db = await openDb();

  const res = await db.get(`SELECT * FROM images WHERE id = ?`, [imageId]);

  await db.close();

  const { id, originalPath, triangulatedPath, status, triangulationProgress } = res;

  const image: Image = {
    id,
    originalPath,
    triangulatedPath,
    status,
    triangulationProgress,
  };

  return image;
};

export const updateImageStatus = async (id: string, status: Status) => {
  const db = await openDb();
  await db.run(`UPDATE images SET status = ? WHERE id = ?`, [status, id]);
  await db.close();
}

export const updateImageTriangulationProgress = async (imageId: string, progress: number) => {
  const db = await openDb();
  await db.get(`UPDATE images SET triangulationProgress = ? WHERE id = ?`, [progress, imageId]);
  await db.close();
}

export const updateImageToComplete = async (imageId: string) => {
  const db = await openDb();
  await db.get(`UPDATE images SET triangulationProgress = 100, status = ? WHERE id = ?`, [Status.COMPLETE, imageId]);
  await db.close();
}