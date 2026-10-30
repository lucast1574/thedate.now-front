import Icon from "@/components/icon";
export default function SeatingEmptyInspector() {
  return (
    <aside className="seating-instructions seating-organizer-empty">
      <Icon name="lucide:mouse-pointer-2" />
      <h3>Selecciona una mesa</h3>
      <p>
        Su organizador aparecerá aquí. Podrás revisar sus asientos y asignar a
        tus invitados.
      </p>
      <ol>
        <li>Elige una mesa en el plano.</li>
        <li>Pulsa «Añadir invitados» para sentarlos juntos.</li>
        <li>Los cambios se guardan automáticamente.</li>
      </ol>
      <small>
        El plano es orientativo. Revisa pasillos y distancias con tu local.
      </small>
    </aside>
  );
}
