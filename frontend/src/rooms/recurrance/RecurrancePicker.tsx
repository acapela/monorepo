import { SingleOptionDropdown } from "~ui/forms/OptionsDropdown/single";
import { IconRepeat } from "~ui/icons";

import { RecurringDays, getRecurringDaysLabel } from "./getRecurringDaysLabel";

interface Props {
  recurringDays: RecurringDays;
  onChange: (recurringDays: RecurringDays) => void;
  shouldShowName?: boolean;
}

interface RecurranceOption {
  recurringDays: RecurringDays;
  name: string;
}

const recurringOptions: RecurranceOption[] = [null, 1, 7, 28].map((recurringDays) => ({
  recurringDays,
  name: getRecurringDaysLabel(recurringDays),
}));

export const RecurrancePicker = ({ recurringDays, onChange, shouldShowName = true }: Props) => {
  return (
    <SingleOptionDropdown<RecurranceOption>
      icon={<IconRepeat />}
      name={shouldShowName ? "Recurrence" : undefined}
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
