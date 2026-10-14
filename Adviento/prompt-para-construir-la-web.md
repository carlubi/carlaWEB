# Prompt para construir el calendario de adviento

Pega esto entero en tu IA de desarrollo. Está escrito para que no tenga que preguntarte nada.

Si ya tienes el prototipo HTML a mano, adjúntalo también: la IA verá el diseño en vez de imaginárselo.

---

## CONTEXTO

Construye una página de calendario de adviento para `carla-lopez.com`, una marca personal que enseña IA práctica a profesionales no técnicos.

Del 1 al 24 de diciembre de 2026 se abre un reto diario. El objetivo de negocio es captar correos para una newsletter y anunciar un curso el día 24.

**La persona que lo va a usar:** mujer de unos 35 años, administrativa o de operaciones en una empresa mediana. No se considera técnica. Entra desde el móvil o desde el ordenador del trabajo. Si algo no se entiende a la primera, se va.

---

## STACK

- Framework: Next.js con React y TypeScript (App Router)
- Base de datos y autenticación: Supabase
- Estilos: CSS modules o Tailwind, lo que prefieras, pero con tokens de color centralizados
- Despliegue: Vercel
- Sin librerías de animación pesadas: CSS y Canvas bastan

---

## FLUJO DE ACCESO

No hay contraseñas. El correo es la identidad.

1. La persona llega a `/adviento` y ve una pantalla de entrada con un campo de correo.
2. Introduce el correo y pulsa "Entrar al calendario".
3. **Si el correo ya está registrado:** entra directamente al calendario, con su progreso cargado.
4. **Si no está registrado:** se le pide el nombre y que marque una casilla de aceptación de la política de privacidad. Hasta que ambas cosas estén, el botón sigue deshabilitado. Al enviar, se crea el registro y entra.
5. La sesión se recuerda en el dispositivo (cookie o token en Supabase) para que no tenga que repetir el correo cada día.

**Validaciones:**
- Formato de correo correcto, con mensaje claro si falla ("Ese correo no parece completo. Revísalo.").
- Normaliza a minúsculas y quita espacios antes de guardar y comparar.
- Protege el endpoint contra envíos masivos con un límite por IP.
- La casilla de privacidad nunca viene premarcada, y se guarda la fecha y hora de aceptación.

---

## MODELO DE DATOS

```sql
create table suscriptores (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  nombre text not null,
  acepto_politicas boolean not null default false,
  fecha_aceptacion timestamptz,
  creado_en timestamptz not null default now(),
  ultima_visita timestamptz
);

create table progreso (
  id uuid primary key default gen_random_uuid(),
  suscriptor_id uuid not null references suscriptores(id) on delete cascade,
  dia smallint not null check (dia between 1 and 24),
  abierto_en timestamptz not null default now(),
  completado_en timestamptz,
  unique (suscriptor_id, dia)
);

create table logros (
  id uuid primary key default gen_random_uuid(),
  suscriptor_id uuid not null references suscriptores(id) on delete cascade,
  logro text not null,
  conseguido_en timestamptz not null default now(),
  unique (suscriptor_id, logro)
);
```

Activa RLS en las tres tablas. Cada persona solo puede leer y escribir sus propias filas.

**Importante: dos estados distintos, no uno.** Abrir una puerta y completar el reto son cosas diferentes. `abierto_en` se rellena al abrir; `completado_en` solo cuando pulsa "Marcar como completado". El círculo de progreso necesita distinguirlos.

---

## REGLAS DE APERTURA

- Solo se pueden abrir los días cuyo número sea **menor o igual al día actual de diciembre**. El día 15 no se abre el 14.
- Los días pasados **sí** se pueden abrir en cualquier momento. Nada caduca: quien entre el 20 de diciembre puede hacer los 19 anteriores.
- Las puertas de días futuros se ven, pero están apagadas y no responden al clic.
- **Valida el día en el servidor, no solo en el cliente.** Cambiar la fecha del ordenador no debe abrir el día 24 en noviembre.
- Fuera de diciembre: antes del 1, pantalla de cuenta atrás con captación de correo. Después del 24, todo queda abierto y accesible.
- Zona horaria: Europe/Madrid para todos los cálculos de fecha.

