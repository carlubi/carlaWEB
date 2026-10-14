# Día 6 · La trampa de las facturas

## Paso 1 — Pídele el total

> Te paso las facturas de 2026. Dime cuánto hemos facturado en total y cuánto está pendiente de cobro.
>
> [adjunta `facturas-2026.csv`]

Guarda la respuesta. No digas nada todavía.

## Paso 2 — Audítala

> Ahora revisa tu propia respuesta. ¿Hay algo en este archivo que pueda hacer que el total no sea fiable? Mira duplicados, celdas vacías, clientes escritos de varias formas y tipos de IVA distintos.

## Paso 3 — La pregunta que importa

> ¿Qué has dado por supuesto para darme el primer número?

---

## Lo que hay escondido en el archivo

Para que lo compruebes tú antes de publicar:

- Facturas duplicadas, idénticas salvo el número
- Varias filas con el importe vacío
- "Talleres Beret SL" escrito de cuatro formas distintas. Igual con Panadería Sol y Grupo Nadal
- Fechas en dos formatos: `2026-03-14` y `14/03/2026`
- Importes con coma decimal y símbolo de euro mezclados con los normales
- Algunas facturas con IVA del 10 % entre las del 21 %
- Facturas vencidas hace meses que nadie ha reclamado
- Espacios sobrantes en algunos conceptos

## Notas para ti, Carla

- El orden importa: primero que confíe, después que descubra. Si avisas de los errores antes, pierdes la lección.
- Si en tus pruebas Claude detecta todo a la primera, el guion cambia pero el reto sigue valiendo: "mira todo lo que te habrías comido a mano". Las dos versiones funcionan, solo hay que saber cuál grabar.
- Las facturas vencidas sin reclamar son el detalle que más duele: es dinero de verdad que se queda ahí porque nadie mira el archivo.
