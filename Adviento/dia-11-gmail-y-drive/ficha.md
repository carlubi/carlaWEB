# Día 11 · Tu correo y tus documentos

**Tipo:** 🎯 Reto
**Herramienta:** Claude (Gmail y Drive)
**Tiempo:** 25 minutos
**Datos:** su Gmail y su Drive, o `bandeja-entrada.csv` y `manual-interno-ejemplo.md`
**Plan:** gratuito

## Objetivo

Conectar Gmail y Drive (el mecanismo ya se conoce del día 10) y aprender lo útil: quién espera respuesta, preparar un borrador con permiso, buscar en Drive, preguntarle a un documento comprobando las citas y, al final, cruzar las tres fuentes.

## Lo que aprende

- Qué hace y qué no hace cada conector (adjuntos, imágenes, permisos de Google).
- Que enviar requiere aprobación; por defecto prepara borradores.
- Encender solo el conector que toca en cada chat.
- Añadir desde Google Drive a un chat y a un proyecto.
- Preguntarle a un documento y comprobar la cita (sustituye al antiguo día de NotebookLM).
- Cruzar calendario, correo y Drive.

## Las dos trampas del manual

1. **Contradicción:** el apartado 3.2 dice que los gastos se presentan en **15 días naturales**; el Anexo B dice **30 días**.
2. **Procedimiento sin definir:** el 3.3 dice que los gastos pasan por "el procedimiento de aprobación correspondiente", que no se explica en ningún sitio.

Bonus que suele salir: los datos bancarios de un proveedor nunca se cambian por correo (vuelve en el día 17).

## Notas para ti

- El manual se descarga en PDF: es lo que la mayoría subirá a Drive. Drive lee PDFs.
- El nombre del adjunto en el prompt es `manual-interno-ejemplo.pdf` porque así se llama la descarga.
- Si en la prueba Gmail tarda o falla con bandejas grandes, insiste en el vídeo en darle pistas (quién, cuándo, tema).

## Capturas que hacen falta

| Archivo | Qué tiene que salir |
|---|---|
| `d11-01-tres-conectados.png` | Personalizar › Conectores con Calendar, Gmail y Drive conectados |
| `d11-02-anadir-desde-drive.png` | Menú + del chat con «Añadir desde Google Drive» y el buscador |
| `d11-03-permiso-borrador.png` | El aviso de permiso para crear el borrador en Gmail |
| `d11-04-borrador-en-gmail.png` | La carpeta Borradores de Gmail con el borrador (tapar datos) |

## Por verificar antes de publicar

- [ ] Que crear borradores en Gmail pida aprobación o no (ajustar el paso 2)
- [ ] Texto exacto de «Añadir desde Google Drive» en español
- [ ] Que los archivos de Drive se puedan añadir a proyectos en el gratuito
- [ ] Que Gmail siga sin leer adjuntos
