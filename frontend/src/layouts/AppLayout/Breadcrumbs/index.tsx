import React, { Fragment } from "react";
import styled from "styled-components";

import { useSingleRoomQuery } from "~frontend/gql/rooms";
import { useSingleSpaceQuery } from "~frontend/gql/spaces";
import { routes } from "~frontend/router";
import { usePathParameter } from "~frontend/utils";
import { IconBox, IconSpaces } from "~ui/icons";
import { theme } from "~ui/theme";

import { Breadcrumb, Props as BreadcrumbProps } from "./Breadcrumb";

export const Breadcrumbs = () => {
  const breadcrumbsProps: BreadcrumbProps[] = [
    {
      title: "Spaces",
      href: routes.spaces.getUrlWithParams({}),
      icon: <IconSpaces />,
    },
  ];

  const spaceId = usePathParameter("spaceId");
  const [space] = useSingleSpaceQuery({ id: spaceId ?? "" }, { skip: !spaceId });

  const roomId = usePathParameter("roomId");
  const [room] = useSingleRoomQuery({ id: roomId ?? "" }, { skip: !roomId });
  if (space) {
    breadcrumbsProps.push({
      title: space.name ?? "",
      href: routes.space.getUrlWithParams({ spaceId: space.id }),
      icon: <IconBox />,
    });

    if (room) {
      breadcrumbsProps.push({
        title: room.name ?? "",
      });
    }
  }

  return (
    <UIHolder>
      {breadcrumbsProps.map((props, index) => {
        const isLast = index === breadcrumbsProps.length - 1;
        const shouldShowDivider = index > 0;

        return (
          <Fragment key={index}>
            {shouldShowDivider && <UIDivider>/</UIDivider>}
            <Breadcrumb {...props} isSelected={isLast} />
          </Fragment>
        );
      })}
    </UIHolder>
  );
};

const UIHolder = styled.div<{}>`
  display: flex;
  gap: 20px;
  ${theme.font.withExceptionalSize("0.9375rem", "Design system uses navigation font at 15px").build}
`;

const UIDivider = styled.div<{}>``;
