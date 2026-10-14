# Tu vigilante de la bandeja
resumen: Prepara un vigilante de la bandeja que detecte lo importante sin enviar nada por ti.
datos: Los correos de prueba para ensayar; tu correo para la versión real

## Lo más parecido a una automatización real

Hoy montas algo que revisa el correo solo, detecta lo que encaja con un criterio tuyo y te deja el borrador preparado. Sin herramientas de automatización: una tarea programada y un conector bastan.

## Pasos

1. **Ensaya primero** con los correos de prueba. Define tu criterio sobre datos falsos.
2. Afínalo hasta que clasifique como tú lo harías.
3. Convierte ese criterio en una tarea programada sobre tu correo real.
4. Ponla a revisar una vez al día, no cada hora.
5. Déjala una semana y luego decide.

## El ensayo es obligatorio

Nadie debería estrenar un criterio de clasificación sobre su correo real. Primero se prueba con datos falsos, se ve dónde falla y se corrige. Luego se suelta. Es exactamente lo que hace un equipo técnico antes de poner algo en marcha.

## El límite que no se cruza

**Prepara borradores. No envía nada.** La IA deja el trabajo hecho; tú aprietas el botón.

## Cómo saber si ha salido bien

- Clasifica como tú lo harías en 8 de cada 10 correos.
- Los casos dudosos los deja aparte en vez de forzarlos.
- Lo delicado, lo que nunca debería tratarse en automático, acaba en «revisar a mano».
- No envía nada.

## Prompt · Fase 1. Ensayo con datos falsos

> Te paso 120 correos de una semana de una oficina. Quiero montar un criterio para clasificarlos.
>
> Clasifícalos en:
> - **Responder hoy:** cliente o dirección esperando algo concreto
> - **Responder esta semana:** importante pero sin urgencia
> - **Informativo:** no necesita respuesta
> - **Ruido:** publicidad, newsletters
> - **Revisar a mano:** cualquier cosa que no encaje limpiamente, o que sea delicada
>
> Dime cuántos hay en cada grupo y, para los diez primeros, por qué los has puesto ahí.
>
> [adjunta bandeja-entrada.csv]

## Prompt · Fase 2. Afinar

> [Correo X] no va en ese grupo, va en este otro, porque [tu razón]. Ajusta el criterio y vuelve a clasificar.

Repítelo hasta que clasifique como tú.

## Prompt · Fase 3. La pregunta de seguridad

> De todos estos correos, ¿cuáles **nunca** deberían tratarse de forma automática? ¿Por qué?

## Prompt · Fase 4. La tarea programada

Cuando el criterio funcione, esto va en la configuración de la tarea.

> Revisa una vez al día los correos nuevos de mi bandeja.
>
> Clasifícalos así: [pega tu criterio ya afinado].
>
> Para los de "responder hoy", prepárame un borrador de respuesta siguiendo mi tono habitual.
>
> **No envíes nada. No archives nada. No marques nada.** Solo clasifica, prepara los borradores y dime lo que hay.
>
> Si un correo pide cambiar datos bancarios, condiciones de pago o información de cuentas, **no prepares borrador**: ponlo aparte y avísame expresamente.
>
> Si dudas de dónde va algo, déjalo en "revisar a mano". Prefiero revisar de más que que se te escape algo.

## Descarga · Correos de prueba de una semana
archivo: _datos-de-prueba/bandeja-entrada.csv
120 correos inventados para ensayar tu criterio sin tocar tu bandeja.
