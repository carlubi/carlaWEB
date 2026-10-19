# Día 10 · Conecta tu calendario

**Tipo:** 🎯 Reto
**Herramienta:** Claude (conectores)
**Tiempo:** 20 minutos
**Datos:** su Google Calendar, o `agenda-semana.csv` si no puede conectar
**Plan:** gratuito

## Objetivo

El primer conector de principio a fin: conectar, autorizar, encender en un chat, leer, pedir cuentas, crear un evento con permiso, apagar y desconectar. Que vea con sus ojos la diferencia entre leer y actuar.

## Lo que aprende

- Personalizar › Conectores › + › directorio › Google Calendar › Conectar.
- OAuth: elegir cuenta, leer permisos, permitir. Claude no ve la contraseña.
- Encender y apagar por chat.
- El recuadro de uso de herramienta: ver qué ha consultado.
- El aviso de permiso al crear un evento; "permitir una vez".
- Desconectar en Claude y revocar en Google.

## La agenda de prueba (para comprobar)

`agenda-semana.csv` tiene 30 eventos del 14 al 18 de diciembre de 2026, con trampas:

- **Tres "Reunión" sin descripción:** lunes 16:00, miércoles 9:30 y viernes 10:00. Debe decir que no sabe de qué van.
- **Un solape:** miércoles, «Sincro rápida» 16:00-16:30 y «Entrevista candidata» 16:15-17:00.
- **Día más cargado:** miércoles. **Más libre:** jueves.
- **Huecos de 2 h o más (entre 8:30 y 18:00):** lunes 14:00-16:00, jueves 9:30-12:00 y 14:00-16:30, viernes 13:30-17:00.
- **Necesitan preparación:** formación de datos (portátil con cámara), presentación Grupo Nadal (propuesta impresa), taller de planificación (tres objetivos), entrevista (revisar CV), cierre de facturación, firma del alquiler (DNI y fianza), revisión con dirección (resumen del año), revisar contrato antes del jueves.

## Notas para ti

- Antes era el día 3. Ahora llega con proyectos, contexto y la teoría de conectores hechos.
- El paso 8 (crear evento) es nuevo y es el que más enseña: ver el aviso de permiso con los detalles quita el miedo y a la vez enseña a leerlo.
- El momento del vídeo es la pantalla de Google: leerla en voz alta y decir "esto es lo único que puede hacer".

## Capturas que hacen falta

| Archivo | Qué tiene que salir |
|---|---|
| `d10-01-directorio-calendar.png` | Directorio de conectores con Google Calendar abierto y su descripción |
| `d10-02-google-oauth.png` | Pantalla de autorización de Google con los permisos (tapar el correo) |
| `d10-03-calendar-conectado.png` | Personalizar › Conectores con Google Calendar conectado |
| `d10-04-uso-herramienta.png` | Una respuesta con el recuadro de consulta al calendario desplegado |
| `d10-05-permiso-crear-evento.png` | El aviso de permiso para crear el evento «Tiempo para mí» |
| `d10-06-desconectar.png` | La ficha del conector con el botón de desconectar |

## Por verificar antes de publicar

- [ ] Que crear eventos pida aprobación por defecto (si no la pide, cambiar el paso 8 y avisar)
- [ ] Textos de los botones del directorio y de la ficha del conector en español
- [ ] Que Google Calendar esté en el directorio y no solo como conector "integrado" activado de serie
- [ ] Qué permisos exactos enseña la pantalla de Google
