import { render, screen } from "@testing-library/react";

import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("renders initials if url not provided", () => {
    const { rerender } = render(<Avatar name="some person" />);
    expect(screen.getByText("SP")).toBeInTheDocument();
    rerender(<Avatar name="person" />);
    expect(screen.queryByText("SP")).not.toBeInTheDocument();
    expect(screen.getByText("P")).toBeInTheDocument();
  });
});
