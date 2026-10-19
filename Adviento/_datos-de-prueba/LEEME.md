# Datos de prueba

Todo lo de esta carpeta es **inventado**: empresas, personas, importes y correos. Nada se parece a un cliente real.

Sirve para que nadie tenga que usar datos de su empresa para practicar. Eso quita el miedo del día 1 y evita disgustos.

## Qué hay

| Archivo | Qué contiene | Días que lo usan |
|---|---|---|
| `facturas-2026.csv` | **367 facturas** de todo 2026: cliente, concepto, importe, IVA, estado, vencimiento y forma de pago | 2, 6, 15 |
| `ventas-2026.csv` | **182 filas** de ventas semanales de 5 comerciales en 4 zonas, 9 meses, con objetivos | 13, 15 |
| `bandeja-entrada.csv` | **120 correos** de una semana de diciembre: remitente, asunto, extracto, adjuntos | 11, 17, 21 |
| `agenda-semana.csv` | **30 eventos** de una semana (14-18 de diciembre) de una persona con trabajo, críos y Navidad. Tres «Reunión» sin descripción, un solape el miércoles | 10, 21 |
| `_solucion-bandeja.csv` | La categoría real de cada correo. **Solo para ti**, para comprobar si la IA acierta. No se publica. | — |

El tamaño es deliberado. Con 12 filas, cualquiera diría "esto lo hago yo a mano en diez minutos". Con 367 facturas y 120 correos, el contraste es evidente: a mano son horas, y ahí se ve para qué sirve la IA.

## Los errores son intencionados

En `facturas-2026.csv` hay sembrados a propósito:

- **Duplicados:** facturas idénticas salvo el número.
- **Importes vacíos:** varias filas sin importe.
- **El mismo cliente escrito de 4 formas:** "Talleres Beret SL", "talleres beret sl", "Talleres Beret, S.L.", "TALLERES BERET SL". Igual con Panadería Sol y Grupo Nadal.
- **Fechas en dos formatos:** unas en `2026-03-14` y otras en `14/03/2026`.
- **Importes con coma y símbolo de euro** mezclados con los normales.
- **IVA del 10 % colado** entre las del 21 %, sin avisar.
- **Vencidas antiguas** que nadie ha reclamado.
- **Espacios sobrantes** al principio y al final de algunos conceptos.

En `ventas-2026.csv`: filas duplicadas, facturaciones vacías, nombres en minúscula y algún importe con coma.

**Por qué:** el reto no es "pídeselo a la IA", es **ver si la IA se da cuenta**. Si alguien le pide un total y la IA se lo da sin mencionar el duplicado ni el importe vacío, ahí está la lección del calendario: revisar siempre. Y si se da cuenta, se ve lo que se habría comido a mano.

## El archivo de la bandeja

Los 120 correos mezclan lo importante con el ruido: presupuestos, incidencias, cobros, temas internos, newsletters y seis correos que piden cambiar datos bancarios de un proveedor. Esos seis son el caramelo del reto de clasificación, porque son exactamente el tipo de mensaje que no debe tratarse en automático.

La categoría real está en `_solucion-bandeja.csv`, fuera del archivo que ve el público.

## Si añades más

Mantén la regla: nombres inventados, importes creíbles, volumen suficiente para que a mano duela, y errores escondidos. Nunca un archivo real anonimizado a medias.
