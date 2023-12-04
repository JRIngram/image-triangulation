import { Divider, Progress, Spinner, Text } from "@chakra-ui/react";
import { TriangulationStatus } from "@/types";

type Props = {
  status: TriangulationStatus;
  progress?: number;
};

export const TriangulationProgress = ({ status, progress }: Props) => {
  switch (status) {
    case TriangulationStatus.UPLOADING:
    case TriangulationStatus.UPLOADED:
      return <Spinner emptyColor="gray.200" color="teal.300" marginY="1rem" />;
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
    case TriangulationStatus.COMPLETE:
      return <Text>Triangulation Completed</Text>;
    default:
      return <Text>Unexpected error during triangulation</Text>;
  }
};