"use client";
import { useTranslator } from "@/lib/i18n/react";

import { useState } from "react";
import Icon from "@/components/icon";
import type { GuestWishlist } from "@/lib/events/wishlist";
import GiftPreviewInvitation from "./gift-preview-invitation";
import GuestWishlistView from "./guest-wishlist-view";
import { exampleProducts, exampleWishlist } from "./gift-examples";

export default function GiftExperiencePreview({
  wedding = false,
  initial,
  imageSource,
}: {
  wedding?: boolean;
  initial?: GuestWishlist;
  imageSource?: (id: string) => string | undefined;
}) {
  const i18n = useTranslator();

  const [step, setStep] = useState<"entry" | "list">(
    initial ? "list" : "entry",
  );
  const [empty, setEmpty] = useState(false);
  const [selected, setSelected] = useState("");
  const [notice, setNotice] = useState("");
  const source = initial || exampleWishlist(wedding, i18n);
  const data = {
    ...source,
    items: (empty ? [] : source.items).map((item) => ({
      ...item,
      mine: item.id === selected,
      reserved: item.reserved || item.id === selected,
    })),
  };
  return (
    <section
      className="gift-experience-preview"
      aria-label={i18n("Vista previa de la experiencia del invitado")}
    >
      <header className="gift-preview-toolbar">
        <div>
          <span className="gift-preview-label">
            {initial
              ? i18n("Tu lista · Vista del invitado")
              : i18n("Productos de ejemplo · Vista del invitado")}
          </span>
          <p>
            {i18n(
              "Abre la lista desde la invitación y prueba una reserva. Los cambios de esta vista no se guardan.",
            )}
          </p>
        </div>
        {!initial && (
          <button
            className="gift-secondary"
            onClick={() => {
              setEmpty(!empty);
              setSelected("");
              setNotice("");
              setStep("list");
            }}
          >
            {empty
              ? i18n("Ver regalos de ejemplo")
              : i18n("Ver lista por preparar")}
          </button>
        )}
        <button
          className="gift-secondary"
          onClick={() => {
            setSelected("");
            setNotice("");
            setEmpty(false);
            setStep("entry");
          }}
        >
          <Icon name="refresh" /> {i18n("Reiniciar recorrido")}
        </button>
      </header>
      <div
        className="gift-preview-steps"
        aria-label={i18n("Recorrido del invitado")}
      >
        <button
          aria-pressed={step === "entry"}
          onClick={() => setStep("entry")}
        >
          <span>1</span> {i18n("Desde la invitación")}
        </button>
        <Icon name="chevron" />
        <button aria-pressed={step === "list"} onClick={() => setStep("list")}>
          <span>2</span>{" "}
          {selected ? i18n("Mi regalo elegido") : i18n("Lista de regalos")}
        </button>
      </div>
      <div
        className={`gift-preview-canvas ${wedding ? "gifts-wedding" : "gifts-general"}`}
      >
        {step === "entry" ? (
          <GiftPreviewInvitation
            title={source.event.title}
            wedding={wedding}
            onOpen={() => setStep("list")}
          />
        ) : (
          <GuestWishlistView
            data={data}
            preview
            notice={notice}
            imageSource={(item) =>
              initial
                ? imageSource?.(item.id)
                : exampleProducts(i18n).find(
                    (product) => product.id === item.id,
                  )?.image
            }
            onChoose={async (id, release) => {
              if (
                !release &&
                (selected ||
                  source.items.find((item) => item.id === id)?.reserved)
              )
                return false;
              setSelected(release ? "" : id);
              setNotice(
                release
                  ? i18n("Elección liberada. Puedes probar con otro regalo.")
                  : i18n(
                      "Reserva de prueba confirmada. El siguiente paso es comprarlo en la tienda.",
                    ),
              );
              return true;
            }}
          />
        )}
      </div>
    </section>
  );
}
