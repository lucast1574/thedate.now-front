// Check the ZIP directory before decompression; never accept macros or giant workbooks.
export function validateWorkbookZip(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer),
    view = new DataView(buffer);
  if (bytes.length > 2_000_000 || bytes.length < 22)
    throw new Error("Excel debe ocupar como máximo 2 MB.");
  let end = bytes.length - 22;
  while (
    end >= Math.max(0, bytes.length - 65557) &&
    view.getUint32(end, true) !== 0x06054b50
  )
    end--;
  if (end < 0 || end < bytes.length - 65557)
    throw new Error("El archivo no es un Excel válido.");
  const entries = view.getUint16(end + 10, true),
    offset = view.getUint32(end + 16, true);
  if (entries > 200 || view.getUint16(end + 4, true) !== 0 || offset > end)
    throw new Error("Excel demasiado complejo.");
  let cursor = offset,
    size = 0;
  for (let i = 0; i < entries; i++) {
    if (cursor + 46 > end || view.getUint32(cursor, true) !== 0x02014b50)
      throw new Error("Excel dañado.");
    const length = view.getUint16(cursor + 28, true);
    const next =
      cursor +
      46 +
      length +
      view.getUint16(cursor + 30, true) +
      view.getUint16(cursor + 32, true);
    if (next > end || view.getUint16(cursor + 8, true) & 1)
      throw new Error("Excel protegido o dañado.");
    size += view.getUint32(cursor + 24, true);
    const name = new TextDecoder().decode(
      bytes.subarray(cursor + 46, cursor + 46 + length),
    );
    if (/vbaProject|\.bin$/i.test(name))
      throw new Error("Usa .xlsx sin macros.");
    cursor = next;
  }
  if (size > 20_000_000) throw new Error("El contenido de Excel supera 20 MB.");
}
