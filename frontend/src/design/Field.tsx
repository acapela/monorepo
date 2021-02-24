import classNames from "classnames";
import { ChangeEventHandler } from "react";

const baseClassNames =
  "w-full display-block rounded-lg px-4 py-2 transition ease-out duration-150 shadow-md hover:shadow-lg focus:outline-none bg-white border border-gray-200 focus:border-gray-300";

export const Field = ({
  id,
  type = FieldType.TEXT,
  name,
  value,
  onChange,
  placeholder,
  ...rest
}: {
  id?: string;
  type?: FieldType;
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}) => {
  const inputClass = classNames(baseClassNames);
  return (
    <input
      id={id}
      placeholder={placeholder}
      name={name}
      className={inputClass}
      type={type}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
};

export enum FieldType {
  TEXT = "text",
  EMAIL = "email",
  PASSWORD = "password",
}
