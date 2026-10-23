# Modelos y gasto: lo que nadie te cuenta
resumen: Qué es un modelo, por qué Claude tiene varios, qué son los tokens y por qué un día te dice que has llegado al límite. Y lo más práctico: dónde ver cuánto llevas gastado y cómo hacer que te cunda.
datos: Las facturas de prueba que te adjunto más abajo
tipo: Formación
herramienta: Claude
minutos: 20

## Por qué te cuento esto el día 2

Porque es lo primero que desconcierta a todo el mundo. Vas tan a gusto y de repente: "Has alcanzado el límite de uso". Y no entiendes qué has hecho para gastarlo. Si entiendes cómo funciona hoy, te ahorras ese susto y sacas el doble de cada sesión.

## Qué es un modelo

Ayer te dije que Claude es un modelo de lenguaje. Vamos un poco más a fondo.

Un **modelo** es el "cerebro" que contesta. Se ha entrenado leyendo cantidades enormes de texto y ha aprendido una cosa muy concreta: **predecir qué viene después**. Cuando le escribes, no busca la respuesta en una base de datos. La va construyendo trozo a trozo, eligiendo en cada momento lo más probable y lo que mejor encaja con lo que le has pedido. Por eso escribe tan bien. Y por eso, a veces, se inventa cosas que suenan perfectas.

Ojo con una diferencia que lía mucho:

- **Claude** es la aplicación: la pantalla, los chats, los proyectos, los conectores.
- **El modelo** es el motor que hay dentro. Y lo puedes cambiar según el objetivo que quieras que la IA te consiga.

Es como un coche al que le puedes poner un motor más rápido y que gasta menos, o uno más potente que gasta más.

## Los modelos de Claude

Anthropic, la empresa detrás de Claude, saca versiones nuevas cada pocos meses, así que los números cambian (Sonnet 5.5, Opus 5.5...). Lo que no cambia es la familia, y con eso te basta:

| Modelo | Cómo es | Úsalo para | Gasto |
|---|---|---|---|
| **Haiku** | El rápido. Ligero y ágil | Preguntas sencillas, resúmenes cortos, reescribir un texto | Bajo |
| **Sonnet** | El todoterreno. Viene por defecto | El 80 % de lo que vas a hacer en este calendario | Medio |
| **Opus** | El potente. Piensa más y mejor | Análisis largos, documentos complicados, decisiones con muchos matices | Alto |

En algunos planes de pago verás además **Fable**, el modelo más grande de Anthropic, para trabajos muy gordos. Tiene su propio límite semanal aparte.

La regla práctica: **empieza con Sonnet**. Si la respuesta se queda corta en algo complicado, sube a Opus. Si es algo tonto y rápido, baja a Haiku.

## Dónde se cambia el modelo

1. Abre un chat nuevo.
2. Abajo a la derecha de la caja de texto verás el nombre del modelo. Púlsalo.
3. Elige el que quieras. Se aplica a ese chat.

![El selector de modelo abierto debajo de la caja de texto, con Haiku, Sonnet y Opus](capturas/d02-01-selector-modelo.png)

En el plan gratuito puede que no te deje elegir todos. Es normal: los más potentes suelen ser de pago.

### El pensamiento ampliado

En ese mismo menú verás una opción para que Claude **piense más** antes de responder (puede aparecer como pensamiento ampliado o como nivel de esfuerzo). Con ella activada, Claude se toma su tiempo para razonar el problema por partes antes de contestar. Sale mejor en cosas difíciles, pero tarda más y gasta más. Para un correo no hace falta. Para analizar un contrato o cuadrar unas cuentas, sí.

## *BONUS* Los tokens: ¿qué son?

La IA no lee palabras ni letras: lee **tokens**, que son trocitos de texto. Una palabra corta es un token; una larga puede ser dos o tres. En español, calcula más o menos un token y medio por palabra. En inglés, calcula más o menos un token por palabra: por eso dicen que gastas menos si le hablas en inglés. 

