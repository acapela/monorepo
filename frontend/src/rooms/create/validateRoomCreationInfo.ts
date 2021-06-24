import { createLengthValidator } from "~shared/validation/inputValidation";

interface RoomCreateInput {
  roomName: string;
  spaceId: string | null;
  spaceName: string;
}

const validateRoomNameLength = createLengthValidator("Room name", 3);

const validateSpaceNameLength = createLengthValidator("Space name", 3);

export const validateRoomCreationInfo = ({ roomName, spaceId, spaceName }: RoomCreateInput) => {
  const roomNameLengthError = validateRoomNameLength(roomName);
  if (roomNameLengthError !== true) {
    return roomNameLengthError;
  }

  if (!spaceId) {
    const spaceNameLengthError = validateSpaceNameLength(spaceName);
    if (spaceNameLengthError !== true) {
      return spaceNameLengthError;
    }
  }
};
