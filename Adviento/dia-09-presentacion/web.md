# De datos a presentación
resumen: Convierte datos de prueba en una presentación breve y comprueba que cada cifra sea correcta.
datos: Ventas de prueba

## Lo que vas a conseguir

Pasar de un archivo de datos a una presentación de 8 diapositivas que podrías enseñar mañana. Sin abrir PowerPoint.

## Pasos

1. Descarga las ventas de prueba.
2. Pide primero la **estructura**, no las diapositivas.
3. Revisa la estructura y cambia lo que no encaje.
4. Ahora sí, pide la presentación.
5. Descárgala, ábrela y comprueba las cifras.

## El paso 2 es el reto

Pedir la estructura antes que el contenido es lo que separa una presentación utilizable de una que hay que rehacer. Si la estructura está mal, las ocho diapositivas están mal. Revisar un esquema cuesta un minuto; rehacer una presentación cuesta una tarde.

## Cómo saber si ha salido bien

- Las cifras de la presentación coinciden con el archivo. Compruébalo tú: es lo que practicaste el día 6.
- Hay una conclusión, no solo datos.
- Podrías enseñarla sin pasar vergüenza.

## La idea que debe quedarse

La IA hace el trabajo de montar. Tú decides qué se cuenta y compruebas que sea verdad. Eso no se delega.

## Prompt · Paso 1. La estructura

> Te paso las ventas de los últimos 9 meses. Tengo que presentarlas en la reunión de dirección.
>
> Antes de hacer nada, propón la estructura de una presentación de 8 diapositivas: qué va en cada una y por qué. Solo títulos y una línea de contenido.
>
> Quien lo verá quiere saber si vamos bien y qué hay que decidir. No le interesan los detalles.
>
> Si en los datos ves algo raro, dímelo antes de montar nada.
>
> [adjunta ventas-2026.csv]

## Prompt · Paso 2. Ajusta

> La estructura me sirve salvo [lo que cambiarías]. Cámbialo.

## Prompt · Paso 3. Ahora sí

> Monta la presentación con esa estructura.
>
> - Una idea por diapositiva, nada de párrafos
> - Gráficos donde ayuden, no por rellenar
> - La última diapositiva: qué propongo hacer
> - Los números, exactos. Si alguno no puedes calcularlo con seguridad, déjalo marcado en vez de aproximarlo

## Prompt · Paso 4. Comprueba

> ¿De dónde sale cada cifra de la presentación? Y dime si has tenido que decidir algo por tu cuenta con los datos que faltaban.

## Descarga · Ventas de prueba
archivo: _datos-de-prueba/ventas-2026.csv
182 filas de ventas semanales inventadas. Se abre con Excel o Google Sheets.