Todo se mide en tokens:

- Lo que tú escribes.
- Los archivos que adjuntas (un PDF de 50 páginas son muchísimos).
- Lo que Claude responde.
- **Y toda la conversación anterior.**

Esto último es lo que casi nadie sabe. Cada vez que envías un mensaje, Claude vuelve a leerse la conversación entera desde el principio para no perder el hilo. Un chat de 80 mensajes gasta muchísimo más por mensaje que uno de 5. Y encima, cuando el chat es enorme, la calidad baja: se le van mezclando cosas.

🧠 Por eso se recomienda no mantener conversaciones largas en un mismo chat. Para cada tarea, empieza una nueva conversación. A eso se le llama, 'ventana de contexto'. 

## La ventana de contexto

Es la **memoria de trabajo** de una conversación: cuánto puede tener en la cabeza a la vez. Es grande, pero no infinita. Cuando una conversación se pasa, Claude tiene que resumir o descartar lo más antiguo, y ahí se pierden detalles.

Moraleja: **un tema, un chat**. Cuando cambias de asunto, chat nuevo.

## Los planes

- **Gratuito:** chat, proyectos (hasta 5), artefactos y conectores con Google. Con un límite de mensajes más bajo. Te sirve para la mayoría de días del calendario.
- **Pro:** varias veces más uso, todos los modelos y las funciones de los días más avanzados.
- **Max:** para quien lo usa a saco todo el día. Cinco o veinte veces más que Pro.
- **Team y Enterprise:** para empresas. Si tu empresa ya lo tiene, usa ese.

Los precios cambian; míralos en **claude.com/pricing**.

### Para alguno retos neecesitaras un plan de pago

| Día | Por qué |
|---|---|
| 16 · Tu primera tarea programada | Las tareas programadas son de pago |
| 17 · Clasifica tu correo | La parte final es una tarea programada |
| 19 · Pack de tareas programadas | Ídem |
| 20 · Claude en tu navegador | La extensión de Chrome es de pago |

Todos tienen alternativa para quien siga en el gratuito. Nadie se queda fuera.

## Cómo funciona el límite

En los planes de pago hay dos contadores:

- **La sesión:** una ventana de **5 horas** que empieza a contar con tu primer mensaje. Cuando pasan las 5 horas, se reinicia.
- **El semanal:** un tope para toda la semana, para que nadie se lo funda todo en dos días.

En el gratuito también hay límite por sesión. Cuando te acercas, Claude te avisa con un mensaje en el chat y te dice a qué hora vuelves a tener uso.

## Dónde ver lo que llevas gastado

Si tienes plan de pago:

1. Pulsa tu nombre, abajo a la izquierda.
2. Entra en **Ajustes**.
3. Ve al apartado **Uso**. También puedes ir directo a **claude.ai/settings/usage**.

Arriba verás los **límites de uso del plan** con dos barras:

- **Sesión actual:** qué porcentaje de las 5 horas llevas y cuánto falta para que se reinicie.
- **Límites semanales:** cuánto llevas de la semana y cuándo se reinicia.

![La página de Uso de los Ajustes, con la barra de la sesión actual y la del límite semanal](capturas/d02-02-pagina-uso.png)

El porcentaje es **lo que has gastado**, no lo que te queda. 30 % quiere decir que te queda el 70.

Si tienes el gratuito, esta página no te sale. Te guías por los avisos del chat.

## Qué gasta más

De más a menos, lo que hace que la barra suba deprisa:

1. **Tareas de varios pasos:** que navegue por webs, ejecute código, cree archivos o trabaje sola un rato.
2. **Investigaciones a fondo** y búsquedas web.
3. **Archivos grandes:** PDFs largos, hojas de cálculo con miles de filas.
4. **Conversaciones muy largas.**
5. **Modelos potentes** y el pensamiento ampliado.
6. **Artefactos** grandes.

