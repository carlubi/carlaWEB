# Día 22 · El vigilante

## Fase 1 — Ensayo con datos falsos

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
> [adjunta `bandeja-entrada.csv`]

## Fase 2 — Afinar

> [Correo X] no va en ese grupo, va en este otro, porque [tu razón]. Ajusta el criterio y vuelve a clasificar.

Repítelo hasta que clasifique como tú.

## Fase 3 — La pregunta de seguridad

> De todos estos correos, ¿cuáles **nunca** deberían tratarse de forma automática? ¿Por qué?

## Fase 4 — La tarea programada

Cuando el criterio funcione, esto va en la configuración:

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

---

## Los seis correos del archivo

Hay seis mensajes pidiendo actualizar los datos bancarios de un proveedor. Es un caso real y conocido de fraude.

Por eso la instrucción de la fase 4 los excluye expresamente. Y por eso la fase 3 existe: para que lo descubra ella antes de que se lo digamos.

## Notas para ti, Carla

- "Prefiero revisar de más que que se te escape algo" es la frase que hay que repetir. Una automatización que duda y pregunta vale más que una que acierta el 90 % y mete la pata en el 10 restante sin avisar.
- Las tres negaciones juntas (no envíes, no archives, no marques) son lo que le deja dormir tranquila. Que salgan en pantalla en el vídeo.