---

## PANTALLA DEL CALENDARIO

### Cabecera

A la izquierda, un **círculo de progreso** formado por 24 arcos, uno por día, dispuestos en anillo:
- Arco fino y gris: día sin abrir
- Arco granate medio: día abierto pero no completado
- Arco dorado grueso con resplandor: día completado

En el centro del círculo, el número de retos completados y debajo "de 24".

A la derecha, el saludo con su nombre y una línea de estado: "Hoy toca el día 12. Llevas 9 retos completados."

### Rejilla de puertas

**No una cuadrícula de 24 cajas iguales.** Los calendarios de adviento reales tienen puertas de tamaños distintos:
- 6 columnas en escritorio, 3 en móvil
- Los días 1, 5, 12 y 19 ocupan 2 columnas
- El día 24 ocupa 2 columnas y 2 filas
- El resto son cuadrados de 1×1
- Usa `grid-auto-flow: dense` para que encaje sin huecos

### Estados visuales de cada puerta

| Estado | Cómo se ve |
|---|---|
| **Futuro** | Apagada, atenuada al 42 %, sin saturación, número en gris. No clicable |
| **Disponible** | Borde dorado, número en degradado dorado, resplandor exterior que late cada 3,2 s |
| **Abierta** | La hoja girada, se ve el interior iluminado con su medallón |
| **Completada** | Como abierta, pero con la luz interior más intensa y un sello dorado con un check en la esquina |

### Dentro de cada puerta

Un **medallón dorado** circular con relieve: degradado radial, brillo elíptico arriba y un símbolo grabado distinto por día. Debajo, el título del reto en pequeño.

Símbolos por día: 1 mapa · 2 llave · 3 enchufe · 4 carpeta · 5 chispa · 6 lupa · 7 reloj · 8 bocadillo · 9 pantalla · 10 libro · 11 lista · 12 regalo · 13 claqueta · 14 gráfico · 15 paleta · 16 brújula · 17 bifurcación · 18 engranaje · 19 regalo · 20 cursor · 21 amanecer · 22 sobre · 23 semáforo · 24 estrella.

---

## ANIMACIONES

Esta es la parte que da la sensación de calendario de verdad. No la recortes.

**Al pasar por encima de una puerta disponible:** la hoja se levanta unos 13 grados sobre una bisagra en el lado izquierdo, con un destello diagonal que la cruza.

**Al abrir una puerta:**
1. La hoja gira 112 grados sobre la bisagra izquierda, en 0,8 s con una curva `cubic-bezier(.34,.9,.28,1)`. Como la cartulina de un calendario físico.
2. El montoncito de nieve del borde superior se cae con ella.
3. El interior se ilumina con un degradado radial cálido que aparece en 0,8 s.
4. El medallón entra escalando con rebote (`cubic-bezier(.2,1.5,.4,1)`), con 0,3 s de retraso.
5. El título aparece después.
6. A los 0,76 s se abre el panel del reto.

**Al marcar como completado:**
1. Explosión de luz dorada desde el centro, que se expande y se desvanece en 1,1 s.
2. Veintidós chispas doradas salen en todas direcciones, con retrasos aleatorios.
3. El sello con el check aparece en la puerta girando y escalando desde cero.
4. El arco correspondiente del círculo de progreso se vuelve dorado.
5. Si eso desbloquea un logro, la página baja suavemente hasta la sección de logros.

**Nada de confeti.** Es el recurso genérico y choca con el tono.

---

## AMBIENTE NAVIDEÑO

Capas de fondo, de atrás hacia delante:

1. **Aurora:** cuatro degradados radiales en granate y oro, desenfocados a 70px, que se desplazan y escalan muy despacio en bucle de 26 s.
2. **Nieve y luz:** un canvas a pantalla completa con unos 95 copos cayendo (48 en móvil) de tamaños variados y balanceo lateral; los más grandes llevan cristalitos de tres aspas. Mezclados, unas 26 motas doradas que suben.
3. **Viñeta:** oscurecimiento radial en los bordes.

Elementos decorativos:

