# Tu lista de la compra en Artefactos
resumen: Crea en Claude una lista de la compra que puedas marcar, ampliar y ordenar por secciones. La probarás con productos de ejemplo y harás un cambio para dejarla a tu gusto.
datos: La lista de ejemplo descargable o tus propios productos
tipo: Reto
herramienta: Claude (Artefactos)
minutos: 20

## Hoy vas a crear una herramienta, no solo una lista

Una lista escrita en el chat sirve para leer. Un **artefacto interactivo** te deja marcar lo que ya has metido en el carro, añadir productos y cambiar cantidades sin pedirle una respuesta nueva a Claude cada vez.

Claude puede crear esta pequeña herramienta a partir de una descripción. Se abrirá junto al chat y la encontrarás después en la pestaña **Artefactos**. Puedes hacer este reto en el plan gratuito, siempre que tengas activadas la **ejecución de código en la nube y la creación de archivos** en **Configuración > Capacidades**. Si Claude no crea el artefacto, comprueba ese ajuste y vuelve a pedírselo. Consulta la [guía oficial de Artefactos](https://support.claude.com/es/articles/17153992-que-son-los-artefactos-y-como-los-uso) si la interfaz cambia.

## La tarea: monta una lista de la compra útil

### Paso 1 · Descarga los productos de prueba

Abre «Lista de ejemplo» en las descargas. Son productos inventados y corrientes, repartidos en cuatro secciones. Puedes adjuntar el archivo en Claude o copiar sus líneas. Si prefieres hacer tu compra real, escribe tus productos y cantidades sin incluir datos personales de otras personas.

### Paso 2 · Pide un artefacto interactivo

Abre un chat nuevo, adjunta la lista y pega el prompt «Crea mi lista». Di expresamente **artefacto interactivo** para que Claude haga una herramienta que puedas usar, no una respuesta de texto. Espera a que se abra junto a la conversación.

### Paso 3 · Pruébala como si estuvieras en la tienda

Marca la leche como comprada. Añade plátanos. Cambia la cantidad de pan. Borra los tomates. Comprueba que los productos pendientes y los comprados quedan claros y que puedes deshacer un marcado por error.

### Paso 4 · Pide una mejora

Usa el prompt «Mejora la lista» para pedir un cambio concreto: un botón para limpiar lo comprado y una forma de copiar los productos pendientes como texto. Prueba ambas funciones. Si Claude te devuelve solo código, pídele que abra la vista previa del artefacto.

![El artefacto de la lista de la compra abierto en Claude, con productos agrupados, uno marcado como comprado, el contador de pendientes y los controles para añadir y copiar](capturas/d21-01-lista-compra-artefacto.png)

### Paso 5 · Guarda lo importante

Vuelve a encontrar el artefacto en **Artefactos**. Antes de cerrar, copia los productos pendientes a una nota o documento si quieres conservar esa compra. En el plan gratuito, el artefacto puede seguir ahí, pero **los cambios hechos dentro de la lista no se guardan necesariamente entre sesiones**. El almacenamiento de datos entre sesiones está disponible en planes de pago; no dependas de él para este ejercicio.

## Cómo saber si ha salido bien

- Puedes marcar y desmarcar un producto sin volver al chat.
- Puedes añadir, cambiar la cantidad y borrar productos.
- Los productos se agrupan de forma clara y se distinguen los pendientes de los comprados.
- La lista de pendientes se puede copiar como texto.
- Has comprobado qué ocurre al cerrar y volver a abrir el artefacto, sin dar por hecho que conserva los cambios.

## La idea que se queda

Cuando una tarea se repite, puedes pedirle a Claude una herramienta pequeña para hacerla. Prueba sus botones con casos reales antes de usarla en el día a día.

## Palabras del día

- **Artefacto:** una pieza que Claude crea y abre aparte del chat, como un documento o una herramienta interactiva.
- **Vista previa:** el panel donde usas la herramienta y compruebas que funciona.
- **Estado:** lo que cambia mientras la usas, por ejemplo qué productos has marcado como comprados.

## Prompt · Crea mi lista

> Crea un **artefacto interactivo** para usar como lista de la compra. Quiero verlo y usarlo en la vista previa, no recibir solo una lista de texto ni el código.
>
> Usa exactamente los productos y cantidades del archivo adjunto. Agrúpalos por sección. Necesito poder marcar y desmarcar productos como comprados, añadir productos nuevos, cambiar cantidades y borrar productos. Muestra claramente cuántos quedan pendientes. Que se lea bien en el móvil y que los controles tengan nombres claros.
>
> Hazlo sencillo. No conectes aplicaciones externas ni supongas que los cambios se guardarán entre sesiones. Si falta algún dato, pregúntame antes de inventarlo.
>
> [adjunta lista-compra-ejemplo.md]

## Prompt · Mejora la lista

> En el artefacto que acabas de crear, añade un botón para quitar de la vista los productos ya comprados y otro para copiar los productos pendientes como texto, con sección, producto y cantidad. Conserva el resto de funciones. Después, comprueba que puedo seguir marcando y desmarcando productos.

## Prompt · Si usas tus productos

> Crea un artefacto interactivo para mi lista de la compra con estos productos: [pega aquí tus productos y cantidades]. Agrúpalos por secciones. Quiero poder marcar, añadir, editar cantidades y borrar productos, y copiar los pendientes como texto. Debe funcionar en el móvil. No inventes productos ni precios.

## Descarga · Lista de ejemplo
archivo: dia-21-lista-compra/lista-compra-ejemplo.md
formato: md
copiar: sí
Productos de prueba para adjuntar a Claude o copiar en el chat.
