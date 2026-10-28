import { useRef, useState } from "react";
import Icon from "@/components/icon";
export default function GuestFileDropzone({
  locked,
  busy,
  fileName,
  onRead,
  onError,
}: {
  locked: boolean;
  busy: boolean;
  fileName: string;
  onRead: (file?: File) => Promise<void>;
  onError: (message: string) => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  return (
    <div
      className={`guest-dropzone ${dragging ? "is-dragging" : ""}`}
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
        if (e.dataTransfer.files.length !== 1) {
          onError("Selecciona un solo archivo Excel.");
          return;
        }
        void onRead(e.dataTransfer.files[0]);
      }}
    >
      <Icon name="table" />
      <strong>
        {busy
          ? "Estamos revisando tu lista…"
          : fileName || "Arrastra aquí tu Excel"}
      </strong>
      <span>También puedes buscarlo en tus archivos.</span>
      <button
        type="button"
        disabled={locked}
        onClick={() => fileInput.current?.click()}
      >
        Elegir archivo
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
