import { SingleOptionDropdown } from "~ui/forms/OptionsDropdown/single";
import { IconRepeat } from "~ui/icons";

export type RecurringDays = number | null;

interface Props {
  recurringDays: RecurringDays;
  onChange: (recurringDays: RecurringDays) => void;
}

interface RecurranceOption {
  recurringDays: RecurringDays;
  name: string;
}

const recurringOptions: RecurranceOption[] = [
  {
    recurringDays: null,
    name: "Does not repeat",
  },
  {
    recurringDays: 1,
    name: "Daily",
  },
  {
    recurringDays: 7,
    name: "Weekly",
  },
  {
    recurringDays: 28,
    name: "Monthly",
  },
];

export const RecurrancePicker = ({ recurringDays, onChange }: Props) => {
  return (
    <SingleOptionDropdown<RecurranceOption>
      icon={<IconRepeat />}
      name="Recurrence"
      items={recurringOptions}
      selectedItem={recurringOptions.find((option) => option.recurringDays === recurringDays)}
      onChange={({ recurringDays }) => {
        onChange(recurringDays);
      }}
      keyGetter={({ name }) => name}
      labelGetter={({ name }) => name}
    />
  );
};
