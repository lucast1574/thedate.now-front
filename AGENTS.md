<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Organización del repositorio

- Empieza por `docs/frontend-map.md`; lee después solo los archivos del área que vas a modificar.
- Mantén los puntos de entrada de las dos aplicaciones en `apps/the-date/src/app` y `apps/save-the-date/src/app`. Delega en las mismas implementaciones de `src/app`, funcionalidades de `src/features`, widgets de `src/components` y lógica de `src/lib`. No dupliques funciones por producto; solo cambia identidad y plantillas. `src/app` también conserva el renderizador independiente de invitaciones.
- Divide por responsabilidad; no concentres sesión, formularios, peticiones y renderizado en un solo componente.
- Mantén los archivos de `src` por debajo de 200 líneas útiles. ESLint comprueba este límite.
- Reutiliza tipos, transporte HTTP, cookies, iconos y widgets existentes. Evita barrels y duplicar modelos.
- Respeta el orden de imports de CSS y las fronteras entre código cliente y servidor.
- Ejecuta `npm run check` tras cambios estructurales. No añadas servicios reales a las pruebas unitarias.

- Los estilos compartidos usan tokens neutros en `src/styles/tokens.css`; cada app importa solo su tema de `src/styles/products`. Define la identidad en el HTML del servidor, nunca después de hidratar.
- Las plantillas nuevas deben usar espacios `template-photo`; no selecciones automáticamente medios de la biblioteca del usuario.
