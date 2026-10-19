# El contexto lo es todo
resumen: Un experimento para verlo con tus ojos: dos proyectos iguales, las mismas preguntas, y un único cambio, el documento de contexto. Uno pobre, otro completo. Después te llevas la estructura de un buen contexto para escribir el tuyo.
datos: Los dos archivos de contexto de este día. Después, tu propio proyecto

## Hoy es festivo, así que hoy toca el experimento bueno

Desde el día 1 te vengo diciendo que el contexto lo cambia todo. Hoy no te lo digo: lo compruebas. Vas a montar un experimento de verdad, como se hace en un laboratorio: dos situaciones idénticas en todo menos en **una sola cosa**, para ver qué efecto tiene esa cosa.

## Por qué el contexto importa tanto

Claude no te conoce. No sabe tus precios, tus normas, tu forma de hablar ni lo que pasó la semana pasada. Cada conversación empieza de cero y lo único que sabe es lo que tú le das en ese momento: lo que escribes, lo que adjuntas y lo que hay en el proyecto.

Cuando le falta información, ¿te acuerdas del día 6? La rellena con **lo más probable**. Y "lo más probable" para una tienda de cerámica cualquiera no es lo correcto para la tuya. Así salen los precios inventados, las promesas que no puedes cumplir y ese tono de folleto que no suena a nadie.

En el mundillo de la IA esto ya tiene nombre: **ingeniería de contexto** (*context engineering*). La idea es que, a estas alturas, los modelos son tan buenos que la diferencia ya no está en el prompt perfecto, sino en **qué información les das para trabajar**.

## El experimento

### El caso

**Barro Lento** es un taller de cerámica inventado en Gijón. Lo lleva Nuria, que quiere un asistente para contestar correos de clientes y escribir posts de Instagram.

Tienes dos documentos de contexto sobre el mismo negocio:

- **El pobre:** cuatro líneas. Lo que escribiría cualquiera con prisa.
- **El completo:** dos páginas en markdown, con precios, normas, talleres, tono, ejemplos y qué hacer cuando duda.

Descarga los dos. Antes de nada, ábrelos con el Bloc de notas o TextEdit y léelos. Fíjate en la estructura del completo: títulos, tablas, ejemplos. Es lo que aprendiste el día 4.

### Paso 1 · Crea el proyecto A (contexto pobre)

1. **Proyectos** › **Nuevo proyecto**.
2. Nombre: **Prueba A · contexto pobre**.
3. En **instrucciones**, pega el texto de instrucciones de más abajo y guarda.
4. En **archivos**, pulsa **+** y sube el **contexto pobre**.

### Paso 2 · Crea el proyecto B (contexto completo)

Exactamente igual, pero:

1. Nombre: **Prueba B · contexto completo**.
2. Las **mismas instrucciones**, palabra por palabra.
3. En archivos, sube el **contexto completo**.

![Los dos proyectos de prueba en la lista de Proyectos, uno al lado del otro](capturas/d08-01-dos-proyectos.png)

Lo único que cambia entre A y B es el archivo. Si cambias algo más, el experimento ya no vale.

### Paso 3 · Haz las mismas tres preguntas en los dos

Abre un chat dentro de **A** y haz la pregunta 1. Luego abre un chat dentro de **B** y haz la misma. Repite con la 2 y la 3. Tienes las tres preguntas en los prompts de abajo.

Truco: deja A y B abiertos en dos pestañas del navegador para compararlos lado a lado.

![Dos pestañas del navegador con el mismo correo de clienta respondido en el proyecto A y en el B](capturas/d08-02-comparativa.png)

### Paso 4 · Puntúa

Para cada respuesta, pon de 0 a 2 puntos en cada criterio. Un 0 es "no", un 1 es "a medias" y un 2 es "sí, perfecto".

| Criterio | A | B |
|---|---|---|
| **No se inventa nada** (precios, fechas, plazas, políticas) | | |
| **Sigue las normas del negocio** (edades, roturas, envíos) | | |
| **Suena a Nuria** (tono, firma, emojis) | | |
| **Se podría enviar tal cual** o casi | | |

Fíjate sobre todo en estas trampas:

- **Pregunta 1:** la hija tiene 12 años y el torno es desde 14 con adulto. ¿Se lo dice? ¿Le ofrece el taller en familia? ¿Confirma plaza (que está prohibido)? ¿Se inventa un precio?
- **Pregunta 2:** ¿se inventa fechas, precios o un "¡¡últimas plazas!!"?
- **Pregunta 3:** ¿pide la foto en 48 horas? ¿Ofrece elegir entre otra pieza o el dinero? ¿Dice que no hace falta devolver la rota?

### Paso 5 · Saca tu conclusión

Haz la pregunta final del experimento en el proyecto B. Y después piensa: ¿cuántas veces le has pedido algo a una IA con contexto tipo A esperando un resultado tipo B?

Cuando acabes, puedes **archivar** los dos proyectos de prueba (tres puntos › Archivar) para que no te ocupen sitio. En el gratuito tienes cinco.

