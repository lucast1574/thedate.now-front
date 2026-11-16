import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
export async function api<T>(
  path: string,
  method = "GET",
  body?: unknown,
  i18n: Translator = spanishTranslator,
): Promise<T> {
  const response = await fetch(path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(
      i18n(
        typeof data.error === "string"
          ? data.error
          : "No se pudo completar la acción",
      ),
    );
  return data as T;
}
