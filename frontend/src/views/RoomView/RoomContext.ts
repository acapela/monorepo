import { createContext, useContext } from "react";

export interface RoomContextProps {
  reloadRoom: () => void;
}

export const RoomContext = createContext<RoomContextProps | null>(null);

export const useRoomContext = () => useContext(RoomContext);
