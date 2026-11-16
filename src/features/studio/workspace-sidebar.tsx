"use client";
import { useTranslator } from "@/lib/i18n/react";

import { useRouter } from "next/navigation";
import InvitationSwitcher from "./invitation-switcher";
import { useActiveInvitation } from "./use-active-invitation";
import { organizationEventHref } from "@/lib/events/organization-events";
import Link from "next/link";
import ProductAlternative from "./product-alternative";
import Brand from "@/components/brand";
import Icon from "@/components/icon";
import UserAvatar from "@/components/user-avatar";
import type { User } from "@/lib/events/types";
export default function WorkspaceSidebar({
  eventId,
  guard,
  wedding,
  user,
  active = "events",
}: {
  eventId?: string;
  guard?: () => boolean;
  wedding: boolean;
  user: User;
  active?:
    | "events"
    | "profile"
    | "admin"
    | "affiliates"
    | "support"
    | "guests"
    | "tables"
    | "gifts"
    | "collaboration";
}) {
  const i18n = useTranslator();

  const router = useRouter();
  const { events, selected, error } = useActiveInvitation(
    user,
    wedding ? "wedding" : "general",
    eventId,
  );
  const toolHref = (tool: string) =>
    selected && !selected.isDemo && selected.paymentStatus === "paid"
      ? organizationEventHref(selected, tool)
      : `/organizar?tool=${tool}`;
  return (
    <aside
      className="workspace-sidebar"
      onClickCapture={(e) => {
        if ((e.target as HTMLElement).closest("a") && guard && !guard())
          e.preventDefault();
      }}
    >
      <Link className="workspace-brand" href="/">
        <Brand wedding={wedding} />
      </Link>
      <InvitationSwitcher
        events={events}
        selected={selected}
        error={error}
        onSelect={(event) => {
          if (guard && !guard()) return;
          router.push(
            ["guests", "tables", "gifts"].includes(active) &&
              !event.isDemo &&
              event.paymentStatus === "paid"
              ? organizationEventHref(event, active)
              : event.isDemo || event.paymentStatus === "paid"
                ? `/editor/${encodeURIComponent(event.id)}`
                : `/?event=${encodeURIComponent(event.id)}`,
          );
        }}
      />
      <p className="workspace-label">
        {wedding ? i18n("TU ESTUDIO") : i18n("TU ESPACIO")}
      </p>
      <nav aria-label={i18n("Tu espacio")}>
        <Link href="/" aria-current={active === "events" ? "page" : undefined}>
          <Icon name="layout" />
          {i18n("Mis invitaciones")}
        </Link>
        {(
          [
            ["guests", "users", i18n("Invitados"), i18n("Lista y respuestas")],
            ["tables", "table", i18n("Mesas"), i18n("Distribución del evento")],
            [
              "gifts",
              "lucide:gift",
              i18n("Lista de regalos"),
              i18n("Quién regala cada detalle"),
            ],
          ] as const
        ).map(([key, icon, title, hint]) => (
          <Link
            key={key}
            href={toolHref(key)}
            aria-current={active === key ? "page" : undefined}
          >
            <Icon name={icon} />
            <span>
              {title}
              <small>{hint}</small>
            </span>
          </Link>
        ))}
        {(user.role === "admin" ||
          user.role === (wedding ? "planner" : "organizer")) && (
          <Link
            href="/compartir"
            aria-current={active === "collaboration" ? "page" : undefined}
          >
            <Icon name="users" />
            <span>
              {i18n("Celebraciones compartidas")}{" "}
              <small>
                {wedding
                  ? i18n("Diseña con tus parejas")
                  : i18n("Crea junto a tus clientes")}
              </small>
            </span>
          </Link>
        )}
        {user.role === (wedding ? "planner" : "organizer") && (
          <Link
            href="/affiliates"
            aria-current={active === "affiliates" ? "page" : undefined}
          >
            <Icon name="sparkle" />
            {i18n("Afiliados")}
          </Link>
        )}
        <Link
          href="/support"
          aria-current={active === "support" ? "page" : undefined}
        >
          <Icon name="ticket" />
          {i18n("Soporte")}
        </Link>
        {user.role === "admin" && (
          <Link
            href="/admin"
            aria-current={active === "admin" ? "page" : undefined}
          >
            <Icon name="table" />
            {i18n("Administración")}
          </Link>
        )}
      </nav>
      <div className="workspace-sidebar-bottom">
        <ProductAlternative wedding={wedding} />
        <Link
          className="workspace-user"
          href="/profile"
          aria-label={i18n("Mi perfil")}
          aria-current={active === "profile" ? "page" : undefined}
        >
          <UserAvatar user={user} />
          <span>
            <strong>{user.name}</strong>
            <small>{i18n("Mi perfil")}</small>
          </span>
        </Link>
      </div>
    </aside>
  );
}
