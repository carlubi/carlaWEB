# Markdown: el idioma de la IA
resumen: Esos asteriscos y almohadillas que salen cuando copias una respuesta de Claude tienen nombre: markdown. Hoy aprendes qué es, por qué la IA lo adora y cómo usarlo a tu favor. Lo vas a necesitar el día 8.
datos: El documento de ejemplo y unas notas tuyas desordenadas
tipo: Formación
herramienta: Claude
minutos: 15

## El misterio de los asteriscos

Te habrá pasado ya: copias una respuesta de Claude, la pegas en un correo o en Word y aparece llena de `**` y de `#`. No es un error. 

Es el famoso **markdown**, el formato en el que la IA escribe por dentro sin que tu lo veas: ES SU IDIOMA. Claude lo "estiliza" en pantalla y por eso tú ves negritas y títulos bonitos, pero el texto original lleva esos símbolos.

Hoy le pierdes el miedo, porque markdown es una de las cosas más útiles que puedes aprender para trabajar con IA. Y se aprende en diez minutos.

## Qué es markdown

Es una forma de escribir texto con formato usando **solo símbolos del teclado**. Nada de botones, nada de menús. Lo inventó en 2004 un tal John Gruber con una idea muy simple: que un texto con formato se pudiera leer bien incluso sin "pintar".

Un archivo markdown es **texto plano** con la extensión `.md`. Se abre con cualquier editor de texto, en cualquier ordenador, hoy y dentro de veinte años.

## Así se ve por dentro y por fuera

Esto es lo que escribes:

```
# Viaje a Lisboa

## Lo que no se nos puede olvidar

- **Pasaportes** (el de Leo caduca en marzo)
- Cargador del móvil
- Reserva del hotel impresa

## Presupuesto

| Concepto | Precio |
|---|---|
| Vuelos | 240 € |
| Hotel, 3 noches | 310 € |

> Ojo: el museo de los azulejos cierra los lunes.
```

Y esto es lo que se ve cuando se "pinta": un título grande, un subtítulo, una lista con "Pasaportes" en negrita, una tabla ordenada y una cita destacada. Mismo texto, dos caras.

### Así queda al verlo

# Viaje a Lisboa

#### Lo que no se nos puede olvidar

- **Pasaportes** (el de Leo caduca en marzo)
- Cargador del móvil
- Reserva del hotel impresa

#### Presupuesto

| Concepto | Precio |
|---|---|
| Vuelos | 240 € |
| Hotel, 3 noches | 310 € |

> Ojo: el museo de los azulejos cierra los lunes.

## La chuleta: lo que necesitas saber

| Escribes | Sale | Para qué |
|---|---|---|
| `# Título` | Título grande | El título del documento |
| `## Apartado` | Subtítulo | Cada sección |
| `### Subapartado` | Subtítulo pequeño | Dentro de una sección |
| `**texto**` | **texto** en negrita | Lo importante |
| `*texto*` | *texto* en cursiva | Matices, palabras en otro idioma |
| `- elemento` | Lista con puntos | Listas sin orden |
| `1. elemento` | Lista numerada | Pasos, rankings |
| `> texto` | Cita destacada | Avisos, frases que quieres resaltar |
| `[texto](enlace)` | Un enlace | Enlazar una web |
| `---` | Una línea separadora | Separar bloques |
| `` `texto` `` | Texto tipo código | Nombres de archivos, fórmulas |

Con los seis primeros ya haces el 90 % de lo que vas a necesitar.

## Por qué la IA lo adora

Aquí está lo interesante, y por qué te lo cuento en un calendario de IA:

1. **La IA aprendió leyéndolo.** Muchísimo del texto con el que se entrenaron los modelos (documentación, foros, wikis) está en markdown. Para Claude es su lengua materna.
2. **La estructura le ayuda a entender.** Un `#` le dice "esto es lo principal", un `##` le dice "esto es una parte". Cuando le pasas un documento bien estructurado, entiende mejor qué es lo importante y qué depende de qué. Un texto sin estructura es una sopa.
3. **Es ligero.** Un Word o un PDF llevan muchísima información de maquetación que a la IA no le sirve: tipos de letra, márgenes, imágenes. Un `.md` es solo el contenido. Menos ruido y menos tokens (¿te acuerdas del día 2?).
4. **Es el formato de los archivos de contexto.** Cuando montes proyectos y asistentes, las instrucciones y los documentos de referencia funcionan mejor en markdown. El día 8 lo vas a comprobar con tus ojos.
5. **Es universal y para siempre.** Lo abre cualquier programa, en cualquier sistema. No depende de tener Word ni de que una app siga existiendo.

