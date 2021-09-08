import { createClientDb } from "~clientdb";

import { attachmentEntity } from "./attachment";
import { createIndexedDbAdapter } from "./indexeddb/adapter";
import { messageEntity } from "./message";
import { roomEntity } from "./room";
import { spaceEntity } from "./space";
import { teamEntity } from "./team";
import { topicEntity } from "./topic";
import { userEntity } from "./user";

const DB_VERSION = 1;

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
  }
);
