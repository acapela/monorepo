import React, { Fragment } from "react";
import styled from "styled-components";
import { usePathParameter } from "~frontend/utils";
import { Breadcrumb, Props as BreadcrumbProps } from "./Breadcrumb";
import { useSingleRoomQuery } from "~frontend/gql/rooms";
import { useSingleSpaceQuery } from "~frontend/gql/spaces";
import { IconSpaces, IconBox } from "~ui/icons";
import { ONYX_LIGHTEST } from "~ui/colors";
import { fontSize } from "~ui/baseStyles";
import { routes } from "~frontend/routes";

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

const UIHolder = styled.div`
  display: flex;
  gap: 20px;
`;

const UIDivider = styled.div`
  font-size: ${fontSize.navigation};
  color: ${ONYX_LIGHTEST};
`;
