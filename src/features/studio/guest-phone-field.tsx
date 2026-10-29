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
      <label>
        País
        <Listbox
          value={country}
          disabled={disabled}
          onValueChange={(code) => onCountry(code as CountryCode)}
        >
          {phoneCountries.map((item) => (
            <option key={item.code} value={item.code}>
              {item.label}
            </option>
          ))}
        </Listbox>
      </label>
      <label>
        WhatsApp
        <span className="guest-phone-number">
          <span>
            {phoneCountries.find((item) => item.code === country)?.prefix}
          </span>
          <input
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
        </span>
      </label>
      {error && (
        <p id={id} className="guest-phone-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
