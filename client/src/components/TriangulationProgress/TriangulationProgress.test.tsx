import React from 'react';
import { render, screen } from "@testing-library/react";
import { TriangulationProgress } from "./TriangulationProgress";

describe("TriangulationProgress", () => {
  it.each([[0], [50], [100]])(
    "renders Triangulation progress when progress is %d",
    (progress) => {
      render(<TriangulationProgress progress={progress} />);
      const notice = screen.getByText('This process may take a long time to complete.');
      const progressText = screen.getByText(`${progress}%`);
      const progressBar = screen.getByRole('progressbar');
      expect(notice).toBeVisible()
      expect(progressText).toBeVisible()
      expect(progressBar).toBeVisible()
    }
  );
});
