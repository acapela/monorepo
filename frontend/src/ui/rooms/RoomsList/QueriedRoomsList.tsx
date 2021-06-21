import styled from "styled-components";
import { RoomsQueryVariables } from "~gql";
import { RoomsList } from "./RoomsList";
import { useRoomsQuery } from "~frontend/gql/rooms";

interface Props {
  className?: string;
  query: RoomsQueryVariables;
}

export const QueriedRoomsList = styled(function QueriedRoomsList({ className, query }: Props) {
  const [rooms = []] = useRoomsQuery(query);

  return <RoomsList className={className} rooms={rooms} />;
})``;
