# Cambios en el Módulo de Productos

## Resumen de cambios

### 1. Búsqueda unificada

El buscador del `DataTable` ahora usa el `searchLabel` personalizado **"Buscar producto..."** directamente en la barra general de la izquierda. Se eliminó la entrada duplicada `{ key: "search", type: "search" }` del `FILTER_CONFIG` en `productos.constants.ts`.

### 2. Botón "Limpiar Filtros"

El antiguo botón rojo de reinicio ha sido reemplazado por un botón con:

- Ícono `RiFilterOffLine`
- Texto **"Limpiar Filtros"**
- Estilos: `bg-slate-700 text-white` (gris oscuro premium)

Este botón aplica sobre los filtros de **toda la lista general** (`FilterGeneral`):

- Resetea el estado `filters` a `{}`.
- Incrementa `filterKey`, lo que desmonta y remonta el componente `FilterGeneral`, limpiando todos sus estados internos (selects, fechas, búsquedas).

### 3. Botón "Crear producto"

Nuevo botón rojo (`bg-[#dc2b1a]`) con ícono `RiAddLine` que abre el modal `CrearProductoModal`.

### 4. Modal "Crear producto" (4 pasos)

| Paso | Título                       | Contenido                                                                 |
| ---- | ---------------------------- | ------------------------------------------------------------------------- |
| 1    | **Contenido multimedia**     | Drop zone para hasta 10 imágenes, grid de previews con opción de eliminar |
| 2    | **Información del Producto** | Nombre, Marca, Número de lote                                             |
| 3    | **Sección del producto**     | Categoría, Sub-categoría, Descripción, Cupón, Unidad                      |
| 4    | **Código Universal**         | Código de barras + visualización de barcode                               |

Al confirmar el paso 4 se muestra una pantalla de **éxito** ("`Producto creado exitosamente`"), que al cerrarse resetea el formulario por completo.

---

## Cómo adaptar el botón "Limpiar Filtros" a otras listas

Si usas el patrón `DataTable + FilterGeneral` en otro módulo y quieres reemplazar el ícono simple por el botón con texto:

```tsx
// Antes (solo ícono)
actions={[
  {
    label: "",
    icon: <RiRestartLine size={20} />,
    onClick: handleResetFilters,
    className: "bg-red-500 text-white",
  },
]}

// Ahora (texto + ícono)
actions={[
  {
    label: "Limpiar Filtros",
    icon: <RiFilterOffLine size={18} />,
    onClick: handleResetFilters,
    className: "bg-slate-700 text-white hover:bg-slate-800 shadow-md shadow-slate-200",
  },
]}
```

El `DataTable` ya renderiza tanto el ícono como el `label` en todos los botones de `actions`, por lo que solo necesitas rellenar ambas propiedades.
