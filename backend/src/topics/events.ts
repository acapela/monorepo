import { db, Topic } from "~db";

export async function handleTopicCreated(topic: Topic) {
  await inheritTopicMembersFromParentRoom(topic);
}

async function inheritTopicMembersFromParentRoom(topic: Topic) {
  if (!topic.room_id) return;

  // Get all parent space members.
  const roomMembers = await db.room_member.findMany({
    where: { room_id: topic.room_id },
  });

  const roomMembersUserIds = roomMembers.map((member) => member.user_id);

  await db.topic_member.createMany({
    data: roomMembersUserIds.map((userId) => {
      return {
        user_id: userId,
        topic_id: topic.id,
      };
    }),
    // This should never happen as the room is just created so it should have no members yet.
    skipDuplicates: true,
  });
}
