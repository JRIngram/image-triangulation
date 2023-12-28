import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import Home from "./page";

describe("Home Page", () => {
  beforeAll(() => {
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  it("renders default home page", () => {
    render(<Home />);
    const title = screen.getByText("Image Triangulation");
    const fileUpload = screen.getByLabelText("file upload input");
    const blurRadiusSlider = screen.getByLabelText("Niblack K slider");
    const niblackSlider = screen.getByLabelText("Blur Radius slider");
    const uploadButton = screen.getByRole("button", { name: "Upload" });

    expect(title).toBeVisible();
    expect(fileUpload).toBeVisible();
    expect(niblackSlider).toBeVisible();
    expect(blurRadiusSlider).toBeVisible();
    expect(uploadButton).toBeVisible();
  });
});
