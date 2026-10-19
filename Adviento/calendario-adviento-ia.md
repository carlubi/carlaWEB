# Calendario de adviento IA · carlaylz

> **Ojo: borrador antiguo.** En octubre de 2026 se reordenaron y reescribieron los 24 días (público general, Claude como eje). El orden y los contenidos actuales están en `indice-contenidos.md`. Este documento se queda como histórico de las decisiones iniciales.

Borrador de trabajo para discutir. Cada día es una propuesta, no una decisión.

**Fechas:** 1 al 24 de diciembre de 2026. El 1 es martes, el 8 es festivo, el 24 es Nochebuena (jueves).
**Eje:** Claude es la plataforma central. Las demás herramientas (NotebookLM, Higgsfield, Canva, Make/n8n...) entran como complemento, no como protagonistas.
**Público:** Silvia, administrativa no técnica. Cada día debe poder hacerse en 10-20 minutos y dejar algo visible.

---

## Tipos de día

| Icono | Tipo | Qué es | Esfuerzo para ti |
|---|---|---|---|
| 🎯 | **Reto** | Tarea guiada con resultado visible | Alto (guía + prompt + captura) |
| 🎁 | **Regalo** | Plantilla, pack de prompts o checklist descargable | Medio (se prepara una vez) |
| ✨ | **Sorpresa** | Algo lúdico o inesperado que enseña sin parecer formación | Medio |
| 💡 | **Tip** | Una idea corta, sin tarea larga | Bajo |
| 🎓 | **Formación** | Mini-clase en vídeo (3-6 min) | Alto |

**Reparto actual:** 12 retos · 4 regalos (el día 1 es reto y regalo a la vez) · 3 sorpresas · 5 tips · 1 formación. Los vídeos ancla se deciden aparte (candidatos: día 1, día 9, día 16).
Los fines de semana (5, 6, 12, 13, 19, 20) mejor regalos, sorpresas y tips: nadie quiere un reto de oficina un domingo.

---

## Qué de Claude queremos que dominen al final

- [ ] Dar contexto y preferencias para que responda como ellas quieren
- [ ] Proyectos (instrucciones + documentos propios)
- [ ] Conectores (correo, calendario, Drive...)
- [ ] Tareas programadas
- [ ] Slides y documentos creados con Claude
- [ ] Artefactos / mini-apps
- [ ] Investigación con fuentes
- [ ] Revisar siempre el resultado y cuidar los datos

## Otras herramientas (una o dos veces cada una, máximo)

NotebookLM · Higgsfield (vídeo) · Canva · ChatGPT / Gemini (comparativa)

Make, n8n y Power Automate quedan fuera: ver la nota del bloque 4.

## Materiales

Todo vive en la carpeta `Adviento` del escritorio. Cada día tiene su carpeta `dia-NN-nombre/` con la ficha, el prompt, el texto del correo y el de la web.

### Piezas compartidas

| Carpeta | Qué hay | Días que la usan |
|---|---|---|
| `00-kit-de-arranque/` | Tarjeta de contexto, semáforo de datos, 10 prompts de oficina, calendario imprimible | 1 (es el regalo), y se referencia en el 2, 6 y 8 |
| `_datos-de-prueba/facturas-2026.csv` | 367 facturas con duplicados, importes vacíos, clientes mal escritos y fechas en dos formatos | 7, 14, 21, 22 |
| `_datos-de-prueba/ventas-2026.csv` | 182 filas de ventas semanales, 5 comerciales, 9 meses | 9, 14, 16 |
| `_datos-de-prueba/bandeja-entrada.csv` | 120 correos de una semana, con ruido y 6 mensajes sospechosos | 3, 11, 22, 23 |
| `_datos-de-prueba/_solucion-bandeja.csv` | La categoría real de cada correo, solo para ti | — |
| `_plantillas-base/` | Piezas que se repiten entre días | varios |

### Qué archivo lleva cada día

