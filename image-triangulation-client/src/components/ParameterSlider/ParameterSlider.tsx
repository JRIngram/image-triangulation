import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Text,
  Box,
} from "@chakra-ui/react";

type Props = {
  defaultValue: number;
  max: number;
  min: number;
  name: string;
  step: number;
  value: number;
  onChange: (value: number) => void;
};

export const ParameterSlider = ({
  defaultValue,
  max,
  min,
  name,
  step,
  value,
  onChange,
}: Props) => {
  return (
    <Box padding="1rem">
      <Text>{name}:</Text>
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
