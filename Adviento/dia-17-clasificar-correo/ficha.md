# Día 17 · Clasifica tu correo

**Tipo:** 🎯 Reto
**Herramienta:** Claude (Gmail + tarea programada)
**Tiempo:** 25 minutos
**Datos:** `bandeja-entrada.csv` para el ensayo; su Gmail para la versión real
**Plan:** fases 1 a 4 en gratuito; la fase 5 (programar) es de pago, con alternativa

## Objetivo

Un sistema de clasificación de correo con criterio propio, montado como lo haría un equipo técnico: ensayo, afinado, prueba supervisada y automatización. Que entienda por qué no se salta fases.

## Lo que aprende

- Definir y afinar un criterio con su porqué.
- Ensayar con datos falsos antes de tocar los reales.
- Detectar el fraude del cambio de datos bancarios.
- Probar en Gmail real con supervisión, acotando a 3 días.
- Convertir el criterio en tarea programada con reglas que no se saltan.
- Entrega como borrador-parte + borradores de respuesta en hilo.

## Para comprobar el ensayo

`_solucion-bandeja.csv` tiene la categoría real de cada uno de los 120 correos (no se publica):

| Categoría real | Correos |
|---|---|
| cliente | 32 |
| comercial | 30 |
| interno | 26 |
| ruido | 12 |
| incidencia | 11 |
| sospechoso | 6 |
| cobros | 3 |

Los seis sospechosos son «Actualización de datos bancarios del proveedor». Si Claude no los pone en «Revisar a mano» a la primera, es buen material para el vídeo.

## Notas para ti

- Antes era el día 22 («Tu vigilante de la bandeja»). Se adelanta para que vaya justo después de la primera tarea programada, que es su base.
- El día 23 vuelve sobre esto con las tres zonas: el parte es verde, los borradores son ámbar y el fraude es rojo.
- La alternativa gratuita con palabra clave BANDEJA es igual que la del día 16 (HOY): que se note el patrón.

## Capturas que hacen falta

| Archivo | Qué tiene que salir |
|---|---|
| `d17-01-parte-bandeja.png` | El borrador del parte en Gmail con los grupos, los urgentes y el aviso de posible fraude (con datos de prueba o tapados) |

## Por verificar antes de publicar

- [ ] Que la tarea programada pueda crear borradores de respuesta dentro del hilo
- [ ] Que el conector de Gmail no pueda marcar como leído o archivar sin permiso (si puede, reforzar las reglas)
- [ ] Probar el criterio con la solución y anotar el porcentaje de acierto para el vídeo
