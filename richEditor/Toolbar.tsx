import { forwardRef } from "react";
import styled from "styled-components";
import { FileInput } from "./FileInput";

interface Props {
  onFileSelected?: (file: File) => void;
  onSubmit?: () => void;
}

export const Toolbar = forwardRef<HTMLDivElement, Props>(function Toolbar({ onFileSelected, onSubmit }, ref) {
  return (
    <UIHolder ref={ref}>
      <UISection>
        <UIToolButton className="ql-bold"></UIToolButton>
        <UIToolButton className="ql-italic"></UIToolButton>
        <UIToolButton className="ql-strike"></UIToolButton>

        <UIToolButton className="ql-code-block"></UIToolButton>
        <UIToolButton className="ql-link"></UIToolButton>

        <UIToolButton className="ql-list" value="ordered"></UIToolButton>
        <UIToolButton className="ql-list" value="bullet"></UIToolButton>

        <UIToolButton className="ql-blockquote"></UIToolButton>
      </UISection>

      <UISection>
        <UIItem>
          <FileInput onFileSelected={onFileSelected}>
            <UICustomButton>Upload...</UICustomButton>
          </FileInput>
        </UIItem>

        <UIItem>
          <UICustomButton onClick={onSubmit}>Submit</UICustomButton>
        </UIItem>
      </UISection>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  &&&:after {
    display: none;
  }

  ${() => UISection} {
    ${() => UIToolButton} {
      all: unset;
      background: none;
      border: none;
      cursor: pointer;
      display: inline-block;

      font-size: 20px;
      height: 1em;
      padding: 0.25em;
      width: 1em;
    }

    ${() => UICustomButton} {
    }
  }
`;

const UISection = styled.div`
  display: flex;
  min-width: 0;
`;

const UIToolButton = styled.button``;

const UICustomButton = styled.div`
  cursor: pointer;
`;

const UIItem = styled.div`
  margin-right: 1rem;

  &:last-child {
    margin-right: 0;
  }
`;
