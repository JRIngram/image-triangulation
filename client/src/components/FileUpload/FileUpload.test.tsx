import React from "react";
import { userEvent } from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { FileUpload } from "./FileUpload";

describe("FileUpload", () => {
  it("Triggers handler when user uploads a file", async () => {
    const spy = jest.fn();
    render(<FileUpload onChangeHandler={() => spy()} />);
    const fileUpload = screen.getByLabelText("file upload input");
    const mockFile: File = new File(["test"], "test.png", {
      type: "image/png",
    });
    await userEvent.upload(fileUpload, mockFile);
    expect(spy).toHaveBeenCalled();
  });
});