Lo que gasta poco: preguntas cortas, chats nuevos y lo que tienes guardado en un proyecto. Los documentos de un proyecto se quedan "en caché" (Claude los recuerda un rato sin volver a leerlos enteros) y cuentan menos.

## Ocho trucos para que te cunda

1. **Un tema, un chat.** Cambias de asunto, chat nuevo.
2. **Junta las preguntas.** Tres preguntas en un mensaje gastan menos que tres mensajes.
3. **Edita en vez de corregir.** Si tu mensaje salió mal, edítalo (el lápiz que aparece al pasar el ratón) en vez de mandar otro detrás.
4. **Sonnet por defecto.** Opus solo cuando haga falta.
5. **Pensamiento ampliado, solo para lo difícil.**
6. **Lo que uses mucho, a un proyecto.** Así no lo adjuntas cada vez.
7. **Pega solo el trozo que importa** de un documento, no el documento entero.
8. **Mira la barra** antes de una tarea gorda. Si vas al 90 %, espera a que se reinicie.

## El reto: tu diario de consumo

Hoy vas a ver con tus ojos cuánto gasta cada cosa. Descarga el diario de consumo y apunta.

### Si tienes plan de pago

1. Abre la página de **Uso** y apunta el porcentaje de la sesión.
2. Abre un chat nuevo con **Haiku** o **Sonnet** y haz la tarea ligera. Vuelve a Uso y apunta.
3. Abre otro chat nuevo con **Opus** y el pensamiento ampliado activado. Adjunta las facturas de prueba y haz la tarea pesada. Vuelve a Uso y apunta.
4. Compara: ¿cuánto ha subido la barra con cada una? Y ¿la respuesta pesada era tan mejor como para gastar eso?

### Si tienes el gratuito

Haz las dos tareas con el modelo que tengas y fíjate en dos cosas: cuánto tarda en responder cada una y si te aparece algún aviso de límite. Después hazle la pregunta de los modelos a Claude para entender en qué te afecta.

## Cómo saber si ha salido bien

- Sabes decir con tus palabras qué es un modelo y qué es un token.
- Sabes dónde se cambia el modelo.
- Has visto la diferencia de gasto entre una tarea ligera y una pesada.
- Tienes claro cuándo abrir un chat nuevo.

## Palabras del día

- **Modelo:** el cerebro que responde. Haiku, Sonnet, Opus.
- **Token:** el trocito de texto con el que se mide todo.
- **Ventana de contexto:** cuánto cabe en la memoria de una conversación.
- **Límite de sesión:** el uso que tienes en una ventana de 5 horas.
- **Pensamiento ampliado:** que Claude razone más antes de contestar. Mejor resultado, más gasto.

## Prompt · Tarea ligera

Con Haiku o Sonnet, en un chat nuevo.

> Dame tres ideas para el asunto de un correo en el que aviso de que me voy de vacaciones del 23 de diciembre al 7 de enero.

## Prompt · Tarea pesada

Con Opus y el pensamiento ampliado, en otro chat nuevo.

> Te paso las facturas de un año de una empresa inventada. Analízalas a fondo: cuánto se ha facturado por mes, qué clientes concentran más dinero, qué facturas están vencidas y qué problemas tienen los datos. Explícame tu razonamiento.
>
> [adjunta facturas-2026.csv]

## Prompt · Pregúntale a Claude por sus modelos

> Explícame como si no supiera nada de tecnología qué diferencia hay entre Haiku, Sonnet y Opus, y dame cinco ejemplos de mi día a día en los que usaría cada uno. Yo me dedico a [a qué te dedicas].

## Descarga · Diario de consumo
archivo: dia-02-modelos-y-uso/diario-de-consumo.md
La tabla para apuntar el gasto de cada tarea y la chuleta de modelos.

## Descarga · Facturas de prueba
archivo: _datos-de-prueba/facturas-2026.csv
367 facturas inventadas, para la tarea pesada.
