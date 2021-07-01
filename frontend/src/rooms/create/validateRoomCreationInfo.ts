import { createLengthValidator, ValidationResult } from "~shared/validation/inputValidation";

interface RoomCreateInput {
  roomName: string;
  spaceId: string | null;
}

const validateRoomNameLength = createLengthValidator("Room name", 3);

export const validateRoomCreationInfo = ({ roomName, spaceId }: RoomCreateInput): ValidationResult => {
  const roomNameLengthError = validateRoomNameLength(roomName);
  if (roomNameLengthError !== true) {
    return roomNameLengthError;
  }

  if (!spaceId) {
    return "Space is required";
  }
};
