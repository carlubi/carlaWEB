# Adviento IA · carlaylz · materiales

Aquí vive todo lo que hace falta para cada día del calendario: prompts, plantillas, datos de prueba y los regalos descargables.

## Cómo está organizado

```
Adviento/
├── LEEME.md                    ← este archivo
├── indice-contenidos.md        ← el índice de los 24 días (empieza por aquí)
├── 00-kit-de-arranque/         ← el regalo del día 1 (lo que descargan)
├── _datos-de-prueba/           ← ficheros ficticios para practicar sin datos reales
├── _capturas/                  ← capturas de pantalla de la app (lista en _capturas/LEEME.md)
├── dia-01-mapa-de-tareas/
├── dia-02-modelos-y-uso/
└── ... (una carpeta por día, 24 en total)
```

## Qué lleva la carpeta de cada día

| Archivo | Para qué |
|---|---|
| `ficha.md` | La ficha interna: objetivo, lo que aprende, notas, capturas necesarias y qué verificar |
| `web.md` | El texto que se ve al abrir la puerta en la web, con los prompts (formato abajo) |
| `correo.md` | El texto del correo que se envía ese día (pendiente) |
| Adjuntos | Plantillas, hojas, documentos de prueba |

## Formato de `web.md`

Es lo único que se publica en la web: la ficha es para ti y no sale nunca. Se escribe de tú, a quien hace el reto.

```
# Título del día
resumen: Una o dos frases que salen bajo el título.
datos: Qué datos necesita (sale como etiqueta).

## Pasos                          ← cualquier título normal va a la columna izquierda
1. ...

## Prompt · Paso 1. La estructura   ← tarjeta copiable en la columna derecha
Texto opcional de introducción.

> El prompt, citado con >. Cada bloque citado lleva su botón «Copiar».
> [adjunta ventas-2026.csv]      ← no se copia: enlaza a la descarga del mismo nombre

## Descarga · Ventas de prueba      ← archivo descargable en la columna derecha
archivo: _datos-de-prueba/ventas-2026.csv
copiar: sí                         ← opcional: añade «Copiar texto» (plantillas para pegar en Claude)
formato: md                        ← opcional: un .md se descarga tal cual, sin pasarlo a PDF
Descripción corta.

### Paso 1 · Abre los ajustes          ← los ### dentro de una sección sirven para el paso a paso

![Pie de foto que describe la captura](capturas/d03-01-nombre.png)   ← captura, sola en su párrafo
```

**Capturas:** cada imagen va sola en su párrafo (nunca dentro de una lista o una tabla) y su archivo vive en `_capturas/`. El texto entre corchetes sale como pie de foto. Si falta el archivo, la web enseña un hueco «Captura pendiente» y la build lo avisa.

**`formato: md`:** para los días de markdown (4), contexto (8) y plantillas (12), donde la gracia es abrir o subir el `.md` tal cual.

Los `.md` se descargan como PDF con la marca; los `.csv`, tal cual. `archivo: @calendario-imprimible` es el calendario del kit: no tiene archivo propio, se maqueta solo con los títulos, tipos, herramientas y tiempos de los 24 días (`scripts/adviento-calendario.mjs`), así que siempre coincide con la web. Después de cambiar algo, ejecuta `npm run build:adviento` (necesita Chrome instalado para los PDF) y vuelve a cargar `supabase/adviento-seed.sql` en Supabase. El script se para si el texto visible menciona un archivo interno (`.md`, `00-kit-de-arranque`...) o si un prompt pide adjuntar algo que no está en las descargas.

## Regla de los datos de prueba

Ningún reto debe pedir datos reales de empresa. Todo lo que se practique usa los ficheros de `_datos-de-prueba/`: nombres, importes y correos inventados. Eso quita el miedo y evita problemas.

## Estado

- [x] Estructura creada
- [x] Los 24 días con ficha y materiales
- [x] Reordenación y reescritura de los 24 días (octubre 2026): público general, Claude como eje, paso a paso con capturas

- [x] Texto de web de cada día
- [ ] Correo de cada día
- [ ] Las 45 capturas de `_capturas/LEEME.md`

## Antes de publicar

Verificar con la herramienta real (en noviembre) cada función que se promete: modelos, uso, proyectos, conectores, tareas programadas, creación de archivos, artefactos y Claude en Chrome. Cada `ficha.md` tiene su lista «Por verificar antes de publicar». Cambian de nombre, de plan y de disponibilidad a menudo, y los nombres de los botones en español hay que comprobarlos con la interfaz delante.
