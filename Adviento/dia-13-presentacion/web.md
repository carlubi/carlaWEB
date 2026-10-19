# Tu presentación sin abrir PowerPoint
resumen: Domingo de sorpresa: Claude te fabrica una presentación de verdad, en un archivo que abres en PowerPoint, Keynote o Google Slides. Con un truco que cambia el resultado: pedir primero la estructura. Y una regla: cada cifra se comprueba.
datos: Las ventas de prueba, o un tema tuyo

## Lo que vas a ver hoy

Hasta ahora Claude te daba texto o artefactos en su panel. Hoy te va a dar **un archivo**: una presentación de PowerPoint (`.pptx`) que descargas y abres donde quieras. Lo mismo vale para documentos de Word, hojas de Excel o PDFs.

¿Cómo lo hace? Claude tiene un pequeño ordenador propio, aislado, donde puede **escribir y ejecutar código**. Para hacer tu presentación, escribe un programa que la construye diapositiva a diapositiva, lo ejecuta y te deja el archivo listo para descargar. Tú no ves nada de eso, solo el resultado. (Si te pica la curiosidad, puedes desplegar los pasos en el chat y verlo trabajar.)

## Elige tu presentación

Hay dos opciones. Elige la que te apetezca:

- **Con datos de prueba:** las ventas de nueve meses de una empresa inventada. Para practicar con números y aprender a comprobarlos.
- **Con un tema tuyo:** la presentación de tu negocio, un trabajo de clase, la propuesta del viaje de fin de curso, la charla que tienes que dar en la asociación de vecinos.

## Pasos

### Paso 1 · Pide primero la estructura

Este es el truco del día. No pidas "hazme una presentación". Pide primero **qué va en cada diapositiva**, solo títulos y una línea. Usa el prompt «Paso 1».

Revisar un esquema cuesta un minuto. Rehacer una presentación de diez diapositivas, una tarde.

### Paso 2 · Ajusta

Lee la estructura. ¿Falta algo? ¿Sobra algo? ¿El orden cuenta bien la historia? Cámbialo con el prompt «Paso 2». Repite hasta que te encaje.

### Paso 3 · Ahora sí, que la fabrique

Usa el prompt «Paso 3». Claude va a trabajar un rato: verás que ejecuta pasos. Cuando acabe, te aparecerá el archivo para **descargar**.

![El archivo de la presentación generado en el chat, con el botón de descargar](capturas/d13-01-archivo-pptx.png)

Si te contesta que no puede crear archivos, entra en **Ajustes** y busca en **Funciones** (o Capacidades) la opción de **crear y editar archivos**. Actívala y vuelve a pedírselo.

![Los Ajustes de Claude con la opción de crear y editar archivos activada](capturas/d13-02-ajuste-archivos.png)

### Paso 4 · Ábrela

- **PowerPoint o Keynote:** doble clic en el archivo descargado.
- **Google Slides:** entra en tu Drive, arrastra el archivo y ábrelo con Presentaciones de Google.

Retócala ahí como cualquier presentación: cambia colores, mueve cosas, añade tu logo. O pídele los cambios a Claude y que te dé una versión nueva.

### Paso 5 · Comprueba las cifras

Si has usado los datos de prueba, usa el prompt «Paso 5». Abre el archivo de ventas y comprueba al menos **dos cifras** a mano. Es lo que practicaste el día 6. Si vas a poner tu nombre debajo, la revisas tú.

## Ideas para la versión con tema propio

- **Tu negocio:** quiénes sois, qué hacéis, para quién, por qué vosotros, precios y contacto.
- **Un trabajo de clase:** pásale tus apuntes o el enunciado y que proponga cómo contarlo en 8 diapositivas.
- **Una propuesta:** el viaje de fin de curso, el cambio de proveedor, la reforma de la comunidad.
- **Una charla:** la que tienes que dar y no sabes por dónde empezar.

## Lo que hay que saber

- **Esto gasta bastante uso**, porque Claude ejecuta código y crea un archivo (día 2). Mejor pedir cambios concretos que "hazla otra vez".
- **El diseño es correcto, no espectacular.** Para dejarla preciosa, retócala en PowerPoint o Google Slides.
- **Los números, siempre a revisar.** Claude calcula con código, que es mucho más fiable que de cabeza, pero puede haber interpretado mal una columna.

## Cómo saber si ha salido bien

- Has revisado la estructura antes de la presentación.
- Tienes un archivo que se abre en tu programa de presentaciones.
- Las cifras que has comprobado coinciden con el archivo.
- La última diapositiva propone algo, no solo enseña datos.

## La idea que se queda

Claude hace el trabajo de montar. Tú decides qué se cuenta y compruebas que sea verdad. Eso no se delega.

## Palabras del día

- **Ejecutar código:** cuando Claude escribe un pequeño programa y lo pone en marcha en su ordenador aislado.
- **Entorno aislado (sandbox):** el ordenador de Claude, separado del tuyo. Lo que pasa ahí no toca tus cosas.
- **.pptx:** el formato de las presentaciones de PowerPoint. Lo abren también Keynote y Google Slides.

## Prompt · Paso 1. La estructura (datos de prueba)

> Te paso las ventas de los últimos nueve meses de una empresa. Tengo que presentarlas en la reunión de dirección.
>
> Antes de hacer nada, propón la estructura de una presentación de 8 diapositivas: qué va en cada una y por qué. Solo títulos y una línea de contenido.
>
> Quien la verá quiere saber si vamos bien y qué hay que decidir. Los detalles no le interesan.
>
> Si en los datos ves algo raro, dímelo antes de montar nada.
>
> [adjunta ventas-2026.csv]

## Prompt · Paso 1. La estructura (tema propio)

> Tengo que hacer una presentación sobre [tema] para [quién la va a ver]. Lo que quiero conseguir es [que entiendan / que decidan / que contraten / aprobar].
>
> Antes de hacer nada, propón la estructura de una presentación de 8 diapositivas: qué va en cada una y por qué. Solo títulos y una línea de contenido. Si te falta información para hacerla bien, pregúntame.
>
> [si tienes material, adjúntalo o pégalo aquí]

## Prompt · Paso 2. Ajusta

> La estructura me sirve salvo [lo que cambiarías]. Cámbialo y enséñamela otra vez.

## Prompt · Paso 3. Fabrícala

> Ahora crea la presentación en un archivo de PowerPoint (.pptx) con esa estructura.
>
> - Una idea por diapositiva, nada de párrafos
> - Gráficos solo donde ayuden
> - La última diapositiva: qué propongo hacer
> - Colores sobrios y letra grande, que se lea desde el fondo de la sala
> - Los números, exactos. Si alguno no puedes calcularlo con seguridad, márcalo en vez de aproximarlo

## Prompt · Paso 5. Comprueba

> ¿De dónde sale cada cifra de la presentación? Dime las columnas y las filas que has usado, y si has tenido que decidir algo por tu cuenta con datos que faltaban o eran raros.

## Descarga · Ventas de prueba
archivo: _datos-de-prueba/ventas-2026.csv
182 filas de ventas semanales inventadas. Se abre con Excel o Google Sheets.
