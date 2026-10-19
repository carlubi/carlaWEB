# Tú decides, Claude prepara
resumen: El día del criterio. Aprendes las tres zonas para decidir qué puede hacer la IA sola, qué prepara para que tú apruebes y qué no debe tocar nunca. Y haces la revisión de diciembre: conectores, permisos, tareas programadas y uso. Antes de Navidad, todo en orden.
datos: Lo que has montado estos días: conectores, proyectos y tareas programadas

## El día que lo une todo

Llevas tres semanas dándole a Claude acceso a tu calendario, tu correo y tus documentos, montando tareas que trabajan solas y dejándole crear eventos y borradores. Hoy toca parar y pensar lo que separa una automatización útil de una peligrosa: **saber dónde se para y te pregunta**.

Y una idea para quitarte un miedo muy común: si la IA nunca decide sola lo importante, no te sustituye. Lo que hace es dejarte el trabajo preparado para que tú decidas mejor, más rápido y con menos ruido encima.

## Las tres zonas

Antes de automatizar cualquier cosa, hazte una sola pregunta: **si esto sale mal, ¿qué pasa?**

### 🟢 Verde · Que lo haga sola

**Si se equivoca, no pasa nada.** Lo ves, lo corriges y ya está.

Clasificar, ordenar, resumir para ti, avisarte de plazos, preparar listas de uso propio. El parte de la bandeja del día 17 o tu IA del día del 16 son verdes: si un día sale mal, lo ves tú y nadie más.

**La prueba:** ¿el error se queda entre tú y la pantalla? Verde.

### 🟡 Ámbar · Que lo prepare, tú apruebas

**Si se equivoca, se nota antes de que salga.** Pero hay que mirarlo.

Borradores de correos, eventos en el calendario, presupuestos, informes que van a otra persona, cualquier cosa con números. Los borradores de respuesta del día 17 y los eventos del acta de ayer son ámbar: Claude los prepara y tú aprietas el botón.

**La prueba:** ¿hay un momento en que tú le das al botón? Ámbar, y está bien.

**Aquí va casi todo.** Si algo te parece verde, piénsalo otra vez.

### 🔴 Rojo · Que ni se acerque

**Si se equivoca, hay consecuencias de verdad.**

Enviar algo fuera sin que lo hayas leído. Pagos, transferencias, cambios de datos bancarios. Aceptar condiciones, firmar, confirmar pedidos. Decisiones sobre personas. Trámites con plazos legales. Borrar cosas.

**La prueba:** ¿tendrías que dar explicaciones si sale mal? Rojo.

Y nada sube a verde desde rojo. Nunca.

## Cómo encajan las zonas con lo que ya sabes

No son una teoría: son exactamente los controles que has ido usando.

| Zona | Cómo se configura en Claude |
|---|---|
| 🟢 Verde | Tareas programadas que solo leen y te dejan un resumen. Conectores en modo lectura |
| 🟡 Ámbar | **Permitir una vez** en cada aviso. Borradores en vez de envíos. "No crees nada todavía, solo propón" |
| 🔴 Rojo | Prohibido por escrito en las instrucciones ("no envíes", "si piden cambiar datos bancarios, avísame"). Fuera del alcance de Chrome (banca, trámites) |

## La revisión de diciembre

Ahora, con las zonas en la cabeza, repasa todo lo que has montado. Es como revisar las llaves que has repartido antes de irte de vacaciones.

### 1 · Conectores

**Personalizar** › **Conectores**. Para cada uno: ¿lo sigues usando? Si no, **desconéctalo**. Y una vez al año, mira también **myaccount.google.com/connections**.

### 2 · Permisos que diste "para siempre"

Si en algún aviso le diste a **permitir siempre**, piensa si esa acción es verde de verdad. Si es ámbar, quítale ese permiso desde la ficha del conector en Personalizar › Conectores, para que vuelva a preguntarte.

![La ficha de un conector con sus herramientas y los permisos de cada una](capturas/d23-01-permisos-herramientas.png)

### 3 · Tareas programadas

En **Programadas**, repasa cada una:

- ¿La lees? Si no, bórrala.
- ¿Qué zona es? Si hace algo ámbar (borradores de respuesta), ¿lo revisas siempre antes de enviar?
- ¿Tiene escrita la frase de la duda?
- ¿Te vas de vacaciones? **Páusala** hasta la vuelta.

### 4 · Proyectos

¿Hay alguno con documentos que ya no deberían estar? ¿Alguno de prueba (los del día 8) que puedas archivar?

### 5 · Uso

Si tienes plan de pago, mira **Ajustes** › **Uso** (día 2). ¿Las tareas programadas te comen mucho de la semana? Baja alguna a Haiku o quita días.

## Cuando se equivoca

No es un fallo del sistema: es información.

| Lo que ha pasado | Lo que significa | Qué hacer |
|---|---|---|
| Clasificó algo donde no iba | El criterio no contemplaba ese caso | Añade la regla, con su porqué |
| Se inventó un dato | Le faltaba información y no preguntó | Añade la frase de la duda |
| Hizo algo que no debía | Estaba en la zona equivocada | Súbelo a ámbar o a rojo |
| Lo ignoras cada día | No resuelve un problema real | Cámbialo o bórralo |

## El reto

1. Descarga la hoja de las tres zonas.
2. Haz la revisión de diciembre, los cinco puntos.
3. Coge una de tus automatizaciones (la del día 16 o la del 17) y reparte lo que hace en las tres zonas.
4. Usa el prompt «Revisa mi automatización» para que Claude te ayude a ver si lo rojo está bien cerrado.
5. Añade la frase de la duda si no la tenía.

## La frase del día

> La IA no viene a decidir por ti. Viene a dejarte el trabajo preparado para que decidas mejor, más rápido y con menos ruido encima. Quien decide sigues siendo tú.

## Cómo saber si ha salido bien

- Has quitado al menos un acceso o una tarea que ya no usabas.
- Sabes en qué zona está cada cosa que has montado.
- Tus instrucciones prohíben por escrito lo rojo.
- Todas tus automatizaciones tienen la frase de la duda.

## Palabras del día

- **Humano en el bucle (human in the loop):** que una persona revise y apruebe antes de que algo tenga efecto. Es la zona ámbar.
- **Principio de mínimo privilegio:** dar solo el acceso justo para lo que se necesita. Lo has aplicado todo el mes sin saber que se llamaba así.

## Prompt · Revisa mi automatización

> Te paso las instrucciones de una automatización que he montado con Claude. Ayúdame a revisarla con las tres zonas:
>
> - Verde: lo que puede hacer sola porque un error no tiene consecuencias.
> - Ámbar: lo que debe preparar para que yo lo apruebe.
> - Rojo: lo que no debe hacer nunca.
>
> Dime qué hace en cada zona, si hay algo en verde que debería ser ámbar, si lo rojo está prohibido de forma explícita y si falta la instrucción de qué hacer cuando duda. Luego dame las instrucciones corregidas.
>
> [pega aquí las instrucciones de tu tarea]

## Prompt · La frase de la duda

Inclúyela en cualquier automatización que montes.

> Si dudas de algo, no lo hagas: déjalo aparte y avísame. Prefiero revisar de más que que se te escape algo.

## Descarga · Las tres zonas
archivo: dia-23-tu-decides/las-tres-zonas.md
Para clasificar cualquier tarea antes de automatizarla, y la revisión de diciembre.
