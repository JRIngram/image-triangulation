"use client";
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      console.log("no file selected");
      return;
    }
    console.log(event.target.files[0]);
    setImageFile(event.target.files[0]);
  };

  const fileUpload = () => {
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      fetch("http://localhost:3001/", {
        method: "post",
        body: formData,
      })
        .then(() => {
          console.log("posted!");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("Image is null");
    }
  };

  return (
    <main className={styles.main}>
      <h1>Image Triangulation</h1>
      <input
        type="file"
        id="image-upload"
        name="filename"
        accept=".png, .jpg, .jpeg"
        onChange={(event) => fileChangeHandler(event)}
      />
      <button onClick={() => fileUpload()}>Upload</button>
      <p>{imageFile?.name}</p>
    </main>
  );
}
