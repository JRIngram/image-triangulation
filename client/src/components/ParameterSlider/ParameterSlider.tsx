import React from "react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Box,
  Tooltip,
  Flex,
} from "@chakra-ui/react";
import { QuestionIcon } from "@chakra-ui/icons";

type Props = {
  max: number;
  min: number;
  name: string;
  tooltip: string;
  step: number;
  value: number;
  onChange: (value: number) => void;
};

export const ParameterSlider = ({
  max,
  min,
  name,
  tooltip,
  step,
  value,
  onChange,
}: Props) => {
  return (
    <Box padding="1rem">
      <Tooltip data-testid="tooltip" label={tooltip} placement="bottom-start">
        <Flex direction="row" gap="0.25rem" alignItems="center">
          <Text>{name}</Text> <QuestionIcon data-testid="question-icon" />:
        </Flex>
      </Tooltip>
      <Box display="flex" flexDirection="row" gap="2rem">
        <Slider
          aria-label={`${name} slider`}
          defaultValue={value}
          min={min}
          max={max}
          colorScheme="teal"
          step={step}
          onChange={(value) => onChange(value)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <Text>{value}</Text>
      </Box>
    </Box>
  );
};