## La estructura de un buen contexto

Ahora que lo has visto, esto es lo que tiene que llevar un documento de contexto. Es la estructura del de Barro Lento, y te vale para cualquier cosa: tu trabajo, tu negocio, tu TFG o la organización de tu casa.

1. **Quién soy.** A qué te dedicas, dónde, con quién.
2. **Para qué es el asistente.** Qué le vas a pedir y quién decide al final.
3. **Para quién es lo que hacemos.** Quién lo va a leer y qué le importa.
4. **Los datos.** Los hechos concretos: precios, horarios, temario, nombres. Mejor en tablas.
5. **Las normas.** Cómo se hacen las cosas, con su porqué.
6. **Cómo hablo.** Tono, trato, longitud, emojis, firma. **Con un ejemplo de "así sí" y otro de "así no".**
7. **El formato.** Cómo quieres recibir lo que te prepara.
8. **Lo que nunca debe hacer.** Las líneas rojas.
9. **Qué hacer si duda.** El hueco marcado en vez del dato inventado.

### Los cinco consejos que marcan la diferencia

1. **Concreto mejor que bonito.** "Cercana" no le dice nada. "De tú, frases cortas, como mucho un emoji" se lo dice todo.
2. **Los ejemplos valen más que las descripciones.** Un "así sí" y un "así no" enseñan más que diez adjetivos.
3. **Explica el porqué de las normas.** "No confirmes plazas *porque cambian cada día*" hace que lo aplique bien también en casos que no has previsto.
4. **Estructura en markdown.** Títulos, listas y tablas. Claude entiende qué es principal y qué es secundario.
5. **Corto y vivo.** Dos a cuatro páginas. Si crece mucho, es ruido. Y actualízalo cuando cambie algo: un contexto viejo da respuestas viejas.

## Ahora, el tuyo

1. Descarga la plantilla de contexto.
2. Rellénala para el proyecto que creaste ayer. Si te atascas, usa el prompt «Que te entreviste».
3. Súbela a los archivos de ese proyecto.
4. Repite allí la pregunta que hiciste ayer y compara.

## Cómo saber si ha salido bien

- El proyecto B ha ganado por goleada, y sabes decir **por qué** en cada pregunta.
- Has pillado al proyecto A inventándose al menos un precio o una norma.
- Tienes tu propio documento de contexto en tu proyecto.

## Palabras del día

- **Ingeniería de contexto:** el arte de darle a la IA la información justa y bien ordenada para trabajar.
- **Variable:** lo único que cambias en un experimento para ver qué efecto tiene.
- **Documento de contexto:** el archivo con todo lo que el asistente tiene que saber.

## Prompt · Las instrucciones (iguales en A y en B)

Pégalas en las instrucciones de los dos proyectos, sin cambiar nada.

> Eres el asistente de un pequeño negocio. Todo lo que necesitas saber del negocio está en el archivo de contexto de este proyecto: léelo antes de cada respuesta y úsalo para todo lo que te pida.

## Prompt · Pregunta 1. El correo de la clienta

> Contesta a este correo de una clienta:
>
> «¡Hola! He visto que dais clases de torno. ¿Hay plazas para enero? Me gustaría ir con mi hija, que tiene 12 años. ¿Cuánto cuesta? Gracias, Marta»

## Prompt · Pregunta 2. El post de Instagram

> Escribe una publicación de Instagram para anunciar los talleres de enero.

## Prompt · Pregunta 3. La taza rota

> Contesta a este mensaje: «Me ha llegado la taza rota, vaya disgusto. Era un regalo para mi madre.»

## Prompt · La pregunta final del experimento

En el proyecto B.

> En otro proyecto he hecho estas mismas preguntas con un documento de contexto de cuatro líneas. Sin ver esas respuestas, dime qué crees que se habrá inventado o habrá hecho mal en cada una, y qué apartados de tu documento de contexto te han ayudado más.

## Prompt · Que te entreviste para tu contexto

> Quiero escribir el documento de contexto para un proyecto de Claude sobre [para qué es]. Entrevístame siguiendo esta estructura: quién soy, para qué es el asistente, para quién es lo que hacemos, los datos clave, las normas, cómo hablo (con un ejemplo de así sí y otro de así no), el formato, lo que nunca debe hacer y qué hacer si duda.
>
> Pregúntame de una en una. Si respondo con algo vago, como "cercano" o "profesional", pídeme que lo concrete.
>
> Al final, dame el documento completo en markdown, como archivo .md descargable.

## Descarga · Contexto pobre
archivo: dia-08-contexto/contexto-pobre.md
formato: md
Cuatro líneas sobre Barro Lento. Va al proyecto A.

## Descarga · Contexto completo
archivo: dia-08-contexto/contexto-completo.md
formato: md
Dos páginas en markdown con todo lo que hay que saber de Barro Lento. Va al proyecto B.

## Descarga · Plantilla de contexto
archivo: dia-08-contexto/plantilla-contexto.md
formato: md
copiar: sí
La estructura de un buen contexto, en markdown, para rellenar con lo tuyo.