Todas las fichas están escritas. Cada carpeta lleva su `ficha.md` (objetivo, pasos, cómo comprobar el resultado y qué verificar antes de publicar) más sus materiales.

| Día | Carpeta | Archivos propios | Datos de prueba |
|---|---|---|---|
| 1 | `dia-01-mapa-de-tareas/` | `ficha.md` · `prompt.md` | ninguno (a propósito) |
| 2 | `dia-02-conectores/` | `ficha.md` · `checklist-permisos.md` | ninguno |
| 3 | `dia-03-primer-conector/` | `ficha.md` · `prompt.md` | `bandeja-entrada.csv` (plan B) |
| 4 | `dia-04-proyecto/` | `ficha.md` · `instrucciones-proyecto.md` | ninguno |
| 5 | `dia-05-mini-app/` | `ficha.md` · `prompt.md` | ninguno |
| 6 | `dia-06-cazar-errores/` | `ficha.md` · `prompt.md` · `checklist-revision.md` | `facturas-2026.csv` |
| 7 | `dia-07-tarea-programada/` | `ficha.md` · `prompt.md` | calendario propio |
| 8 | `dia-08-pedir-mejor/` | `ficha.md` · `las-5-frases.md` | ninguno |
| 9 | `dia-09-presentacion/` | `ficha.md` · `prompt.md` | `ventas-2026.csv` |
| 10 | `dia-10-notebooklm/` | `ficha.md` · `prompt.md` · `manual-interno-ejemplo.md` | el manual (con 2 trampas) |
| 11 | `dia-11-reunion/` | `ficha.md` · `prompt.md` · `notas-reunion-ejemplo.md` | las notas (con 4 cabos sueltos) |
| 12 | `dia-12-plantilla-asistente/` | `ficha.md` · `asistente-de-oficina.md` | ninguno |
| 13 | `dia-13-video-higgsfield/` | `ficha.md` · `ideas-video.md` | ninguno |
| 14 | `dia-14-informe/` | `ficha.md` · `prompt.md` | `ventas-2026.csv` + `facturas-2026.csv` |
| 15 | `dia-15-diseno-canva/` | `ficha.md` · `prompt.md` | ninguno |
| 16 | `dia-16-investigar/` | `ficha.md` · `prompt.md` | ninguno |
| 17 | `dia-17-que-uso-cuando/` | `ficha.md` · `tabla-decision.md` | ninguno |
| 18 | `dia-18-asistente-reutilizable/` | `ficha.md` · `prompt.md` | un proceso suyo |
| 19 | `dia-19-pack-programadas/` | `ficha.md` · `pack-tareas.md` | ninguno |
| 20 | `dia-20-navegador/` | `ficha.md` · `prompt.md` | ninguno |
| 21 | `dia-21-prepara-tu-lunes/` | `ficha.md` · `prompt.md` | `bandeja-entrada.csv` + `facturas-2026.csv` |
| 22 | `dia-22-vigilante-bandeja/` | `ficha.md` · `prompt.md` | `bandeja-entrada.csv` |
| 23 | `dia-23-tu-decides/` | `ficha.md` · `las-tres-zonas.md` | el vigilante del día 22 |
| 24 | `dia-24-mapa-2027/` | `ficha.md` · `prompt.md` · `mapa-2027.md` | el mapa del día 1 |

### Hilos que atraviesan el calendario

No son días sueltos: hay cuatro ideas que vuelven.

- **El mapa de tareas:** se hace el día 1 y se retoma el día 24.
- **Revisar lo que devuelve:** nace el día 6 y reaparece en el 9, el 14 y el 16.
- **Los datos bancarios de un proveedor:** aparecen en el manual del día 10, en las notas del día 11, en los correos del día 21 y como caso central del 22. Un riesgo real, visto cuatro veces desde ángulos distintos.
- **Quién decide:** se insinúa el día 2, se practica el 22 y se formaliza el 23 con las tres zonas.

