import React from "react";
import { describe, it, expect } from 'vitest'
import { render, screen } from "@testing-library/react";
import { BeforeAfterImages } from "./BeforeAfterImages";

describe("BeforeAfterImages", () => {
  it("Renders Images and Labels", () => {
    render(<BeforeAfterImages imageId={0} />);
    const beforeLabel = screen.getByText("Original Image:");
    const beforeImage = screen.getByTestId("before-image");
    const afterLabel = screen.getByText("Triangulated Image:");
    const afterImage = screen.getByTestId("after-image");
    expect(beforeLabel).toBeVisible();
    expect(beforeImage).toBeVisible();
    expect(afterLabel).toBeVisible();
    expect(afterImage).toBeVisible();
  });
});
