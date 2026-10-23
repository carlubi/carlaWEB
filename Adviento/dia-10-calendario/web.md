# Conecta tu calendario
resumen: Tu primer conector, paso a paso: conectar Google Calendar, autorizarlo, encenderlo en un chat, usarlo para entender tu semana, crear un evento con tu permiso, apagarlo y desconectarlo. Si no puedes conectar nada, hay agenda de prueba.
datos: Tu Google Calendar, o la agenda de prueba si no puedes conectar
tipo: Reto
herramienta: Claude (conectores)
minutos: 20

## Por qué empezamos por el calendario

Es el conector más agradecido para estrenarse. No tiene adjuntos ni datos de clientes, lo que ve ya lo conoces de memoria (así compruebas al momento si acierta) y si algo sale raro, no hay nada que lamentar. El correo llega mañana, cuando ya domines el mecanismo.

Ayer viste la teoría. Hoy, con las manos.

## Parte 1 · Conectarlo

### Paso 1 · Ve a los conectores

En la barra lateral entra en **Personalizar** › **Conectores**.

### Paso 2 · Busca Google Calendar

Pulsa el **+** junto a «Conectores» para abrir el directorio. Busca **Google Calendar** (está en las categorías de productividad, o escríbelo en el buscador). Púlsalo y lee qué puede hacer.

![La ficha de Google Calendar en Conectores, con su descripción y las herramientas disponibles](capturas/d10-01-directorio-calendar.png)

### Paso 3 · Pulsa Conectar

Te lleva a una pantalla de Google. Esto se llama **OAuth**: es la forma estándar de dar acceso a una app sin darle tu contraseña. Claude nunca ve tu contraseña de Google.

1. **Elige la cuenta.** Si tienes varias (personal y trabajo), fíjate bien en cuál.
2. **Lee los permisos.** Google te dice qué va a poder hacer Claude: ver y editar eventos de tus calendarios.
3. **Pulsa Permitir** (o Continuar).

La captura muestra el inicio de la autorización. Después de pulsar **Continuar**, revisa los permisos antes de aceptarlos.

![La pantalla de Google para continuar el inicio de sesión en Claude con la cuenta elegida](capturas/d10-02-google-oauth.png)

Si te sale **"Acceso bloqueado"**, es una cuenta de empresa o de centro de estudios y tu administrador tiene que autorizar a Claude (lo vimos ayer). Usa tu cuenta personal o salta a la parte de "Si no puedes conectar".

### Paso 4 · Comprueba que está

Vuelves a Claude. En **Personalizar › Conectores** ya aparece Google Calendar como conectado.

![La página de conectores con Google Calendar en la lista de conectados](capturas/d10-03-calendar-conectado.png)

## Parte 2 · Usarlo

### Paso 5 · Enciéndelo en un chat

1. Abre un **Nuevo chat**.
2. Pulsa el **+** de la caja de texto › **Conectores**.
3. Comprueba que **Google Calendar** tiene el interruptor encendido. Si tienes otros conectores, apágalos para este chat.

### Paso 6 · Tu primera pregunta

Copia el prompt «Mi semana». Cuando Claude consulte tu calendario, verás en el chat un recuadro que indica que está usando la herramienta del calendario. Puedes desplegarlo para ver qué ha consultado exactamente.

![Una respuesta de Claude con el recuadro desplegable que muestra la consulta al calendario](capturas/d10-04-uso-herramienta.png)

### Paso 7 · Pídele cuentas

Usa el prompt «Para comprobar». Es la mitad del reto: aprender a no fiarte a ciegas y a pedirle de dónde ha sacado cada cosa. Compáralo con lo que ves en tu Google Calendar.

### Paso 8 · Que haga algo (con tu permiso)

Hasta aquí solo ha leído. Ahora vas a ver qué pasa cuando quiere **actuar**. Usa el prompt «Un bloque para ti»: le pides que te reserve un hueco en la agenda.

Antes de crear nada, Claude te pedirá permiso con un aviso. Lee qué va a hacer (qué día, qué hora, qué título) y elige **permitir una vez**. Luego mira tu Google Calendar: ahí está.

