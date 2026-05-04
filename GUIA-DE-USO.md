# Kitchen Cabinet — Guía de uso

App de recetas y despensa para tu móvil. Todos los datos viven en tu teléfono: si desinstalas, se borran. Haz **Ajustes → Exportar todo** para guardar copia.

## Primera vez

La app llega con **15 recetas** de ejemplo, **9 categorías** de despensa y **17 ítems** ya marcados. Puedes editarlo todo o borrarlo.

## Las 5 pestañas (barra inferior)

### 🏠 Explorador
- Lista de recetas con foto, tiempo y categoría.
- Buscador por nombre y chips para filtrar (Desayunos, Almuerzos, Postres…).

### 🔎 Buscar
- **Solo lo que puedo cocinar ahora** (toggle verde): muestra solo recetas donde tienes **todos** los ingredientes. Que te sobren cosas no importa.
- **Ingredientes que tengo**: chips de tu despensa. Toca para activar/desactivar.
- **Utensilios disponibles**: marca los que tienes (horno, batidora, etc.). Aparecerán recetas que usen **alguno** de los marcados — no hace falta tenerlos todos.
- **Dificultad**: Fácil / Medio / Difícil.
- Resultados agrupados: ✅ Cocinables · 🟡 Casi · 📚 Otras.
- Botón **🛒 Añadir a la lista** en cada receta para enviar lo que falta al carrito.

### ➕ Nueva receta
- Foto (cámara o galería), título, tiempo, categoría, dificultad.
- Ingredientes con cantidad y unidad. Equipo. Pasos (uno por línea).
- Se guarda local. Aparece en Explorador.

### 🥕 Despensa
- Cabecera con total `disponibles / totales`.
- **+ Añadir ingrediente**: nombre, cantidad numérica, unidad (ud/g/kg/ml/L/cup…), categoría y caducidad opcional.
- **⚙ Gestionar categorías**: crear, renombrar (con emoji), eliminar (te pregunta si mover ítems a otra o borrarlos también). No puedes borrar la última categoría.
- En cada ítem:
  - **− 3 ud +** botones para sumar/restar cantidad (incremento adaptativo: 1 si son unidades, 5 ó 50 si es peso o volumen grande).
  - Switch verde para ocultar sin borrar (no aparecerá en sugerencias).
  - ✏ para editar nombre, categoría, fecha y unidad.
  - ✕ para borrar.
- Caducidad: si quedan ≤3 días, el texto se vuelve naranja con ⚠.

## Detalle de receta

- **Porciones ±**: recalcula cantidades.
- **Sustitutos** (botón ↻ junto al ingrediente): muestra alternativas comunes (mantequilla → aceite, leche → bebida vegetal, etc.).
- **🍳 Modo Cocina**: pantalla siempre encendida, paso a paso, timers detectados en el texto ("reposar 30 minutos" → botón ▶ con cuenta atrás).
- **♥** favoritos.
- Menú **⋯**:
  - Compartir como imagen (PNG estilo postal)
  - Exportar JSON
  - **🔗 Compartir como enlace**: comprime la receta en una URL. Cualquiera con el link la importa al abrirla. Sin servidor.
  - Eliminar.
- Valoración 1–5 estrellas.

## Carrito (Ajustes → Lista de compras)

- Añadir ítem con nombre, **cantidad** y **unidad**.
- Cada fila: checkbox + cantidad ± + selector de unidad + ✕.
- **⬇ Pasar comprados a despensa**: vacía los marcados y los suma a tu despensa (si ya existe el ítem con la misma unidad, suma cantidades).

## Ajustes

- Idioma **Español / English**.
- Tema **Claro / Oscuro**.
- **Exportar todo** → archivo JSON de respaldo.
- **Importar copia** → restaurar en otro teléfono (reemplaza los datos actuales).
- Accesos rápidos: Favoritos, Lista de compras, Planificador, Herramientas.

## Planificador semanal

- 7 días × 3 comidas. Toca un hueco → elige receta. Toca un hueco lleno → quitar.
- **+ Lista de compras**: vuelca los ingredientes de toda la semana al carrito (sin duplicados).
- Flechas para cambiar de semana.

## Herramientas

- **Conversor de unidades**: g ↔ kg ↔ oz ↔ lb · ml ↔ L ↔ cup ↔ tbsp ↔ tsp ↔ fl oz.
- **Escáner de código de barras**: usa la cámara (Chrome/Edge en Android). Crea un ítem en la despensa con ese código asociado.
- **Foto de la nevera**: haz una foto y escribe lo que ves separado por comas; añade todo a la despensa de golpe.
- **Modo manos libres**: información (la integración completa de voz vendrá en la siguiente versión).
- **Notificaciones de caducidad**: configura cuántos días antes avisar. Solo funciona en la app instalada (APK), no en el navegador.

## Backup recomendado

Cada cierto tiempo, **Ajustes → Exportar todo**. Guarda el JSON en Drive o en tu correo. Es tu única red de seguridad: la app no usa la nube.

## Idiomas

Las recetas semilla están traducidas. Las que tú creas se guardan en el idioma en que escribiste; cambiar el idioma de interfaz no las traduce.
