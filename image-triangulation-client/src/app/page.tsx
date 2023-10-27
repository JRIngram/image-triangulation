"use client";
import { useState } from "react";
import styles from "./page.module.css";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";

import { FileUpload } from "@/components/FileUpload/FileUpload";

export default function Home() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      console.log("no file selected");
      return;
    }
    console.log(event.target.files[0]);
    setImageFile(event.target.files[0]);
  };

  const fileUpload = async () => {
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      setIsUploading(true);
      await fetch("http://localhost:3001/", {
        method: "post",
        body: formData,
      });
      setIsUploading(false);
    } else {
      console.log("Image is null");
    }
  };

  return (
    <main>
      <Box width={"md"} marginX={"2rem"}>
        <Heading>Image Triangulation</Heading>
        {!imageFile && (
          <Text>Please select a .jpg or .png image to upload.</Text>
        )}
        <Flex width="100%" height="4rem" justifyContent="center">
          {!isUploading ? (
            <FileUpload onChangeHandler={(event) => fileChangeHandler(event)} />
          ) : (
            <Spinner emptyColor="gray.200" color="teal.300" marginY="1rem" />
          )}
        </Flex>
        <Button
          width={"100%"}
          background="teal.500"
          color={"white"}
          onClick={() => fileUpload()}
          isDisabled={!imageFile ? true : false}
        >
          Upload
        </Button>
      </Box>
    </main>
  );
}
