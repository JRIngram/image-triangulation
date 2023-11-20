"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

import { FileUpload } from "@/components/FileUpload/FileUpload";
import { TriangulationStatus } from "../types";
import { TriangulationProgress } from "@/components/TriangulationProgress/TriangulationProgress";
import { getTriangulationStatus, postImage, triggerTriangulation } from "./api";

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

  const fileUpload = async () => {
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
              onClick={() => fileUpload()}
              isDisabled={!imageFile ? true : false}
            >
              Upload
            </Button>
          </>
        ) : (
          <TriangulationProgress
            status={triangulationStatus}
            progress={triangulationProgress}
          />
        )}
      </Box>
    </main>
  );
}
