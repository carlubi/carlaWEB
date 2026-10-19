# Investiga con fuentes
resumen: Claude puede responderte de memoria o ir a buscarlo a internet. Por fuera parece lo mismo y no lo es. Hoy aprendes a activar la búsqueda web, a pedir una investigación a fondo y a comprobar que las fuentes dicen lo que Claude dice que dicen.
datos: Ninguno. Una pregunta tuya que necesites resolver de verdad

## La idea central

¿Te acuerdas de la **fecha de corte** del día 6? El modelo aprendió hasta una fecha. Todo lo que pasó después no lo sabe... salvo que **busque**.

Cuando le preguntas algo, Claude puede:

- **Responder de memoria**, con lo que aprendió. Va bien para conceptos estables: qué es la fotosíntesis, cómo se escribe una carta de presentación, qué es un IBAN.
- **Buscar en internet**, leer páginas y responderte con lo que encuentra, enlazando las fuentes. Imprescindible para todo lo que cambia: precios, normativa, horarios, quién ocupa un cargo, qué herramienta existe hoy.

Por fuera, las dos respuestas suenan igual de seguras. Saber cuándo exigir la segunda es la habilidad del día.

## Las dos herramientas

### La búsqueda web

Claude hace unas cuantas búsquedas, lee los resultados y te responde con **citas**: enlaces a las páginas de donde ha sacado cada cosa.

Cómo se activa:

1. En la caja de texto, pulsa **+**.
2. Busca **Búsqueda web** y comprueba que está activada.
3. Cuando la use, verás en el chat que está buscando y qué páginas consulta.

![El menú + con la opción de búsqueda web activada](capturas/d14-01-busqueda-web.png)

Con la búsqueda activada, Claude decide solo cuándo buscar. Si quieres que busque sí o sí, díselo: "busca en internet...".

### La investigación (Research)

Es la versión a fondo. En lugar de cuatro búsquedas, Claude hace decenas, lee muchas fuentes, las contrasta y te entrega un **informe largo con todas las citas**. Puede tardar varios minutos. Está en los planes de pago y aparece como un botón o una opción junto a la caja de texto.

Úsala para decisiones gordas: elegir un máster, comparar seguros, entender una normativa nueva, preparar un viaje complicado. Gasta muchísimo uso, así que no para preguntas rápidas.

![La opción de investigación activada junto a la caja de texto, con Claude trabajando en un informe](capturas/d14-02-investigacion.png)

## Pasos del reto

### Paso 1 · Elige una pregunta de verdad

Algo que necesites decidir o saber. Tienes ideas más abajo.

### Paso 2 · Pregúntalo sin pedir nada

En un chat nuevo, **con la búsqueda web desactivada**, haz la pregunta tal cual. Guarda la respuesta. Léela. Suena fiable, ¿verdad?

### Paso 3 · Ahora exigiendo fuentes

En otro chat nuevo, **con la búsqueda web activada**, usa el prompt «Exigiendo fuentes». Compara las dos respuestas. ¿Dicen lo mismo? ¿Hay algo que la primera daba por hecho y la segunda corrige?

### Paso 4 · Abre dos enlaces

Este es el reto entero. Pincha en **dos citas** y comprueba que la página dice exactamente lo que Claude dice que dice. A veces la fuente existe pero dice otra cosa, o es de hace tres años, o es un blog contándolo de oídas en lugar de la fuente oficial. Pillarlo una vez te vacuna para siempre.

### Paso 5 · Que se juzgue a sí mismo

Usa el prompt «¿Qué tal tus fuentes?». Te ayuda a distinguir una fuente oficial de una opinión.

## Cuándo exigir fuentes siempre

- Precios, tarifas y condiciones.
- Normativa, plazos legales, obligaciones, ayudas y subvenciones.
- Horarios, fechas de convocatorias, requisitos.
- Quién ocupa un cargo o quién es responsable de algo.
- Qué incluye un producto, un plan o un servicio.
- Cualquier cosa que haya podido cambiar en el último año.
- **Todo lo que vayas a repetir delante de alguien.**

## Cómo distinguir una buena fuente

| Mejor | Peor |
|---|---|
| La web oficial (organismo, empresa, universidad) | Un blog que lo cuenta |
| Con fecha reciente | Sin fecha o de hace años |
| Que cita de dónde saca los datos | Que no dice de dónde sale nada |
| Que dice lo que Claude dice que dice | Que dice algo parecido, pero no eso |

## Preguntas de ejemplo

- **Trabajo:** ¿Qué obligaciones de factura electrónica tiene un autónomo en España en 2027 y desde cuándo?
- **Estudios:** ¿Qué requisitos y plazos tiene la beca general del Ministerio para el curso que viene?
- **Casa:** ¿Qué ayudas hay en mi comunidad autónoma para cambiar las ventanas de casa?
- **Compras:** Compara tres tarifas de fibra y móvil para una familia de cuatro, con el precio actual y la permanencia.
- **Viajes:** ¿Qué documentación necesita un menor que viaja a Londres con uno solo de sus padres?

## Cómo saber si ha salido bien

- La segunda respuesta trae enlaces que se abren.
- Has comprobado dos y sabes decir si cuadran.
- Ves en qué se diferencian la respuesta de memoria y la buscada, y entiendes por qué.

## La frase del día

> Una respuesta sin fuente es una opinión bien redactada. Cuando vayas a decidir algo con ella, pide el enlace.

## Palabras del día

- **Búsqueda web:** Claude busca en internet y te responde con citas.
- **Investigación (Research):** búsqueda a fondo, con decenas de fuentes y un informe largo.
- **Cita:** el enlace a la página de la que sale un dato.
- **Fuente primaria u oficial:** la que origina la información (el BOE, la web de la universidad), no quien la cuenta.

## Prompt · Paso 2. Sin pedir nada

Con la búsqueda web desactivada.

> [Tu pregunta]

## Prompt · Paso 3. Exigiendo fuentes

Con la búsqueda web activada, en un chat nuevo.

> Busca en internet información actualizada sobre esto: [tu pregunta].
>
> Para cada cosa que me digas, quiero:
> - El enlace a la fuente
> - De cuándo es
> - Si es la fuente oficial o alguien contándolo
>
> Prioriza fuentes oficiales. Si algo no lo encuentras con fuente, dilo en vez de completarlo de memoria.
>
> Al final, dime qué ha cambiado recientemente sobre este tema y qué no has podido confirmar.

## Prompt · Paso 5. ¿Qué tal tus fuentes?

> Repasa las fuentes que has usado. Ordénalas de más fiable a menos y explícame por qué. ¿Hay algún dato de tu respuesta que se apoye solo en una fuente floja?

## Prompt · Para una investigación a fondo

Con la investigación activada (planes de pago).

> Necesito decidir [qué decisión]. Investiga a fondo [tema], comparando [opciones], con estos criterios: [precio, requisitos, plazos, opiniones...].
>
> Quiero un informe con: un resumen de una página arriba, una tabla comparativa, los pros y contras de cada opción y tu recomendación para mi caso, que es [tu situación]. Todas las afirmaciones con su enlace.
