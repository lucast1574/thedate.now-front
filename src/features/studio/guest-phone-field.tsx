import { useId } from "react";
import Listbox from "@/components/listbox";
import {
  phoneCountries,
  splitInternationalPhone,
} from "@/lib/events/guest-phone";
import type { CountryCode } from "libphonenumber-js";

export default function GuestPhoneField({
  country,
  value,
  error,
  disabled,
  onCountry,
  onChange,
}: {
  country: CountryCode;
  value: string;
  error: string;
  disabled: boolean;
  onCountry: (country: CountryCode) => void;
  onChange: (value: string) => void;
}) {
  const id = useId();
  return (
    <div className="guest-phone-field">
      <label htmlFor={`${id}-number`}>WhatsApp</label>
      <div className="guest-phone-control">
        <Listbox
          aria-label={`País y prefijo: ${phoneCountries.find((item) => item.code === country)?.label}`}
          value={country}
          disabled={disabled}
          menuMinWidth={320}
          renderLabel={(option, selected) => {
            const item = phoneCountries.find(
              (item) => item.code === option.value,
            )!;
            return (
              <span className="phone-country-choice">
                {/* Local SVG assets preserve the flag across operating systems. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/flags/${item.code.toLowerCase()}.svg`}
                  alt=""
                  width={24}
                  height={18}
                />
                <span>{selected ? item.prefix : item.label}</span>
              </span>
            );
          }}
          onValueChange={(code) => onCountry(code as CountryCode)}
        >
          {phoneCountries.map((item) => (
            <option key={item.code} value={item.code}>
              {item.label}
            </option>
          ))}
        </Listbox>
        <input
          id={`${id}-number`}
          required
          type="tel"
          autoComplete="tel-national"
          placeholder="Número local"
          value={value}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? id : undefined}
          onChange={(e) => {
            const next = e.target.value;
            const international = splitInternationalPhone(next);
            if (international) {
              onCountry(international.country);
              onChange(international.national);
            } else onChange(next);
          }}
        />
      </div>
      {error && (
        <p id={id} className="guest-phone-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
