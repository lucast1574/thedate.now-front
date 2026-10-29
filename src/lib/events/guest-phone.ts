import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js/max";

const names = new Intl.DisplayNames(["es"], { type: "region" });
export const phoneCountries = getCountries()
  .map((code) => ({
    code,
    name: names.of(code) || code,
    prefix: `+${getCountryCallingCode(code)}`,
    label: `${names.of(code) || code} (+${getCountryCallingCode(code)})`,
  }))
  .sort((a, b) => a.name.localeCompare(b.name, "es"));

export function phoneCountry(value: string): CountryCode | undefined {
  const text = value.trim();
  return phoneCountries.find(
    (country) =>
      country.code === text.toUpperCase() ||
      country.label.toLowerCase() === text.toLowerCase() ||
      country.name.toLowerCase() === text.toLowerCase(),
  )?.code;
}

export function guestPhone(value: string, country?: CountryCode): string {
  const text = value.trim();
  if (!text) throw new Error("WhatsApp: falta el número.");
  if (!/^\+?[\d\s().-]+$/.test(text))
    throw new Error(
      "WhatsApp: usa solo números, espacios, guiones o + al inicio.",
    );
  if (!country && !text.startsWith("+"))
    throw new Error("WhatsApp: elige un país o incluye + y el código de país.");
  const phone = parsePhoneNumberFromString(text, country);
  if (!phone || phone.ext || !phone.isValid())
    throw new Error(
      "WhatsApp: el número no es válido para su país. Revisa los dígitos.",
    );
  return phone.number;
}

export function splitInternationalPhone(value: string) {
  if (!value.trim().startsWith("+")) return undefined;
  const phone = parsePhoneNumberFromString(value);
  return phone?.country
    ? { country: phone.country, national: String(phone.nationalNumber) }
    : undefined;
}
