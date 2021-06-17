import { createLengthValidator } from "~shared/validation/inputValidation";

interface ValidateParams {
  roomName: string;
  spaceId: string | null;
  spaceName: string;
}

export const validate = ({ roomName, spaceId, spaceName }: ValidateParams) => {
  const validateRoomNameLength = createLengthValidator("Room name", 3);
  const roomNameLengthError = validateRoomNameLength(roomName);
  if (roomNameLengthError !== true) {
    return roomNameLengthError;
  }

  if (!spaceId) {
    const validateSpaceNameLength = createLengthValidator("Space name", 3);
    const spaceNameLengthError = validateSpaceNameLength(spaceName);
    if (spaceNameLengthError !== true) {
      return spaceNameLengthError;
    }
  }
};
