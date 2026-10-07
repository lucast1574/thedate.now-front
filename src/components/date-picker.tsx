"use client";
import PickerField, { usePickerClose } from "./picker-field";
import CalendarPicker from "./calendar-picker";
import { localDay } from "@/lib/ui/date-time";
export default function DatePicker({
  value,
  onChange,
  label = "Fecha",
  required,
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}) {
  const date = localDay(value);
  const display = date
    ? date.toLocaleDateString("es", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Elige una fecha";
  return (
    <PickerField
      label={label}
      value={date ? value : ""}
      display={display}
      icon="calendar"
      required={required}
    >
      <DatePickerPanel value={value} onChange={onChange} />
    </PickerField>
  );
}

function DatePickerPanel({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const close = usePickerClose();
  return (
    <CalendarPicker
      value={value}
      onChoose={(next) => {
        onChange(next);
        close();
      }}
    />
  );
}
