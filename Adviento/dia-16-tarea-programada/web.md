# Tu primera tarea programada
resumen: Hoy Claude empieza a trabajar sin que se lo pidas. Montas paso a paso una tarea que cada mañana busca las noticias de IA, elige las tres que importan, te explica cómo te pueden ayudar en tu día a día y te lo deja en tu Gmail. El prompt va hecho y explicado pieza a pieza.
datos: Gmail conectado (día 11). Plan de pago para programarla; alternativa para el gratuito

## De pedirle cosas a que trabaje para ti

Hasta hoy, Claude solo hacía algo cuando tú le escribías. Una **tarea programada** es distinto: le dejas unas instrucciones, le dices cuándo, y **se pone a trabajar sola** a esa hora, cada día o cada semana, aunque estés durmiendo, de viaje o con el portátil cerrado. Cuando acaba, te deja el resultado.

Esto es lo que en el mundillo se llama un **agente**: una IA que no solo responde, sino que hace una serie de pasos por su cuenta (buscar, leer, elegir, escribir, guardar) para cumplir un encargo.

Hoy montas tu primer agente. Y no es de juguete: es uno que vas a querer leer cada mañana.

## Lo que vas a montar

Cada día laborable, a la hora que elijas:

1. Claude **busca en internet** las noticias de inteligencia artificial de las últimas 24 horas.
2. **Elige las tres** que importan a alguien que no se dedica a la tecnología.
3. Para cada una te cuenta qué ha pasado, por qué importa y **cómo te puede ayudar en tu día a día**, teniendo en cuenta a qué te dedicas.
4. Añade **un truco práctico de Claude**.
5. Te lo deja como **borrador en tu Gmail**, dirigido a ti, con un asunto fácil de encontrar.

Abres el correo con el café y en tres minutos estás al día. En un mes sabrás más de IA que la mayoría de la gente que te rodea.

## Lo que necesitas

- **Un plan de pago** (Pro, Max, Team o Enterprise). Las tareas programadas no están en el gratuito. Si es tu caso, al final tienes una alternativa que funciona casi igual.
- **Gmail conectado**, como hiciste el día 11.
- **La búsqueda web activada** (día 14).
- **Claude en la web o en la app de escritorio.** Las tareas se crean ahí; luego se ejecutan en la nube, así que no hace falta que tu ordenador esté encendido.

## Por qué te llega como borrador y no como correo enviado

Buena pregunta. Claude, por seguridad, **no envía correos sin tu permiso**: cada envío necesita que tú lo apruebes. Una tarea que se ejecuta sola a las 7:30 no tiene a nadie delante para aprobar nada. Así que la forma segura y que siempre funciona es esta: Claude **crea un borrador dirigido a ti** y tú lo encuentras en la carpeta **Borradores** de Gmail, en el móvil o en el ordenador.

Y de paso aprendes la regla de oro de las automatizaciones, que veremos a fondo el día 23: **la IA prepara, tú decides qué sale**.

## El prompt, pieza a pieza

Antes de copiarlo, entiende por qué está escrito así. Así podrás escribir los tuyos.

| Pieza | Qué hace | Por qué |
|---|---|---|
| **El rol** | "Eres mi curador de noticias de IA" | Le da un papel claro y un criterio para elegir |
| **Quién eres tú** | A qué te dedicas y qué te interesa | Sin esto, el consejo práctico es genérico |
| **Qué buscar y dónde** | Últimas 24 horas, fuentes fiables | Evita noticias viejas y blogs de dudosa procedencia |
| **Cómo elegir** | Solo tres, lo que afecta a gente normal | Si no le pones límite, te manda quince |
| **El formato de cada noticia** | Qué ha pasado, por qué importa, cómo te ayuda, enlace | Lo hace útil y comprobable |
| **El truco del día** | Una cosa práctica de Claude | Aprendes un poco cada día |
| **Las reglas** | No inventar, siempre enlace, qué hacer si no hay nada | Una tarea que corre sola necesita límites claros |
| **La entrega** | Borrador en Gmail, a tu dirección, con asunto fijo | Lo encuentras siempre en el mismo sitio |

Fíjate en la regla de "si no hay nada relevante, dilo". Es la **frase de la duda** que vimos el día 3, aplicada a una tarea que trabaja sola. Sin ella, un día flojo te rellenaría con noticias de relleno o, peor, inventadas.

## Antes de programarla: pruébala a mano

Nunca programes algo que no has visto funcionar. Primero:

