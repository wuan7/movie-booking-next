"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const [date, setDate] = React.useState<Date | undefined>(value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {date ? format(date, "dd/MM/yyyy") : "Chọn ngày"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            setDate(selectedDate);
            onChange?.(selectedDate);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};