import { render, fireEvent, screen } from "@testing-library/react";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("renders initials if url not provided", () => {
    let { rerender } = render(<Avatar name="some person" />);
    expect(screen.getByText("SP")).toBeInTheDocument();
    rerender(<Avatar name="person" />);
    expect(screen.queryByText("SP")).not.toBeInTheDocument();
    expect(screen.getByText("P")).toBeInTheDocument();
  });

  it("can receive custom classNames", () => {
    let { rerender } = render(<Avatar name="a long name" />);
    expect(screen.getByText("AL")).not.toHaveClass("some");
    expect(screen.getByText("AL")).not.toHaveClass("custom");
    expect(screen.getByText("AL")).not.toHaveClass("classes");
    rerender(<Avatar name="a long name" className="some custom classes" />);
    expect(screen.getByText("AL")).toHaveClass("some");
    expect(screen.getByText("AL")).toHaveClass("custom");
    expect(screen.getByText("AL")).toHaveClass("classes");
  });
});
