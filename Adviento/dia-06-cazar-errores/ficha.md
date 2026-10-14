# Día 6 · Cómo cazar un error de la IA

**Tipo:** 💡 Tip con tarea
**Herramienta:** Claude
**Tiempo:** 10 minutos
**Datos:** `facturas-2026.csv`

## Objetivo

Que pierda la fe ciega. Que sepa que la IA se equivoca, dónde suele hacerlo y cómo pillarlo en treinta segundos.

## Por qué va al final del bloque 1

Durante cinco días ha visto cosas que funcionan. Hoy le enseñamos la cara b, antes de que se confíe. Y cierra el bloque con la idea más importante del calendario: ella sigue siendo quien revisa y quien responde.

## La tarea: la trampa de las facturas

Le damos un archivo de 367 facturas que tiene errores sembrados a propósito: duplicados, importes vacíos, el mismo cliente escrito de cuatro formas, dos tipos de IVA mezclados.

Le pedimos un total facturado. Y luego le pedimos que se audite a sí misma.

Casi siempre pasa una de dos cosas, y las dos enseñan:
- Da un total limpio sin avisar de nada → ahí está la lección.
- Avisa de los problemas → entonces ve lo que ella se habría comido revisando a mano.

## Las tres comprobaciones

1. **¿De dónde sale este número?** Pedirle que enseñe el cálculo o las filas que ha usado.
2. **¿Qué has dado por supuesto?** Aquí salen las decisiones que tomó sin preguntar.
3. **¿Qué puede estar mal en lo que me has dado?** Obligarla a buscarse los fallos.

## Dónde falla más

- Sumas y cuentas sobre muchos datos.
- Fechas y plazos.
- Datos que cambian con el tiempo.
- Rellenar huecos: cuando le falta un dato, a veces lo completa en vez de preguntar.
- Documentos largos: se queda con lo del principio y lo del final.

## Lo que se lleva

`checklist-revision.md`: tres preguntas para pegar al lado de la pantalla.

## La frase del día

> La IA no es un oráculo ni una calculadora. Es una compañera rápida que a veces se equivoca con mucha seguridad. Tu trabajo no es creerla: es revisarla. Y eso es exactamente lo que te hace necesaria.

## Por verificar antes de publicar

- [ ] Probar el archivo de facturas y ver qué responde de verdad, para contarlo con honestidad
- [ ] Si lo detecta todo, subir la dificultad del archivo
