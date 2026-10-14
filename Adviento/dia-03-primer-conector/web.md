# Tu primer conector
resumen: Conecta tu calendario y pídele a Claude un resumen útil de tu semana. Hay alternativa con datos de prueba.
datos: Tu calendario, o los correos de prueba si no puedes conectar nada

## Pasos

1. Abre los ajustes de conectores de Claude.
2. Conecta solo el calendario. Nada más, aunque te ofrezca el paquete entero.
3. Lee qué permisos pide antes de aceptar. Es lo que practicamos ayer.
4. Copia el prompt principal de este reto.
5. Comprueba que lo que te dice coincide con tu agenda real.
6. Termina con el prompt de comprobación: es la mitad del reto.

## ¿Por qué el calendario y no el correo?

El calendario no tiene adjuntos ni datos de clientes. Si algo sale raro, no hay nada que lamentar. El correo llegará más adelante, cuando ya sepas cómo funciona esto.

## Si no puedes conectar nada

Si tu empresa no lo permite o tu plan no lo incluye, no pasa nada: este reto también es para ti. Descarga los correos de prueba de una semana y pídele lo mismo sobre ese archivo. Aprendes exactamente lo mismo sin conectar nada.

## Cómo saber si ha salido bien

- Lo que resume coincide con lo que ves en tu agenda.
- Si una reunión no tiene un asunto claro, te lo dice en vez de inventarse de qué va.
- Sabes dónde se desconecta.

## La idea que debe quedarse

Un conector no le da acceso a toda tu vida: le da la llave de una puerta concreta, y la llave se devuelve cuando quieras.

## Prompt · El principal

> Mira mi calendario de esta semana y dime:
>
> 1. Cuántas horas tengo ocupadas en reuniones.
> 2. Qué día tengo más cargado y cuál más libre.
> 3. Si hay algún hueco de dos horas seguidas para trabajar sin interrupciones.
> 4. Si ves alguna reunión que no sé de qué va, dímelo en vez de suponerlo.
>
> No cambies nada en mi calendario. Solo quiero que me lo cuentes.

## Prompt · Para comprobar

> ¿De dónde has sacado cada cosa que me has dicho? Dime qué eventos has usado.

Así aprendes a pedirle cuentas en vez de fiarte a ciegas.

## Prompt · Si no puedes conectar nada

> Te paso un archivo con los correos de una semana. Dime cuántos son de clientes, cuántos son internos y cuántos son publicidad. Si alguno no sabes dónde ponerlo, déjalo aparte en vez de forzarlo.
>
> [adjunta bandeja-entrada.csv]

## Descarga · Correos de prueba de una semana
archivo: _datos-de-prueba/bandeja-entrada.csv
120 correos inventados, para practicar sin conectar nada.
