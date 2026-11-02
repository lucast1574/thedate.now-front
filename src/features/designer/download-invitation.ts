async function embeddedAsset(url: string, base: string) {
  if (/^(data:|#)/.test(url)) return url;
  const response = await fetch(new URL(url, base));
  if (!response.ok)
    throw new Error("No se pudo preparar la descarga. Vuelve a intentarlo.");
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function embeddedCSS(css: string, base: string) {
  const matches = [...css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)];
  const assets = await Promise.all(
    matches.map(async (match) => [
      match[0],
      await embeddedAsset(match[1].trim(), base),
    ]),
  );
  for (const [original, asset] of assets)
    css = css.replaceAll(original, `url("${asset}")`);
  return css;
}

// A self-contained visual keepsake: no account, live event server or API needed.
export async function downloadInvitation(doc: Document, title: string) {
  await doc.fonts.ready;
  const copy = doc.documentElement.cloneNode(true) as HTMLElement;
  const head = copy.querySelector("head")!;
  const charset = doc.createElement("meta");
  charset.setAttribute("charset", "utf-8");
  head.prepend(charset);
  const styles = await Promise.all(
    [...doc.styleSheets].map(async (sheet) => {
      let css: string;
      try {
        css = [...sheet.cssRules].map((rule) => rule.cssText).join("\n");
      } catch {
        if (!sheet.href) throw new Error("No se pudo preparar la descarga.");
        const response = await fetch(sheet.href);
        if (!response.ok) throw new Error("No se pudo preparar la descarga.");
        css = await response.text();
      }
      return embeddedCSS(css, sheet.href || doc.baseURI);
    }),
  );
  copy
    .querySelectorAll("script, link, style, .invitation-opening, .invite-music")
    .forEach((node) => node.remove());
  const style = doc.createElement("style");
  style.textContent =
    styles.join("\n") +
    "\nhtml,body{margin:0}*,*::before,*::after{animation:none!important;transition:none!important}.invite-content{visibility:visible!important;opacity:1!important}";
  head.appendChild(style);
  const label = head.querySelector("title");
  if (label) label.textContent = title;
  await Promise.all(
    [...copy.querySelectorAll<HTMLElement>("[style]")].map(async (node) => {
      node.setAttribute(
        "style",
        await embeddedCSS(node.getAttribute("style") || "", doc.baseURI),
      );
    }),
  );
  await Promise.all(
    [...copy.querySelectorAll<HTMLImageElement>("img")].map(async (image) => {
      image.src = await embeddedAsset(
        image.getAttribute("src") || "",
        doc.baseURI,
      );
      image.removeAttribute("srcset");
      image.loading = "eager";
    }),
  );
  await Promise.all(
    [...copy.querySelectorAll<SVGUseElement>("svg use")].map(async (use) => {
      const href = use.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      const url = new URL(href, doc.baseURI);
      const response = await fetch(url.href.split("#")[0]);
      if (!response.ok) throw new Error("No se pudo preparar la descarga.");
      const sprite = new DOMParser().parseFromString(
        await response.text(),
        "image/svg+xml",
      );
      const symbol = sprite.getElementById(
        decodeURIComponent(url.hash.slice(1)),
      );
      if (!symbol) throw new Error("No se pudo preparar la descarga.");
      use.replaceWith(
        ...[...symbol.childNodes].map((node) => node.cloneNode(true)),
      );
    }),
  );
  copy.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((link) => {
    link.href = new URL(link.getAttribute("href")!, doc.baseURI).href;
  });
  const url = URL.createObjectURL(
    new Blob(["<!doctype html>\n", copy.outerHTML], {
      type: "text/html;charset=utf-8",
    }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `${title.replace(/[^\p{L}\p{N} -]/gu, "").slice(0, 80) || "invitacion"}.html`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
