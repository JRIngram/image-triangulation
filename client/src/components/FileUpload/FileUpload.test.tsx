import React from "react";
import { userEvent } from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { FileUpload } from "./FileUpload";

describe("FileUpload", () => {
  it('renders default state', () => {
    render(<FileUpload onChangeHandler={() => {}} />);
    const fileUpload = screen.getByLabelText("file upload input");
    const label = screen.getByText('Please select a .jpg or .png image to upload:')
    expect(fileUpload).toBeVisible()
    expect(label).toBeVisible()
  })

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
