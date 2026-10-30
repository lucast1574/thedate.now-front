"use client";
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
  const [step, setStep] = useState<"entry" | "list">(
    initial ? "list" : "entry",
  );
  const [empty, setEmpty] = useState(false);
  const [selected, setSelected] = useState("");
  const [notice, setNotice] = useState("");
  const source = initial || exampleWishlist(wedding);
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
      aria-label="Vista previa de la experiencia del invitado"
    >
      <header className="gift-preview-toolbar">
        <div>
          <span className="gift-preview-label">
            {initial
              ? "Tu lista · Vista del invitado"
              : "Productos de ejemplo · Vista del invitado"}
          </span>
          <p>
            Abre la lista desde la invitación y prueba una reserva. Los cambios
            de esta vista no se guardan.
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
            {empty ? "Ver regalos de ejemplo" : "Ver lista por preparar"}
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
          <Icon name="refresh" /> Reiniciar recorrido
        </button>
      </header>
      <div className="gift-preview-steps" aria-label="Recorrido del invitado">
        <button
          aria-pressed={step === "entry"}
          onClick={() => setStep("entry")}
        >
          <span>1</span> Desde la invitación
        </button>
        <Icon name="chevron" />
        <button aria-pressed={step === "list"} onClick={() => setStep("list")}>
          <span>2</span> {selected ? "Mi regalo elegido" : "Lista de regalos"}
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
                : exampleProducts.find((product) => product.id === item.id)
                    ?.image
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
                  ? "Elección liberada. Puedes probar con otro regalo."
                  : "Reserva de prueba confirmada. El siguiente paso es comprarlo en la tienda.",
              );
              return true;
            }}
          />
        )}
      </div>
    </section>
  );
}
