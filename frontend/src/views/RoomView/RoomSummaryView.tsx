import { useSingleRoomQuery } from "~frontend/gql/rooms";
import { RoomView } from "./RoomView";

interface Props {
  roomId: string;
}

export function RoomSummaryView({ roomId }: Props) {
  const [roomQuery] = useSingleRoomQuery({ id: roomId });

  const room = roomQuery?.room;

  return (
    <RoomView room={room} selectedTopicId={null}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ac interdum nunc, sed aliquam tortor. Nulla
      porttitor orci vel faucibus lacinia. Duis iaculis, leo in egestas rutrum, metus mauris hendrerit massa, ac tempus
      metus est in velit. Vestibulum ultricies aliquam enim at auctor. Etiam bibendum aliquet sem, venenatis pulvinar
      nunc consequat eget. Ut ipsum justo, imperdiet in erat a, rutrum maximus dolor. In at leo vitae ante fringilla
      tristique vitae a orci. In eu eleifend felis. Vestibulum scelerisque elit nunc, in suscipit libero vestibulum at.
      Donec pretium ligula in arcu blandit vulputate. Curabitur purus tortor, bibendum eget posuere et, fringilla eget
      tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus
      pretium lorem vel euismod feugiat. Quisque aliquet, turpis id tincidunt scelerisque, magna nulla commodo sapien,
      nec pulvinar quam lectus id ipsum.
    </RoomView>
  );
}
