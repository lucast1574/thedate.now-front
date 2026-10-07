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
    couples/     Aceptación de acceso a un evento por correo
    account/     Administración compartida, cortesías y afiliados
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
| Invitaciones de colaboradores              | `src/features/studio/couple-access.tsx`                                         |
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

## Nombre del destinatario y ediciones publicadas

`lib/events/guest-name.ts` define el binding `guest_name` y el marcador `{{nombre_invitado}}`. El inspector permite editar texto, color, fuente, tamaño, posición y giro en secciones y flyers. El visor modal acepta un nombre de ejemplo sin modificar invitados.

`features/invitations/personal-invitation.tsx` conserva `/rsvp/{token}`: obtiene el nombre completo y el diseño vigente, valida evento/producto/slug contra el contenedor y muestra invitación y confirmación. Tokens inválidos o de otro evento devuelven 404. El proxy aplica `private, no-store`, `no-referrer` y `noindex`. `live-invitation.tsx` actualiza al recuperar el foco y cada 30 segundos cuando la página está visible.

Guardar un diseño publicado conserva URL, token y respuestas; el slug publicado es inmutable. No requiere otro pago ni reenvía WhatsApp. `/api/invitation-health` confirma evento e imagen para evitar marcar una versión antigua como desplegada. El backend renueva los contenedores existentes al detectar una imagen nueva del renderer.

## Cuentas independientes y panel compartido

`/admin` en cualquiera de los dos estudios lee el mismo backend y exige rol administrador en cada endpoint. `features/account/` separa ingresos, roles, cortesías y retiros en componentes pequeños. `/affiliates` comparte una atribución para ambas marcas, enlaces de registro, historial y solicitud desde USD50. Pagos de prueba y cortesías aparecen separados de ingresos/saldo real.

`studio/couple-access.tsx` invita por correo a dos colaboradores y permite revocar accesos/pending. `couples/join.tsx` permite registrar una cuenta propia o entrar con Google/contraseña del correo invitado y aceptar el evento. Cada cuenta puede crear eventos/bodas propios. OAuth guarda una continuación local validada (`lib/auth/continuation.ts`), sin redirecciones arbitrarias. El proxy guarda primer código de referido durante 30 días; el servidor lo atribuye únicamente al crear la cuenta. Los enlaces privados `/join` y `/rsvp` llevan no-store/no-referrer/noindex.

`studio/subdomain-field.tsx` muestra un input con sufijo de dominio según producto, sugerencias de nombres y ayuda desplegable usable con teclado/móvil. La dirección se reserva al crear el evento. `publication-panel.tsx` muestra carga sin detalles técnicos y solo enlaza cuando el backend devuelve ready con el host esperado y el evento publicado; un timestamp anterior no basta. `Invitation` incluye el marcador público del evento que el backend comprueba en la página real.

## Galería del studio y perfil

El inicio muestra `studio/event-gallery.tsx`; no selecciona automáticamente una demo. `lib/events/studio-gallery.ts` filtra los eventos propios/compartidos del producto, ordena por última edición (creación como respaldo) y deja la muestra al final. Cada tarjeta abre `/editor/[id]`; Gestionar abre `/?event=id` con detalles, publicación y colaboradores en `event-workspace.tsx`. `invitation-thumbnail.tsx` monta el renderer real en un iframe sin interacción, carga cerca del viewport y encuadra el encabezado de la invitación para la miniatura.

`workspace-sidebar.tsx` se comparte con administración, afiliados y `/profile`. La alternativa de producto y el perfil permanecen en su parte inferior; en móvil la navegación se adapta sin desbordamiento. `user-avatar.tsx` muestra foto propia, foto de Google o iniciales. `account/profile-*` prepara un recorte cuadrado de 384 px y guarda nombre/foto; `/api/profile/avatar` limita el cuerpo, exige sesión/origen y conserva la respuesta privada. `styles/22-studio-workspace.css` y `23-studio-gallery.css` mantienen bodas cálidas/editoriales y eventos violetas/más festivos.

`components/listbox.tsx` y `listbox-menu.tsx` comparten los desplegables de ambas marcas: teclado, búsqueda por letras, opciones deshabilitadas, validación requerida y popup fuera de los contenedores con overflow. La lógica de navegación y posición está en `lib/ui/listbox.ts`. El perfil tiene un único acceso mediante el avatar del sidebar. Administración consume `roleProtected`; el servidor decide los permisos.

Los roles administrativos pueden asignarse a cuentas de Google o correo/contraseña. Afiliados muestra los enlaces de ambas marcas activos automáticamente para las cuentas elegibles, sin botón de activación; conserva la exclusión de comisiones de administradores/cortesías.

`studio/demo-cover.tsx` da una portada violeta/festiva a la muestra intacta de The Date y una portada floral/editorial a Save the Date. `lib/events/thumbnail.ts` reconoce únicamente la muestra original: cualquier diseño editado conserva el renderer. Las miniaturas miden título/párrafo o el primer lienzo y ajustan su escala al alto de la tarjeta, sin recortar texto; la tarjeta de crear conserva las mismas dimensiones.

Las muestras no repiten aviso, título ni fecha debajo de su tarjeta. `designer/preview-watermark.tsx` marca únicamente el visor de muestras/eventos pendientes: el editor no tiene esa capa y eventos pagados/cortesías no la muestran. El acceso directo al manager se ofrece únicamente con evento habilitado.
