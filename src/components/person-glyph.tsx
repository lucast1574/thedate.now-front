import type { Gender } from "@/lib/events/seating";
export default function PersonGlyph({
  gender = "unspecified",
}: {
  gender?: Gender;
}) {
  return (
    <svg
      viewBox="0 0 24 32"
      role="img"
      aria-label={
        gender === "woman" ? "Mujer" : gender === "man" ? "Hombre" : "Persona"
      }
      className="person-glyph"
    >
      <circle cx="12" cy="5" r="4" fill="currentColor" />
      <path
        d={
          gender === "woman"
            ? "M9 11h6l5 13h-5v7h-3v-7h-1v7H8v-7H4z"
            : "M8 11h8l3 10h-3v10h-3V21h-2v10H8V21H5z"
        }
        fill="currentColor"
      />
    </svg>
  );
}
