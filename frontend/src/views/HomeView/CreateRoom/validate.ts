import { createLengthValidator } from "~shared/validation/inputValidation";

interface ValidateParams {
  roomName: string;
}

export const validate = ({ roomName }: ValidateParams) => {
  const validateLength = createLengthValidator("Room name", 3);
  const lengthError = validateLength(roomName);
  if (lengthError) {
    return lengthError;
  }
};
