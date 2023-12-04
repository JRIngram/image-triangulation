"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

import { FileUpload } from "@/components/FileUpload/FileUpload";
import { TriangulationStatus } from "../types";
import { TriangulationProgress } from "@/components/TriangulationProgress/TriangulationProgress";
import {
  getImage,
  getTriangulationStatus,
  postImage,
  triggerTriangulation,
} from "./api";
import { ImageError } from "next/dist/server/image-optimizer";

export default function Home() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [triangulationStatus, setTrainagulationStatus] =
    useState<TriangulationStatus>(TriangulationStatus.NOT_STARTED);
  const [imageId, setImageId] = useState<number>(-1);
  const [triangulationProgress, setTriangulationProgress] = useState<number>(0);

  useEffect(() => {
    if (triangulationStatus === TriangulationStatus.UPLOADED) {
      triggerTriangulation(imageId);
      setTrainagulationStatus(TriangulationStatus.PENDING);
    }
  }, [triangulationStatus]);

  useEffect(() => {
    const pollServer = async () => {
      if (triangulationStatus === TriangulationStatus.PENDING) {
        const response = await getTriangulationStatus(imageId);
        const responseJson = await response.json();
        const { imageStatus } = responseJson;
        if (
          imageStatus === TriangulationStatus.COMPLETE ||
          imageStatus === TriangulationStatus.ERROR
        ) {
          setTrainagulationStatus(imageStatus);

          if (imageStatus === TriangulationStatus.COMPLETE) {
            console.log("yay complete");
            // display image
            await getImage(imageId);
          }
        } else {
          setTriangulationProgress(responseJson.triangulationProgress);
          setTimeout(pollServer, 5000);
        }
      }
    };

    pollServer();
  }, [triangulationStatus]);

  const fileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      console.log("no file selected");
      return;
    }
    console.log(event.target.files[0]);
    setImageFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      setTrainagulationStatus(TriangulationStatus.UPLOADING);
      try {
        const response = await postImage(formData);
        const responseJson = await response.json();
        setImageId(responseJson.id);
        setTrainagulationStatus(TriangulationStatus.UPLOADED);
      } catch (err) {
        setTrainagulationStatus(TriangulationStatus.ERROR);
      }
    } else {
      console.log("Image is null");
    }
  };

  const resetState = () => {
    setImageFile(null);
    setTrainagulationStatus(TriangulationStatus.NOT_STARTED);
    setImageId(-1);
    setTriangulationProgress(0);
  };

  return (
    <main>
      <Box width={"md"} marginX={"2rem"}>
        <Heading>Image Triangulation</Heading>
        {!imageFile && (
          <Text>Please select a .jpg or .png image to upload.</Text>
        )}

        {triangulationStatus === TriangulationStatus.NOT_STARTED ? (
          <>
            <Flex width="100%" height="4rem" justifyContent="center">
              <FileUpload
                onChangeHandler={(event) => fileChangeHandler(event)}
              />
            </Flex>
            <Button
              marginY="4"
              width={"100%"}
              background="teal.500"
              color={"white"}
              onClick={() => uploadFile()}
              isDisabled={!imageFile ? true : false}
            >
              Upload
            </Button>
          </>
        ) : (
          <>
            <TriangulationProgress
              status={triangulationStatus}
              progress={triangulationProgress}
            />
            {triangulationStatus === TriangulationStatus.COMPLETE && (
              <Image
                src={`http://localhost:3001/image/${imageId}`}
                alt="The triangulated image"
                width={500}
                height={500}
              />
            )}
            <Button
              marginY="4"
              width={"100%"}
              background="teal.500"
              color={"white"}
              onClick={() => resetState()}
              isDisabled={!imageFile ? true : false}
            >
              Reset
            </Button>
          </>
        )}
      </Box>
    </main>
  );
}
