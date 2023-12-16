import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { ParameterSlider } from "./ParameterSlider";
import userEvent from "@testing-library/user-event";

describe("ParameterSlider", () => {
  beforeAll(() => {
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it.each([0, 50, 100])(
    "renders a slider with the text label showing the value: %d",
    (value: number) => {
      render(
        <ParameterSlider
          min={0}
          max={50}
          name="test"
          tooltip="test tooltip"
          step={1}
          value={value}
          onChange={() => {}}
        />,
      );

      const slider = screen.getByLabelText("test slider");
      const name = screen.getByText("test");
      const valueText = screen.getByText(value);
      expect(slider).toBeVisible();
      expect(name).toBeVisible();
      expect(valueText).toBeVisible();
    },
  );
});
