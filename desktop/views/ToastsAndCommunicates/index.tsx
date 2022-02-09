import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { defineAction } from "@aca/desktop/actions/action";
import { installUpdate } from "@aca/desktop/actions/app";
import { applicationStateBridge, showErrorToUserChannel } from "@aca/desktop/bridge/system";
import { PublicErrorData } from "@aca/desktop/domains/errors/types";
import { BodyPortal } from "@aca/ui/BodyPortal";

import { Toast } from "./Toast";

export const ToastsAndCommunicatesView = observer(() => {
  const { isUpdateReadyToInstall, updateDownloadingPercent } = applicationStateBridge.get();

  const [errors, setErrors] = useState<PublicErrorData[]>([]);
  useEffect(() => {
    return showErrorToUserChannel.subscribe((newError) => {
      setErrors((errors) => [...errors, newError]);
    });
  });

  return (
    <BodyPortal>
      <UIHolder>
        {isUpdateReadyToInstall && (
          <Toast
            key="update-ready"
            title="Update available"
            description="New version of Acapela is available."
            action={installUpdate}
          />
        )}
        {updateDownloadingPercent && (
          <Toast
            key="downloading"
            title="Downloading update"
            description={`${updateDownloadingPercent}%`}
            action={installUpdate}
          />
        )}
        {errors.map((error) => {
          return (
            <Toast
              key={error.id}
              title="Error"
              description={error.message}
              action={defineAction({
                name: "Close",
                handler() {
                  setErrors((errors) => errors.filter((currentError) => currentError.id !== error.id));
                },
              })}
            />
          );
        })}
      </UIHolder>
    </BodyPortal>
  );
});

const UIHolder = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 320px;
  z-index: 9999;
  display: flex;
  gap: 8px;
  flex-direction: column;
  pointer-events: none;

  & > * {
    pointer-events: all;
  }
`;