1. Abre un chat nuevo con **Gmail** y la **búsqueda web** activados.
2. Pega el prompt «La tarea: tu IA del día», rellenando tus datos.
3. Mira qué hace, paso a paso. Cuando vaya a crear el borrador, te pedirá permiso: dale a **permitir una vez**.
4. Abre Gmail › **Borradores**. ¿Te gusta lo que hay? ¿El consejo práctico tiene que ver contigo?
5. Si algo no te encaja, cambia el prompt y repite. Cuando te guste, a programarla.

## Paso a paso: programarla

La pantalla de las tareas programadas depende de cómo tengas Claude. Mira tu caja de texto:

- Si ves dos opciones, **Chat** y **Cowork**, sigue el **camino A**.
- Si no las ves, tienes la versión nueva: sigue el **camino B**.

### Camino A · Desde el apartado de tareas programadas

**1. Entra en Cowork.** Selecciona **Cowork** en la caja de texto.

**2. Abre las tareas programadas.** En la barra lateral, pulsa **Programadas** (en inglés, *Scheduled*).

![La barra lateral de Cowork con el apartado de tareas programadas](capturas/d16-01-programadas.png)

**3. Crea una nueva.** Pulsa **Nueva tarea** (arriba a la derecha) y elige **Configurar manualmente**. Hay otra opción, **Crear con Claude**, en la que Claude te hace preguntas y la monta por ti; está bien, pero hoy hazla a mano para entender cada campo.

**4. Rellena el formulario:**

- **Nombre:** «Tu IA del día».
- **Instrucciones (prompt):** pega el prompt ya probado y con tus datos.
- **Modo de aprobación:** decide si Claude puede usar sus herramientas sin preguntarte mientras trabaja solo. Para esta tarea necesita buscar en internet y crear el borrador, así que elige el modo que se lo permita sin esperarte. Como solo crea un borrador para ti, el riesgo es mínimo.
- **Frecuencia:** **Entre semana** (de lunes a viernes). Si te pide hora, elige un rato antes de empezar tu día.
- **Modelo:** **Sonnet**. Para esto no hace falta Opus, y así gastas menos.
- **Carpeta:** déjala vacía. Esta tarea no necesita archivos de tu ordenador.

![El formulario de nueva tarea programada con los campos de nombre, instrucciones, modo de aprobación, frecuencia y modelo](capturas/d16-02-formulario.png)

**5. Guarda.** Ya aparece en tu lista de tareas programadas, con la próxima ejecución.

### Camino B · Desde cualquier chat

1. Abre un chat nuevo.
2. Usa el prompt «Prográmala desde el chat», con tu prompt dentro.
3. Claude te hará alguna pregunta (la hora, por ejemplo) y te enseñará un resumen: nombre, frecuencia e instrucciones.
4. Revísalo bien y pulsa **Programar**.

![La propuesta de tarea programada dentro de un chat, con el resumen y el botón de programar](capturas/d16-03-programar-desde-chat.png)

## Pruébala ya, sin esperar a mañana

En la lista de tareas programadas, abre la tuya y pulsa **ejecutar ahora** (o "run now"). Se pondrá en marcha en ese momento. Cuando acabe, mira tus **Borradores** de Gmail.

Esto es importante: así compruebas que la versión programada hace lo mismo que la que probaste a mano. A veces, sin nadie delante, algo falla (un permiso, un conector apagado). Mejor descubrirlo hoy que mañana a las 7:30.

## Cómo se gestiona

Todo desde la lista de tareas programadas:

- **Ver el historial:** cada ejecución queda guardada como una sesión que puedes abrir para ver qué buscó, qué leyó y qué escribió. Si un día el correo sale raro, ahí está el porqué.
- **Editarla:** pulsa la tarea y cambia las instrucciones, la frecuencia o el modelo.
- **Pausarla:** si te vas de vacaciones, la pausas y la reanudas a la vuelta.
- **Eliminarla:** si ya no la lees, bórrala. En serio.

![La ficha de una tarea programada con el historial de ejecuciones y los botones de editar, pausar, ejecutar ahora y eliminar](capturas/d16-04-gestionar-tarea.png)

## Lo que gasta

Cada ejecución consume uso, como una conversación con búsqueda web (día 2). Con Sonnet y cinco días a la semana es asumible en Pro. Si ves que la barra semanal sube mucho, baja a Haiku o pásala a tres días.

## El paso que casi nadie da

