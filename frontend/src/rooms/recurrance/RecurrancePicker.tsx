import { SingleOptionDropdown } from "~ui/forms/OptionsDropdown/single";
import { IconRepeat } from "~ui/icons";

import { getRecurranceIntervalInDaysLabel } from "./getRecurranceIntervalInDaysLabel";
import { RecurranceIntervalInDays, recurranceIntervalInDaysOptions } from "./RecurranceIntervalInDays";

interface Props {
  recurranceIntervalInDays: RecurranceIntervalInDays;
  onChange: (recurranceIntervalInDays: RecurranceIntervalInDays) => void;
  shouldShowName?: boolean;
}

interface RecurranceOption {
  recurranceIntervalInDays: RecurranceIntervalInDays;
  name: string;
}

const recurringOptions: RecurranceOption[] = recurranceIntervalInDaysOptions.map((recurranceIntervalInDays) => ({
  recurranceIntervalInDays,
  name: getRecurranceIntervalInDaysLabel(recurranceIntervalInDays),
}));

export const RecurrancePicker = ({ recurranceIntervalInDays, onChange, shouldShowName = true }: Props) => {
  return (
    <SingleOptionDropdown<RecurranceOption>
      icon={<IconRepeat />}
      name={shouldShowName ? "Recurrence" : undefined}
      items={recurringOptions}
      selectedItem={recurringOptions.find((option) => option.recurranceIntervalInDays === recurranceIntervalInDays)}
      onChange={({ recurranceIntervalInDays }) => {
        onChange(recurranceIntervalInDays);
      }}
      keyGetter={({ name }) => name}
      labelGetter={({ name }) => name}
    />
  );
};
