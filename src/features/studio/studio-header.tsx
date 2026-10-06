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
