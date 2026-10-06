type Props = {
  response: string;
  reason: string;
  onResponse: (value: string) => void;
  onReason: (value: string) => void;
};
const choices = [
  { value: "going", label: "Sí, asistiré" },
  { value: "not_going", label: "No podré asistir" },
  { value: "maybe", label: "Tal vez" },
];

export default function ResponseFields({
  response,
  reason,
  onResponse,
  onReason,
}: Props) {
  return (
    <>
      <fieldset>
        <legend>¿Podrás acompañarnos?</legend>
        {choices.map((choice) => (
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
      {response === "maybe" && (
        <label>
          Cuéntanos por qué estás en espera
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
