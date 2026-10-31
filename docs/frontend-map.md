# Aplicación frontend

Las landings y sus guías SEO viven ahora en [thedate.now-landing](https://github.com/lucast1574/thedate.now-landing).
Este repositorio contiene dos aplicaciones independientes con un único núcleo compartido: `apps/the-date` y `apps/save-the-date`. La diferencia es de identidad, diseño y catálogo; las funciones se mantienen en `src`. El build raíz es el renderizador de invitaciones.

# Mapa del frontend

Lee este mapa antes de explorar todo `src/`. Después abre solo el módulo de la tarea.

## Estructura

```text
apps/
  the-date/      App, estilos, configuración y Dockerfile de The Date
  save-the-date/ App, estilos, configuración y Dockerfile de Save the Date
src/
  app/           Implementaciones de rutas compartidas y entrada del renderizador
  components/    Widgets compartidos entre funcionalidades
  features/
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
  styles/        Tokens y CSS comunes; products/general y products/wedding contienen temas aislados
tests/           Regresiones de contratos, eventos y widgets
```

## Dónde cambiar cada cosa

| Tarea                                      | Archivos iniciales                                                              |
| ------------------------------------------ | ------------------------------------------------------------------------------- |
| Selección de página según host             | `src/app/page.tsx`, `src/lib/events/domains.ts`                                 |
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
- `lib/events/template-catalog.ts`, los catálogos de bodas/eventos y sus archivos `*-canvas-templates.ts` contienen 30 entradas: 12 lienzos por producto y 6 diseños de secciones conservados para compatibilidad. `template-canvas.ts` y `template-layouts.ts` comparten la composición entre miniaturas y aplicación. El catálogo se incluye en el editor y sus IDs se sincronizan con el backend. `templateId` conserva la elección exacta; `resolveTemplateId` impide mezclar producto/modo. Aplicar una plantilla conserva el contenido y las capas existentes; cambiar de modo conserva los lienzos.
- `use-design-history.ts` mantiene hasta 60 pasos. `use-silent-design.ts` guarda automáticamente en segundo plano, serializa cambios y termina el guardado al volver con la flecha. No muestra confirmaciones ni mensajes de éxito. Una copia local permite retomar trabajo si coincide con la versión del servidor. Antes del despliegue, Terminar y continuar guarda y abre Invitados; Enviar invitaciones prepara y verifica la web antes de enviar. Después del despliegue, Actualizar invitación aplica los cambios al diseño público desde el editor; solo los errores interrumpen el flujo. Subir una imagen conserva la edición.
- `guest-import.tsx` ofrece revisión de CSV antes de enviarlo. `lib/events/guest-csv.ts` valida las filas; la API vuelve a validar. Solo eventos pagados habilitan herramientas de invitados; WhatsApp también requiere publicación.
- `styles/13-editor.css`, `14-editor-canvas.css` y `15-editor-modals.css` separan renderer/editor, lienzos y visores. El frontend y backend nuevos deben desplegarse juntos: la API antigua no acepta `designMode` ni `canvas`.

## Invitados, aforo y mesas

La plantilla diseñada vive en `public/templates/plantilla-invitados.xlsx`: seis columnas en B:G, margen A vacío, cabecera en la fila 10 y 500 filas de invitados. D5 selecciona el país principal y empieza con «Selecciona un país», sin país predeterminado. D11:D510 usa `IF($B11="","",$D$5)`, ajustado a cada fila, para heredar el país solo cuando existe nombre; cualquier fila permite reemplazarlo con su desplegable. Una hoja oculta contiene 21 opciones de país: Latinoamérica hispanohablante, Puerto Rico, España y Estados Unidos, con sus prefijos; `PaisesTelefonicos` alimenta ambos selectores. La bandera superior usa IMAGE (Excel 365/2024) y se oculta si no puede cargarse, sin afectar teléfonos. La importación ignora la presentación anterior a la cabecera y resuelve exclusivamente las referencias de país conocidas, sin ejecutar fórmulas ni confiar en cachés. Mantiene compatibilidad con las plantillas anteriores basadas en el país del primer invitado.

`guest-phone.ts` usa `libphonenumber-js/max` para validar y normalizar teléfonos según país. `guest-phone-field.tsx` reutiliza el Listbox de la marca y muestra el prefijo junto al número local; mantiene el país al añadir y detecta números internacionales pegados. `readGuestFileReport` devuelve invitados válidos e incidencias con la fila original. `guest-import.tsx` importa los válidos inmediatamente y muestra los errores sin confirmación adicional. La deduplicación sigue en el servidor, por lo que corregir y volver a subir el archivo no repite invitados. Las pruebas cubren herencia de país, cambios individuales, validación real, rechazo de fórmulas y carga parcial.

El teléfono manual comparte una sola fila de 44 px: selector compacto con bandera SVG y prefijo, más número local. Las 21 banderas se sirven desde `public/flags` (flag-icons 7.6.0, MIT), sin emojis ni peticiones a terceros. Listbox admite `renderLabel` para presentación enriquecida y `menuMinWidth` para desplegar nombres completos; conserva etiquetas de texto para búsqueda por teclado. Las tarjetas de Excel y alta manual se estiran a la misma altura en escritorio; al apilarse en móvil conservan su altura natural.

`use-guest-import.ts` controla lectura, bloqueo de cargas simultáneas, errores y recibo de importación. Después de guardar, limpia el nombre del archivo y confirma durante 10 segundos con un check y una flecha hacia la lista. Durante ese aviso se bloquea otra carga y después «Subir otro Excel» se habilita automáticamente. `guest-import-receipt.tsx` presenta el resumen y el enlace a la lista dentro del área de carga durante la confirmación, sin un segundo aviso inferior. Los +1 por revisar se mantienen aparte hasta otra carga. «Ver invitados abajo» lleva a `#guest-list`, transfiere el foco y respeta movimiento reducido. CSS desactiva automáticamente la animación con `prefers-reduced-motion`. Reimportar identifica por WhatsApp, conserva respuestas/mesas/envíos y muestra errores de filas sin impedir las válidas.

`lib/events/guest-categories.ts` define las categorías cerradas para la entrada manual y la columna `categoria` de Excel. La plantilla usa un desplegable con rango nombrado en una hoja oculta; importación normaliza tildes, mayúsculas y espacios y rechaza categorías desconocidas. El transporte conserva `family` para que el acompañante herede categoría y la propuesta existente agrupe esos invitados. Las etiquetas antiguas guardadas no se migran sin una asignación explícita.

Las altas nuevas son una persona titular con cero o un acompañante. El formulario y Excel expresan `acompanantes_permitidos` (0/1); el transporte conserva `seats` como total (1/2). La plantilla descargable y la carga usan únicamente `.xlsx`. `familia` sigue siendo una etiqueta para mesas. RSVP permite elegir ir solo o acompañado, registrar el nombre y advierte que recuperar un lugar liberado depende del aforo. El parser conserva lectura de columnas antiguas `cupos`, validando el nuevo máximo al importar.

El gestor presenta descarga de plantillas y carga por archivo/arrastre en `studio/guest-import.tsx` y `guest-file-dropzone.tsx`, además del alta manual visible en `manager/guest-workspace.tsx`. La tabla empieza en orden de invitación y la consulta por apellido no cambia la prioridad del servidor. Excel incorpora una hoja de instrucciones; los pendientes de envío no muestran enlaces personales.

`manager/invitation-delivery.tsx` y `use-invitation-delivery.ts` sustituyen los botones separados de publicar/enviar con una sola intención persistida mediante `/events/{id}/delivery`. Muestran preparación de la web, comprobación y envíos, o espera por aforo. El navegador solo consulta el progreso: la API verifica la web y ejecuta la cola incluso después de salir. Los fallos y resultados desconocidos se muestran sin repetir mensajes automáticamente. Los estilos de este recorrido viven en `styles/62-guest-journey.css`.

Ruta privada `/manager/[id]` para ambos productos; el estudio enlaza el gestor. `features/manager` separa carga/polling (`use-manager`), métricas, lista, lienzo, inspector de mesa y propuesta automática. Propietario/admin y parejas asignadas pueden gestionar invitados y mesas de eventos pagados; solo propietario/admin envía WhatsApp. Diseño, guardado y preview permanecen gratis.

- `lib/events/guest-rows.ts`, `guest-csv.ts`, `guest-spreadsheet.ts`: formato, parser CSV y Excel cargado bajo demanda. Plantillas descargables; primera hoja .xlsx, hasta 500 filas, 2 MB (CSV 200 KB). Se rechazan fórmulas, enlaces, macros, y metadatos ZIP que superen límites. Teléfonos se guardan como texto.
- Columnas: `nombre`, `apellido`, `telefono`, `cupos`, `genero`, `familia`, `acompanantes`, `apellidos_acompanantes`, `generos_acompanantes`. Cupos incluye al titular; nombres de varios acompañantes se separan con `|`. Importar invita, no confirma. Teléfonos existentes se omiten.
- `attendees.ts`: convierte cada invitación en personas, usando cupos confirmados y slots estables `guestID~n`. Los +1 desconocidos tienen placeholder; no se infieren género ni nombres.
- `auto-seating.ts`: agrupa por familia explícita, luego primer apellido. Mantiene cada titular con sus acompañantes; propone sin exceder mesas/aforo y deja grupos sin asiento cuando no caben. La propuesta requiere revisión antes de aplicarse al borrador.
- `door-export.ts`: Excel con una fila por confirmado, titular, familia y mesa, más hoja de revisión. No incluye teléfonos ni tokens/enlaces personales; la exportación requiere un plano guardado y sin conflicto conocido.

El lienzo usa coordenadas 1600×1000, mesas circulares/rectangulares, capacidad 1–50 y hasta 5000 asignaciones, sin el anterior límite de 100 mesas. Solo muestra confirmados y acompañantes registrados; antes de confirmar, la lista indica «Se asignará al confirmar». Al confirmar, el servidor asigna por categoría con mesas nuevas de 10, conserva capacidades editadas y decisiones manuales, y mantiene la pareja junta. Mover o desmarcar a una persona en el inspector afecta a toda su invitación. Completar mesas conserva asignaciones previas y añade las pendientes por categoría. Las categorías incluyen compañeros de trabajo del novio y de la novia; los datos genéricos anteriores se conservan. Drag con pointer capture, flechas del teclado y coordenadas editables. El plano no representa medidas físicas del local.

El polling de 15 s actualiza respuestas. Con borrador sucio no reemplaza el plano; detecta versión nueva y exige recargar. Backend vuelve a validar aforo, personas, capacidades y versión. `tests/seating.test.mjs` prueba las invariantes; `tests/spreadsheet.test.mjs` usa ExcelJS real para importación/exportación, rechaza fórmulas y verifica teléfonos. ExcelJS usa un override de `uuid` 11.1.1 compatible con su única llamada v4; `npm audit --omit=dev` queda en cero vulnerabilidades conocidas.

## Identidad de producto y móvil

`components/product-heading.tsx` y `styles/19-product-workspaces.css` distinguen bodas (tonos cálidos, serif, controles rectos) de eventos (violeta, sans, controles redondeados) en editor, galería y gestor. `components/icon.tsx` contiene SVG reutilizables para las landings, herramientas e invitaciones, sin depender del diseño de emojis del dispositivo. `styles/18-icons.css` regula su tamaño y `20-mobile-landings.css` adapta títulos, navegación, CTA, ilustraciones, tarjetas y pies de página en pantallas estrechas.

## Nombre del destinatario y ediciones publicadas

Los elementos conectados usan `eventBound` y `lib/events/element-values.ts`: nombres de novios (`celebration.partnerOne/partnerTwo`, con fallback al título anterior), nombre de evento, fecha/hora, ubicación, vestimenta e indicaciones. Desactivar la conexión conserva contenido independiente. Las plantillas completas incluyen todos los elementos, regalos con `/regalos` y restricciones incluso sin configurar. `DesignSection.when` oculta esas secciones en la invitación pública hasta que tengan contenido; los lienzos del editor siguen mostrándolas. «Añadir elementos que faltan» añade secciones explícitamente y conserva el diseño anterior.

`actionHint`, `hintText`, `hintIcon` y `hintStyle` controlan la pista opcional del enlace desde el inspector, tanto desde cero como en plantillas. El color/tamaño acompañan al elemento. `binding: map` añade mapas con MapLibre, datos vectoriales OpenStreetMap, marcador, tres estilos, zoom, radio y suavizado. La atribución queda fuera del suavizado. Solo se cargan mapas visibles y se envía únicamente el origen como Referer, sin tokens ni rutas privadas. `NEXT_PUBLIC_OSM_VECTOR_TILES` permite cambiar el proveedor de teselas; el worker se sirve localmente, generado desde el paquete fijado por `prepare-map-assets.mjs`, también en ambos estudios y renderer. La API valida límites y coordenadas y no admite URLs arbitrarias para mapas embebidos.

El lápiz de cada tarjeta abre `/?event=id` con el formulario existente. Se muestra al hover/foco y permanece visible en dispositivos sin hover. Permite editar metadatos sin cambiar plantilla; el enlace se bloquea al publicar o iniciar los envíos. La validación de `save` y otros nombres reservados existe tanto en cliente como en servidor. The Date conserva el título libre para eventos generales y rechaza campos exclusivos de novios y expresiones explícitas de boda; la API vuelve a validar el producto almacenado, las plantillas y sus precios.

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

`components/style-fields.tsx` muestra estilos como tarjetas con muestras tipográficas en el editor, dentro de «Personalizar plantilla» cuando hay una plantilla de secciones aplicada. Al crear, `event-template-start.tsx` permite activarlas opcionalmente con vista previa modal real antes de guardar (requiere nombre y fecha); al editar datos de un evento no aparecen. Desactivar la opción restaura el estilo base; el flyer personaliza directamente fondo y elementos. `color-picker.tsx`, `color-panel.tsx` y `color-plane.tsx` comparten el selector visual para acento, fondo y elementos del flyer: paletas, HSV por arrastre/táctil o sliders con teclado, HEX validado y colores recientes. `lib/ui/color.ts` contiene conversiones y normalización. `color-memory.tsx` guarda hasta 12 colores por ID de cuenta en localStorage del origen actual; EditorPage provee la identidad autenticada. No sincroniza entre dispositivos ni orígenes. Cambios de almacenamiento y selecciones se reflejan entre controles abiertos; los pasos de arrastre no llenan el historial. `26-design-pickers.css`, `color-picker-controls.css` y `color-picker-details.css` conservan las variantes de boda y eventos.

El formulario de evento agrupa nombre/fecha y lugar/invitados en tarjetas. `event-capacity.tsx` presenta el máximo o la opción sin límite; mensaje y organizador/espera se abren bajo demanda. `guest-hold-field.tsx` ofrece plazos en días, explica la reserva desde la respuesta «Tal vez» y permite horas personalizadas de 1 a 168, conservando valores existentes. `event-basics.tsx` separa fecha y hora y sugiere un enlace con `lib/events/event-form.ts`; personalizarlo detiene las sugerencias, y una dirección existente permanece reservada. La validación abre el bloque que contenga un campo obligatorio inválido antes de enfocarlo. El lugar escrito manualmente se conserva al pegar Maps.

`date-picker.tsx` y `time-picker.tsx` reemplazan los campos nativos en toda la aplicación. `picker-field.tsx` abre el panel al activar cualquier parte del campo, lo coloca dentro del viewport y gestiona validación, Escape y cierre exterior. `calendar-picker.tsx` ofrece días/meses/años, semana desde lunes y flechas/Home/End/PageUp/PageDown. `time-panel.tsx` usa una cuadrícula de horas y medias horas con AM/PM y navegación por teclado; la conversión a HH:mm mantiene mediodía y medianoche. Los estilos de calendario/hora conservan variantes cálidas para bodas y violetas para eventos. La lógica de calendario, conversión y posición vive en `lib/ui/date-time.ts`.

Los selectores de fecha y hora usan `picker-field.tsx`: en escritorio el popover se coloca por debajo o encima del campo según el espacio real medido, con altura acotada; en móvil o pantallas de hasta 600 px de alto se centra abajo y permite desplazamiento interno. Tab fuera del panel, Escape y clic exterior lo cierran. `time-panel.tsx` presenta opciones directas cada 30 minutos, separadas por AM/PM; `halfHourTimes` incluye medianoche y mediodía. Abrir o cambiar de AM/PM no altera la hora guardada, incluso si tenía minutos distintos de 00/30. La selección guarda y cierra con un toque.

## Editor de lienzos continuo

El editor compartido de bodas y eventos usa una sola experiencia de lienzo. `invitation-designer.tsx` normaliza las secciones antiguas conservando su contenido y abre eventos sin secciones con un lienzo vacío. El contrato persistido sigue usando `designMode: flyer`; no hay selector de modos en la interfaz.

`flyer/canvas-workspace.tsx` compone rail y sidebar; `use-canvas-workspace.ts` mantiene selección, cambios de elementos y creación de secciones vacías; `canvas-pages.tsx` muestra la secuencia completa con zoom, orden y eliminación (conserva al menos una sección). `canvas-toolbox.tsx` inserta texto, fotos, símbolos, nombre personalizado y copias editables de la ubicación y fecha del evento. El nombre del invitado tiene binding dinámico; la ubicación conserva su dirección, presentación y enlace en un elemento propio. `canvas-properties.tsx` y `canvas-formatting.tsx` ofrecen propiedades en la sidebar y formato contextual sobre el lienzo. Los cambios conservan historial y guardado explícito. `33-canvas-studio.css` adapta la composición a los dos productos y a móvil; los lienzos públicos quedan consecutivos sin separación añadida.

## Música de la invitación

La sidebar compartida incluye `music-panel.tsx` y `use-music-upload.ts`: admite MP3 (10 MB) y enlaces de YouTube / YouTube Music. Spotify está deshabilitado; sus referencias guardadas se leen para pedir sustitución, sin reproducirlas. `lib/events/music.ts` normaliza enlaces y limita proveedores. `music` participa en guardado, historial y merge; las referencias a archivos subidos se conservan al deshacer.

`invitations/invitation-music.tsx` renderiza el MP3 oculto y en bucle, sin botones ni pantalla de entrada. `use-background-music.ts` intenta reproducir al cargar y reintenta dentro del primer toque o tecla si el navegador bloquea autoplay. Atenúa a 0.25 mediante GainNode (aproximadamente −12 dB de señal), con media.volume como respaldo; respeta el ciclo de vida y el replay de efectos de React. YouTube usa `youtube-background.tsx` como se detalla abajo. Spotify no se reproduce. La vista previa no abre embeds externos ni reproduce automáticamente; el autor puede probar su MP3 privado en el panel.

`/api/audio/[id]` limita bytes y exige sesión/origen; `/api/audio/[id]/[key]` permite escuchar el archivo propio. `/api/public-audio/[kind]/[slug]/[key]` conserva rangos HTTP y el aislamiento del contenedor. El backend comprueba pago/publicación y que el archivo sea la canción actualmente publicada. `34-invitation-music.css` amplía rail/sidebar/iconos y define los estilos del panel y de reproductores anteriores.

### YouTube como fondo musical

El editor permite MP3 y enlaces de YouTube / YouTube Music; `musicFromLink` rechaza Spotify y el renderer no lo reproduce. El discriminante anterior permanece en el tipo únicamente para leer diseños guardados y pedir al autor que sustituya la canción, sin borrar datos en masa.

`youtube-api.ts` carga una sola vez la API oficial. `youtube-background.tsx` inicializa un reproductor oculto, sin interacción ni foco, a volumen 25 y en bucle. Intenta reproducir al estar listo y conserva listeners para un toque/tecla real mientras el navegador bloquea el sonido; los retira cuando empieza a reproducir. Al desmontar destruye el reproductor. El iframe usa youtube-nocookie y referrer de origen para no exponer enlaces RSVP y evitar falta de Referer. La vista previa no abre el proveedor. La disponibilidad, publicidad, restricciones regionales y políticas de autoplay siguen dependiendo del proveedor/navegador; el editor lo comunica. Esta implementación oculta no cumple el requisito de visibilidad del reproductor de YouTube; fue solicitada explícitamente por Lucas tras explicar esa limitación.

## Plantillas dentro del editor

Plantillas es una herramienta de la sidebar; el botón superior abre la misma pestaña. No existe la galería modal. `template-panel.tsx` permite búsqueda sin tildes y filtros por categoría; `template-detail.tsx` muestra una composición con los textos/fotos del evento, sin tapar el lienzo. Aplicar a una sección vacía crea elementos editables. Si ya tiene contenido, la acción principal añade otra sección; la secundaria cambia únicamente colores/fuentes de la sección actual, conservando capas y posiciones. El historial permite deshacer. Se enfoca la sección aplicada y se conserva la búsqueda al volver al catálogo.

`templateLayouts` define geometrías distintas (floral, editorial, arco, marco, monograma, botánica, minimal, ticket, cartel, fiesta y sol). Los motivos frame/arch/leaf/sunburst son SVG del sistema compartido, con geometría editable y trazo adaptado para la composición. El renderer conserva el tamaño de iconos antiguos. `35-template-sidebar.css` limita los estilos al panel y amplía su alto en móvil. Los 24 diseños de lienzo están disponibles por igual para eventos/bodas de muestra y reales, sin pago para diseñar.

## Interacción y símbolos del lienzo

`canvas-geometry.ts` ajusta fotos por su relación natural, escala medios desde cuatro esquinas y calcula el ajuste magnético al centro; Alt permite mover sin imán. El renderer muestra las fotos completas con `object-fit: contain` y todos los símbolos llenan su caja SVG. `canvas-commands.ts` concentra duplicación, borrado, centrado y orden de capas. El menú contextual admite clic derecho, Shift+F10, flechas, Home/End y Escape. Supr/Retroceso funcionan después de seleccionar en el lienzo o la sidebar, sin interceptar campos de texto ni diálogos. Seleccionar no cambia el orden visual real de las capas.

`symbol-library.tsx` ofrece 1903 símbolos Lucide y nueve motivos propios, búsqueda en español/inglés y carga por tandas. Los destacados cambian entre bodas y eventos. El sprite local versionado y su licencia viven en `public/symbols/`; solo la ruta exacta del sprite se permite en contenedores publicados. `npm run symbols:sync` regenera el catálogo y la lista permitida del backend desde `lucide-static` 1.61.0, fijado como dependencia de desarrollo.

`guest-binding-field.tsx` separa saludo, ficha protegida y texto posterior. El marcador no es editable y los diseños antiguos con marcador ausente se reparan al mostrar y guardar. El elemento completo sigue siendo eliminable y el historial permite recuperarlo. `location-inspector.tsx` deja elegir icono/texto/dirección, editar la dirección o el enlace de Google Maps y obtener la dirección del enlace mediante el resolver existente. Estos cambios pertenecen al elemento de la invitación; no alteran silenciosamente el formulario del evento. Sin enlace explícito se abre una búsqueda de la dirección. La API valida los proveedores y el renderer evita URLs ejecutables.

## Paneles de propiedades e identidad de eventos

El inspector oculta el encabezado genérico y los ajustes de sección mientras hay un elemento seleccionado. Contenido/destino van primero; Estilo y Posición y tamaño agrupan controles con despliegues accesibles. Duplicar y eliminar son acciones compactas de cabecera; el orden de capas queda en el menú contextual. La ubicación permite combinar icono, título y dirección sin dejar una presentación vacía. `location-element.ts` define siete combinaciones; `flyer-location.tsx` compone las mismas partes en la miniatura y la invitación pública, con el icono arriba.

`37-inspector-panels.css` organiza los paneles compartidos. `38-general-editor.css` da a The Date una interfaz sans, azul y neutra, con marca recta y textos para planes cotidianos. Los lienzos nuevos de eventos son blancos y los textos nuevos usan sans; los diseños ya editados conservan colores, fuentes y fondos. Las bodas mantienen sus valores iniciales y su estética. `canvas-event-tools.tsx` concentra las inserciones de invitado/lugar/fecha para ambos productos.

## Organización visible y lista de regalos

La herramienta de regalos incluye un recorrido interactivo de entrada y elección
con productos reales de Saga Falabella, Mercado Libre y Coolbox. Los ejemplos
solo cambian estado local; no crean productos ni reservas. `gift-experience-preview.tsx`
reutiliza `guest-wishlist-view.tsx` y las mismas tarjetas/confirmaciones de la lista
personal. El organizador puede alternar su lista, su vista como invitado y el ejemplo.
Las fotos de ejemplo y sus fuentes están documentadas en `docs/gift-examples.md`.

`use-gift-draft.ts` ignora respuestas de enlaces anteriores y conserva ediciones
manuales durante la lectura de metadatos. El formulario muestra una ficha inmediata.
El fallo de una foto solo afecta a esa URL; una imagen nueva vuelve a intentarse.
Las reservas requieren confirmación, bloquean dobles envíos y muestran el acceso a
la tienda después de elegir. Cambiar de regalo libera primero la elección anterior.
Los errores de carga inicial bloquean la edición; los conflictos recargan la versión
vigente y conservan abierto el formulario. Estilos en `50-gift-experience.css`.

La sidebar compartida muestra Invitados, Mesas y Lista de regalos en ambas marcas, con accesos mayores y contexto del evento cuando está seleccionado. `/organizar?tool=guests|tables|gifts` permite conocer las funciones y escoger un evento. `/manager/[id]?tab=...` abre su espacio propio; invitados/mesas sin pago muestran `organization-preview.tsx`, con un plano de ejemplo que se puede mover sin guardar en el evento. `manager-tools.tsx` mantiene las funciones activas separadas de la composición/navegación. Los enlaces al editor avisan si hay cambios del plano sin guardar.

`features/gifts/` permite preparar una lista opcional de hasta 100 productos antes de pagar. Se activa su acceso público únicamente en eventos reales pagados y publicados. El formulario obtiene título e imagen de los metadatos de una URL HTTPS pública; nombre, imagen y nota pueden completarse manualmente si la tienda no comparte datos. `use-wishlist.ts` conserva versiones para no sobrescribir reservas nuevas. El organizador ve el nombre asociado, puede marcar recibido o liberar la reserva; la lista de invitados también muestra el regalo del titular.

`/regalos` admite el código o enlace personal de WhatsApp; `/regalos/[token]` muestra los productos sin cuenta y reserva uno por invitación. Los huéspedes solo ven disponibilidad y su propia elección. `gift-scope.ts` valida producto, subdominio y evento fijado antes de cualquier lectura, reserva o imagen. Los tokens son los mismos de RSVP, las páginas son privadas/no indexables y los enlaces a las tiendas no envían Referer. Las imágenes se sirven por proxies verificados; el navegador no envía el código a la tienda. `invitation-runtime.ts` permite exclusivamente las rutas de regalos del contenedor. La invitación personal enlaza con el token; la pública abre la entrada de código cuando el organizador activó la lista.

`39-organization.css` amplía la sidebar y centra las tres tarjetas de datos del editor con columnas estables; `40-wishlist.css` comparte tarjetas, formularios y estados entre organización y página de invitados, con variantes de boda/evento.

## Invitaciones completas y entrada

`designer/template-sequence.ts` genera seis secciones editables por plantilla: portada, presentación con foto, fecha, ubicación, dress code y cierre. El aviso de adultos añade una séptima sección solo si se eligió. Usar una plantilla completa reemplaza las secciones después de confirmarlo cuando hay contenido, conserva fotos/música y permite deshacer. Los valores de fecha y lugar proceden del evento; no se copian datos personales de la invitación de referencia.

`template-photos.ts` resuelve únicamente el marcador reservado `template-photo` al SVG local «Pon tu foto aquí». El clic o Enter/Espacio sobre una imagen abre el explorador; `replaceImage` actualiza solo el elemento de la sección original sin perder geometría ni sobrescribir cambios realizados durante la subida. Arrastrar no abre el explorador. Las muestras no consumen almacenamiento privado.

`opening-panel.tsx` ofrece una pestaña Apertura y un acceso desde Secciones para añadir o quitar el sobre; comparte `OpeningArtwork` con la invitación real y permite editar plantilla, título, mensaje, botón, tipografía, colores y sello. El editor no duplica los detalles del evento: la vestimenta se edita seleccionando su elemento y el público se configura en el formulario del evento. Las nuevas plantillas ofrecen sobre por defecto y respetan una desactivación explícita. Las miniaturas muestran el diseño; el visor permite recorrer la apertura real. `celebration` conserva dress code y el aviso opcional de adultos. Los valores sirven para añadir elementos/plantillas; los bloques ya colocados se editan en el lienzo. WhatsApp incluye el aviso solo cuando `adultsOnly` y `whatsappNotice` están activados; guardar no reenvía mensajes.

Desplegar primero la API que acepta `opening`, `celebration`, los bindings `dress_code`/`adults_notice` y el marcador reservado; después el frontend y los renderers de invitaciones. Los clientes antiguos no borran estas opciones al omitirlas.

## Barra de herramientas del editor

`DressColorRules` permite añadir hasta ocho colores no permitidos, con nombre y
muestra HEX editable. `dressExcludedColors` queda dentro del elemento Dress code;
`FlyerDressCode` muestra nombres y muestras tachadas en el canvas y en la invitación.
Las reglas se validan antes de guardar y en la API.

El elemento `restrictions` se añade desde Elementos con icono y texto. Su inspector
permite icono, texto o ambos, cambiar el símbolo y partir de ejemplos de adultos,
mascotas, acompañantes o fotografías. Cada aviso tiene contenido independiente;
no cambia el público ni los cupos del formulario del evento. `FlyerRestrictions`
se comparte entre canvas y publicación. El menú Detalles se eliminó para evitar
duplicar la vestimenta y la configuración de público del evento.

La apertura ofrece seis escenas: Carta, Jardín, Ticket, Telón, Flor y Constelación.
`opening-presets.ts` define los tiempos y resuelve la paleta desde el primer canvas
y el acento del diseño con contraste legible. `paletteMode: design` sigue la
plantilla; `custom` conserva los colores elegidos. Aperturas anteriores sin ese
campo conservan su apariencia. Cada estilo aporta un icono y permite sustituirlo.

`opening-scene.tsx` y `use-opening-animation.ts` son compartidos por la invitación
y `opening-live-preview.tsx`: el preview es interactivo, revela el primer canvas
real y se puede repetir. `opening-customization.tsx` agrupa colores, icono y textos;
el fondo permanece opcional. `51-opening-scenes.css` y `52-opening-animation.css`
separan composición y movimiento. Cada animación termina antes de retirar la
apertura, y reduced-motion abre inmediatamente sin animaciones. No cambia las
secciones ni el canvas del diseño.

El editor recibe en Elementos. `canvas-section-controls.tsx` comparte la sección activa, añadir sección y el color de fondo entre Elementos, Imágenes, Capas y Secciones, antes de las herramientas. Elegir una página conserva la herramienta actual; crear una sección o pulsar el fondo del lienzo vuelve a Elementos. Seleccionar un objeto abre su inspector.

`canvas-rail.tsx` agrupa creación, organización y configuración con etiquetas cortas. Texto y foto tienen accesos directos; símbolos se despliega bajo demanda. `canvas-images.tsx` mantiene la subida y la inserción de fotos en una sola implementación. Los controles usan el selector personalizado del proyecto y el foco no añade contornos ni anillos.

`CelebrationAudience` comparte la pregunta de todas las edades/solo adultos en el formulario de creación y edición del evento; el formulario guarda el aviso y la opción de WhatsApp desde el alta. `DressCodeInspector` combina icono, imagen y texto sin permitir una composición vacía. `FlyerDressCode` comparte la presentación entre lienzo y publicación; `dressPhotoKey` permite reemplazar la imagen sin cambiar la geometría. Las plantillas reúnen vestimenta e indicaciones en el mismo elemento editable.

`gift_link` es un elemento de texto con icono y enlace: apunta a `/regalos` (resuelto al enlace personal del invitado) o a una lista HTTPS externa. El inspector valida el destino antes de guardar; la invitación ya no impone un botón de regalos fuera del lienzo. El catálogo no ofrece Solo adultos: esa elección permanece en el formulario del evento y en plantillas. La acción de aplicar plantillas precede a sus muestras para estar accesible también en demos y móvil.

## Imágenes de fondo y referencia de uso

`background.ts` define una imagen por sección y una imagen común opcional. El fondo común se calcula en proporciones normalizadas de los lienzos; `sectionBackground` devuelve el recorte de cada sección para que una sola imagen continúe sin reiniciarse. `FlyerBackground` comparte ese recorte entre editor, vista previa e invitación publicada. Mover, añadir y quitar secciones recalcula la continuidad. Una sección puede heredar, usar su propia imagen o quedarse solo con su color.

El acceso Imagen de fondo aparece junto al color de la sección y abre `canvas-background-panel.tsx`, con alcance Esta sección/Toda la invitación, biblioteca/subida, cubrir/completa, posición e intensidad. Las subidas capturan la sección de destino y actualizan el borrador actual sin perder edición concurrente. `opening-background-editor.tsx` ofrece las mismas opciones para la entrada del sobre; el fondo de apertura es independiente del contenido. No se incluyen fotografías generadas ni imágenes de terceros en las plantillas.

Referencia examinada: [invitación Canva](https://llinvit.my.canva.site/sander-y-angie-/page-2) y su página inicial. Su estructura observada incluye sobre con ornamentación floral, nombres/fecha, dedicatoria, familia y padrinos, música, calendario, recepción/mapa, dress code, regalos, cuenta regresiva, confirmación y cierre. Se usa para mapear necesidades, sin copiar fotografías, nombres, teléfonos ni datos bancarios. En The Date, la entrada no obliga a desplazarse para encontrar el sobre y cada bloque del diseño sigue siendo editable. Los textos familiares y dedicatorias se resuelven con secciones; los accesos de ubicación y regalos son elementos. La cuenta regresiva dinámica y la descarga de calendario requieren elementos propios si se incorporan más adelante; la referencia no los convierte en funciones ya implementadas.

`canvas-tools.ts` define el orden de la navegación: Crear (Elementos, Imágenes, Plantillas), Organizar (Secciones, Fondos, Capas) y Experiencia (Apertura, Música). Elementos es siempre la primera vista al abrir. Fondos tiene acceso propio y estado activo visible. Secciones ofrece añadir sin duplicar el selector de contexto. Capas conserva su lista al seleccionar, permite adelantar/enviar atrás y abre el inspector con Editar; su estado vacío conduce a Elementos. Seleccionar una capa no reinicia el scroll del panel. Al insertar desde Imágenes se abre el inspector en Elementos y volver a Imágenes recupera la biblioteca. `canvas-selection-inspector.tsx` concentra la conexión del elemento seleccionado con sus propiedades, separada de los paneles de herramientas.

La creación usa el catálogo de lienzos en `event-template-start.tsx` y `initial-invitation.ts`: la misma secuencia alimenta el preview y el diseño inicial enviado al crear. `template-extras.ts` adapta la apertura a la temática e incorpora colores de vestimenta, restricciones y el enlace de regalos cuando la lista está activa. Los espacios móviles del salón viven en `venue-areas.tsx`; el editor permite añadirlos y guardarlos en `SeatingPlan.areas`. El demo usa seis mesas, bocaditos, bar y pista, sin escenario.

El formulario pide solo el enlace de Maps y presenta la ubicación resuelta como texto; al cambiar el enlace descarta la dirección anterior y espera la nueva resolución. Los presets de apertura reutilizan `OpeningArtwork` con loops CSS y respetan `prefers-reduced-motion`.

## Builds y fronteras de producto

`npm run dev:the-date -- --port 3111` y `npm run dev:save-the-date -- --port 3112` ejecutan cada app (para pasar argumentos directos usa `npm run dev --workspace=@thedate/the-date -- --port 3111`). `npm run build:apps` compila ambas; `npm run build` mantiene la imagen del renderizador. Cada Dockerfile de app usa el contexto raíz del repositorio.

`APP_PRODUCT` se fija en cada `next.config.ts`: el servidor emite `data-product` y `data-application` desde el primer HTML, usa el endpoint de API del producto y rechaza el host de la otra app. Las rutas comparten handlers: una corrección de funciones se implementa una sola vez. Las vistas de iframe esperan su CSS y copian la identidad antes de montar contenido.

Hay 24 plantillas de lienzo por producto, más los diseños antiguos por secciones conservados por compatibilidad. `template-layouts-extended.ts` y `template-layout-pages.ts` aportan portadas, álbumes y programas. Todos los espacios iniciales usan `template-photo`: las fotos de la biblioteca solo se colocan mediante una acción explícita del usuario.

El Dockerfile de The Date empaqueta el build raíz como artefacto `/app/renderer`. `scripts/renderer-image.Dockerfile` permite publicarlo como imagen de invitación sin mantener un servicio frontend antiguo activo. El servicio de bodas sigue compilándose y ejecutándose de forma independiente.

## Activación de demos y espacio profesional

Las cuentas nuevas usan `user`. Un botón en la galería activa `planner` en bodas u `organizer` en eventos; administración puede asignar los mismos tres roles de su producto, incluido `admin`. `/compartir` ofrece una demo local hasta que exista un evento propio pagado y luego gestiona dos accesos por correo. El servidor verifica rol profesional, propiedad y pago. Los invitados conservan el rol `user` y su pertenencia al evento; tras autenticar con el correo invitado entran al editor.

El editor guarda la demo antes de abrir `/?new=1&demo=<id>`. La activación actualiza ese mismo evento de forma condicional mediante `POST /events/{id}/activate`: no regenera secciones ni cambia las claves de medios. La creación continúa al checkout y Stripe vuelve a `/editor/{id}?payment=success`; el editor consulta la confirmación sin conceder funciones pagadas por el parámetro de URL.

## Plantillas, composición y secciones diseñadas

El catálogo de 48 lienzos usa `template-art-direction.ts` y `InvitationArtwork` para seis familias visuales; `templateCanvas` y `templatePage` comparten el ornamento con el editor y el renderer. Las fuentes locales Cormorant Garamond, Manrope e Italianno conservan su licencia OFL en `public/fonts` y no hacen peticiones a un proveedor de fuentes.

`apply-template-design.ts` combina la secuencia con `template-content.ts`: empareja secciones y elementos semánticos, conserva textos, fotos colocadas, secciones propias y apertura. `TemplateDetail` muestra ese mismo resultado antes de aplicarlo y permite diseños sin espacios de fotografía. La biblioteca no coloca automáticamente fotografías privadas. `adapt-template-content.ts` y `fit-invitation-text.ts` ajustan textos y alturas; el renderer vuelve a calcular el ajuste para nombres conectados.

`invitation-theme.ts` actualiza el color base, el papel y la fuente de todas las secciones, conservando los valores distintos que el usuario personalizó. La fuente global queda persistida en el lienzo incluso si está vacío. `section-library.ts` crea portada, historia, itinerario, mapa, galería, dress code y RSVP con ese estilo. Los nuevos elementos también heredan la fuente y el color del diseño. RSVP conserva el flujo real: encuesta por WhatsApp y datos desde el enlace personal; la sección no abre una confirmación genérica sin token.

`composition.ts` opera sobre selección múltiple, grupos y límites del lienzo. Capas ofrece selección múltiple para móvil y Shift permite sumar objetos en el lienzo. Agrupar, bloquear, alinear, distribuir y copiar/pegar estilo aparecen únicamente al seleccionar. `groupId` y `locked` persisten en el elemento; los bloqueados no se mueven ni se eliminan. Los grupos se alinean y trasladan como una unidad. El inspector individual queda oculto al seleccionar varios.

Las fotos admiten `photoTreatment` (none, soft, fade, arch, cinema) y `photoFit` (contain, cover). El acabado se define por plantilla y puede editarse; cambiar la foto conserva el encuadre y el tratamiento. Las portadas gallery/cinematic usan fotografías a sangre. `InvitationMotion` secuencia entradas por sección y espera a que se retire el sobre; cancela el movimiento cuando cambia prefers-reduced-motion y no añade controles visibles.

Desplegar la API que valida los metadatos de lienzo y foto antes del frontend y de la imagen renderer. No requiere migración de documentos existentes ni modifica los diseños guardados al actualizar el catálogo. El primer despliegue continúa en Invitados; el editor conserva Terminar y continuar / Actualizar invitación.
