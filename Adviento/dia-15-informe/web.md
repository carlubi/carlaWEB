# Informe sin empezar de cero
resumen: El reto más exigente hasta ahora: cruzar dos archivos con 549 filas, limpiar los datos sucios antes de calcular y sacar un informe con conclusiones que puedas comprobar. Y entiendes por qué Claude acierta con los números cuando usa código.
datos: Las ventas y las facturas de prueba

## Por qué esto te sirve aunque no trabajes con facturas

Los archivos de hoy son de una empresa inventada, pero la habilidad vale para cualquier hoja de cálculo: los gastos de casa del año, las notas de tus alumnos, las cuotas de los socios del club, los pedidos de tu tienda, las horas de tus clientes. Siempre es lo mismo: datos desordenados, una pregunta y la tentación de fiarse del primer número.

## Antes: por qué Claude acierta más con código

El día 6 viste que un modelo de lenguaje es regular haciendo cuentas "de cabeza". Pues bien: cuando le pasas un archivo de datos, Claude puede hacer algo distinto. Escribe un pequeño programa (normalmente en **Python**, un lenguaje muy usado para analizar datos), lo **ejecuta** en su ordenador aislado (lo viste ayer con la presentación) y te da el resultado del programa.

La diferencia es enorme:

- **De cabeza:** predice un número que suena bien. Puede fallar.
- **Con código:** el número sale de una operación real sobre tus filas. No se inventa.

Pero ojo, que el código no arregla todo. Si los datos están sucios (duplicados, nombres escritos de cuatro formas), el programa suma la basura con mucha precisión. Por eso el primer paso de hoy no es calcular: es **diagnosticar**.

Puedes ver el código si quieres: en el chat, despliega los pasos que ejecuta. No hace falta que lo entiendas. Basta con saber que está ahí.

## Pasos

### Paso 1 · Descarga los dos archivos

Ventas por comercial y facturas emitidas. Ábrelos en Excel o Google Sheets y échales un vistazo: ¿cuánto tardarías en cruzarlos a mano?

### Paso 2 · El diagnóstico de los datos

En un chat nuevo, adjunta los dos y usa el prompt «Paso 1». Que te diga **qué está sucio antes de calcular nada**. Si calcula sobre datos sucios, el informe sale precioso y falso.

### Paso 3 · Decide tú qué hacer con lo sucio

Con el prompt «Paso 2», que te proponga cómo tratar cada problema y qué efecto tiene. **Tú decides.** ¿Los duplicados se quitan? ¿Las facturas sin importe se ignoran o se marcan? Es tu criterio, no el suyo.

### Paso 4 · El cruce y el informe

Prompts «Paso 3» y «Paso 4». El cruce responde a las preguntas; el informe lo cuenta para quien tiene cinco minutos.

### Paso 5 · Tres cifras, a mano

Con el prompt «Paso 5», que te dé el cálculo de las tres cifras principales. Compruébalas con la calculadora o con un filtro en Excel. Es el hábito que separa a quien usa IA con criterio de quien se la juega. Cinco minutos.

## Lo que debería salir

- Cuánto se ha facturado y cuánto está sin cobrar.
- Qué clientes pagan tarde de forma sistemática.
- Cuánto hay en facturas vencidas que nadie ha reclamado.
- Si hay relación entre quién vende y qué clientes luego no pagan.

## Un truco: pídele un gráfico

Al final, pídele que te haga un gráfico con lo más importante. Lo puede hacer como artefacto (día 5) o como imagen. Un gráfico bien elegido se entiende en dos segundos; una tabla de 40 filas, no.

## Cómo saber si ha salido bien

- Te avisó de los datos sucios **antes** de dar números.
- Has decidido tú qué hacer con cada problema.
- Las tres cifras que has comprobado cuadran.
- Hay una recomendación, no solo una descripción.
- Dice qué **no** se puede concluir con estos datos.

## Palabras del día

- **Análisis de datos con código:** Claude escribe y ejecuta un programa para calcular, en vez de calcular de cabeza.
- **Python:** el lenguaje de programación que suele usar para analizar datos.
- **Limpieza de datos:** quitar duplicados, unificar nombres y formatos antes de calcular.
- **Cruzar datos:** unir dos tablas por algo que tienen en común (aquí, el cliente).

## Prompt · Paso 1. Diagnóstico de los datos

> Te paso dos archivos: las ventas por comercial y las facturas emitidas de 2026 de una empresa.
>
> **Antes de calcular nada**, dime qué problemas tienen estos datos: duplicados, campos vacíos, nombres escritos de varias formas, formatos mezclados, cualquier cosa que haga que un total no sea fiable. Dime cuántos casos hay de cada problema.
>
> Usa código para revisarlo, no lo hagas de cabeza. Y no me des todavía ninguna cifra de facturación.
>
> [adjunta ventas-2026.csv y facturas-2026.csv]

## Prompt · Paso 2. Qué hacer con lo sucio

> Para cada problema, propón cómo lo tratarías y qué efecto tiene en el resultado. No lo apliques todavía: yo decido.

Luego responde con tu decisión, por ejemplo: «Quita los duplicados, unifica los nombres de clientes y deja aparte las facturas sin importe».

## Prompt · Paso 3. El cruce

> Aplica lo que he decidido y cruza los dos archivos. Dime:
>
> 1. Cuánto se ha facturado en total y cuánto sigue sin cobrar.
> 2. Qué clientes pagan sistemáticamente tarde.
> 3. Cuánto dinero hay en facturas vencidas que nadie ha reclamado, y desde cuándo.
> 4. Si hay alguna relación entre quién vende y qué clientes luego no pagan.
>
> Si alguna pregunta no se puede responder con estos datos, dilo en vez de aproximar.

## Prompt · Paso 4. El informe

> Conviértelo en un informe de una página para dirección.
>
> - Empieza por lo que hay que decidir, no por los datos
> - Máximo tres conclusiones
> - Una recomendación concreta por conclusión
> - Un apartado final con lo que no se puede saber con estos datos
>
> Sin adornos. Quien lo lee tiene cinco minutos.

## Prompt · Paso 5. Comprueba

> Dame el cálculo de las tres cifras principales paso a paso, con las filas o filtros que has usado, para que las verifique yo en Excel.

## Prompt · Para tus propios datos

> Te paso [qué archivo: gastos de casa, notas, pedidos...]. Antes de calcular nada, dime qué problemas tienen los datos. Luego quiero saber [tu pregunta]. Usa código para calcular y dime cómo lo has hecho para que pueda comprobarlo.
>
> [aquí va tu archivo, sin datos personales de otros]

## Descarga · Ventas de prueba
archivo: _datos-de-prueba/ventas-2026.csv
182 filas de ventas semanales inventadas.

## Descarga · Facturas de prueba
archivo: _datos-de-prueba/facturas-2026.csv
367 facturas inventadas de 2026.
