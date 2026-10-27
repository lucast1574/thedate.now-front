import type { Kind } from "@/lib/events/types";

// Do not mount invitation content until its own styles have finished loading.
export async function preparePreviewDocument(
  doc: Document,
  source: Document,
  product: Kind,
) {
  doc.documentElement.className = source.documentElement.className;
  doc.documentElement.dataset.product = product;
  doc.documentElement.dataset.application =
    product === "wedding" ? "save-the-date" : "the-date";
  const pending = Array.from(
    source.querySelectorAll('link[rel="stylesheet"], style'),
  ).map((node) => {
    const copy = node.cloneNode(true) as HTMLElement;
    const loaded =
      copy.tagName === "LINK"
        ? new Promise<void>((resolve, reject) => {
            copy.addEventListener("load", () => resolve(), { once: true });
            copy.addEventListener(
              "error",
              () =>
                reject(
                  new Error(
                    "No se pudieron cargar los estilos de la vista previa.",
                  ),
                ),
              { once: true },
            );
          })
        : Promise.resolve();
    doc.head.appendChild(copy);
    return loaded;
  });
  await Promise.all(pending);
  return doc.body;
}
