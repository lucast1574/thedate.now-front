import Brand from "@/components/brand";
import type { User } from "@/lib/events/types";
export default function StudioHeader({
  wedding,
  user,
  onSignOut,
}: {
  wedding: boolean;
  user: User | null;
  onSignOut: () => void;
}) {
  return (
    <header className="office-header">
      <a
        className="office-brand"
        href={wedding ? "https://save.thedate.now" : "https://thedate.now"}
      >
        <Brand wedding={wedding} />
      </a>
      <div>
        {user ? (
          <>
            <a href="/affiliates">Afiliados</a>
            {user.role === "admin" && <a href="/admin">Administración</a>}
            <a
              className="portal-switch"
              href={
                wedding
                  ? "https://crea.thedate.now"
                  : "https://studio.save.thedate.now"
              }
            >
              {wedding ? "Otros eventos" : "Bodas"} ↗
            </a>
            <span>{user.name}</span>
            <button onClick={onSignOut}>Salir</button>
          </>
        ) : (
          <span>{wedding ? "Estudio de bodas" : "Mi espacio de eventos"}</span>
        )}
      </div>
    </header>
  );
}
