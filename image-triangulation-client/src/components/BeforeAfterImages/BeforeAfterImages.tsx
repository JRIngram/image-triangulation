import { Text } from "@chakra-ui/react";
import Image from "next/image";

type Props = {
  imageId: number;
};

export const BeforeAfterImages = ({ imageId }: Props) => {
  return (
    <>
      <Text>Original Image:</Text>
      <Image
        src={`http://localhost:3001/image/${imageId}/original`}
        alt="The original image"
        width={500}
        height={500}
      />
      <Text>Triangulated Image:</Text>
      <Image
        src={`http://localhost:3001/image/${imageId}/triangulated`}
        alt="The triangulated image"
        width={500}
        height={500}
      />
    </>
  );
};
