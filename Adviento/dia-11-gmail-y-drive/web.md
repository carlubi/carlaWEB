# Tu correo y tus documentos
resumen: Conectas Gmail y Google Drive, ya sabiendo cómo va. Le preguntas a tu bandeja quién espera respuesta, le dejas preparar un borrador, buscas en tus documentos y le haces preguntas a un manual con la cita de dónde sale cada cosa.
datos: Tu Gmail y tu Drive, o los correos de prueba y el manual de ejemplo

## Hoy subimos de nivel

Ayer conectaste el calendario: lo menos delicado. Hoy toca el correo y los documentos, que es donde está el oro (y donde hay más cosas sensibles). Como ya conoces el mecanismo, hoy vamos más rápido con la conexión y nos centramos en **qué hacer con ellos**.

Antes de empezar, repasa en dos segundos el semáforo de datos del día 1. En tu correo hay cosas de otras personas: lo que le pidas a Claude que lea, lo lee.

## Parte 1 · Conectar Gmail y Drive

Es el mismo proceso de ayer, dos veces:

1. **Personalizar** › **Conectores** › **+**.
2. Busca **Gmail** › **Conectar** › elige tu cuenta en la pantalla de Google › lee los permisos › **Permitir**.
3. Vuelve al directorio, busca **Google Drive** y repite.
4. Comprueba que los dos aparecen en tu lista de conectados.

![La página de conectores con Google Calendar, Gmail y Google Drive conectados](capturas/d11-01-tres-conectados.png)

En la pantalla de Google de Gmail verás que menciona **enviar correos**. Tranquilidad: Claude no envía, responde ni reenvía nada sin pedirte permiso antes. Por defecto, lo que hace es **preparar borradores** que tú revisas y envías desde Gmail.

## Lo que hay que saber de cada uno

### Gmail

- **Busca y lee** correos y conversaciones enteras.
- **Crea borradores** que aparecen en la carpeta Borradores de tu Gmail, en el ordenador y en el móvil.
- **No lee el contenido de los adjuntos.** Sabe que un correo trae un PDF, pero no lo abre.
- Con bandejas enormes, a veces tiene que hacer varias búsquedas. Si le das pistas (quién, cuándo, de qué tema), acierta más y gasta menos.

### Google Drive

- **Busca y lee** Google Docs, Hojas de cálculo, Presentaciones, PDFs y archivos de texto.
- **Solo ve el texto.** Las imágenes, fotos y gráficos de dentro de un documento no los procesa.
- **Solo ve lo que tú ya puedes abrir.** Si un documento no está compartido contigo, Claude tampoco lo ve.
- Además de buscar por su cuenta, puedes **añadir un archivo concreto** a un chat: **+** › **Añadir desde Google Drive** › buscas el archivo o pegas el enlace.

![El selector «Añadir desde Google Drive» abierto en Claude, con documentos recientes y el campo para buscar o pegar un enlace](capturas/d11-02-anadir-desde-drive.png)

- Y en un **proyecto**, puedes añadir archivos de Drive a su conocimiento: en el apartado de archivos, **+** › **Drive**.

## Parte 2 · Tu correo

Abre un chat nuevo. En **+** › **Conectores**, deja encendido **solo Gmail**.

### Paso 1 · ¿Quién me espera?

Usa el prompt «Quién espera respuesta». Es la pregunta que más tranquiliza a todo el mundo. Fíjate en el recuadro de uso de herramienta: verás qué búsquedas ha hecho en tu correo.

### Paso 2 · Un borrador

Elige uno de esos correos y usa el prompt «Prepárame el borrador». Claude te pedirá permiso para **crear el borrador**: lee el aviso y dale a **permitir una vez**.

![El aviso de Claude pidiendo permiso para crear un borrador en Gmail, con el destinatario y el asunto](capturas/d11-03-permiso-borrador.png)

Ahora abre tu Gmail y ve a **Borradores**. Ahí está, listo para que lo revises, lo cambies y lo envíes tú. Claude prepara; tú aprietas el botón.

![La carpeta Borradores de Gmail con el borrador creado por Claude](capturas/d11-04-borrador-en-gmail.png)

## Parte 3 · Tus documentos

### Paso 3 · Busca algo en tu Drive

En un chat nuevo, deja encendido **solo Google Drive** y usa el prompt «Busca en mi Drive». Pídele algo que sepas que está, para comprobar que lo encuentra.

### Paso 4 · Pregúntale a un documento (y comprueba la cita)

Este es el paso que más vale del día. Vas a hacerle preguntas a un manual de 10 páginas, de una empresa inventada, que tiene **dos trampas** escondidas: una contradicción y un procedimiento que se menciona pero nunca se explica.

