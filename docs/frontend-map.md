# Mapa del frontend

Lee este mapa antes de explorar todo `src/`. Después abre solo el módulo de la tarea.

## Estructura

```text
src/
  app/           Rutas Next.js, layout y adaptadores HTTP
  components/    Widgets compartidos entre funcionalidades
  features/
    marketing/   Landings general y de bodas, divididas en secciones
    studio/      Sesión, eventos, formularios y paneles de organización
    designer/    Editor, secciones, vista previa y guardado del diseño
    invitations/ Invitación pública y carga de datos en el servidor
    rsvp/        Formulario y lógica de confirmación de asistencia
    couples/     Aceptación del acceso de una pareja
  lib/
    events/      Tipos, fechas, borradores, dominios e iconos compartidos
    api/         Cliente JSON, transporte servidor y proxy del estudio
    auth/        Cookie de sesión y callback de Google
  styles/        CSS legible; el orden de imports conserva la cascada
tests/           Regresiones de contratos, eventos y widgets
```

## Dónde cambiar cada cosa

| Tarea                                      | Archivos iniciales                                                              |
| ------------------------------------------ | ------------------------------------------------------------------------------- |
| Selección de página según host             | `src/app/page.tsx`, `src/lib/events/domains.ts`                                 |
| Landing general                            | `src/features/marketing/general/<sección>.tsx`                                  |
| Landing de bodas                           | `src/features/marketing/wedding/<sección>.tsx`                                  |
| Marca, botones, avisos o imágenes          | `src/components/`                                                               |
| Detalles de evento en invitación y RSVP    | `src/components/event-details.tsx`                                              |
| Composición del estudio                    | `src/features/studio/studio.tsx`                                                |
| Login y registro                           | `auth-panel.tsx`, `use-studio-session.ts` en studio                             |
| Selección, creación y edición de eventos   | `use-studio-events.ts`, `event-form.tsx` en studio                              |
| Campos básicos o modalidad/mapas           | `event-basics.tsx`, `event-location-fields.tsx`, `use-map-address.ts` en studio |
| Invitados y publicación                    | `guest-panel.tsx`, `publication-panel.tsx`, `use-event-actions.ts` en studio    |
| Acceso directo para parejas                | `src/features/studio/couple-access.tsx`                                         |
| Editor de diseño                           | `src/features/designer/invitation-designer.tsx`, `use-invitation-design.ts`     |
| Una sección editable                       | `src/features/designer/section-editor.tsx`                                      |
| Vista previa                               | `src/features/designer/design-preview.tsx`                                      |
| Invitación publicada                       | `src/features/invitations/invitation.tsx`, `invitation-sections.tsx`            |
| RSVP                                       | `src/features/rsvp/rsvp-form.tsx`, `use-rsvp.ts`, `response-fields.tsx`         |
| Proxy, errores HTTP y validación de origen | `src/lib/api/server.ts`, `studio-proxy.ts`                                      |
| Google y cookies                           | `src/lib/auth/`, `src/app/api/auth/google/`                                     |

## Límites de los módulos

- `app/` decide rutas y conecta solicitudes con módulos. La UI de negocio vive en `features/`.
- Un componente usado en varias funcionalidades vive en `components/`; uno específico permanece en su feature.
- Los hooks poseen estado, efectos y acciones. Los widgets reciben datos y callbacks explícitos.
- Los tipos comunes tienen una sola fuente en `lib/events/types.ts`. Evita redefinir modelos en cada formulario.
- `lib/api/client.ts` llama a `/api/` desde el navegador. `server.ts`, `config.ts` y `lib/auth/` son solo de servidor; no los importes desde componentes cliente.
- Los archivos que componen interfaces interactivas marcan la frontera con `"use client"`. Sus componentes hijos no necesitan repetirla si no son entradas independientes.
- Evita archivos de reexportaciones y abstracciones con un único uso que compliquen localizar la implementación.

## Estilos

`src/app/globals.css` importa 15 fragmentos en orden. Sus nombres indican el área y su número indica la posición en la cascada. Los fragmentos mantienen las reglas y media queries existentes; algunos límites incluyen la transición entre dos áreas. Para encontrar una regla, busca su clase en `src/styles/` con `rg` y abre ese archivo. No ordenes los imports alfabéticamente ni muevas overrides sin verificar la cascada.

## Verificación

`npm run check` ejecuta formato, lint, tipos, pruebas y build. ESLint rechaza archivos de código en `src/` de más de 200 líneas útiles y variables/imports sin usar. Las pruebas de Node aíslan las dependencias de Next y evitan solicitudes de red reales. No sustituyen pruebas E2E con servicios del backend.

## Integración con el backend reorganizado

- `src/lib/events/invitation-runtime.ts` y `src/proxy.ts` limitan cada contenedor a su evento configurado con `INVITATION_KIND`, `INVITATION_SLUG` e `INVITATION_EVENT_ID`.
- `/api/invitation-health` confirma la identidad del contenedor; `/api/public-photos/` usa la URL de backend configurada en el servidor.
- `use-deployment.ts` consulta publicación asíncrona. La UI muestra preparación, error/reintento y disponibilidad.
- Permisos del estudio dependen del propietario del evento; pertenecer como pareja no permite administrar invitados o publicar. `portals` y `creatorPortals` distinguen acceso y creación.
- El diseñador combina cambios guardados con el borrador local mediante `merge-design.ts`. Una subida o actualización de publicación no descarta secciones sin guardar.
- RSVP restaura elección/motivo persistidos, y los cupos Maybe respetan su vencimiento.