## Ventajas para ti, aunque lo tuyo no sea la tecnología

- Escribes más rápido: no levantas la mano del teclado para poner negritas.
- Tus notas quedan ordenadas y las puedes pasar a cualquier IA tal cual.
- Pesan nada. Miles de notas caben en nada.
- Si mañana cambias de app de notas, te las llevas sin perder nada.

## Cómo abrir y editar un archivo markdown

- **En Windows:** botón derecho sobre el archivo › Abrir con › Bloc de notas.
- **En Mac:** botón derecho › Abrir con › TextEdit. Si te lo enseña raro, ve a Formato › Convertir a texto normal.
- **Si le coges el gusto:** hay apps gratuitas que lo pintan mientras escribes, como Obsidian o Typora. 

## El truco de los asteriscos al copiar

Cuando copies una respuesta de Claude para pegarla en otro sitio:

- **En Google Docs:** activa en Herramientas › Preferencias la opción de markdown. Desde ahí, al pegar respeta las negritas y los títulos.
- **En un correo o en WhatsApp:** pídele a Claude "dámelo en texto plano, sin formato markdown". Y listo.
- **Si quieres un documento:** pídele que te lo dé como archivo descargable.

Por eso cuando escribes un prompt, es importante pedirle en qué formato lo necesitas. 

## El reto

### Paso 1 · Ábrelo por dentro

Descarga el documento de ejemplo de este día y ábrelo con el Bloc de notas o TextEdit. Fíjate en los símbolos. Intenta adivinar cómo se verá.

### Paso 2 · Míralo por fuera

Abre un chat nuevo en Claude, adjunta el archivo y usa el prompt «Enséñamelo pintado». Te lo devolverá como documento en el panel de la derecha. Compara las dos caras.

### Paso 3 · Pasa tus notas a markdown

Coge unas notas tuyas desordenadas: la lista de la compra, apuntes de clase, ideas para un proyecto, lo que apuntaste en una reunión. Pégalas con el prompt «De notas a markdown».

### Paso 4 · Llévatelo como archivo

Pídele que te lo dé como archivo `.md` descargable. Descárgalo y ábrelo con el Bloc de notas. Ya tienes tu primer archivo markdown. Guárdalo: el día 8 vas a trabajar con dos.

## Cómo saber si ha salido bien

- Sabes leer un archivo markdown sin pintar y entender su estructura.
- Tienes un archivo `.md` tuyo guardado en el ordenador.
- Sabes qué hacer cuando te salen asteriscos al pegar.

## Palabras del día

- **Markdown:** forma de dar formato a un texto con símbolos del teclado.
- **Texto plano:** texto sin maquetación, que se abre en cualquier sitio.
- **Renderizar ("pintar"):** convertir los símbolos en formato visual.
- **Extensión .md:** la terminación de los archivos markdown.

## Prompt · Enséñamelo pintado

> Te adjunto un archivo en markdown. Muéstramelo como documento ya formateado en un artefacto, y después explícame qué símbolo has convertido en qué, con dos o tres ejemplos del propio archivo.
>
> [adjunta ejemplo-markdown.md]

## Prompt · De notas a markdown

> Te paso unas notas mías desordenadas. Ordénalas en markdown:
>
> - Un título principal que resuma de qué van
> - Apartados con ## agrupando lo que va junto
> - Listas donde haya enumeraciones
> - En negrita solo lo realmente importante
> - Si hay fechas, cifras o tareas, que se vean a la primera
>
> No añadas nada que no esté en mis notas. Si algo no lo entiendes, márcalo con un «¿?» en vez de interpretarlo.
>
> Enséñame el resultado en texto sin pintar, con los símbolos, para que aprenda cómo queda.
>
> Mis notas: [pega aquí tus notas]

## Prompt · Como archivo

> Perfecto. Ahora dámelo como archivo .md descargable.

## Descarga · Documento de ejemplo en markdown
archivo: dia-04-markdown/ejemplo-markdown.md
formato: md
Un documento real en markdown para abrir con el Bloc de notas y ver cómo es por dentro.

## Descarga · Chuleta de markdown
archivo: dia-04-markdown/chuleta-markdown.md
Los símbolos que necesitas, en una hoja.