- **Guirnalda de luces** colgando en la parte superior, en seis vanos con caída. Cable verde oscuro, agujas de pino a lo largo, bombillas doradas, rojas y blancas que parpadean con retrasos distintos entre sí, y bayas rojas en el punto bajo de cada vano.
- **Ramas de abeto** en las dos esquinas superiores de la rejilla, con bayas rojas y bolitas doradas.
- **Nieve posada** en el borde superior de cada puerta cerrada, con forma ligeramente distinta en cada una (genérala a partir del número del día).
- **Escarcha** en las esquinas de las puertas cerradas. Desaparece al abrir.

El verde pino y el rojo baya son **solo decoración**. Botones, números, medallones e interfaz van siempre en granate y oro.

---

## PANEL DEL RETO

Se abre sobre un velo oscuro con desenfoque. Contiene:

- El medallón del día, grande y centrado
- "Día N" y una etiqueta dorada con el tipo (Reto, Regalo, Sorpresa, Tip, Formación)
- Título del reto
- Descripción en una o dos frases
- Una fila de tres datos: herramienta, tiempo estimado, si hacen falta datos reales
- El contenido del reto: pasos y el prompt, con **botón de copiar**
- Descargas del día, si las hay
- Botones: "Marcar como completado" y "Lo hago luego"
- Si ya está completado: un indicador en vez del botón, más "Cerrar"

Se cierra con Escape, con clic fuera o con el botón. El foco entra al panel al abrirse y vuelve a la puerta al cerrarse.

---

## LOGROS

Sección debajo de la rejilla, con nueve medallas en rejilla de 3×3. Las no conseguidas se ven en gris y desaturadas; al desbloquearse pasan a dorado con una animación de rebote.

| Clave | Nombre | Condición |
|---|---|---|
| `primera` | La primera puerta | Abrir el día 1 |
| `tres` | Tres seguidos | Completar 3 retos |
| `conectada` | Conectada | Completar el día 3 |
| `critica` | Ojo crítico | Completar el día 6 |
| `sola` | Trabaja sola | Completar el día 7 |
| `mitad` | A mitad de camino | Completar 12 retos |
| `datos` | Sin miedo a los datos | Completar el día 14 |
| `vigilante` | La que automatiza | Completar el día 22 |
| `todas` | Las 24 | Completar los 24 |

Debajo del título: "X de 9 desbloqueados. Se consiguen solos según avanzas."

Calcula y guarda los logros **en el servidor**, al registrar cada compleción.

---

## DISEÑO

### Colores

```css
--noche:#1C060D;        /* fondo */
--noche-2:#2E0A17;
--fachada:#48162A;      /* cara de las puertas */
--granate:#691B32;      /* color de marca */
--granate-vivo:#9B2F4C;
--oro:#FFE45C;          /* color de marca, la recompensa */
--oro-hondo:#D99B2B;
--oro-claro:#FFF6C9;
--crema:#FBF6EF;        /* texto */
--pino:#2E6B4F;         /* solo decoración */
--pino-hondo:#1B4532;
--baya:#C1372F;
--hielo:#CFE6F2;
```

El oro es la recompensa: solo aparece donde ya ha estado la persona. Las puertas cerradas no llevan oro.

### Tipografía

- Títulos y números: **Fraunces**, pesos 300 y 500
- Texto e interfaz: **Inter Tight**, pesos 300 a 600
- Los títulos grandes llevan el degradado dorado aplicado al texto con `background-clip: text` y un resplandor suave

### Criterio general

Alegre y navideño, pero **nunca infantil**. El público tiene 35 años y lo abre desde el trabajo. La referencia no es un calendario de chocolate de supermercado, es una caja de bombones buena: granate, oro, vidrio y luz.

Nada de tipografía de cómic, morados de videojuego ni personajes de dibujos.

---

## ACCESIBILIDAD Y RENDIMIENTO

- **Móvil primero.** La mitad o más entrará desde el teléfono.
- Respeta `prefers-reduced-motion`: sin nieve en movimiento, sin aurora, sin parpadeos. El contenido sigue funcionando igual.
- Las puertas son `<button>` reales, navegables con teclado y con foco visible.
- `aria-label` en cada puerta: "Día 5: Tu mini-app en 5 minutos" o "Día 18, todavía cerrado".
- El panel es un diálogo modal con el foco atrapado dentro.
- Contraste suficiente de todo el texto sobre el fondo oscuro.
- El canvas de nieve se pausa cuando la pestaña no está visible.
- Precarga solo lo del día actual; el resto, al abrir.

