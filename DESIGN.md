# Sistema visual de carlaylz

Referencia de dirección: la claridad, densidad contenida y componentes funcionales del manual de diseño aportado. Esta es una adaptación propia para una web de recursos de IA y un calendario de Adviento; no se usan la marca, los iconos ni las fuentes propietarias de Airbnb.

## Identidad

| Token | Valor | Uso |
| --- | --- | --- |
| `cherry` / `primary` | `#691B32` | CTA, enlaces, estados activos, títulos puntuales |
| `cherry-active` | `#521326` | Pulsación y hover de CTA |
| `cherry-soft` | `#E9D4D9` | Superficie secundaria o estado tenue |
| `yellow` / `accent` | `#F3C969` | Acento, progreso y foco; nunca texto pequeño sobre blanco |
| `white` / `canvas` | `#FFFFFF` | Fondo base y tarjetas |
| `warm-white` / `surface` | `#F8F5ED` | Banda alterna y fondos de formulario |
| `ink` | `#3B252D` | Texto principal |
| `muted` | `#6B5960` | Texto secundario |
| `hairline` | `rgba(59, 37, 45, .14)` | Divisores y contornos |
| `holly` | `#2F6B47` | Verde navideño: solo para «hecho» (reto completado) en el Adviento |
| `holly-soft` | `#E9F1E6` | Fondo de la tarjeta de un reto completado |

El blanco domina. El cherry identifica las acciones y el amarillo señala momentos de avance. Todas las páginas, también la de inicio, usan fondo blanco y superficies planas; solo el calendario usa degradados por su carácter navideño. Las imágenes propias de Carla y las portadas de sus guías siguen siendo las protagonistas visuales.

## Logo

El logo de **carlaylz** es un símbolo de dos círculos que se solapan, negro `#1D1D1F` y `cherry`, con la intersección en forma de lente en `yellow`, seguido de la palabra «carlaylz» en Inter Tight de peso 500, con tracking ajustado, en `#1D1D1F`. Ese negro es propio del logo y no se usa en la interfaz, donde el texto va en `ink`.

- Símbolo suelto: `public/assets/logo-mark.svg`. Favicon: `public/assets/favicon.svg`, el símbolo sobre una baldosa blanca con borde fino.
- En la web, el logo va en la cabecera, a la izquierda, con el símbolo a unos 30px de alto y el nombre en HTML para que use la fuente de la web. Enlaza a la página de inicio. Lo pinta el componente `src/components/SiteLogo.astro`.
- El nombre junto al símbolo es «carla lópez» en todas las páginas.
- Sobre fondos oscuros, el círculo negro pasa a blanco.
- No se recolorea, no se deforma y no se le añaden sombras ni contornos.

## Tipografía

Una sola familia para toda la web: **Inter Tight**, alojada en `/public/fonts`, con `font-display: swap`. Se usa como alternativa libre y disponible a la familia citada en el manual. No declarar Canva Sans ni Airbnb Cereal si no existe un archivo con licencia para esta web.

| Papel | Tamaño | Peso | Interlineado |
| --- | --- | --- | --- |
| Hero | `clamp(36px, 5vw, 64px)` | 600 | 1.05 |
| Título de sección | `clamp(28px, 3vw, 40px)` | 600 | 1.15 |
| Título de tarjeta | 20–22px | 600 | 1.2 |
| Cuerpo | 16px | 400 | 1.5–1.65 |
| Cuerpo pequeño | 14px | 400 | 1.43 |
| Etiqueta | 12–14px | 600 | 1.3 |
| Botón | 16px | 600 | 1.25 |

La jerarquía nace de tamaño, peso y espacio; no de titulares negros gigantes o tracking extremo. Longitud máxima de lectura: 65–75 caracteres. Para cifras de progreso, usar números tabulares.

## Geometría, espacio y contenedor

- Escala de espacio: 4, 8, 12, 16, 24, 32, 48 y 64px.
- Contenedor editorial: hasta 1120px; calendario: hasta 1280px. Márgenes laterales de al menos 16px en móvil.
- Secciones: 64px de separación vertical en escritorio, 48px en móvil.
- Tarjetas: radio de 14px y 24px de relleno. Formularios y botones: radio de 8px. Solo chips y controles circulares son píldoras.
- Bordes de 1px o una única sombra sutil en superficies flotantes. Evitar pilas de sombras, halos y tarjetas anidadas.
- La información sigue una retícula limpia. En móvil se reduce el número de columnas y se mantiene el orden de lectura.

## Componentes

### Navegación

Cabecera blanca de aproximadamente 80px, logo a la izquierda y contexto o acción a la derecha. Línea inferior fina. En páginas de lectura, enlace claro para volver.

### Botón principal

