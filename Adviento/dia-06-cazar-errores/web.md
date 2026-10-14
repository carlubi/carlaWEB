# Cómo cazar un error
resumen: La IA también se equivoca, y a veces con mucha seguridad. Aprende a pillarla en treinta segundos.
datos: Facturas de prueba

## La cara b

Llevas cinco días viendo cosas que funcionan. Hoy toca lo contrario: la IA se equivoca, y a veces con mucha seguridad. Vas a aprender dónde suele fallar y cómo pillarla en treinta segundos.

## Pasos

1. Descarga las facturas de prueba.
2. Pídele el total con el paso 1. Guarda la respuesta y no digas nada todavía.
3. Pídele que se audite con el paso 2.
4. Termina con la pregunta del paso 3. Es la que más enseña.

## Las tres comprobaciones

1. **¿De dónde sale este número?** Pídele que te enseñe el cálculo o las filas que ha usado.
2. **¿Qué has dado por supuesto?** Aquí salen las decisiones que tomó sin preguntarte.
3. **¿Qué puede estar mal en lo que me has dado?** Oblígala a buscarse los fallos.

## Dónde falla más

- Sumas y cuentas sobre muchos datos.
- Fechas y plazos.
- Datos que cambian con el tiempo.
- Rellenar huecos: cuando le falta un dato, a veces lo completa en vez de preguntar.
- Documentos largos: se queda con lo del principio y lo del final.

## La frase del día

> La IA no es un oráculo ni una calculadora. Es una compañera rápida que a veces se equivoca con mucha seguridad. Tu trabajo no es creerla: es revisarla. Y eso es exactamente lo que te hace necesaria.

## Prompt · Paso 1. Pídele el total

> Te paso las facturas de 2026. Dime cuánto hemos facturado en total y cuánto está pendiente de cobro.
>
> [adjunta facturas-2026.csv]

Guarda la respuesta. No digas nada todavía.

## Prompt · Paso 2. Audítala

> Ahora revisa tu propia respuesta. ¿Hay algo en este archivo que pueda hacer que el total no sea fiable? Mira duplicados, celdas vacías, clientes escritos de varias formas y tipos de IVA distintos.

## Prompt · Paso 3. La pregunta que importa

> ¿Qué has dado por supuesto para darme el primer número?

## Descarga · Facturas de prueba
archivo: _datos-de-prueba/facturas-2026.csv
367 facturas inventadas de 2026. Se abre con Excel o Google Sheets.

## Descarga · Las tres preguntas
archivo: dia-06-cazar-errores/checklist-revision.md
Para tener al lado de la pantalla. Treinta segundos que te ahorran un disgusto.
