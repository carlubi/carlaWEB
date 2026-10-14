# Informe sin empezar de cero
resumen: Cruza dos archivos de prueba y prepara un informe con conclusiones que puedas verificar.
datos: Ventas y facturas de prueba

## El reto más difícil hasta ahora

Hasta hoy todo venía de una sola fuente. Aquí hay dos archivos, 549 filas entre los dos, y la respuesta no está en ninguno: hay que cruzarlos. A mano, esto lleva una tarde entera.

## Pasos

1. Descarga los dos archivos.
2. Pide primero el **diagnóstico de los datos**: qué está sucio, antes de calcular nada.
3. Decide qué hacer con lo sucio.
4. Pide el cruce y después el informe.
5. Comprueba tres cifras a mano, con la calculadora.

## El diagnóstico no es opcional

Si se calcula sobre datos sucios, el informe sale precioso y falso. Y un informe falso con tu nombre es lo último que quieres.

## Tres cifras, a mano

Es el hábito que separa a quien usa IA con criterio de quien se la juega. Cinco minutos.

## Lo que debería salir

- Cuánto se ha facturado y cuánto está sin cobrar.
- Qué clientes pagan tarde de forma sistemática.
- Si hay relación entre el comercial que vende y el cliente que luego no paga.
- Qué facturas llevan meses vencidas sin que nadie las reclame.

## Cómo saber si ha salido bien

- Te avisó de los datos sucios **antes** de dar números.
- Las tres cifras que has comprobado cuadran.
- Hay una recomendación, no solo una descripción.
- Dice qué no se puede concluir con estos datos.

## Prompt · Paso 1. Diagnóstico de los datos

> Te paso dos archivos: las ventas por comercial y las facturas emitidas de 2026.
>
> **Antes de calcular nada**, dime qué problemas tienen estos datos: duplicados, campos vacíos, nombres escritos de varias formas, formatos mezclados, cualquier cosa que haga que un total no sea fiable.
>
> No me des todavía ninguna cifra.
>
> [adjunta ventas-2026.csv y facturas-2026.csv]

## Prompt · Paso 2. Decide qué hacer con lo sucio

> Para cada problema, dime cómo lo tratarías y qué efecto tiene en el resultado. Yo decido.

## Prompt · Paso 3. El cruce

> Ahora cruza los dos archivos y dime:
>
> 1. Cuánto hemos facturado en total y cuánto sigue sin cobrar.
> 2. Qué clientes pagan sistemáticamente tarde.
> 3. Cuánto dinero hay en facturas vencidas que nadie ha reclamado, y desde cuándo.
> 4. Si hay alguna relación entre quién vende y qué clientes luego no pagan.
>
> Si alguna de estas preguntas no se puede responder con estos datos, dilo en vez de aproximar.

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

> Dame el cálculo de las tres cifras principales, paso a paso, para que las verifique a mano.

## Descarga · Ventas de prueba
archivo: _datos-de-prueba/ventas-2026.csv
182 filas de ventas semanales inventadas.

## Descarga · Facturas de prueba
archivo: _datos-de-prueba/facturas-2026.csv
367 facturas inventadas de 2026.
