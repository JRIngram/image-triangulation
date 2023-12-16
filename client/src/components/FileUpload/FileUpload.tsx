import React from "react";
import { Flex, Input, Text } from "@chakra-ui/react";
import { ChangeEvent } from "react";

type Props = {
  onChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const FileUpload = ({ onChangeHandler }: Props) => {
  return (
    <>
      <Text>Please select a .jpg or .png image to upload:</Text>
      <Flex width="100%" height="4rem" justifyContent="center">
        <Input
          aria-label="file upload input"
          variant="filled"
          type="file"
          accept=".png, .jpg, .jpeg"
          size="md"
          onChange={(event) => onChangeHandler(event)}
          marginY="1rem"
        />
      </Flex>
    </>
  );
};
