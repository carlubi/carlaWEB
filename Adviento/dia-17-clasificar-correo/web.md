# Clasifica tu correo
resumen: Juntas lo de los días 11 y 16: un criterio tuyo para ordenar el correo, ensayado primero con 120 correos de prueba, probado después en tu Gmail y convertido al final en una tarea que cada mañana te deja el parte de tu bandeja. Sin enviar nada por ti.
datos: Los correos de prueba para ensayar; tu Gmail para la versión real

## Lo más parecido a una automatización de verdad

Hoy montas algo que mucha gente paga a un consultor por montar: un sistema que revisa tu correo cada mañana, lo ordena según **tu** criterio, te dice qué no puede esperar, te avisa de lo sospechoso y te deja los borradores de lo urgente preparados.

Sin herramientas de automatización ni programación: un conector (día 11), una tarea programada (día 16) y un buen criterio.

## Por qué en cuatro fases

Porque nadie debería estrenar un criterio sobre su correo real. Lo que hacen los equipos técnicos antes de poner algo en marcha es exactamente esto, y lo vas a hacer tú:

1. **Ensayo con datos falsos:** defines el criterio sin riesgo.
2. **Afinado:** corriges donde falla.
3. **Prueba en real, con supervisión:** en un chat, tú delante.
4. **Automatización:** cuando ya te fías, lo programas.

Saltarse fases es la forma más rápida de acabar con un sistema que no usas o, peor, que hace algo que no querías.

## Fase 1 · Ensayo con 120 correos falsos

1. Descarga los correos de prueba. Son de una semana de diciembre de una oficina inventada, con de todo: clientes, compañeros, publicidad, incidencias... y **seis correos sospechosos** escondidos.
2. En un chat nuevo, adjúntalos con el prompt «Fase 1».
3. Mira los grupos que salen y las razones de los diez primeros. ¿Los habrías puesto tú ahí?

Las cinco categorías del prompt son un punto de partida. Si tu vida es otra (eres estudiante, tienes un negocio, llevas una comunidad de vecinos), cámbialas por las tuyas.

## Fase 2 · Afina el criterio

Cuando algo no esté donde tú lo pondrías, díselo con el prompt «Fase 2» y **explica por qué**. Ese porqué es lo que convierte una regla suelta en un criterio que aplica bien a casos nuevos (lo viste el día 8 con las normas de Barro Lento).

Repite hasta que clasifique como tú en, más o menos, **8 de cada 10 correos**. Perfecto no va a ser, y no hace falta: para eso está la categoría «revisar a mano».

Cuando el resultado te convenza, usa el prompt «Fase 2b» para que te escriba **el criterio final** en limpio. Guárdalo: es lo que vas a programar.

## Fase 3 · La pregunta de seguridad

Usa el prompt «Fase 3». En los correos de prueba hay seis que piden **cambiar datos bancarios**. Es una de las estafas más comunes: alguien se hace pasar por un proveedor y pide que le pagues a otra cuenta. Ninguna automatización debería tratar eso como un correo normal.

Si Claude no los detecta todos, añade una regla expresa al criterio.

## Fase 4 · Prueba en tu correo real (con supervisión)

Ahora sí, tu Gmail. Pero todavía en un chat, contigo delante:

1. Chat nuevo. En **+** › **Conectores**, enciende **solo Gmail**.
2. Usa el prompt «Fase 4» con tu criterio pegado. Le pides los últimos tres días, no todo el año.
3. Revisa lo que te dice abriendo tu bandeja. ¿Cuadra?
4. Si te propone borradores, mira el aviso de permiso antes de aceptar.

Si algo falla, vuelve a la fase 2 con ese correo como ejemplo.

## Fase 5 · Convertirlo en tarea programada

Cuando lleves un par de pruebas buenas, prográmalo como aprendiste el día 16:

1. **Nueva tarea** › **Configurar manualmente** (o desde un chat, si tienes la versión nueva).
2. **Nombre:** «Parte de la bandeja».
3. **Instrucciones:** el prompt «La tarea: parte de la bandeja», con tu criterio pegado dentro.
4. **Frecuencia:** entre semana, a primera hora.
5. **Modelo:** Sonnet.
6. Guarda y pulsa **ejecutar ahora** para probarla.
7. Mira tus **Borradores** de Gmail: tendrás el parte de la bandeja y, si había algo urgente, los borradores de respuesta.

![Un borrador en Gmail con el parte de la bandeja: grupos de correos, urgentes y aviso de correos sospechosos](capturas/d17-01-parte-bandeja.png)

## El límite que no se cruza

**Prepara borradores. No envía, no archiva, no borra, no marca nada.** Clasifica, te cuenta y te deja el trabajo preparado. Tú aprietas el botón.

