<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Organización del repositorio

- Empieza por `docs/frontend-map.md`; lee después solo los archivos del área que vas a modificar.
- Mantén rutas en `src/app`, funcionalidades en `src/features`, widgets compartidos en `src/components` y lógica común en `src/lib`.
- Divide por responsabilidad; no concentres sesión, formularios, peticiones y renderizado en un solo componente.
- Mantén los archivos de `src` por debajo de 200 líneas útiles. ESLint comprueba este límite.
- Reutiliza tipos, transporte HTTP, cookies, iconos y widgets existentes. Evita barrels y duplicar modelos.
- Respeta el orden de imports de CSS y las fronteras entre código cliente y servidor.
- Ejecuta `npm run check` tras cambios estructurales. No añadas servicios reales a las pruebas unitarias.
