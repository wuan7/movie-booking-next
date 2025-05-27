"use client";

import * as React from "react";

interface TimePickerProps {
  hour: number;
  minute: number;
  onChange: (hour: number, minute: number) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({ hour, minute, onChange }) => {
  return (
    <div className="flex gap-2 items-center">
      <select
        className="border rounded p-1"
        value={hour}
        onChange={(e) => onChange(Number(e.target.value), minute)}
      >
        {Array.from({ length: 24 }, (_, i) => (
          <option key={i} value={i}>
            {i.toString().padStart(2, "0")}
          </option>
        ))}
      </select>
      :
      <select
        className="border rounded p-1"
        value={minute}
        onChange={(e) => onChange(hour, Number(e.target.value))}
      >
        {Array.from({ length: 60 }, (_, i) => (
          <option key={i} value={i}>
            {i.toString().padStart(2, "0")}
          </option>
        ))}
      </select>
    </div>
  );
};
