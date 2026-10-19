# Día 8 · El contexto lo es todo

**Tipo:** 🎯 Reto
**Herramienta:** Claude (Proyectos)
**Tiempo:** 25 minutos
**Datos:** `contexto-pobre.md` y `contexto-completo.md` (Barro Lento, inventado)
**Plan:** gratuito (usa 2 de los 5 proyectos; se archivan al acabar)

## Objetivo

Que vea con sus ojos, con un experimento controlado, que el contexto cambia el resultado más que cualquier prompt. Y que salga con la estructura de un buen contexto y su propio documento.

## Por qué es el 8

Es festivo (8 de diciembre): hay más tiempo. Y llega justo después del primer proyecto (día 7) y del markdown (día 4), que son los dos ingredientes.

## Lo que aprende

- Qué es un experimento: una sola variable.
- Por qué la IA rellena huecos con lo probable y no con lo correcto (enlaza con días 2 y 6).
- Ingeniería de contexto.
- Las nueve piezas de un buen contexto y los cinco consejos.
- Subir un `.md` como archivo de un proyecto.

## Las trampas del caso (para comprobar en las pruebas)

| Pregunta | Lo que debería hacer B | Lo que suele hacer A |
|---|---|---|
| 1 · Marta y su hija de 12 | Decir que torno es desde 14 con adulto, ofrecer «Modelado en familia» (45 €, domingo 17 de enero), no confirmar plaza, firmar «Nuria · Barro Lento» | Confirmar plaza, inventar precio y fechas, aceptar a la niña en torno |
| 2 · Post de enero | Torno desde el sábado 9 y familia el domingo 17, tono de proceso, sin urgencias falsas, máximo un emoji | Fechas y precios inventados, «¡¡últimas plazas!!», emojis |
| 3 · Taza rota | Foto en 48 h, elegir reposición o reembolso, no hace falta devolverla, sin emojis | Pedir que la devuelva, no dar plazo, ofrecer descuento |

Si en las pruebas A sale demasiado bien (Claude es prudente y no inventa), deja la pregunta 1 igual: la de la edad casi nunca la acierta sin contexto, y el tono y la firma siempre fallan.

## Notas para ti

- Barro Lento es inventado. `barrolento.example` no existe a propósito.
- Las instrucciones son idénticas en A y B: si alguien pone instrucciones distintas, el experimento no vale. Insiste en el vídeo.
- La rúbrica de 4 criterios × 2 puntos da un máximo de 8 por pregunta. Mola enseñar el marcador final en el vídeo.
- Los tres `.md` se descargan tal cual, no en PDF: se suben a los proyectos.

## Capturas que hacen falta

| Archivo | Qué tiene que salir |
|---|---|
| `d08-01-dos-proyectos.png` | La lista de Proyectos con «Prueba A · contexto pobre» y «Prueba B · contexto completo» |
| `d08-02-comparativa.png` | Las dos respuestas a la pregunta 1, lado a lado. La de A con algo inventado y la de B bien |

## Por verificar antes de publicar

- [ ] Hacer el experimento completo y guardar las respuestas para el vídeo
- [ ] Que un `.md` se suba bien como archivo de proyecto en el gratuito
- [ ] Si Claude crea archivos `.md` descargables en el gratuito (para el prompt de la entrevista)
