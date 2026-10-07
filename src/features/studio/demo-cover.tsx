import Icon from "@/components/icon";
import type { Event } from "@/lib/events/types";
export default function DemoCover({ event }: { event: Event }) {
  const wedding = event.kind === "wedding";
  return (
    <div
      className={`demo-cover ${wedding ? "demo-cover-wedding" : "demo-cover-general"}`}
      aria-hidden="true"
    >
      <div className="demo-cover-content">
        <Icon name={wedding ? "flower" : "sparkle"} />
        <span className="demo-cover-kicker">
          {wedding ? "CELEBREMOS EL AMOR" : "THE DATE · A CELEBRAR"}
        </span>
        <strong>{event.title}</strong>
        <span className="demo-cover-rule" />
        <p>{event.description}</p>
      </div>
    </div>
  );
}