La configuración operativa, migración de reservas y límites de escala están documentados en el backend (`docs/rollout.md`).

## Editor independiente y flyers

- `/editor/[id]` abre únicamente eventos accesibles a la sesión. El backoffice enlaza al editor; los contenedores de invitaciones siguen rechazando rutas privadas.
- `features/designer/editor-page.tsx` carga el evento y `invitation-designer.tsx` compone controles, secciones, galería y visor modal.
- `preview-modal.tsx` y `design-preview.tsx` montan el mismo `Invitation` en un iframe con los estilos del sitio. Su viewport reproduce las media queries de móvil/escritorio; los enlaces se desactivan durante la previsualización.
- `components/flyer-surface.tsx` es el renderizador compartido. `lib/events/flyer.ts` define el contrato; coordenadas de lienzo se convierten a porcentajes y tamaños tipográficos relativos al ancho.
- `designer/flyer/` separa geometría, gestos con captura de puntero, inspector y composición. Cada sección conserva su lienzo; movimiento/rotación/resize se confirma al finalizar el gesto. Flechas, Shift+flechas y Delete permiten ajustes con teclado.
- `lib/events/template-catalog.ts` con `wedding-templates.ts` y `general-templates.ts`, `designer/template-thumbnail.ts` y `templates.ts` separan catálogo, miniaturas y aplicación. Hay tres opciones por modo y producto (12 en total). La galería consulta `/api/backend/templates` y usa el catálogo local como respaldo. `templateId` conserva la elección exacta; `resolveTemplateId` impide mezclar producto/modo. Aplicar una plantilla conserva el contenido y las capas existentes; cambiar de modo conserva los lienzos.
- `use-design-history.ts` mantiene hasta 60 pasos y avisa al salir con cambios sin guardar. El guardado explícito persiste en backend incluso sin pago; subir una imagen no descarta el borrador.
- `guest-import.tsx` ofrece revisión de CSV antes de enviarlo. `lib/events/guest-csv.ts` valida las filas; la API vuelve a validar. Solo eventos pagados habilitan herramientas de invitados; WhatsApp también requiere publicación.
- `styles/13-editor.css`, `14-editor-canvas.css` y `15-editor-modals.css` separan renderer/editor, lienzos y visores. El frontend y backend nuevos deben desplegarse juntos: la API antigua no acepta `designMode` ni `canvas`.

## Invitados, aforo y mesas

Ruta privada `/manager/[id]` para ambos productos; el estudio enlaza el gestor. `features/manager` separa carga/polling (`use-manager`), métricas, lista, lienzo, inspector de mesa y propuesta automática. Propietario/admin y parejas asignadas pueden gestionar invitados y mesas de eventos pagados; solo propietario/admin envía WhatsApp. Diseño, guardado y preview permanecen gratis.

- `lib/events/guest-rows.ts`, `guest-csv.ts`, `guest-spreadsheet.ts`: formato, parser CSV y Excel cargado bajo demanda. Plantillas descargables; primera hoja .xlsx, hasta 500 filas, 2 MB (CSV 200 KB). Se rechazan fórmulas, enlaces, macros, y metadatos ZIP que superen límites. Teléfonos se guardan como texto.
- Columnas: `nombre`, `apellido`, `telefono`, `cupos`, `genero`, `familia`, `acompanantes`, `apellidos_acompanantes`, `generos_acompanantes`. Cupos incluye al titular; nombres de varios acompañantes se separan con `|`. Importar invita, no confirma. Teléfonos existentes se omiten.
- `attendees.ts`: convierte cada invitación en personas, usando cupos confirmados y slots estables `guestID~n`. Los +1 desconocidos tienen placeholder; no se infieren género ni nombres.
- `auto-seating.ts`: agrupa por familia explícita, luego primer apellido. Mantiene cada titular con sus acompañantes; propone sin exceder mesas/aforo y deja grupos sin asiento cuando no caben. La propuesta requiere revisión antes de aplicarse al borrador.
- `door-export.ts`: Excel con una fila por confirmado, titular, familia y mesa, más hoja de revisión. No incluye teléfonos ni tokens/enlaces personales; la exportación requiere un plano guardado y sin conflicto conocido.

El lienzo usa coordenadas 1600×1000, mesas circulares/rectangulares, capacidad 1–50, hasta 100 mesas / 5000 asignaciones. Drag con pointer capture, flechas del teclado y coordenadas editables. Los asientos provisionales se etiquetan; no sustituyen la confirmación. El plano no representa medidas físicas del local.

El polling de 15 s actualiza respuestas. Con borrador sucio no reemplaza el plano; detecta versión nueva y exige recargar. Backend vuelve a validar aforo, personas, capacidades y versión. `tests/seating.test.mjs` prueba las invariantes; `tests/spreadsheet.test.mjs` usa ExcelJS real para importación/exportación, rechaza fórmulas y verifica teléfonos. ExcelJS usa un override de `uuid` 11.1.1 compatible con su única llamada v4; `npm audit --omit=dev` queda en cero vulnerabilidades conocidas.

## Identidad de producto y móvil

`components/product-heading.tsx` y `styles/19-product-workspaces.css` distinguen bodas (tonos cálidos, serif, controles rectos) de eventos (violeta, sans, controles redondeados) en editor, galería y gestor. `components/icon.tsx` contiene SVG reutilizables para las landings, herramientas e invitaciones, sin depender del diseño de emojis del dispositivo. `styles/18-icons.css` regula su tamaño y `20-mobile-landings.css` adapta títulos, navegación, CTA, ilustraciones, tarjetas y pies de página en pantallas estrechas.
