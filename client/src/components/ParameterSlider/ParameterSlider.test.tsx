import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ParameterSlider } from "./ParameterSlider";

describe("ParameterSlider", () => {
  beforeAll(() => {
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  afterAll(() => {
    vi.clearAllMocks();
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
