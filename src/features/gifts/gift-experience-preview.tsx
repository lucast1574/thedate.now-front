"use client";
import { useState } from "react";
import Icon from "@/components/icon";
import type { GuestWishlist } from "@/lib/events/wishlist";
import GiftCodeEntry from "./gift-code-entry";
import GuestWishlistView from "./guest-wishlist-view";
import {
  exampleProducts,
  exampleToken,
  exampleWishlist,
} from "./gift-examples";

export default function GiftExperiencePreview({
  wedding = false,
  initial,
  imageSource,
}: {
  wedding?: boolean;
  initial?: GuestWishlist;
  imageSource?: (id: string) => string | undefined;
}) {
  const [step, setStep] = useState<"entry" | "list">("list");
  const [selected, setSelected] = useState("");
  const [notice, setNotice] = useState("");
  const source = initial || exampleWishlist(wedding);
  const data = {
    ...source,
    items: source.items.map((item) => ({
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
            Prueba la entrada y elige un regalo. Las reservas de esta vista no
            se guardan.
          </p>
        </div>
        <button
          className="gift-secondary"
          onClick={() => {
            setSelected("");
            setNotice("");
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
          <span>1</span> Entrar con mi invitación
        </button>
        <Icon name="chevron" />
        <button aria-pressed={step === "list"} onClick={() => setStep("list")}>
          <span>2</span>{" "}
          {selected ? "Mi regalo elegido" : "Ver y elegir regalos"}
        </button>
      </div>
      <div
        className={`gift-preview-canvas ${wedding ? "gifts-wedding" : "gifts-general"}`}
      >
        {step === "entry" ? (
          <GiftCodeEntry
            example={`https://celebracion.${wedding ? "save." : ""}thedate.now/rsvp/${exampleToken}`}
            onEnter={() => setStep("list")}
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
