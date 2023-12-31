"use client";
import React from "react";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
} from "@chakra-ui/react";
import { getTriangulationStatus, postImage, triggerTriangulation } from "./api";

import { FileUpload } from "../components/FileUpload/FileUpload";
import { TriangulationStatus } from "../types";
import { StatusDisplay } from "../components/StatusDisplay/StatusDisplay";
import { BeforeAfterImages } from "../components/BeforeAfterImages/BeforeAfterImages";
import { ParameterSlider } from "../components/ParameterSlider/ParameterSlider";

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
  }, [triangulationStatus, imageId]);

  useEffect(() => {
    const pollServer = async () => {
      if (triangulationStatus === TriangulationStatus.PENDING) {
        const response = await getTriangulationStatus(imageId);
        const responseJson = await response.json();
        const { imageStatus } = responseJson;
        if (imageStatus !== TriangulationStatus.NOT_STARTED) {
          if (
            imageStatus === TriangulationStatus.COMPLETE ||
            imageStatus === TriangulationStatus.ERROR
          ) {
            setTrainagulationStatus(imageStatus);
          } else {
            setTriangulationProgress(responseJson.triangulationProgress);
            setTimeout(pollServer, 1000);
          }
        }
      }
    };

    pollServer();
  }, [triangulationStatus, imageId]);

  const fileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImageFile(event.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("niblackK", niblackK.toString());
      formData.append("blurRadius", blurRadius.toString());
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
    setBlurRadius(1);
    setNiblackK(1);
  };

  return (
    <main>
      <Card width="50%" margin="auto" colorScheme="teal">
        <CardHeader>
          <Heading>Image Triangulation</Heading>
        </CardHeader>
        <CardBody>
          {triangulationStatus === TriangulationStatus.NOT_STARTED ? (
            <Box background="#E6FFFA" padding="0.5rem">
              <FileUpload
                onChangeHandler={(event) => fileChangeHandler(event)}
              />
              <ParameterSlider
                name="Blur Radius"
                tooltip="The size of the blur in the pre-trinagulation processing steps. A higher number leads to less triangles."
                value={blurRadius}
                min={1}
                max={10}
                step={1}
                onChange={(val) => setBlurRadius(val)}
              />
              <ParameterSlider
                name="Niblack K"
                tooltip="Used to calculate the threshold in the pre-trinagulation processing steps. A higher number leads to less triangles."
                value={niblackK}
                min={-2}
                max={2}
                step={0.1}
                onChange={(val) => setNiblackK(val)}
              />
            </Box>
          ) : (
            <>
              {triangulationStatus !== TriangulationStatus.COMPLETE && (
                <StatusDisplay
                  status={triangulationStatus}
                  progress={triangulationProgress}
                />
              )}
              {triangulationStatus === TriangulationStatus.COMPLETE && (
                <BeforeAfterImages imageId={imageId} />
              )}
            </>
          )}
        </CardBody>
        <CardFooter>
          {triangulationStatus === TriangulationStatus.NOT_STARTED ? (
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
          ) : (
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
          )}
        </CardFooter>
      </Card>
      <Box width={"md"} marginX={"2rem"}></Box>
    </main>
  );
}
