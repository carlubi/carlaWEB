# Día 22 · Tu vigilante de la bandeja

**Tipo:** 🎯 Reto
**Herramienta:** Claude (tarea programada + conector de correo)
**Tiempo:** 25 minutos
**Datos:** `bandeja-entrada.csv` para ensayar, su correo para la versión real

## Objetivo

Montar lo más parecido a una automatización real que vamos a hacer: algo que revisa el correo solo, detecta lo que encaja con un criterio suyo y le deja el borrador preparado.

## Por qué sin Make ni n8n

Porque con una tarea programada y un conector se consigue lo mismo para su caso. Un flujo se dispara cuando llega el correo; esto revisa cada cierto tiempo. Para ella, la diferencia es ninguna.

Lo que no se puede hacer así (ramificaciones, muchas apps encadenadas, registros) es contenido de curso, no de un reto de 25 minutos. Y conviene decirlo: aquí termina lo que se hace sin herramientas de automatización, y eso ya es mucho más de lo que creía.

## Pasos

1. **Ensaya primero** con `bandeja-entrada.csv`. Define el criterio sobre datos falsos.
2. Afina hasta que clasifique como ella lo haría.
3. Convierte ese criterio en una tarea programada sobre su correo real.
4. Ponla a revisar una vez al día, no cada hora.
5. Déjala una semana y luego decide.

## El paso 1 es obligatorio

Nadie debe estrenar un criterio de clasificación sobre su correo real. Primero se prueba con datos falsos, se ve dónde falla y se corrige. Luego se suelta.

Esto es exactamente lo que hace un equipo técnico antes de poner algo en producción, y ella lo va a hacer sin saber que tiene nombre.

## El límite que no se cruza hoy

**Prepara borradores. No envía nada.** Mañana trabajamos esto a fondo, pero hoy ya tiene que estar claro: la IA deja el trabajo hecho, ella aprieta el botón.

## Los seis correos sospechosos

`bandeja-entrada.csv` tiene seis mensajes pidiendo cambiar datos bancarios de un proveedor. Son el caso perfecto: lo que **nunca** debe entrar en una rutina automática. Si su criterio los mete en "proveedores" sin más, ahí está la lección del día.

## Cómo saber si ha salido bien

- Clasifica como ella lo haría en 8 de cada 10.
- Los casos dudosos los deja aparte en vez de forzarlos.
- Los seis sospechosos acaban en una categoría de revisión manual.
- No envía nada.

## Por verificar antes de publicar

- [ ] **Clave:** si una tarea programada puede leer correo y dejar un borrador, y en qué plan
- [ ] Si no se puede, el reto pasa a ser "clasificar y avisar", que sigue valiendo
