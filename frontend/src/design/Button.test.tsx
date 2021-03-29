import { render, fireEvent, screen } from "@testing-library/react";
import { Button } from "./Button";

describe(Button.name, () => {
  it("can be clicked", () => {
    const clickHandler = jest.fn();
    render(<Button onClick={clickHandler}>Click me</Button>);
    expect(clickHandler).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Click me"));
    expect(clickHandler).toHaveBeenCalled();
  });

  it("can be disabled", () => {
    const clickHandler = jest.fn();
    render(
      <Button onClick={clickHandler} disabled>
        Click me
      </Button>
    );
    fireEvent.click(screen.getByText("Click me"));
    expect(clickHandler).not.toHaveBeenCalled();
  });

  it("is disabled when it is loading", () => {
    const clickHandler = jest.fn();
    render(
      <Button onClick={clickHandler} loading>
        Click me
      </Button>
    );
    fireEvent.click(screen.getByText("Click me"));
    expect(clickHandler).not.toHaveBeenCalled();
  });

  /* Maybe use snapshot testing instead? */
  xit("can be block level", () => {
    render(<Button>Normal</Button>);
    expect(screen.getByText("Normal")).not.toHaveClass("w-full");
    render(<Button block>Block level</Button>);
    expect(screen.getByText("Block level")).toHaveClass("w-full");
  });

  it("can receive custom classNames", () => {
    render(<Button>Normal</Button>);
    expect(screen.getByText("Normal")).not.toHaveClass("some");
    expect(screen.getByText("Normal")).not.toHaveClass("custom");
    expect(screen.getByText("Normal")).not.toHaveClass("classes");
    render(<Button className="some custom classes">Customized</Button>);
    expect(screen.getByText("Customized")).toHaveClass("some");
    expect(screen.getByText("Customized")).toHaveClass("custom");
    expect(screen.getByText("Customized")).toHaveClass("classes");
  });
});
