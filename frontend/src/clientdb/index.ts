import { createClientDb } from "~clientdb";

import { attachmentEntity } from "./attachment";
import { createIndexedDbAdapter } from "./indexeddb/adapter";
import { messageEntity } from "./message";
import { messageReactionEntity } from "./messageReaction";
import { roomEntity } from "./room";
import { spaceEntity } from "./space";
import { taskEntity } from "./task";
import { teamEntity } from "./team";
import { topicEntity } from "./topic";
import { userEntity } from "./user";

const DB_VERSION = 2;

export const clientdb = createClientDb(
  {
    db: {
      dbAdapter: createIndexedDbAdapter(),
      dbVersion: DB_VERSION,
      dbPrefix: "acapela",
    },
  },
  {
    space: spaceEntity,
    user: userEntity,
    room: roomEntity,
    topic: topicEntity,
    message: messageEntity,
    attachment: attachmentEntity,
    team: teamEntity,
    task: taskEntity,
    messageReaction: messageReactionEntity,
  }
);
