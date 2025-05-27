"use client";

import * as React from "react";
import { DatePicker } from "./DatePicker";
import { TimePicker } from "./TimePicker";
import { setHours, setMinutes } from "date-fns";

interface DateTimeSelectorProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({ value, onChange }) => {
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [hour, setHour] = React.useState<number>(value ? value.getHours() : 0);
  const [minute, setMinute] = React.useState<number>(value ? value.getMinutes() : 0);

  React.useEffect(() => {
    if (date) {
      const combined = setMinutes(setHours(date, hour), minute);
      onChange?.(combined);
    }
  }, [date, hour, minute]);

  return (
    <div className="flex flex-col gap-2">
      <DatePicker value={date} onChange={setDate} />
      <TimePicker hour={hour} minute={minute} onChange={(h, m) => {
        setHour(h);
        setMinute(m);
      }} />
    </div>
  );
};
