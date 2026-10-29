import { useRef, useState } from "react";
import Icon from "@/components/icon";
export default function GuestFileDropzone({
  locked,
  busy,
  fileName,
  complete = false,
  uploaded = false,
  onRead,
  onError,
}: {
  locked: boolean;
  busy: boolean;
  fileName: string;
  complete?: boolean;
  uploaded?: boolean;
  onRead: (file?: File) => Promise<void>;
  onError: (message: string) => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  return (
    <div
      className={`guest-dropzone ${dragging ? "is-dragging" : ""} ${complete ? "is-complete" : ""}`}
      aria-busy={busy}
      onDragOver={(e) => {
        e.preventDefault();
        if (!locked) setDragging(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node))
          setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (locked) return;
        if (e.dataTransfer.files.length !== 1) {
          onError("Selecciona un solo archivo Excel.");
          return;
        }
        void onRead(e.dataTransfer.files[0]);
      }}
    >
      <Icon name={complete ? "check" : "table"} />
      <strong>
        {busy
          ? "Revisando y añadiendo invitados…"
          : complete
            ? "Listo, tu lista está al día"
            : fileName ||
              (uploaded
                ? "Arrastra otro Excel cuando quieras"
                : "Arrastra aquí tu Excel")}
      </strong>
      <span>
        {complete
          ? "Ya puedes ver a tus invitados en la lista de abajo."
          : "También puedes buscarlo en tus archivos."}
      </span>
      <button
        type="button"
        disabled={locked}
        onClick={() => fileInput.current?.click()}
      >
        {uploaded ? "Subir otro Excel" : "Elegir archivo"}
      </button>
      <small>Excel (.xlsx) · Hasta 500 invitados por archivo</small>
      <input
        ref={fileInput}
        className="guest-file-input"
        aria-label="Seleccionar Excel de invitados"
        type="file"
        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        disabled={locked}
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          void onRead(file);
        }}
      />
    </div>
  );
}
