# Cómo cazar un error
resumen: La IA se equivoca, y a veces con una seguridad que da miedo. Hoy entiendes por qué pasa, dónde falla más y las tres preguntas para pillarla en treinta segundos.
datos: Las facturas de prueba

## La cara B

Llevas cinco días viendo cosas que funcionan. Hoy toca lo contrario, y es igual de importante: **Claude se equivoca**. No mucho, pero sí lo bastante como para que no te fíes a ciegas. Y lo peor no es que se equivoque, es que lo hace con el mismo tono seguro con el que acierta.

Saber pillarlo es lo que separa a quien usa IA con criterio de quien se la juega.

## Por qué se equivoca

¿Te acuerdas del día 2? El modelo construye la respuesta prediciendo qué encaja mejor después. No consulta una base de datos ni "sabe" si algo es verdad. Genera lo que **suena** más probable.

La mayoría de las veces, lo que suena probable y lo que es verdad coinciden. Cuando no coinciden, aparece lo que se llama una **alucinación**: un dato, una cita, una cifra o una fuente que se ha inventado sin darse cuenta. No miente a propósito. Simplemente no distingue entre "esto lo sé" y "esto suena bien".

Hay tres situaciones que lo disparan:

1. **Le falta información** y, en vez de preguntar, rellena el hueco con lo más probable.
2. **La pregunta es sobre algo reciente.** Los modelos aprenden hasta una fecha (la *fecha de corte*). De lo que pasó después no saben nada, salvo que busquen en internet.
3. **Hace cuentas "de cabeza".** Un modelo de lenguaje es buenísimo con palabras y regular con números. Cuando suma 300 filas sin usar ninguna herramienta, puede fallar. Cuando usa código para calcular (lo verás el día 15), acierta mucho más.

## Dónde falla más

- **Sumas, porcentajes y cuentas** con muchos datos.
- **Fechas y plazos**: días de la semana, vencimientos, cuántos días hay entre dos fechas.
- **Datos que cambian**: precios, normativa, quién ocupa un cargo.
- **Citas y fuentes**: a veces te da un libro, un estudio o una ley que no existe, o que no dice eso.
- **Documentos largos**: se queda con el principio y el final, y se salta lo del medio.
- **Nombres parecidos**: mezcla dos clientes, dos personas o dos productos.

## Las tres preguntas

Apréndetelas. Te van a servir toda la vida:

1. **¿De dónde sale esto?** Que te enseñe el cálculo, las filas o la parte del documento que ha usado.
2. **¿Qué has dado por supuesto?** Aquí sale todo lo que decidió sin preguntarte. Suele ser donde está el error.
3. **¿Qué puede estar mal en tu respuesta?** Oblígale a buscarse los fallos. Funciona sorprendentemente bien.

## El reto

Las facturas de prueba son de una empresa inventada y tienen trampas sembradas a propósito: duplicados, importes vacíos, clientes escritos de cuatro formas distintas, fechas en dos formatos. A ver si Claude las ve.

1. Descarga las facturas de prueba.
2. Abre un chat nuevo y pídele el total con el paso 1. **Apunta el número y no digas nada todavía.**
3. Haz el paso 2: que se audite.
4. Termina con el paso 3, la pregunta que más enseña.
5. Compara el número del principio con lo que ha descubierto después. ¿Te habrías fiado del primero?

## Cómo saber si ha salido bien

- Ha encontrado al menos tres tipos de problema en los datos.
- Te ha explicado qué supuso para dar el primer número.
- Has entendido por qué el primer número no era fiable.

## La frase del día

> La IA no es un oráculo ni una calculadora. Es una compañera rapidísima que a veces se equivoca con mucha seguridad. Tu trabajo no es creerla: es revisarla.

## Palabras del día

- **Alucinación:** cuando la IA se inventa algo que suena verdad.
- **Fecha de corte:** hasta cuándo aprendió el modelo. De lo posterior no sabe, salvo que busque.
- **Verificar:** comprobar un dato en su origen. Es tu trabajo, no el suyo.

## Prompt · Paso 1. Pídele el total

> Te paso las facturas de 2026 de una empresa. Dime cuánto se ha facturado en total y cuánto está pendiente de cobro.
>
> [adjunta facturas-2026.csv]

Apunta el número. No digas nada todavía.

## Prompt · Paso 2. Que se audite

> Ahora revisa tu propia respuesta. ¿Hay algo en este archivo que haga que el total no sea fiable? Mira duplicados, celdas vacías, clientes escritos de varias formas, fechas en formatos distintos y tipos de IVA diferentes. Dime cuántos casos hay de cada cosa.

## Prompt · Paso 3. La pregunta que importa

> ¿Qué has dado por supuesto para darme el primer número? Y con lo que has visto, ¿cuál sería el total correcto y cómo lo has calculado?

## Prompt · Para pegar al final de cualquier encargo importante

> Cuando termines, dime qué partes de tu respuesta debería comprobar yo antes de usarla y por qué.

## Descarga · Facturas de prueba
archivo: _datos-de-prueba/facturas-2026.csv
367 facturas inventadas de 2026. Se abre con Excel o Google Sheets.

## Descarga · Las tres preguntas
archivo: dia-06-cazar-errores/checklist-revision.md
Para tener al lado de la pantalla. Treinta segundos que te ahorran un disgusto.
