import { createClientDb } from "~clientdb";
import { attachmentEntity } from "./attachment";
import { messageEntity } from "./message";
import { roomEntity } from "./room";
import { spaceEntity } from "./space";
import { teamEntity } from "./team";
import { topicEntity } from "./topic";
import { userEntity } from "./user";

export const clientdb = createClientDb(
  {},
  {
    space: spaceEntity,
    user: userEntity,
    room: roomEntity,
    topic: topicEntity,
    message: messageEntity,
    attachment: attachmentEntity,
    team: teamEntity,
  }
);
