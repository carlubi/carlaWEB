# Día 9 · De notas sueltas a presentación

**Tipo:** 🎯 Reto (candidato a vídeo ancla)
**Herramienta:** Claude (slides)
**Tiempo:** 20 minutos
**Datos:** `ventas-2026.csv`

## Objetivo

Que pase de un archivo de datos a una presentación de 8 diapositivas que podría enseñar mañana. Sin abrir PowerPoint.

## Por qué es candidato a vídeo

Es el día con el contraste visual más fuerte: un CSV de 182 filas a la izquierda, un deck terminado a la derecha. Eso se graba en 40 segundos y se entiende sin audio.

## Pasos

1. Descarga `ventas-2026.csv`.
2. Pide primero la **estructura**, no las diapositivas. El prompt está en `prompt.md`.
3. Revisa la estructura. Cambia lo que no encaje.
4. Ahora sí, pide la presentación.
5. Descárgala y ábrela.

## El paso 2 es el reto

Pedir la estructura antes que el contenido es lo que separa un deck utilizable de uno que hay que rehacer. Si la estructura está mal, las ocho diapositivas están mal. Revisar un esquema cuesta un minuto; rehacer un deck cuesta una tarde.

## Cómo saber si ha salido bien

- Las cifras del deck coinciden con el archivo. **Que lo compruebe**: el archivo tiene filas duplicadas y facturaciones vacías a propósito.
- Hay una conclusión, no solo datos.
- Podría enseñarlo sin pasar vergüenza.

## Trampa del archivo

`ventas-2026.csv` tiene cuatro facturaciones vacías, dos filas duplicadas y nombres en minúscula. Si el deck da totales sin mencionarlo, ahí está el repaso del día 6.

## La idea que debe quedarse

La IA hace el trabajo de montar. Ella decide qué se cuenta y comprueba que sea verdad. Eso no se delega.

## Por verificar antes de publicar

- [ ] En qué formatos se descarga y si abre bien en PowerPoint
- [ ] Si está en plan gratuito
- [ ] Qué tal salen los gráficos con datos reales