![El aviso de Claude pidiendo permiso para crear un evento en el calendario, con los detalles del evento](capturas/d10-05-permiso-crear-evento.png)

Si no lo quieres, bórralo desde Google Calendar como cualquier otro evento. O pídele a Claude que lo borre, y verás que también te pide permiso.

## Parte 3 · Apagarlo y desconectarlo

### Apagarlo en un chat

**+** › **Conectores** › apaga el interruptor. Ese chat deja de ver tu calendario. Los demás chats no se enteran.

### Desconectarlo del todo

1. **Personalizar** › **Conectores**.
2. Pulsa **Google Calendar**.
3. **Desconectar** y confirma.

![La ficha del conector de Google Calendar con el botón de desconectar](capturas/d10-06-desconectar.png)

Para cortarlo también desde Google: **myaccount.google.com/connections** › Claude › eliminar conexión.

No hace falta que lo desconectes hoy: lo vas a usar en los próximos días. Pero tienes que saber dónde está.

## Si no puedes conectar nada

Si tu cuenta es de empresa y no te dejan, o prefieres no hacerlo todavía, este reto también es para ti. Descarga la agenda de prueba (una semana inventada de una persona con trabajo, críos y vida) y adjúntala en un chat con el prompt «Con la agenda de prueba». Aprendes lo mismo: a preguntarle a una agenda y a comprobar lo que te dice.

## Cómo saber si ha salido bien

- Lo que te resume coincide con tu agenda real.
- Si una reunión no tiene descripción, te lo dice en vez de inventarse de qué va.
- Has visto el aviso de permiso antes de crear el evento.
- Sabes dónde se apaga en un chat y dónde se desconecta.

## La idea que se queda

Un conector no le da acceso a toda tu vida: le da la llave de una puerta, y tú decides cuándo puede abrirla y cuándo la devuelve.

## Palabras del día

- **OAuth:** la pantalla de Google donde autorizas el acceso sin dar tu contraseña.
- **Llamada a herramienta:** cuando Claude usa un conector. Lo ves en el recuadro del chat.
- **Permiso de escritura:** el que deja crear, cambiar o borrar. Siempre con tu visto bueno.

## Prompt · Mi semana

> Mira mi calendario de esta semana y dime:
>
> 1. Cuántas horas tengo ocupadas en total.
> 2. Qué día tengo más cargado y cuál más libre.
> 3. Si hay algún hueco de dos horas seguidas para concentrarme sin interrupciones.
> 4. Si hay algo que se solape.
> 5. Qué eventos necesitan que prepare algo antes.
> 6. Si ves algún evento que no sé de qué va (sin descripción o con un título genérico), dímelo en vez de suponerlo.
>
> No cambies nada en mi calendario. Solo quiero que me lo cuentes.

## Prompt · Para comprobar

> ¿De dónde has sacado cada cosa que me has dicho? Dime qué eventos has usado para cada respuesta, con día y hora.

## Prompt · Un bloque para ti

> Busca en mi calendario de la semana que viene un hueco de una hora y media que esté libre por la mañana y crea un evento llamado «Tiempo para mí · no molestar». Antes de crearlo, dime qué día y a qué hora lo vas a poner.

## Prompt · Con la agenda de prueba

Si no puedes conectar nada.

> Te paso la agenda de una semana de una persona. Dime:
>
> 1. Cuántas horas tiene ocupadas en total.
> 2. Qué día está más cargado y cuál más libre.
> 3. Si hay algún hueco de dos horas seguidas para trabajar sin interrupciones.
> 4. Si hay algo que se solape.
> 5. Qué eventos necesitan que prepare algo antes.
> 6. Qué eventos no se sabe de qué van. No te lo inventes.
>
> Después, dime de qué filas has sacado cada respuesta.
>
> [adjunta agenda-semana.csv]

## Descarga · Agenda de prueba
archivo: _datos-de-prueba/agenda-semana.csv
Una semana inventada con trabajo, críos, gimnasio y una cena de Navidad. Para practicar sin conectar nada.
