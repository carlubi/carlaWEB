# Prepara tu semana
resumen: Lunes de la semana de Navidad. Juntas calendario, correo y Drive en un solo encargo y Claude te devuelve lo que de verdad importa esta semana: lo que no puede esperar, lo que hay que preparar, quién te espera y lo que puede esperar a enero. Y le pides que justifique su criterio.
datos: Tu calendario, tu Gmail y tu Drive, o la agenda y los correos de prueba

## Tres fuentes, un solo encargo

Hasta ahora has usado cada conector por separado, y el día 11 los juntaste un momento. Hoy es el plato fuerte: Claude mira tu agenda, tu correo y tus documentos a la vez y te prepara la semana. Es lo más parecido a tener a alguien que te organiza.

Y es la semana perfecta para probarlo: la de Navidad, con medio mundo de vacaciones, cosas que hay que cerrar antes del 24 y otras que pueden esperar perfectamente a enero.

## Pasos

### Paso 1 · Enciende los tres

Chat nuevo. **+** › **Conectores**: Google Calendar, Gmail y Google Drive encendidos. Nada más.

### Paso 2 · El encargo

Usa el prompt «Con tus datos conectados». Claude va a hacer varias consultas seguidas (verás varios recuadros de herramientas). Puede tardar un poco.

### Paso 3 · Compara con tu cabeza

Antes de leer su respuesta entera, apunta en un papel las tres cosas que tú crees que no pueden esperar. Luego compara.

### Paso 4 · Donde no coincidáis, pregúntale por qué

Este es el reto. El valor no está en que acierte, sino en obligarle a **justificar su criterio de prioridad**. Usa el prompt «El que de verdad enseña». A veces tendrás razón tú (sabes cosas que no están en el correo). A veces habrá visto algo que se te había pasado. Descubrir cuándo es cada caso es lo que entrena el criterio. El tuyo y el suyo.

### Paso 5 · Guárdalo como proyecto o como tarea

Si te ha gustado, tienes dos opciones:

- **Proyecto:** guarda el prompt en las instrucciones de un proyecto con la palabra clave **SEMANA** y úsalo cada lunes.
- **Tarea programada** (de pago): prográmalo para los lunes a primera hora, con la entrega como borrador en Gmail, como en el día 16.

## Cómo saber si ha salido bien

- Su criterio de prioridad se puede explicar.
- No se ha inventado urgencias.
- Hay cosas en la lista de "puede esperar". Si todo es urgente, no ha priorizado.
- Cada cosa dice de dónde sale: calendario, correo o Drive.

## La idea que se queda

Lo que agota no es el trabajo: es decidir constantemente por dónde seguir. Delegar esa primera decisión de la semana quita más carga mental que cualquier otra cosa. Pero la última palabra sobre qué es urgente la tienes tú.

## Si no puedes conectar nada

Descarga la agenda y los correos de prueba (son de una persona inventada) y usa el prompt «Con los archivos de prueba». El ejercicio de comparar criterios funciona igual.

## Palabras del día

- **Priorizar:** decidir qué va primero y, sobre todo, qué puede esperar.
- **Orquestar:** cuando Claude combina varias herramientas en un solo encargo.

## Prompt · Con tus datos conectados

> Prepárame la semana. Mira mi calendario de esta semana y la que viene, mi correo de los últimos 7 días y, si hace falta, los documentos de mi Drive relacionados con lo que tengo pendiente.
>
> Ten en cuenta que es la semana de Navidad: hay gente de vacaciones y cosas que tienen que cerrarse antes del 24.
>
> Dime:
>
> 1. **Las tres cosas que no pueden esperar**, y por qué cada una.
> 2. **Qué tengo que preparar** antes de cada cita importante, y qué documento de Drive me sirve.
> 3. **Quién espera respuesta mía** desde hace días.
> 4. **Qué puede esperar a enero** sin consecuencias.
>
> El punto 4 es el que más me interesa. Si me dices que todo es urgente, no me sirve.
>
> Explícame tu criterio para ordenar y dime de dónde sale cada cosa (calendario, correo o Drive).
>
> No cambies nada, no respondas a nadie y no crees nada.

## Prompt · El que de verdad enseña

Cuando lo compares con lo que tú habrías priorizado:

> Yo habría puesto [X] primero y tú lo has dejado para [donde lo haya puesto]. ¿Por qué? ¿Qué sabías tú que yo no, o qué sé yo que tú no puedes saber?

## Prompt · Con los archivos de prueba

Si no puedes conectar nada.

> Te paso la agenda de una semana y los correos de una persona. Prepárale la semana:
>
> 1. Las tres cosas que no pueden esperar, y por qué
> 2. Qué tiene que preparar antes de cada cita importante
> 3. Quién lleva días esperando respuesta
> 4. Qué puede esperar a la semana siguiente
> 5. **Si hay algún correo que no deba tratarse de forma rutinaria, señálalo**
>
> Explícame tu criterio de prioridad y de qué archivo y fila sale cada cosa.
>
> [adjunta agenda-semana.csv y bandeja-entrada.csv]

## Descarga · Agenda de prueba
archivo: _datos-de-prueba/agenda-semana.csv
Una semana inventada con trabajo, críos y Navidad.

## Descarga · Correos de prueba de una semana
archivo: _datos-de-prueba/bandeja-entrada.csv
120 correos inventados de una semana de diciembre.
