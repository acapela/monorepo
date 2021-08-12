import { gql, useSubscription } from "@apollo/client";
import React, { Fragment } from "react";
import styled from "styled-components";

import { routes } from "~frontend/router";
import { usePathParameter } from "~frontend/utils";
import { BreadcrumbQuery, BreadcrumbQueryVariables } from "~gql";
import { assert, assertDefined } from "~shared/assert";
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

  const spaceId = assertDefined(usePathParameter("spaceId"), "space id is required");
  const roomId = usePathParameter("roomId");
  const { data: result } = useSubscription<BreadcrumbQuery, BreadcrumbQueryVariables>(
    gql`
      query Breadcrumb($spaceId: uuid!, $roomId: uuid) {
        space: space_by_pk(id: $spaceId) {
          id
          name
        }
        rooms: room(where: { id: { _eq: $roomId } }) {
          id
          name
        }
      }
    `,
    { variables: { spaceId, roomId } }
  );

  if (result) {
    const {
      space,
      rooms: [room],
    } = result;
    assert(space, "space needs to have been fetched");
    breadcrumbsProps.push({
      title: space.name,
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
