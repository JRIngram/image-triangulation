import React from 'react';
import { Flex, Progress, Text } from "@chakra-ui/react";

type Props = {
  progress: number;
};

export const TriangulationProgress = ({ progress }: Props) => 
  <>
    <Text>This process may take a long time to complete.</Text>
    <Flex
      display="flex"
      flexDirection="column"
      alignItems="center"
      border={"1px solid #2C7A7B"}
      padding="0.5rem"
    >
      <Text>{progress}%</Text>
      <Progress
        colorScheme="teal"
        width={"100%"}
        value={progress}
        hasStripe
        isAnimated
      />
    </Flex>
  </>;