1. Descarga el manual de ejemplo.
2. Súbelo a tu Google Drive (arrástralo a drive.google.com).
3. En un chat con Drive encendido: **+** › **Añadir desde Google Drive** › selecciónalo.
4. Usa el prompt «Pregúntale al manual».
5. **Abre el manual y comprueba dos de las citas.** Que dice lo que Claude dice que dice.

Esto vale para todo: el convenio de tu sector, el contrato del alquiler, las bases de una beca, el reglamento de la comunidad, el temario de un examen. Documentos que nadie se lee enteros.

## Parte 4 · Todo junto

Si tienes los tres conectados (calendario, correo y Drive), enciéndelos en un chat nuevo y usa el prompt «Prepara mi próxima reunión». Claude va a cruzar las tres fuentes. Es la primera vez que lo ves trabajar como un asistente de verdad.

## Si no puedes conectar nada

Descarga los correos de prueba y el manual, y adjúntalos directamente en un chat (**+** › subir archivo). Usa los prompts «Con los correos de prueba» y «Pregúntale al manual». Lo que aprendes es lo mismo.

## Cómo saber si ha salido bien

- Te ha dado una lista de correos pendientes que cuadra con tu bandeja.
- Tienes un borrador en Gmail que has creado tú con su ayuda (y no se ha enviado nada).
- Ha encontrado las dos trampas del manual, y has comprobado al menos dos citas.
- Sabes encender solo el conector que necesitas en cada chat.

## La idea que se queda

Conectado, Claude deja de ser alguien a quien le cuentas las cosas y pasa a ser alguien que **las va a buscar**. Por eso cada vez es más importante lo de los días 6 y 9: pedir de dónde sale cada cosa y darle solo las llaves que necesita.

## Palabras del día

- **Borrador:** correo preparado y sin enviar, en tu carpeta de Borradores.
- **Cita o referencia:** la parte exacta del documento de la que sale una respuesta.
- **Conocimiento del proyecto:** también puede venir de archivos de Drive.

## Prompt · Quién espera respuesta

> Revisa mi correo de los últimos 10 días y dime qué correos esperan una respuesta mía y siguen sin contestar.
>
> Para cada uno: quién lo envía, de qué va en una línea, desde cuándo espera y si parece urgente.
>
> Ignora newsletters, publicidad y notificaciones automáticas. No respondas, no archives y no marques nada.

## Prompt · Prepárame el borrador

> Prepárame un borrador de respuesta para el correo de [quién] sobre [tema]. Tono [cercano / formal], máximo seis líneas. Si para responder necesitas un dato que no está en el correo, déjalo marcado así: [FALTA: lo que sea].
>
> Crea el borrador en mi Gmail, pero no lo envíes.

## Prompt · Busca en mi Drive

> Busca en mi Google Drive [lo que necesites: el documento de..., la hoja de...]. Dime cuáles has encontrado, de cuándo es cada uno y qué contiene en dos líneas. Si hay varias versiones, dime cuál parece la última.

## Prompt · Pregúntale al manual

> Usa solo este documento para responder. Si algo no está en el documento, dímelo en vez de completarlo.
>
> 1. ¿De qué va y a quién afecta?
> 2. ¿Qué plazos hay? Hazme una tabla.
> 3. ¿Hay algo que se contradiga entre dos partes del documento?
> 4. ¿Hay algo que se menciona pero no se explica?
> 5. Si entrara alguien nuevo, ¿qué cinco cosas le diría primero?
>
> Para cada respuesta, cítame el apartado exacto del documento del que sale.
>
> [adjunta manual-interno-ejemplo.pdf]

## Prompt · Prepara mi próxima reunión

Con calendario, Gmail y Drive encendidos.

> Mira cuál es mi próxima reunión en el calendario. Busca en mi correo los mensajes relacionados con esa reunión o con esas personas, y en mi Drive los documentos sobre ese tema.
>
> Prepárame una hoja de preparación: de qué va, qué se ha hablado antes por correo, qué documentos debería tener abiertos, qué temas siguen pendientes y tres preguntas que debería llevar.
>
> Dime de dónde sale cada cosa. No cambies nada en ningún sitio.

## Prompt · Con los correos de prueba

Si no puedes conectar Gmail.

> Te paso los correos de una semana de una persona. Dime cuáles esperan respuesta y siguen sin leer o sin contestar, quién los envía, de qué van y cuáles parecen urgentes. Ignora publicidad y newsletters.
>
> Después, prepárame un borrador de respuesta para el más urgente.
>
> [adjunta bandeja-entrada.csv]

## Descarga · Manual de ejemplo
archivo: dia-11-gmail-y-drive/manual-interno-ejemplo.md
Diez páginas de una empresa inventada, con dos trampas escondidas. Para subir a tu Drive o adjuntar.

## Descarga · Correos de prueba de una semana
archivo: _datos-de-prueba/bandeja-entrada.csv
120 correos inventados, por si no puedes conectar Gmail.
