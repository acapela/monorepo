import { routes } from "~frontend/../router";
import { RoomDetailedInfoFragment, TopicDetailedInfoFragment } from "~gql";
import { formatDate } from "../shared";
import { convert as convertToPlainText } from "html-to-text";

// Contains a special character within div that allows line-breaks to occur in notion
const htmlLineBreak = "<div>‎</div>";

export function convertRoomToHtml(room: RoomDetailedInfoFragment): string {
  const roomSummaryUrl = routes.spaceRoomSummary.getUrlWithParams({ spaceId: room.space_id, roomId: room.id });
  return `
    <div>
      <h1><a href="${roomSummaryUrl}">${room.name}</a></h1>
      <div>Created ${formatDate(room.finished_at)}</div>

      ${htmlLineBreak}
      
      ${room.topics
        .map(
          (topic: TopicDetailedInfoFragment) =>
            `      
        <div><strong>${topic.name}</strong> was closed by <strong>${topic.closed_by_user?.name}</strong> · ${formatDate(
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

      <small><em>Generated by <strong>Acapela</strong></small></em>
    </div>
  `;
}

export function convertRoomToPlainText(room: RoomDetailedInfoFragment): string {
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
