import isEmail from "validator/lib/isEmail";

export type ValidationResult = string | true;

export type InputValidatorFunction = (input: string) => ValidationResult;

export function emailInputValidator(email: string): ValidationResult {
  if (!email.trim().length) {
    return `Email is required`;
  }
  if (!isEmail(email)) {
    return `Please provide correct email address`;
  }

  return true;
}

export function createLengthValidator(entityName: string, minLength = 3): InputValidatorFunction {
  return function validateLength(nameValue: string) {
    const trimmedLength = nameValue.trim().length;
    if (!trimmedLength) {
      return `${entityName} is required.`;
    }

    if (trimmedLength < minLength) {
      return `${entityName} must be longer than ${minLength} characters.`;
    }

    return true;
  };
}
