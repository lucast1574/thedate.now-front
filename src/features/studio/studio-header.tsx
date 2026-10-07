import Brand from "@/components/brand";
export default function StudioHeader({ wedding }: { wedding: boolean }) {
  return (
    <header className="office-header">
      <a
        className="office-brand"
        href={wedding ? "https://save.thedate.now" : "https://thedate.now"}
      >
        <Brand wedding={wedding} />
      </a>
      <span>{wedding ? "Estudio de bodas" : "Mi espacio de eventos"}</span>
    </header>
  );
}
