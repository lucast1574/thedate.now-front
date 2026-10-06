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

`src/app/globals.css` importa 12 fragmentos en orden. Sus nombres indican el área y su número indica la posición en la cascada. Los fragmentos mantienen las reglas y media queries existentes; algunos límites incluyen la transición entre dos áreas. Para encontrar una regla, busca su clase en `src/styles/` con `rg` y abre ese archivo. No ordenes los imports alfabéticamente ni muevas overrides sin verificar la cascada.

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
