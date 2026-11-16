import { useTranslator } from "@/lib/i18n/react";
import type { Dispatch, SetStateAction } from "react";
import type { Event } from "@/lib/events/types";
import {
  admissionCurrencies,
  admissionMoney,
  type Admission,
} from "@/lib/events/admission";
import Listbox from "@/components/listbox";
import Icon from "@/components/icon";
import EventOptionChoice from "./event-option-choice";

export default function EventAdmission({
  draft,
  setDraft,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
}) {
  const i18n = useTranslator();
  if (draft.kind !== "general") return null;
  const admission: Admission = draft.admission || {
    enabled: false,
    currency: "PEN",
    amountCents: 0,
    basis: "person",
    instructions: "",
  };
  const locked = Boolean(draft.guestPaymentCount);
  const update = (patch: Partial<Admission>) =>
    setDraft((current) => ({
      ...current,
      admission: { ...admission, ...patch },
    }));
  return (
    <section className="event-form-card event-admission">
      <div className="event-form-card-heading">
        <span>
          <Icon name="lucide:banknote" />
        </span>
        <div>
          <h2>{i18n("Costo para los asistentes")}</h2>
          <p>
            {i18n("Define el aporte y lleva el control de lo que recibes.")}
          </p>
        </div>
      </div>
      <fieldset disabled={locked} className="admission-mode">
        <EventOptionChoice
          legend={i18n("¿Este evento tiene costo?")}
          name="event-admission-enabled"
          value={admission.enabled}
          onChange={(enabled) =>
            update({
              enabled,
              ...(!enabled ? { amountCents: 0, instructions: "" } : {}),
            })
          }
          choices={[
            {
              value: false,
              title: i18n("Sin costo"),
              description: i18n(
                "No se mostrará un aporte ni un apartado de pagos.",
              ),
              icon: "lucide:ticket",
            },
            {
              value: true,
              title: i18n("Con costo"),
              description: i18n(
                "Recibe las capturas por WhatsApp y registra los pagos.",
              ),
              icon: "lucide:banknote",
            },
          ]}
        />
      </fieldset>
      {admission.enabled && (
        <div className="admission-fields">
          <div className="admission-fields-row">
            <label>
              {i18n("Moneda")}
              <Listbox
                value={admission.currency}
                disabled={locked}
                onValueChange={(currency) => update({ currency })}
              >
                {admissionCurrencies.map(([code, label]) => (
                  <option key={code} value={code}>
                    {i18n(label)} · {code}
                  </option>
                ))}
              </Listbox>
            </label>
            <label>
              {i18n("Importe")} · {admission.currency}
              <input
                required
                type="number"
                min="0.01"
                max="1000000"
                step="0.01"
                readOnly={locked}
                value={admission.amountCents ? admission.amountCents / 100 : ""}
                onChange={(e) =>
                  update({
                    amountCents: Math.round(Number(e.target.value) * 100),
                  })
                }
              />
            </label>
            <label>
              {i18n("Se cobra")}
              <Listbox
                value={admission.basis}
                disabled={locked}
                onValueChange={(basis) =>
                  update({ basis: basis as Admission["basis"] })
                }
              >
                <option value="person">{i18n("Por persona")}</option>
                <option value="group">{i18n("Por invitación o grupo")}</option>
              </Listbox>
            </label>
          </div>
          <label>
            {i18n("Instrucciones para pagar")}
            <textarea
              required
              maxLength={2000}
              value={admission.instructions}
              placeholder={i18n(
                "Indica tu cuenta, Yape, Plin u otro medio para recibir el pago.",
              )}
              onChange={(e) => update({ instructions: e.target.value })}
            />
          </label>
          <div className="admission-preview">
            <strong>
              {admissionMoney(
                admission.amountCents,
                admission.currency,
                i18n.locale,
              )}{" "}
              ·{" "}
              {admission.basis === "person"
                ? i18n("por persona")
                : i18n("por invitación")}
            </strong>
            <p>
              {i18n(
                "Los invitados enviarán la foto al WhatsApp de la invitación. Tú verificas el ingreso y registras el importe.",
              )}
            </p>
          </div>
          {locked && (
            <p role="status">
              {i18n(
                "El costo y la moneda están bloqueados porque ya registraste pagos.",
              )}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
