import React from "react";
import { Spinner, Text } from "@chakra-ui/react";
import { TriangulationStatus } from "../..//types";
import { TriangulationProgress } from "../TriangulationProgress/TriangulationProgress";

type Props = {
  status: TriangulationStatus;
  progress?: number;
};

export const StatusDisplay = ({ status, progress }: Props) => {
  switch (status) {
    case TriangulationStatus.UPLOADING:
    case TriangulationStatus.UPLOADED:
      return (
        <Spinner
          data-testid="loading-spinner"
          emptyColor="gray.200"
          color="teal.300"
          marginY="1rem"
        />
      );
    case TriangulationStatus.PENDING:
      if (progress) {
        return <TriangulationProgress progress={progress} />;
      }
      return <></>;
    case TriangulationStatus.COMPLETE:
      return <Text>Triangulation Completed</Text>;
    default:
      return <Text>Unexpected error during triangulation</Text>;
  }
};
