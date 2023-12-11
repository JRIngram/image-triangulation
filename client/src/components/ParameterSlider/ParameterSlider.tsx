import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Box,
  Tooltip,
} from "@chakra-ui/react";
import { QuestionIcon } from "@chakra-ui/icons";

type Props = {
  defaultValue: number;
  max: number;
  min: number;
  name: string;
  tooltip: string;
  step: number;
  value: number;
  onChange: (value: number) => void;
};

export const ParameterSlider = ({
  defaultValue,
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
      <Tooltip label={tooltip} placement="bottom-start">
        <Text>
          {name} <QuestionIcon />:
        </Text>
      </Tooltip>
      <Box display="flex" flexDirection="row" gap="2rem">
        <Slider
          aria-label={`${name}-slider`}
          defaultValue={defaultValue}
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
