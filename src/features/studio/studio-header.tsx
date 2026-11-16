import { useTranslator } from "@/lib/i18n/react";
import Brand from "@/components/brand";
export default function StudioHeader({ wedding }: { wedding: boolean }) {
  const i18n = useTranslator();

  return (
    <header className="office-header">
      <a
        className="office-brand"
        href={wedding ? "https://save.thedate.now" : "https://thedate.now"}
      >
        <Brand wedding={wedding} />
      </a>
      <span>
        {wedding ? i18n("Estudio de bodas") : i18n("Mi espacio de eventos")}
      </span>
    </header>
  );
}
