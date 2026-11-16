import { useTranslator } from "@/lib/i18n/react";
import SeatingRotationControl from "./seating-rotation-control";
import Icon from "@/components/icon";
import RemoveSeatingItem from "./remove-seating-item";
import { moveVenueArea, type VenueArea } from "@/lib/events/venue-areas";
import type { SeatingPlan } from "@/lib/events/seating";
export default function VenueAreaPopover({
  area,
  plan,
  onChange,
  onClose,
  getViewport,
}: {
  area: VenueArea;
  plan: SeatingPlan;
  onChange: (plan: SeatingPlan) => void;
  onClose: () => void;
  getViewport?: () => { width: number; height: number } | undefined;
}) {
  const i18n = useTranslator();

  function patch(fields: Partial<VenueArea>) {
    const next = moveVenueArea(
      { ...area, ...fields },
      area.x,
      area.y,
      plan.width,
      plan.height,
      getViewport?.(),
    );
    onChange({
      ...plan,
      areas: plan.areas?.map((a) => (a.id === area.id ? next : a)),
    });
  }
  return (
    <>
      <header>
        <div>
          <h3 id="table-popover-title">{area.name}</h3>
          <small>{i18n("Ajusta el tamaño aquí mismo.")}</small>
        </div>
        <button
          type="button"
          aria-label={i18n("Cerrar espacio")}
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
      </header>
      <div className="venue-popover-fields">
        <label>
          {i18n("Nombre")}{" "}
          <input
            maxLength={100}
            value={area.name}
            onChange={(e) => patch({ name: e.target.value })}
          />
        </label>
        <label>
          {i18n("Ancho ·")} {area.width}
          <input
            type="range"
            min={80}
            max={800}
            step={10}
            value={area.width}
            onChange={(e) => patch({ width: Number(e.target.value) })}
          />
        </label>
        <label>
          {i18n("Alto ·")} {area.height}
          <input
            type="range"
            min={60}
            max={600}
            step={10}
            value={area.height}
            onChange={(e) => patch({ height: Number(e.target.value) })}
          />
        </label>
      </div>
      <SeatingRotationControl
        value={area.rotation || 0}
        onChange={(rotation) => patch({ rotation })}
      />
      <RemoveSeatingItem
        name={area.name}
        description={i18n(
          "Se quitará este espacio. Las mesas y sus invitados se conservan.",
        )}
        onRemove={() => {
          onChange({
            ...plan,
            areas: plan.areas?.filter((a) => a.id !== area.id),
          });
          onClose();
        }}
      />
    </>
  );
}
