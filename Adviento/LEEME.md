# Adviento IA · carlaylz · materiales

Aquí vive todo lo que hace falta para cada día del calendario: prompts, plantillas, datos de prueba y los regalos descargables.

## Cómo está organizado

```
Adviento/
├── LEEME.md                    ← este archivo
├── 00-kit-de-arranque/         ← el regalo del día 1 (lo que descargan)
├── _plantillas-base/           ← piezas reutilizables en varios días
├── _datos-de-prueba/           ← ficheros ficticios para practicar sin datos reales
├── dia-01-mapa-de-tareas/
├── dia-02-conectores/
└── ... (una carpeta por día, se van creando según decidimos)
```

## Qué lleva la carpeta de cada día

| Archivo | Para qué |
|---|---|
| `ficha.md` | La ficha del día: objetivo, herramienta, tiempo, pasos, revisión |
| `prompt.md` | El prompt listo para copiar (si lo hay) |
| `correo.md` | El texto del correo que se envía ese día |
| `web.md` | El texto que se ve al abrir la puerta en la web (formato abajo) |
| Adjuntos | Plantillas, hojas, documentos de prueba |

## Formato de `web.md`

Es lo único que se publica en la web: la ficha y el prompt.md son para ti y no salen nunca. Se escribe de tú, a quien hace el reto.

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
Descripción corta.
```

Los `.md` se descargan como PDF con la marca; los `.csv`, tal cual. `archivo: @calendario-imprimible` es el calendario del kit: no tiene archivo propio, se maqueta solo con los títulos, tipos, herramientas y tiempos de los 24 días (`scripts/adviento-calendario.mjs`), así que siempre coincide con la web. Después de cambiar algo, ejecuta `npm run build:adviento` (necesita Chrome instalado para los PDF) y vuelve a cargar `supabase/adviento-seed.sql` en Supabase. El script se para si el texto visible menciona un archivo interno (`.md`, `00-kit-de-arranque`...) o si un prompt pide adjuntar algo que no está en las descargas.

## Regla de los datos de prueba

Ningún reto debe pedir datos reales de empresa. Todo lo que se practique usa los ficheros de `_datos-de-prueba/`: nombres, importes y correos inventados. Eso quita el miedo y evita problemas.

## Estado

- [x] Estructura creada
- [x] Los 24 días con ficha y materiales

- [ ] Correo y texto de web de cada día
- [ ] Calendario imprimible del kit
- [ ] Capturas de los días 3, 4, 7, 9, 10 y 20

## Antes de publicar

Verificar con la herramienta real (en noviembre) cada función que se promete: conectores, tareas programadas, slides, artefactos, NotebookLM, Higgsfield. Cambian de nombre, de plan y de disponibilidad a menudo.
