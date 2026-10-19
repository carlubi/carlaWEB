# Conectores sin miedo
resumen: Qué es un conector, qué puede ver y hacer Claude cuando conectas tu correo o tu calendario, dónde están todos y cómo se controlan los permisos. Hoy no conectas nada: lo entiendes para hacerlo mañana con calma.
datos: Hoy no se conecta nada

## Hasta ahora, Claude vivía en una burbuja

Todo lo que ha sabido estos días es lo que tú le has escrito o adjuntado. No ve tu correo, ni tu agenda, ni tus documentos de Drive. Para que trabaje con tus cosas tienes que copiar y pegar.

Un **conector** rompe esa burbuja: le da a Claude acceso a una herramienta tuya (Gmail, Google Calendar, Google Drive, Notion, Slack...) para que lea lo que necesita y, si le dejas, haga cosas por ti.

La imagen que me gusta: **le das una llave de una puerta concreta**, no de toda la casa. Y la llave se devuelve cuando quieras.

## Cómo funciona por dentro (sin agobiarse)

Los conectores de Claude funcionan con algo llamado **MCP** (*Model Context Protocol*). Es un estándar abierto que publicó Anthropic en 2024 para que cualquier IA pueda hablar con cualquier herramienta de la misma manera. Hay quien lo llama "el USB-C de la IA": un enchufe único que vale para todo.

Lo que te importa saber:

- Cada conector ofrece a Claude unas **herramientas** concretas. Por ejemplo, el de Gmail: buscar correos, leer un correo, crear un borrador.
- Claude **decide cuándo usarlas** según lo que le pidas. Si le preguntas "¿qué tengo mañana?", usa la de calendario. Si le pides un poema, no toca nada.
- Solo accede a lo que **tú ya puedes ver** en esa herramienta. No se salta permisos.
- Cuando usa un conector, lo ves en el chat: aparece un recuadro con lo que ha consultado.

## Leer no es lo mismo que actuar

Esta es la distinción más importante del día.

- **Leer:** buscar correos, ver tus eventos, abrir un documento. Si se equivoca, no pasa nada: te lo cuenta mal y lo corriges.
- **Escribir o actuar:** crear un evento, preparar un borrador, mover un archivo, enviar algo. Aquí sí puede tener consecuencias.

Por eso, cuando Claude quiere hacer algo que cambia tus cosas, **te pide permiso** con un aviso en el chat. Normalmente verás opciones del estilo **permitir una vez**, **permitir siempre** o **denegar**.

![El aviso de Claude pidiendo permiso para usar una herramienta de un conector, con las opciones de permitir una vez, permitir siempre y denegar](capturas/d09-01-aviso-permiso.png)

Mi consejo para todo el calendario: **permitir una vez**. "Permitir siempre" es cómodo, pero quita la parada en la que tú miras qué va a hacer. Ya habrá tiempo de darle más confianza cuando lo conozcas.

## Qué puede hacer cada conector de Google

Los que vamos a usar estos días, y que están disponibles para todo el mundo, también en el gratuito:

| Conector | Qué puede hacer | Qué no |
|---|---|---|
| **Google Calendar** | Ver tus eventos y calendarios compartidos, buscar huecos, crear, cambiar y borrar eventos, responder a invitaciones | Nada fuera de tu calendario |
| **Gmail** | Buscar y leer correos, crear borradores. Enviar, responder o reenviar solo con tu aprobación | Leer el contenido de los adjuntos (solo ve que existen) |
| **Google Drive** | Buscar y leer documentos, hojas de cálculo, presentaciones, PDFs y textos | Ver las imágenes de dentro de los documentos (solo lee el texto) |

## Dónde están todos los conectores

Todo se gestiona desde un sitio. Apúntatelo:

1. En la barra lateral, entra en **Personalizar** y luego en **Conectores**. O ve directo a **claude.ai/customize/connectors**.
2. Ahí ves **los que ya tienes conectados**.
3. Con el botón **+** junto a «Conectores» abres el **directorio**: todos los conectores disponibles, por categorías.

![La página de Conectores con la lista de conectados y el botón + para abrir el directorio](capturas/d09-02-pagina-conectores.png)

También llegas desde cualquier chat: botón **+** (abajo a la izquierda de la caja) › **Conectores** › **Gestionar conectores**.

## Encendido y apagado en cada chat

Tener un conector conectado no quiere decir que esté encendido siempre. En cada conversación puedes elegir cuáles usa:

1. Pulsa el **+** de la caja de texto (o escribe `/`).
2. Pasa el ratón por **Conectores**.
3. Activa o desactiva cada uno con su interruptor.

![El menú + del chat con el apartado Conectores desplegado y los interruptores de cada uno](capturas/d09-03-menu-conectores-chat.png)

Es una buena costumbre: si en este chat solo necesitas el calendario, apaga el correo. Menos acceso, menos sustos. Y menos gasto: cada consulta a un conector consume uso (día 2).

## Cómo se quita el acceso

Dos niveles, y conviene saber los dos:

- **En Claude:** Personalizar › Conectores › pulsas el conector › **Desconectar** › confirmas.
- **En Google, para cortar del todo:** entra en **myaccount.google.com/connections**, busca Claude y elimina la conexión. Esto es lo que garantiza que no queda ninguna puerta abierta.

## Si usas una cuenta de empresa o de la universidad

Si tu correo es del trabajo o de tu centro de estudios (Google Workspace), puede que al conectar te salga **"Acceso bloqueado"**. No es un fallo tuyo: el administrador de tu organización tiene que autorizar a Claude. Pregunta a quien lleve la informática. Y si te dicen que no, no pasa nada: los retos tienen alternativa con datos de prueba, o puedes usar tu Gmail personal.

Si tu empresa tiene Claude de pago (Team o Enterprise), además alguien tiene que haber activado los conectores para toda la organización.

## Las cuatro preguntas antes de conectar nada

1. **¿Qué puede ver exactamente?** ¿Todo el correo o solo lo que le pida?
2. **¿Solo lee o también actúa?** ¿Qué acciones me va a pedir aprobar?
3. **¿Dónde se quita el acceso?** En Claude y en Google.
4. **¿Hay alguna norma** en mi empresa o centro sobre esto?

Si no sabes alguna, espera. Mejor un día tarde que con miedo.

## El reto de hoy (cinco minutos)

1. Entra en **Personalizar › Conectores**.
2. Abre el directorio con el **+** y date una vuelta. Mira qué conectores hay para herramientas que tú usas.
3. Pulsa uno (el de Google Calendar, por ejemplo) y lee su descripción y qué puede hacer. **No pulses conectar todavía.**
4. Abre un chat, pulsa **+** y localiza dónde está el menú de conectores.
5. Responde a las cuatro preguntas para tu calendario. Mañana lo conectamos.

## Cómo saber si ha salido bien

- Sabes llegar a la página de conectores por los dos caminos.
- Sabes la diferencia entre leer y actuar, y qué significa "permitir una vez".
- Sabes cómo se desconecta en Claude y en Google.

## Palabras del día

- **Conector:** la llave que deja a Claude entrar en una herramienta tuya.
- **MCP:** el estándar con el que funcionan los conectores. El enchufe universal.
- **Herramienta (de un conector):** cada cosa concreta que el conector deja hacer: buscar, leer, crear.
- **OAuth:** la pantalla de Google en la que autorizas el acceso. La verás mañana.
- **Revocar:** quitar un permiso que diste.

## Descarga · Checklist de permisos
archivo: dia-09-conectores/checklist-permisos.md
Para repasar antes de dar acceso a Claude o a cualquier otra app.
