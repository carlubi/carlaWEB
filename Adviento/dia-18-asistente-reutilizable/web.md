# Tu asistente reutilizable
resumen: Eso que solo sabes hacer tú y que siempre te preguntan: lo sacas de tu cabeza con una entrevista, lo conviertes en un procedimiento en markdown y lo metes en un proyecto que cualquiera puede consultar. Lo que sabes, disponible sin que tengas que estar.
datos: Un proceso tuyo que expliques a menudo

## Lo que solo está en tu cabeza te ata

Todo el mundo tiene uno. El proceso que siempre acaba en "pregúntale a esta persona, que lo sabe". Cómo se tramita una factura que llega mal. Cómo se prepara el cierre de mes. Cómo se pide cita en el pediatra con la mutua. Cómo se cuadra la caja de la tienda. Cómo se hace la paella de la abuela.

Parece que eso te hace imprescindible, pero en realidad te ata siempre a lo mismo: mientras seas la única persona que sabe hacerlo, no puedes delegarlo, ni irte de vacaciones sin el móvil en la mano, ni dedicarte a otra cosa. Escribir lo que sabes no te hace prescindible: te libera.

## Por qué con IA y no con un folio en blanco

Lo difícil de documentar un proceso no es escribirlo. Es **acordarse de los pasos que haces en automático**: ese "bueno, antes miro que el número de pedido esté" que llevas diez años haciendo sin pensar. Con un folio en blanco, se te escapan. Con una buena entrevista, salen solos.

Y eso es lo que hoy le vas a pedir a Claude: que te **entreviste** como lo haría una consultora que quiere entender tu trabajo.

## Ideas de procesos

**En el trabajo**

- Cómo se tramita una factura que llega con errores.
- Qué hacer cuando un cliente pide un cambio fuera de plazo.
- Cómo se da de alta a un cliente o un proveedor nuevo.
- Cómo se prepara el cierre de mes.

**En tu negocio**

- Cómo se prepara y se envía un pedido.
- Qué se hace cuando llega una devolución.
- Cómo se forma a alguien que entra a echar una mano en Navidad.

**En casa**

- Qué hay que hacer cuando se va la luz o salta el diferencial.
- Cómo se pide cita médica, se renueva el DNI o se hace la declaración.
- Las instrucciones para quien se queda con los críos o con el perro.

**Estudios y asociaciones**

- Cómo se organiza la fiesta de fin de curso.
- Cómo se tramita el alta de un socio en el club.

## Pasos

### Paso 1 · Elige el proceso

El que más explicas, o el que más miedo te da que se pierda si un día no estás.

### Paso 2 · Que te entreviste

Abre un chat nuevo y usa el prompt «Paso 1. Que te entreviste». Claude te hará preguntas de una en una.

### Paso 3 · Responde con calma

Aquí es donde está el reto. Contesta como si se lo explicaras a alguien nuevo. Cuando te pregunte por los casos raros ("¿y si el cliente no tiene NIF?", "¿y si el pediatra no tiene cita en dos semanas?"), no lo despaches con un "depende": cuéntale de qué depende.

### Paso 4 · El procedimiento

Con el prompt «Paso 2», que lo escriba en markdown con una estructura clara. Léelo entero. Corrige lo que no está bien. Y usa el prompt «Paso 3» para que busque los huecos.

### Paso 5 · Guárdalo como archivo

Pídele el procedimiento como **archivo .md descargable** (día 4). Así lo tienes tú, lo puedes compartir y lo puedes subir donde quieras.

### Paso 6 · Conviértelo en asistente

1. **Proyectos** › **Nuevo proyecto**. Nombre: el del proceso. "Facturas con errores", "Alta de clientes", "Si se va la luz".
2. Sube el archivo del procedimiento a los **archivos** del proyecto.
3. Pega en las **instrucciones** el texto del prompt «Paso 4».
4. Pruébalo con una duda real de las que te hacen. Y con una que se salga del procedimiento, para ver si te dice que no lo sabe en vez de inventárselo.

### Paso 7 · Compártelo (si tu plan lo permite)

En los planes de equipo (Team y Enterprise), puedes compartir el proyecto con tus compañeros: así consultan a tu asistente en vez de a ti. Si no tienes plan de equipo, comparte el archivo `.md` y que cada uno lo suba a su proyecto, o pásalo a PDF.

## Cómo saber si ha salido bien

- Alguien que no conoce el proceso podría seguirlo sin preguntarte.
- Están los casos raros, no solo el camino fácil.
- Al probarlo con una duda real, responde bien.
- Con una duda que no está, dice que no lo sabe y a quién preguntar.

## El siguiente nivel, para 2027

Lo que has hecho hoy es la base de lo que en Claude se llama **Skills** (habilidades): procedimientos escritos que Claude carga automáticamente cuando hacen falta, sin que tengas que abrir un proyecto. Si te gusta lo de hoy, es lo siguiente que deberías explorar.

## Palabras del día

- **Procedimiento:** los pasos escritos para hacer algo, incluidos los casos raros.
- **Conocimiento tácito:** lo que sabes hacer sin saber que lo sabes. La entrevista lo saca.
- **Skills (habilidades):** procedimientos que Claude usa por su cuenta cuando los necesita.

## Prompt · Paso 1. Que te entreviste

> Hay un proceso que explico constantemente y que solo está en mi cabeza. Quiero dejarlo escrito para que otra persona pueda seguirlo sin preguntarme.
>
> El proceso es: [una frase].
>
> **Entrevístame**, como lo haría una consultora que quiere entender mi trabajo. Hazme preguntas de una en una hasta tener claro cómo se hace, incluidos los casos raros y los errores típicos.
>
> Pregúntame también por las cosas que doy por obvias y que alguien nuevo no sabría. Si respondo «depende», pregúntame de qué depende.
>
> Cuando creas que lo tienes, dímelo y escribimos el procedimiento.

## Prompt · Paso 2. El procedimiento

> Escríbelo en markdown, con esta estructura:
>
> 1. Para qué sirve y cuándo se usa
> 2. Qué hace falta antes de empezar
> 3. Los pasos, en orden y numerados
> 4. Los casos raros y qué hacer en cada uno
> 5. Los errores típicos y cómo evitarlos
> 6. A quién se pregunta si algo se sale de esto
>
> Lenguaje sencillo. Quien lo lea puede no haber hecho esto nunca.

## Prompt · Paso 3. Los huecos

> Léelo como si fueras alguien que entra nuevo mañana. ¿Qué te faltaría para hacerlo sin preguntarme nada? Hazme esas preguntas y luego actualiza el procedimiento.

## Prompt · Paso 4. Las instrucciones del asistente

Esto va en las instrucciones del proyecto.

> Eres el asistente para este proceso. El procedimiento está en el archivo de este proyecto.
>
> Cuando alguien pregunte, responde siguiendo el procedimiento y di en qué paso o apartado está la respuesta.
>
> Si la pregunta se sale de lo que está escrito, dilo claramente y di a quién hay que preguntar según el procedimiento. No te inventes pasos.
>
> Habla de tú, con frases cortas, como una compañera que lo sabe hacer y tiene paciencia.
