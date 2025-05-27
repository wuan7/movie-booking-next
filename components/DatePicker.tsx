"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { format } from "date-fns";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {value ? format(value, "dd/MM/yyyy") : "Chọn ngày"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => onChange?.(date)}
        />
      </PopoverContent>
    </Popover>
  );
};