Cherry con texto blanco, altura mínima de 48px, relleno de 14px por 24px, radio de 8px y peso 600. Hover `#521326`; estado deshabilitado visiblemente atenuado. Sin desplazamiento al pasar el cursor. El texto describe la acción real.

### Botón secundario y enlace

Secundario blanco con borde cherry tenue y texto cherry. Enlaces dentro de párrafos subrayados. Foco visible de 3px en amarillo con contorno cherry cuando sea necesario para mantener contraste.

### Campo de formulario

Superficie blanca, borde fino, radio de 8px, altura mínima de 56px. Etiqueta visible. En foco, borde cherry de 2px. Mensajes de error concretos junto al campo o formulario; consentimiento separado de acciones comerciales optativas.

### Tarjeta y contenido

Fotografías y portadas con radio de 14px; metadatos debajo, no flotando encima por defecto. Tarjetas de texto blancas con borde fino o sombra suave. Listas de pasos con divisores y espaciado de 16–24px.

### Iconografía

Iconos SVG de línea en retícula de 24px, trazo de 1.8px y extremos redondeados. Usar `currentColor` para mantener el mismo dibujo en cherry, blanco o amarillo según el estado. Cada icono comunica una tarea o logro concreto; los símbolos tipográficos quedan solo como decoración festiva. El sprite del Adviento vive en `public/assets/adviento-icons.svg` y su asignación en `src/data/adviento-icons.ts`.

### Calendario de Adviento

Es la excepción narrativa: el calendario es una casa con volumen, tejado nevado, chimenea y 24 cajones extraíbles. Se presenta directamente sobre el fondo blanco de la página, sin tarjeta ni degradado detrás; los arbolitos acompañan al objeto. El progreso se sitúa a la derecha del título principal. La estructura toma la idea de un calendario físico y se construye con capas 3D de CSS para conservar botones accesibles y carga ligera. La fachada es blanco cálido (`surface`), como una casita glaseada, con el tejado y la chimenea en cherry, la nieve en blanco y los textos, la guirnalda y las molduras de la fachada en cherry; las luces del tejado alternan blanco cálido y cherry. Los frentes de los cajones siguen rayas diagonales de blanco cálido, cherry suave y cherry, como un papel de regalo. Cada frente es un panel lacado con un relieve fino, un tirador de latón, el número y el icono del día en la misma línea. Hay excepciones con significado: el 1 es el comienzo, un bastón de caramelo con rayas rojas y blancas y una placa crema para el número («¡Empieza!»); los días de sorpresa son verde abeto (el de los árboles); los de regalo llevan un lazo dorado; el 15 es la mitad del camino, en rojo navideño con copos de nieve («¡Mitad!»); el 24 es el gran regalo de Nochebuena, en verde pino con lazo, lazada y estrellas; y unos días sueltos (4, 9, 17, 19 y 22) van nevados, y el 19, aunque es de regalo, cede el lazo a la nieve, en azul escarcha con nieve acumulada en el borde superior. Cada cajón conserva siempre su color, también cuando ya se puede abrir. El amarillo no decora: solo marca lo que se puede abrir, con la etiqueta «Ábrelo» en una píldora amarilla y el marco del hueco en amarillo. El marco es verde `holly` cuando el reto está hecho, cherry suave cuando el cajón está abierto y cherry apagado en los días futuros. Un reto completado es verde navideño (`holly`) en todas partes: la etiqueta «Hecho» del cajón, el botón «Reto completado», el número del día y el anillo de progreso. Los días futuros muestran un candado y su fecha. Al abrir un día, el cajón sale y aparece el regalo; los días futuros siguen cerrados. La interfaz que lo rodea usa la misma tipografía, botones, blancos, cherry, amarillo, radios y jerarquía de la web. Cada día tiene un icono relacionado con su contenido; los logros usan iconos propios y un estado conseguido amarillo. El acceso bloqueado muestra la casa difuminada. En móvil, cajones y retos siguen siendo operables con tacto y teclado.

## Estados y accesibilidad

- Objetivos táctiles de al menos 44px; acciones principales de 48px.
- Contraste mínimo AA para texto. El amarillo funciona como acento y foco, no como cuerpo de texto sobre blanco.
- `:focus-visible` visible en enlaces, botones y campos. Etiquetas reales y estados anunciados en formularios.
- Animación breve y vinculada a una acción; respetar `prefers-reduced-motion`.
- El progreso del Adviento distingue disponible, futuro, abierto y completado con texto/forma además del color.
- Ningún contenido imprescindible depende de hover, blur o animación.

## Aplicación

`src/styles/global.css` y `tailwind.config.mjs` son la fuente técnica de tokens compartidos. Los componentes Astro consumen estas reglas. `src/styles/adviento.css` y `src/styles/adviento-day.css` aplican la variante festiva sin crear un segundo sistema de marca.
