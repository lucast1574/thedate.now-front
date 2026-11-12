import Icon from "@/components/icon";

type Choice = {
  value: boolean;
  title: string;
  description: string;
  icon: string;
};
export default function EventOptionChoice({
  legend,
  name,
  value,
  choices,
  onChange,
}: {
  legend: string;
  name: string;
  value: boolean;
  choices: Choice[];
  onChange: (value: boolean) => void;
}) {
  return (
    <fieldset className="event-option-choice">
      <legend>{legend}</legend>
      <div className="event-option-group" role="radiogroup" aria-label={legend}>
        {choices.map((choice) => (
          <label
            key={String(choice.value)}
            className={`event-option-card ${value === choice.value ? "is-selected" : ""}`}
          >
            <input
              type="radio"
              name={name}
              value={String(choice.value)}
              checked={value === choice.value}
              onChange={() => onChange(choice.value)}
            />
            <span className="custom-radio-indicator" aria-hidden="true">
              <span className="custom-radio-dot" />
            </span>
            <span className="event-option-body">
              <span className="event-option-heading">
                <Icon name={choice.icon} />
                <strong>{choice.title}</strong>
              </span>
              <small>{choice.description}</small>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
