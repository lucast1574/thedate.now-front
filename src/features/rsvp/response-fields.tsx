import { useTranslator } from "@/lib/i18n/react";
import { type Translator, localized } from "@/lib/i18n/translator";
type Props = {
  response: string;
  reason: string;
  onResponse: (value: string) => void;
  onReason: (value: string) => void;
  maybeEnabled?: boolean;
};
const choices = localized((i18n: Translator) => [
  { value: "going", label: i18n("Sí, asistiré") },
  { value: "not_going", label: i18n("No podré asistir") },
  { value: "maybe", label: i18n("Tal vez") },
]);

export default function ResponseFields({
  response,
  reason,
  onResponse,
  onReason,
  maybeEnabled = true,
}: Props) {
  const i18n = useTranslator();

  return (
    <>
      <fieldset>
        <legend>{i18n("¿Podrás acompañarnos?")}</legend>
        {choices(i18n)
          .filter((choice) => choice.value !== "maybe" || maybeEnabled)
          .map((choice) => (
            <label key={choice.value}>
              <input
                type="radio"
                name="response"
                value={choice.value}
                checked={response === choice.value}
                onChange={() => onResponse(choice.value)}
              />{" "}
              {choice.label}
            </label>
          ))}
      </fieldset>
      {maybeEnabled && response === "maybe" && (
        <label>
          {i18n("Cuéntanos por qué estás en espera")}{" "}
          <textarea
            required
            minLength={3}
            value={reason}
            onChange={(e) => onReason(e.target.value)}
          />
        </label>
      )}
    </>
  );
}