### Lo que falta por crear

- **El calendario imprimible** del kit de arranque (diseño, en Canva, con granate y amarillo)
- **El texto del correo** de cada día (24 correos)
- **El texto de la web** de cada puerta (24 textos cortos)
- **Capturas** de los días que explican una función: 3, 4, 7, 9, 10, 20

### Decisiones que cambian días enteros

Hay que verificarlas en noviembre, con la herramienta delante:

| Qué verificar | A qué día afecta | Qué pasa si la respuesta es no |
|---|---|---|
| ¿Las tareas programadas están en gratuito? | 7, 19, 22 | Hay que ofrecer alternativa o mover el día 7 |
| ¿Los proyectos están en gratuito? | 4, 12, 18 | Alternativa: pegar el contexto en cada conversación |
| ¿Una tarea programada puede leer correo y dejar borrador? | 22 | El reto pasa a "clasificar y avisar" |
| ¿Higgsfield pide tarjeta para registrarse? | 13 | Cambiar de herramienta |
| ¿Claude en Chrome es fácil de instalar? | 20 | Cambiar el día entero |

---

## Bloque 1 · Conoce Claude (días 1-6)

**Objetivo:** que pierdan el miedo, que Claude les conozca y que vean un primer resultado el día 1.
**Dificultad:** ⭐

| Día | Tipo | Idea | Herramienta | Resultado visible |
|---|---|---|---|---|
| 1 · mar | 🎯🎁 | **Tu mapa de tareas:** cuenta tu semana en 5 minutos y Claude te devuelve las 3 tareas que más merece delegar, el tiempo que se te va en ellas y por cuál empezar, en una página interactiva. **Incluye el kit de arranque** | Claude | Mapa propio + kit descargable |
| 2 · mié | 💡 | **Conectores sin miedo:** qué ve Claude, qué permisos das y cómo revocarlos (prepara el día 3) | Claude | Checklist de permisos |
| 3 · jue | 🎯 | **Tu primer conector:** conecta correo o calendario y pide un resumen de la semana | Claude (conectores) | Resumen real de su bandeja |
| 4 · vie | 💡 | **Un proyecto para tu trabajo:** instrucciones + 2 documentos propios | Claude (Proyectos) | Proyecto creado |
| 5 · sáb | ✨ | **Tu mini-app en 5 minutos:** un planificador o checklist que Claude crea y tú usas | Claude (artefactos) | App funcionando |
| 6 · dom | 💡 | **Cómo cazar un error de la IA:** 3 comprobaciones antes de fiarte | Claude | Checklist de revisión |

### Día 1 en detalle (el que decide si se quedan)

**Regla:** en 15 minutos tienen algo suyo y visible, sin conectar nada ni meter datos de empresa, y se llevan algo en la mano.

**Reto:** el prompt del mapa de tareas. La persona describe su semana (correos, informes, facturas...) y Claude devuelve:
1. Las 3 tareas con más sentido para delegar o asistir.
2. Cuánto tiempo se le va en cada una (estimación suya, no inventada).
3. Por cuál empezar y por qué.
4. Todo en una página interactiva, para que el resultado sea visual.

**Lo que aprende sin que se lo digamos:** dar contexto y describir una tarea con claridad.

**Regalo, el kit de arranque:**
- [ ] El prompt del mapa de tareas, listo para copiar
- [ ] Tarjeta de contexto en blanco (rol, tono, reglas), para rellenar una vez y reutilizar
- [ ] Semáforo de datos en una hoja
- [ ] Pack de 10 prompts de oficina (antes iba el día 4)
- [ ] Calendario imprimible con los 24 días, en granate y amarillo

**Conexión con el final:** el mapa del día 1 vuelve el día 24 (mapa de automatización 2027). El calendario abre y cierra con la misma idea.

