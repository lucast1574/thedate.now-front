"use client";
import { useTranslator } from "@/lib/i18n/react";

import PickerField, { usePickerClose } from "./picker-field";
import TimePanel from "./time-panel";
import { timeLabel } from "@/lib/ui/date-time";
export default function TimePicker({
  value,
  onChange,
  label: sourceLabel,
  required,
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}) {
  const i18n = useTranslator();
  const label = sourceLabel ?? i18n("Hora");

  const valid = /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
  return (
    <PickerField
      label={label}
      value={valid ? value : ""}
      display={valid ? timeLabel(value) : i18n("Elige una hora")}
      icon="clock"
      required={required}
    >
      <TimePickerPanel value={value} onChange={onChange} />
    </PickerField>
  );
}

function TimePickerPanel({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const close = usePickerClose();
  return (
    <TimePanel
      value={value}
      onChoose={(next) => {
        onChange(next);
        close();
      }}
    />
  );
}
