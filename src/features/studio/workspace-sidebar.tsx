import Link from "next/link";
import ProductAlternative from "./product-alternative";
import Brand from "@/components/brand";
import Icon from "@/components/icon";
import UserAvatar from "@/components/user-avatar";
import type { User } from "@/lib/events/types";
export default function WorkspaceSidebar({
  wedding,
  user,
  active = "events",
}: {
  wedding: boolean;
  user: User;
  active?: "events" | "profile" | "admin" | "affiliates";
}) {
  return (
    <aside className="workspace-sidebar">
      <Link className="workspace-brand" href="/">
        <Brand wedding={wedding} />
      </Link>
      <p className="workspace-label">{wedding ? "TU ESTUDIO" : "TU ESPACIO"}</p>
      <nav aria-label="Tu espacio">
        <Link href="/" aria-current={active === "events" ? "page" : undefined}>
          <Icon name="layout" />
          Mis invitaciones
        </Link>
        <Link
          href="/profile"
          aria-current={active === "profile" ? "page" : undefined}
        >
          <Icon name="users" />
          Mi perfil
        </Link>
        <Link
          href="/affiliates"
          aria-current={active === "affiliates" ? "page" : undefined}
        >
          <Icon name="sparkle" />
          Afiliados
        </Link>
        {user.role === "admin" && (
          <Link
            href="/admin"
            aria-current={active === "admin" ? "page" : undefined}
          >
            <Icon name="table" />
            Administración
          </Link>
        )}
      </nav>
      <div className="workspace-sidebar-bottom">
        <ProductAlternative wedding={wedding} />
        <Link className="workspace-user" href="/profile">
          <UserAvatar user={user} />
          <span>
            <strong>{user.name}</strong>
            <small>Tu cuenta</small>
          </span>
        </Link>
      </div>
    </aside>
  );
}