Mañana por la mañana abres un solo correo y sabes cómo está tu bandeja. Eso es todo. Y es muchísimo.

## Si estás en el plan gratuito

Haz las fases 1 a 4 igual. Para la 5, crea un proyecto llamado **Mi bandeja**, pega tu criterio en las instrucciones con este final: "Cuando escriba BANDEJA, revisa mi correo de las últimas 24 horas y dame el parte". Cada mañana, abres el proyecto con Gmail encendido y escribes **BANDEJA**.

## Cómo saber si ha salido bien

- En el ensayo, clasifica como tú en 8 de cada 10 correos.
- Ha detectado los seis correos de datos bancarios.
- Los dudosos van a «revisar a mano» en vez de forzarse.
- La tarea programada te ha dejado el parte en Borradores.
- No ha enviado, archivado ni marcado nada.

## Palabras del día

- **Criterio de clasificación:** las reglas, con su porqué, para decidir dónde va cada cosa.
- **Ensayo (o entorno de pruebas):** probar con datos falsos antes de tocar los reales.
- **Phishing o fraude del proveedor:** correo que se hace pasar por alguien conocido para que pagues a otra cuenta.

## Prompt · Fase 1. Ensayo con datos falsos

> Te paso 120 correos de una semana de una oficina. Quiero montar un criterio para clasificarlos.
>
> Clasifícalos en:
> - **Responder hoy:** alguien espera algo concreto y es urgente
> - **Responder esta semana:** importante pero sin urgencia
> - **Informativo:** no necesita respuesta
> - **Ruido:** publicidad y newsletters
> - **Revisar a mano:** cualquier cosa que no encaje limpiamente, o que sea delicada
>
> Dime cuántos hay en cada grupo y, para los diez primeros correos, en qué grupo los has puesto y por qué.
>
> [adjunta bandeja-entrada.csv]

## Prompt · Fase 2. Afinar

> El correo [asunto o remitente] no va en ese grupo, va en [el grupo correcto], porque [tu razón]. Ajusta el criterio con esta regla y vuelve a clasificarlos todos. Dime qué correos han cambiado de grupo.

Repítelo hasta que clasifique como tú.

## Prompt · Fase 2b. El criterio en limpio

> Escríbeme el criterio de clasificación final en markdown, con cada categoría, qué entra en ella, las reglas que hemos añadido y su porqué, y qué hacer con los casos dudosos. Lo voy a usar como instrucciones de una tarea programada.

## Prompt · Fase 3. La pregunta de seguridad

> De todos estos correos, ¿cuáles **nunca** deberían tratarse de forma automática? ¿Por qué? Fíjate especialmente en peticiones de cambio de datos bancarios, pagos o accesos.

## Prompt · Fase 4. Prueba en tu correo real

Con Gmail encendido, en un chat nuevo.

> Revisa los correos que he recibido en los últimos 3 días y clasifícalos con este criterio:
>
> [pega tu criterio en limpio]
>
> Dime cuántos hay en cada grupo y, de los de «Responder hoy» y «Revisar a mano», quién los envía y de qué van.
>
> No envíes, no archives, no marques y no borres nada.

## Prompt · La tarea: parte de la bandeja

Esto va en las instrucciones de la tarea programada.

> Revisa los correos que he recibido en las últimas 24 horas (si es lunes, desde el viernes).
>
> Clasifícalos con este criterio:
>
> [pega tu criterio en limpio]
>
> **Reglas que no se saltan:**
>
> - No envíes, no archives, no marques como leído y no borres nada.
> - Si un correo pide cambiar datos bancarios, condiciones de pago, contraseñas o accesos, **no prepares borrador**: ponlo el primero del parte con la etiqueta «⚠️ POSIBLE FRAUDE · REVISAR».
> - Si dudas de dónde va algo, a «Revisar a mano». Prefiero revisar de más que que se te escape algo.
>
> **Entrega:**
>
> 1. Crea un borrador en mi Gmail dirigido a [tu correo] con el asunto «📬 Parte de la bandeja · [fecha de hoy]». Dentro: primero los avisos de posible fraude, luego cuántos correos hay en cada grupo y, para «Responder hoy» y «Revisar a mano», quién, de qué va en una línea y por qué está ahí.
> 2. Para cada correo de «Responder hoy», crea además un borrador de respuesta en el hilo de ese correo, con un tono [cercano / profesional] y dejando marcado [FALTA: lo que sea] si necesitas un dato que no tienes. No lo envíes.

## Descarga · Correos de prueba de una semana
archivo: _datos-de-prueba/bandeja-entrada.csv
120 correos inventados para ensayar tu criterio sin tocar tu bandeja.
