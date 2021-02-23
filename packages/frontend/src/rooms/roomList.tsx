import Link from "next/link";
import { AvatarList } from "../design/Avatar";
import { Room, useRooms } from "./Room";

export const RoomList: React.FC<unknown> = () => {
  const { loading, rooms } = useRooms();

  // TODO: Loader
  if (loading) {
    return <span>Loading...</span>;
  }

  return (
    <ul className="grid md:grid-cols-1 md:grid-cols-3 gap-8">
      {rooms.map((room: Room) => (
        <li key={room.id}>
          <RoomLink room={room} />
        </li>
      ))}
    </ul>
  );
};

const RoomLink = ({ room }: { room: Room }) => {
  return (
    <Link href={`/rooms/${room.id}`}>
      <a className="block w-full p-4 rounded-lg font-semibold transition duration-150 ease-in-out transform-gpu hover:-translate-y-0.5 mb-1 active:translate-y-0 bg-white shadow-lg hover:shadow-xl">
        <h3 className="text-xl mb-4">{room.name || "New room"}</h3>
        <AvatarList
          avatars={(room.participants || []).map(({ user: { name, avatarUrl } }) => ({
            url: avatarUrl,
            name,
            className: "border-white",
          }))}
        />
      </a>
    </Link>
  );
};
