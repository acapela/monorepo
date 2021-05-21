import { ReactNode } from "react";
import styled from "styled-components";
import { SecondaryText } from "~ui/typo";
import { BodyPortal } from "~ui/BodyPortal";

interface Props {
  head?: {
    title: ReactNode;
    description?: ReactNode;
  };
  children: ReactNode;
  onCloseRequest: () => void;
}

export function Modal({ head, children, onCloseRequest }: Props) {
  return (
    <BodyPortal>
      <UIBodyCover
        onClick={(event) => {
          event.stopPropagation();

          onCloseRequest();
        }}
      >
        <UIModal
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          {head && (
            <UIHead>
              <UIHeadTitle>{head.title}</UIHeadTitle>
              <SecondaryText>{head.description}</SecondaryText>
            </UIHead>
          )}
          {children}
        </UIModal>
      </UIBodyCover>
    </BodyPortal>
  );
}

const UIBodyCover = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UIModal = styled.div`
  align-items: center;
  padding: 1.5rem;
  min-width: 368px;

  background: #ffffff;

  border: 1px solid #f8f8f8;

  box-shadow: 0px 100px 80px rgba(0, 0, 0, 0.07), 0px 64.8148px 46.8519px rgba(0, 0, 0, 0.0531481),
    0px 38.5185px 25.4815px rgba(0, 0, 0, 0.0425185), 0px 20px 13px rgba(0, 0, 0, 0.035),
    0px 8.14815px 6.51852px rgba(0, 0, 0, 0.0274815), 0px 1.85185px 3.14815px rgba(0, 0, 0, 0.0168519);
  border-radius: 1rem;
`;

const UIHead = styled.div`
  line-height: 1.5;
  text-align: center;
  margin-bottom: 2rem;
`;

const UIHeadTitle = styled.div``;
