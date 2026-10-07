export default function PreviewWatermark({ wedding }: { wedding: boolean }) {
  return (
    <div
      className="preview-watermark"
      aria-hidden="true"
      data-product={wedding ? "wedding" : "general"}
    >
      <span>
        Vista previa<small>{wedding ? "Save the Date" : "The Date"}</small>
      </span>
    </div>
  );
}
