import { Divider, Progress, Spinner, Text } from "@chakra-ui/react";
import { TriangulationStatus } from "@/types";

type Props = {
  status: TriangulationStatus;
  progress?: number;
};

export const TriangulationProgress = ({ status, progress }: Props) => {
  switch (status) {
    case TriangulationStatus.UPLOADING:
      return <Spinner emptyColor="gray.200" color="teal.300" marginY="1rem" />;
    case TriangulationStatus.UPLOADED:
      return <Text>Upload Completed</Text>;
    case TriangulationStatus.PENDING:
      return (
        <>
          <Text>This process may take a long time to complete.</Text>
          <Progress
            colorScheme="teal"
            width={"100%"}
            value={progress}
            hasStripe
            isAnimated
          />
        </>
      );
    default:
      return <Text>Triangulation Completed</Text>;
  }
};