**Para discutir:**
- ¿El kit entero el día 1 es mucho trabajo? Mínimo imprescindible: prompt + tarjeta de contexto + semáforo. El resto puede ir en otros días.
- ¿El conector el día 3 sigue siendo pronto? Con el día 2 como preparación, yo lo mantendría con el calendario (menos sensible que el correo) o con una cuenta de prueba.
- ¿Un premio mayor (sorteo, sesión 1:1) para quien complete los 24? Mejor en el cierre, no el día 1. Un sorteo exige bases legales.

---

## Bloque 2 · Oficina más productiva (días 7-12)

**Objetivo:** tareas reales de su jornada: informes, reuniones, presentaciones. Primera programación.
**Dificultad:** ⭐⭐

| Día | Tipo | Idea | Herramienta | Resultado visible |
|---|---|---|---|---|
| 7 · lun | 🎯 | **Tu primera tarea programada:** un resumen cada mañana de correos o agenda | Claude (tareas programadas) | Resumen que llega solo |
| 8 · mar (festivo) | 💡 | **5 frases para pedir mejor:** contexto, formato, ejemplo, límite, revisión | Claude | Tarjeta imprimible |
| 9 · mié | 🎯 | **De notas sueltas a presentación:** 8 diapositivas editables | Claude (slides) | Deck descargable |
| 10 · jue | 🎯 | **Pregúntale a tus documentos:** un cuaderno con fuentes citadas + resumen en audio | NotebookLM | Cuaderno + audio |
| 11 · vie | 🎯 | **De reunión a próximos pasos:** acta, responsables y fechas | Claude + conector de calendario/Drive | Acta lista para enviar |
| 12 · sáb | 🎁 | **Plantilla "Mi asistente de oficina":** instrucciones de proyecto listas para copiar | Claude (Proyectos) | Descargable |

**Para discutir:**
- ¿Tarea programada el día 7 o más tarde? Es el reto más "wow", pero depende del plan de cada persona y de la disponibilidad. Hay que verificarlo antes de prometerlo.
- ¿Marcamos el día 9 como vídeo ancla (🎓)?

---

## Bloque 3 · Crear y comparar (días 13-18)

**Objetivo:** salir de Claude hacia otras herramientas, crear cosas que se vean (vídeo, diseño) y empezar a decidir qué herramienta usar para qué.
**Dificultad:** ⭐⭐-⭐⭐⭐

| Día | Tipo | Idea | Herramienta | Resultado visible |
|---|---|---|---|---|
| 13 · dom | ✨ | **Tu primer vídeo con IA:** una felicitación o escena corta | Higgsfield | Vídeo de unos segundos |
| 14 · lun | 🎯 | **Informe semanal sin empezar de cero:** datos de una hoja de cálculo → análisis → informe | Claude | Informe con conclusiones |
| 15 · mar | 🎯 | **Diseño sin ser diseñadora:** un post o cartel con tu marca | Claude + Canva | Diseño listo |
| 16 · mié | 🎓 | **Investigar con fuentes:** comparar 3 opciones y exigir enlaces | Claude + Gemini (comparar) | Informe con fuentes |
| 17 · jue | 💡 | **¿Cuándo uso cada una?** Claude, ChatGPT, Gemini, NotebookLM en una tabla | Varias | Tabla de decisión |
| 18 · vie | 🎯 | **Tu asistente reutilizable:** convierte un proceso repetido en instrucciones guardadas | Claude (Proyectos / skills, verificar) | Asistente que responde dudas |

**Para discutir:**
- Higgsfield: ¿lo dejamos como sorpresa de fin de semana (sin presión) o como reto? Verificar plan gratuito y condiciones de uso antes.
- ¿Metemos un día de vida personal aquí (menú semanal, ensayo de una conversación difícil)? Ahora mismo este bloque es muy laboral.

---

## Bloque 4 · Automatiza (días 19-24)

**Objetivo:** pasar de "usar IA" a "dejar que trabaje por mí", con revisión humana. Cierre y anuncio del curso.
**Dificultad:** ⭐⭐⭐-⭐⭐⭐⭐

