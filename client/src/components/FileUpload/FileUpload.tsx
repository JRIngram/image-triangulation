import React from 'react';
import { Input } from "@chakra-ui/react";
import { ChangeEvent } from "react";

type Props = {
  onChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const FileUpload = ({ onChangeHandler }: Props) => {
  return (
    <Input
      aria-label='file upload input'
      variant="filled"
      type="file"
      accept=".png, .jpg, .jpeg"
      size="md"
      onChange={(event) => onChangeHandler(event)}
      marginY="1rem"
    />
  );
};
