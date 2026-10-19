# De reunión a próximos pasos
resumen: De unas notas hechas un desastre a un acta con tareas, responsables y lo que quedó en el aire. Y luego, con los conectores, Claude mira tu agenda, te propone los eventos y te deja el correo para el equipo preparado. Tú apruebas cada paso.
datos: Las notas de ejemplo, o notas tuyas sin datos personales

## Lo que se pierde al salir de una reunión

Da igual que sea una reunión de trabajo, la del AMPA, la junta de la comunidad o la de la asociación: todo el mundo sale con notas a trozos y la sensación de que algo se va a perder. Normalmente se pierde. Lo que nadie apuntó como tarea, nadie lo hace.

Hoy conviertes unas notas desordenadas en un acta útil. Y das un paso más que en días anteriores: Claude no solo lee tus herramientas, sino que **propone cambios en ellas** (eventos, borradores) y tú los apruebas uno a uno. Es el ensayo general de lo que veremos mañana: quién decide qué.

## Pasos

### Paso 1 · Las notas

Descarga las notas de ejemplo: una reunión inventada de una oficina, escrita como se escriben las notas de verdad, con abreviaturas, sin orden y con cosas a medias. O usa notas tuyas de una reunión reciente, quitando nombres y datos personales (semáforo del día 1).

### Paso 2 · El acta

Chat nuevo, adjunta las notas y usa el prompt «El acta». Fíjate en cómo trata lo que no está claro: ¿lo marca o se lo inventa?

### Paso 3 · Mira los cabos sueltos

Esta es la parte que vale oro. Un acta normal recoge lo que se dijo. Lo útil es lo que **no** se dijo: la tarea sin dueño, la fecha que nadie fijó, la decisión que se dejó para "ya lo hablamos". Las notas de ejemplo tienen al menos cinco cosas así. ¿Cuántas encuentra?

Detectarlas es lo que te convierte en la persona que se da cuenta. Y eso se nota.

### Paso 4 · Crúzalo con tu agenda

En el mismo chat, enciende **Google Calendar** (**+** › **Conectores**) y usa el prompt «Cruza con mi agenda». Primero solo mira y te propone.

### Paso 5 · Que cree los eventos, con tu permiso

Si las propuestas te encajan, usa el prompt «Crea los eventos». Claude te pedirá permiso para **cada evento**. Lee el aviso (día, hora, título) antes de aceptar. Si alguno está mal, deniégalo y dile por qué.

![El aviso de permiso para crear un evento a partir del acta, con día, hora y título visibles](capturas/d22-01-permiso-evento-acta.png)

### Paso 6 · El correo para el equipo

Enciende **Gmail** y usa el prompt «El correo para el equipo». Te dejará un borrador en Gmail. Revísalo, pon tú los destinatarios y envíalo cuando quieras.

### Paso 7 · Llévate el acta

Pídele el acta como archivo descargable (Word o markdown) para guardarla donde guardes estas cosas.

## Cómo saber si ha salido bien

- Cada tarea tiene dueño y fecha, o está marcada como "sin asignar" o "sin fecha".
- No se ha inventado ningún responsable ni ninguna fecha.
- Ha encontrado al menos cuatro cabos sueltos.
- Ha detectado el correo que pedía cambiar una cuenta bancaria y lo trata como asunto delicado.
- Has aprobado cada evento uno a uno, leyendo el aviso.
- Tienes un borrador del correo en Gmail, sin enviar.

## La idea que se queda

La IA puede tocar tus herramientas, pero cada cambio pasa por tus ojos. Esa parada de un segundo antes de aceptar es lo que te deja delegar sin miedo.

## Palabras del día

- **Acta:** lo que se decidió, quién hace qué y para cuándo.
- **Cabo suelto:** lo que se habló y no quedó asignado ni decidido.
- **Acción con aprobación:** cuando Claude propone un cambio en tus herramientas y espera tu sí.

## Prompt · El acta

> Te paso mis notas de una reunión. Están desordenadas, tal cual las escribí.
>
> Conviértelas en un acta con estas partes:
>
> **1. Decisiones tomadas.** Solo lo que quedó decidido de verdad.
>
> **2. Tareas.** Qué hay que hacer, quién lo hace y para cuándo. Si no se dijo quién o cuándo, escribe "sin asignar" o "sin fecha". **No lo rellenes tú.**
>
> **3. Cabos sueltos.** Lo que se habló y quedó en el aire: preguntas sin responder, decisiones aplazadas, temas que nadie recogió.
>
> **4. Asuntos delicados.** Cualquier cosa que no deba tratarse de forma rutinaria.
>
> **5. Para la próxima.** Lo que hay que traer resuelto.
>
> No inventes nada que no esté en las notas. Si algo no se entiende, dímelo al final en vez de interpretarlo.
>
> [adjunta notas-reunion-ejemplo.pdf]

## Prompt · Cruza con mi agenda

Con Google Calendar encendido.

> Mira mi calendario de las próximas dos semanas. De las tareas y reuniones del acta que tienen fecha, dime cuáles chocan con lo que ya tengo y propón día y hora para la revisión semanal y para la próxima reunión.
>
> **No crees nada todavía.** Solo dime qué propones.

## Prompt · Crea los eventos

> Vale, crea en mi calendario los eventos que me has propuesto. Uno a uno, para que pueda revisar cada aviso antes de aceptar. En la descripción de cada evento pon a qué punto del acta corresponde.

## Prompt · El correo para el equipo

Con Gmail encendido.

> Ahora prepárame el correo para mandar el acta al equipo. Breve, que se lea en el móvil, con las tareas de cada persona bien visibles y los cabos sueltos al final como "temas pendientes de asignar".
>
> Crea el borrador en mi Gmail sin destinatarios, que los pongo yo. No lo envíes.

## Descarga · Notas de reunión de ejemplo
archivo: dia-22-reunion/notas-reunion-ejemplo.md
copiar: sí
Notas desordenadas de una reunión inventada. Puedes adjuntarlas o pegarlas.