Una tarea programada que no se lee es ruido. **Si en una semana te la estás saltando, cámbiala o bórrala.** Puede que te sobre una noticia y quieras solo una. Puede que el consejo no sea útil y haya que contarle más de ti. Ajusta.

## Si estás en el plan gratuito

No puedes programarla, pero puedes tenerla a un clic:

1. Crea un proyecto llamado **Mi IA del día**.
2. En sus **instrucciones**, pega el prompt de la tarea, cambiando la última parte (la entrega) por: "Muéstramelo aquí, en el chat".
3. Cada mañana, abre el proyecto, activa la búsqueda web y escribe **HOY**.

Es lo mismo, solo que la que aprieta el botón eres tú.

## Cómo saber si ha salido bien

- La has probado a mano antes de programarla.
- Has ejecutado la tarea programada una vez con "ejecutar ahora" y el borrador ha llegado.
- Las noticias tienen enlace y son de las últimas 24 horas.
- El consejo práctico tiene que ver con lo que tú haces.
- Sabes dónde se pausa y dónde se borra.

## La idea que se queda

La diferencia entre usar IA y tener IA trabajando para ti es una pantalla de configuración. No hace falta programar.

## Palabras del día

- **Tarea programada:** instrucciones que Claude ejecuta solo, a la hora que digas.
- **Agente:** IA que hace varios pasos por su cuenta para cumplir un encargo.
- **Ejecución:** cada vez que la tarea se pone en marcha. Queda en el historial.
- **Modo de aprobación:** si Claude puede usar herramientas sin preguntarte mientras trabaja solo.

## Prompt · La tarea: tu IA del día

Rellena lo que va entre corchetes. Pruébalo primero en un chat; luego, a la tarea.

> Eres mi curador de noticias de inteligencia artificial.
>
> **Sobre mí:** me dedico a [a qué te dedicas] y mi día a día consiste en [tres o cuatro cosas que haces]. No soy una persona técnica. Me interesa la IA para [ahorrar tiempo / mi negocio / estudiar / estar al día].
>
> **Tu tarea, cada vez que te ejecutes:**
>
> 1. Busca en internet las noticias sobre inteligencia artificial publicadas en las últimas 24 horas. Usa fuentes fiables: medios de tecnología reconocidos, medios generalistas serios y los blogs oficiales de las empresas (Anthropic, OpenAI, Google, Microsoft, Meta...).
> 2. Elige las 3 más relevantes para alguien como yo. Prioriza lo que afecta a gente normal (herramientas nuevas que se pueden usar, cambios en apps conocidas, normativa, usos prácticos) frente a lo muy técnico o lo puramente financiero.
> 3. Para cada noticia escribe:
>    - **Titular** en lenguaje claro, sin jerga.
>    - **Qué ha pasado**, en dos o tres frases.
>    - **Por qué importa**, en una frase.
>    - **Cómo te puede ayudar:** un consejo práctico y concreto para mi día a día según a qué me dedico. Si la noticia no tiene aplicación práctica para mí, dilo con sinceridad.
>    - **Fuente:** el enlace a la noticia original y su fecha.
> 4. Al final, añade **«El truco del día»**: un truco práctico para usar mejor Claude, explicado en tres líneas.
>
> **Reglas:**
>
> - No inventes noticias ni datos. Cada noticia, con su enlace.
> - Solo noticias de las últimas 24 horas. Si es lunes, incluye el fin de semana.
> - Nada de rumores sin fuente fiable.
> - Si no hay nada relevante, dilo en una línea y dame solo el truco del día. Prefiero un correo corto a uno de relleno.
> - En español, tono cercano, máximo 350 palabras en total.
>
> **Entrega:** crea un borrador en mi Gmail dirigido a [tu correo], con el asunto «☕ Tu IA del día · [fecha de hoy]» y todo lo anterior en el cuerpo. No envíes nada.

## Prompt · Prográmala desde el chat

Si tienes la versión nueva (camino B).

> Quiero programar una tarea que se ejecute de lunes a viernes a las [hora]. Estas son las instrucciones de la tarea:
>
> [pega aquí el prompt de tu IA del día, ya probado]
>
> Antes de programarla, enséñame el nombre, la frecuencia y las instrucciones para que lo revise.

## Prompt · Para afinarla después de una semana

> Llevo una semana recibiendo este resumen. Te pego el de hoy. Lo que me sobra es [lo que sea]. Lo que echo en falta es [lo que sea]. Reescribe las instrucciones de la tarea para corregirlo y dame el texto completo para pegarlo.
