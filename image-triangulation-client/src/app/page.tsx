"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

import { FileUpload } from "@/components/FileUpload/FileUpload";
import { TriangulationStatus } from "../types";
import { TriangulationProgress } from "@/components/TriangulationProgress/TriangulationProgress";
import { getTriangulationStatus, postImage, triggerTriangulation } from "./api";
import { BeforeAfterImages } from "@/components/BeforeAfterImages/BeforeAfterImages";
// import { ParameterSlider } from "@/components/ParameterSlider/ParameterSlider";

export default function Home() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [triangulationStatus, setTrainagulationStatus] =
    useState<TriangulationStatus>(TriangulationStatus.NOT_STARTED);
  const [imageId, setImageId] = useState<number>(-1);
  const [triangulationProgress, setTriangulationProgress] = useState<number>(0);
  const [blurRadius, setBlurRadius] = useState<number>(1);
  const [niblackK, setNiblackK] = useState<number>(1);

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
    if (event.target.files) {
      setImageFile(event.target.files[0]);
    }
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
    }
  };

  const resetState = () => {
    setImageFile(null);
    setTrainagulationStatus(TriangulationStatus.NOT_STARTED);
    setImageId(-1);
    setTriangulationProgress(0);
  };

  return (
    <main className={styles.appContainer}>
      <Box width={"md"} marginX={"2rem"}>
        <Heading>Image Triangulation</Heading>
        {triangulationStatus === TriangulationStatus.NOT_STARTED ? (
          <>
            <Text>Please select a .jpg or .png image to upload.</Text>
            <Flex width="100%" height="4rem" justifyContent="center">
              <FileUpload
                onChangeHandler={(event) => fileChangeHandler(event)}
              />
            </Flex>
            <ParameterSlider
              name="blurRadius"
              value={blurRadius}
              min={1}
              max={10}
              defaultValue={1}
              step={1}
              onChange={(val) => setBlurRadius(val)}
            />
            <ParameterSlider
              name="Niblack K"
              value={niblackK}
              min={-2}
              max={2}
              defaultValue={0}
              step={0.1}
              onChange={(val) => setNiblackK(val)}
            />
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
            {triangulationStatus !== TriangulationStatus.COMPLETE && (
              <TriangulationProgress
                status={triangulationStatus}
                progress={triangulationProgress}
              />
            )}
            {triangulationStatus === TriangulationStatus.COMPLETE && (
              <BeforeAfterImages imageId={imageId} />
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
