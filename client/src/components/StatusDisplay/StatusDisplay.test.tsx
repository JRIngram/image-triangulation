import React from "react";
import { describe, it, expect } from 'vitest'
import { render, screen } from "@testing-library/react";
import { StatusDisplay } from "./StatusDisplay";
import { TriangulationStatus } from "../../types";

describe("StatusDisplay", () => {
  it("Renders Spinner when status is UPLOADING", () => {
    render(<StatusDisplay status={TriangulationStatus.UPLOADING} />);
    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeVisible();
  });

  it("Renders Spinner when status is UPLOADED", () => {
    render(<StatusDisplay status={TriangulationStatus.UPLOADED} />);
    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeVisible();
  });

  it("Renders ProgressBar when status is PENDING and progress is passed", () => {
    render(
      <StatusDisplay status={TriangulationStatus.PENDING} progress={50} />,
    );
    const progressBar = screen.getByRole("progressbar");
    const progressText = screen.getByText("50%");
    expect(progressBar).toBeVisible();
    expect(progressText).toBeVisible();
  });

  it("Does not render ProgressBar when status is PENDING and progress is not passed", () => {
    render(<StatusDisplay status={TriangulationStatus.PENDING} />);
    const progressBar = screen.queryByRole("progressbar");
    expect(progressBar).toBeNull();
  });

  it("Renders a notice when the status is COMPLETE", () => {
    render(<StatusDisplay status={TriangulationStatus.COMPLETE} />);
    const noticeText = screen.getByText("Triangulation Completed");
    expect(noticeText).toBeVisible();
  });

  it("Renders an error message when the status is ERROR", () => {
    render(<StatusDisplay status={TriangulationStatus.ERROR} />);
    const noticeText = screen.getByText(
      "Unexpected error during triangulation",
    );
    expect(noticeText).toBeVisible();
  });
});