---

## CORREOS

Cada día a las 8:00 (hora de Madrid) sale un correo a quienes estén suscritos, avisando de que hay puerta nueva. El correo lleva al calendario, no sustituye a la web.

Monta el envío con una tarea programada de Vercel o un cron de Supabase, y un proveedor como Resend. Guarda qué correos se han enviado para no duplicar si la tarea se reintenta.

Todo correo lleva enlace de baja.

---

## CASOS QUE HAY QUE RESOLVER

- **Entra el día 20 por primera vez:** ve 20 puertas disponibles de golpe, que abruma. Muéstrale un mensaje de bienvenida distinto que le sugiera empezar por el día 1 en lugar de por el de hoy.
- **Mismo correo en dos dispositivos:** el progreso es el mismo, vive en la base de datos.
- **Pulsa dos veces "completado":** la restricción de unicidad lo impide; la interfaz no debe romperse.
- **Entra el 25 o después:** todo abierto, mensaje de cierre y el anuncio del curso.
- **Se queda sin conexión a media apertura:** la puerta no se marca como abierta hasta que el servidor confirma.
- **No acepta las políticas:** no entra, y el botón se lo dice sin regañarle.

---

## LOS 24 DÍAS

| Día | Título | Tipo | Herramienta | Tiempo |
|---|---|---|---|---|
| 1 | Tu mapa de tareas | Reto + regalo | Claude | 15 min |
| 2 | Conectores sin miedo | Tip | Claude | 5 min |
| 3 | Tu primer conector | Reto | Claude | 15 min |
| 4 | Un proyecto para tu trabajo | Tip | Claude | 10 min |
| 5 | Tu mini-app en 5 minutos | Sorpresa | Claude | 10 min |
| 6 | Cómo cazar un error | Tip | Claude | 10 min |
| 7 | Tu primera tarea programada | Reto | Claude | 15 min |
| 8 | 5 frases para pedir mejor | Tip | Claude | 5 min |
| 9 | De notas a presentación | Reto | Claude | 20 min |
| 10 | Pregúntale a tus documentos | Reto | NotebookLM | 20 min |
| 11 | De reunión a próximos pasos | Reto | Claude | 15 min |
| 12 | Mi asistente de oficina | Regalo | Claude | 10 min |
| 13 | Tu primer vídeo con IA | Sorpresa | Higgsfield | 15 min |
| 14 | Informe sin empezar de cero | Reto | Claude | 25 min |
| 15 | Diseño sin ser diseñadora | Reto | Claude + Canva | 20 min |
| 16 | Investigar con fuentes | Formación | Claude | 25 min |
| 17 | ¿Cuándo uso cada una? | Tip | Varias | 5 min |
| 18 | Tu asistente reutilizable | Reto | Claude | 25 min |
| 19 | Pack de tareas programadas | Regalo | Claude | 10 min |
| 20 | Claude en tu navegador | Sorpresa | Claude en Chrome | 15 min |
| 21 | Prepara tu lunes | Reto | Claude | 20 min |
| 22 | Tu vigilante de la bandeja | Reto | Claude | 25 min |
| 23 | Tú decides, ella prepara | Reto | Claude | 20 min |
| 24 | Tu mapa de 2027 | Regalo | Claude | 15 min |

El contenido completo de cada día (pasos, prompts y descargas) lo cargo yo. Deja los textos en un archivo de datos aparte, fácil de editar, no incrustados en los componentes.

---

## ENTREGA

1. Monta primero el esqueleto con datos de ejemplo y todo navegable.
2. Después, el acceso y la base de datos.
3. Después, las animaciones y el ambiente.
4. Por último, los correos.

Enséñame cada parte antes de pasar a la siguiente.

Dos cosas importantes: **la validación del día va en el servidor** y **el progreso vive en la base de datos, no en el navegador**. Todo lo demás se puede ajustar después.