| Día | Tipo | Idea | Herramienta | Resultado visible |
|---|---|---|---|---|
**Decisión:** todo el bloque se hace **dentro de Claude**, sin Make ni n8n. Ver la nota de abajo.

| Día | Tipo | Idea | Herramienta | Resultado visible |
|---|---|---|---|---|
| 19 · sáb | 🎁 | **Pack de instrucciones programadas:** 5 tareas recurrentes listas para copiar y activar | Claude (tareas programadas) | Descargable |
| 20 · dom | ✨ | **Claude trabaja en tu navegador:** una tarea repetitiva, mirando cómo la hace | Claude en Chrome (verificar) | Tarea hecha |
| 21 · lun | 🎯 | **Prepara tu lunes:** correo + calendario + documentos juntos en un solo encargo | Claude (varios conectores) | Briefing semanal |
| 22 · mar | 🎯 | **Tu vigilante de la bandeja:** una tarea programada revisa el correo, detecta lo que encaja con un criterio tuyo y te prepara el borrador | Claude (programación + conector) | Borrador que te espera |
| 23 · mié | 🎯 | **Tú decides, ella prepara:** afinar el vigilante para que avise en vez de actuar, y qué hacer cuando se equivoca | Claude | Flujo revisado |
| 24 · jue | 🎁 | **Tu mapa de automatización 2027:** retomas el mapa del día 1, eliges un proceso, mides el tiempo y priorizas. Anuncio del curso | Claude + hoja | Mapa personal actualizado |

### Por qué fuera Make y n8n

Para Silvia, montar un escenario en Make es otra herramienta más que aprender, con su cuenta, su interfaz y sus errores. Y el calendario promete lo contrario: que no necesita ser técnica.

Con tareas programadas y conectores se cubre casi todo lo que ella necesita: revisar algo cada día, preparar un borrador, avisarla. La diferencia real es que un flujo se dispara por un evento y una tarea programada revisa cada cierto tiempo. Para su caso, da igual.

Lo que sí se pierde: ramificaciones, muchas apps encadenadas y registros de ejecución. Eso es justo el contenido del curso, no de un reto de 15 minutos. Mejor que el calendario deje la puerta abierta.

**Para discutir:**
- Verificar en noviembre qué permite exactamente una tarea programada con conector (si puede leer correo y dejar un borrador, y en qué plan).
- El día 24 es Nochebuena: cierre cálido y breve. Sin día 25.

---

## Mecánica (decidida)

- **Puerta + correo:** cada día se desbloquea la puerta en la web y se envía el correo. El correo lleva a la web, no la sustituye.
- **Todo queda abierto:** quien llegue el día 14 puede hacer los 13 anteriores. Nadie se queda fuera por llegar tarde, y el calendario sigue sirviendo en enero.
- **Correo para entrar:** se pide el correo para acceder al calendario. Es el objetivo de captación de carla-lopez.com.
- **Sin día 25.**

### Consecuencias de "todo queda abierto"

Quita la urgencia diaria, así que la urgencia tiene que venir del contenido y de Instagram, no del candado. A favor: quien entre el día 20 ve 20 puertas abiertas, y eso convence más que 20 candados.

### Pendiente de decidir

- **Vídeos:** ¿cuáles llevan? Propuesta: el día 1 (tiene que enganchar), el 9 y el 16, más algunos retos con captura animada. El resto en texto + prompt.
- **Qué pasa el 25 de diciembre con quien lo ha completado todo.**

## Reglas de cada ficha

Cada día incluye: objetivo en una frase · herramienta · tiempo estimado · prompt o pasos · aviso de datos/privacidad si procede · cómo comprobar el resultado.

## Antes de publicar

Verificar funciones, planes y nombres con la herramienta real en noviembre: conectores, tareas programadas, Claude en Chrome, skills, Higgsfield y NotebookLM cambian con frecuencia.
