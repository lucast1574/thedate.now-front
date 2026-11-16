import { useTranslator } from "@/lib/i18n/react";

export default function SupportPagination({
  page,
  pages,
  setPage,
  setSelected,
}: {
  page: number;
  pages: number;
  setPage: (update: (value: number) => number) => void;
  setSelected: (value: null) => void;
}) {
  const i18n = useTranslator();
  return (
    <nav
      className="support-pagination"
      aria-label={i18n("Páginas de reportes")}
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => {
          setPage((value) => value - 1);
          setSelected(null);
        }}
      >
        {i18n("Anterior")}
      </button>
      <span>
        {i18n("Página")} {page} {i18n("de")} {pages}
      </span>
      <button
        type="button"
        disabled={page >= pages}
        onClick={() => {
          setPage((value) => value + 1);
          setSelected(null);
        }}
      >
        {i18n("Siguiente")}
      </button>
    </nav>
  );
}
