import { gql } from "@apollo/client";
import { convert as convertToPlainText } from "html-to-text";

import { RoomEntity } from "~frontend/clientdb/room";
import { routes } from "~frontend/router";
import { ConvertRoom_RoomFragment } from "~gql";

import { formatDate } from "../shared";

// Contains a special character within div that allows line-breaks to occur in notion
const htmlLineBreak = "<div>‎</div>";

export const convertRoomFragment = gql`
  fragment ConvertRoom_room on room {
    id
    space_id
    name
    finished_at
    summary
    topics {
      name
      closed_by_user {
        name
      }
      closed_at
      closing_summary
    }
  }
`;

export function convertRoomToHtml(room: RoomEntity): string {
  const roomSummaryUrl = routes.spaceRoomSummary.getUrlWithParams({ spaceId: room.space_id, roomId: room.id });
  return `
    <div>
      <h1><a href="${roomSummaryUrl}">${room.name}</a></h1>
      <div>Created ${formatDate(room.finished_at)}</div>

      ${htmlLineBreak}
      
      ${room.topics.all
        .map(
          (topic) =>
            `      
        <div><strong>${topic.name}</strong> was closed by <strong>${topic.closedByUser?.name}</strong> · ${formatDate(
              topic.closed_at
            )}</div>
          <p>${topic.closing_summary || "No summary"}</p>
      `
        )
        .join(htmlLineBreak)}

      ${htmlLineBreak}

      <div>${room.summary ?? ""}</div>

      ${htmlLineBreak}
      ${htmlLineBreak}

      <small><em>Generated by <strong>Acapela</strong></em></small>
    </div>
  `;
}

export function convertRoomToPlainText(room: RoomEntity): string {
  // We're reusing a library already in use for our content editor
  return convertToPlainText(convertRoomToHtml(room), {
    selectors: [
      {
        selector: "a",
        options: { noLinkBrackets: true, baseUrl: `https://${window.location.host}` },
      },
    ],
  });
}
