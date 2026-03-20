# Patrón de Eliminación Reutilizable

Este documento detalla cómo implementar la funcionalidad de eliminación en nuevas secciones de la aplicación utilizando el sistema de diálogos y mutaciones estandarizado.

## 1. Componentes Necesarios

Asegúrate de importar los siguientes componentes en tu página:

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteConfirmDialog } from "@/components/shared/modals/DeleteConfirmDialog";
import { NotificationDialog } from "@/components/shared/modals/NotificationDialog";
import api from "@/lib/axios";
```

## 2. Configuración de Estados y Mutación

Define los estados para el diálogo y la notificación, y configura la mutación `useMutation`:

```tsx
const queryClient = useQueryClient();

// Estado para el diálogo de confirmación
const [deleteDialog, setDeleteDialog] = useState<{
  show: boolean;
  id: string | null;
  name: string;
}>({ show: false, id: null, name: "" });

// Mutación para eliminar
const { mutate: deleteEntity, isPending: isDeleting } = useMutation({
  mutationFn: async (id: string) => {
    await api.delete(`/tu-endpoint/${id}`);
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["tu-query-key"] });
    setNotification({
      show: true,
      type: "success",
      title: "Elemento Eliminado",
      message: "El elemento ha sido eliminado correctamente.",
    });
    setDeleteDialog({ show: false, id: null, name: "" });
  },
  onError: (err: any) => {
    setNotification({
      show: true,
      type: "error",
      title: "Error",
      message:
        err.response?.data?.message || "No se pudo eliminar el elemento.",
    });
  },
});

// Función para abrir el diálogo
const handleDelete = (item: TuTipo) => {
  setDeleteDialog({ show: true, id: item.id, name: item.nombre });
};
```

## 3. Integración con DataTable

Pasa la función `handleDelete` a la prop `onDelete` del `DataTable`:

```tsx
<DataTable
  // ... otras props
  onDelete={handleDelete}
/>
```

## 4. Renderizado de Modales

Agrega los componentes de modal al final de tu JSX (dentro del `return`):

```tsx
<DeleteConfirmDialog
  isOpen={deleteDialog.show}
  title="Eliminar Elemento"
  itemName={deleteDialog.name}
  onClose={() => setDeleteDialog({ show: false, id: null, name: "" })}
  onConfirm={() => deleteDialog.id && deleteEntity(deleteDialog.id)}
  isLoading={isDeleting}
/>

<NotificationDialog
  isOpen={notification.show}
  type={notification.type}
  title={notification.title}
  message={notification.message}
  onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
/>
```

---

## ¿Qué podria fallar en la implementación inicial?

Si intentaste implementar esto y no funcionaba, probablemente se debía a dos razones principales:

1.  **Falta de Componentes en el JSX**: Aunque definas la mutación (`useMutation`) y el estado (`useState`), si no agregas los componentes `<DeleteConfirmDialog />` y `<NotificationDialog />` dentro del `return` de tu página, nunca se mostrarán las interfaces visuales.
2.  **Handler Incorrecto en DataTable**: La prop `onDelete` del `DataTable` debe recibir la función que prepara el diálogo (habitualmente llamada `handleDelete`), no una función de `confirm` nativa del navegador ni la mutación directamente.

Al pasarle `onDelete={handleDelete}`, el componente `DataTable` sabe que debe ejecutar esa lógica cuando el usuario haga clic en el icono de la papelera.

---

## Solución al Error `isPending` Unused

El error `All destructured elements are unused.ts(6198)` ocurre cuando extraes `isPending` (o lo renombras a `isDeleting`) pero no lo pasas a ningún componente visual.

Para solucionarlo, asegúrate de pasarlo a la prop `isLoading` del `DeleteConfirmDialog`. Esto no solo quita el error de lint, sino que también bloquea los botones y muestra un spinner mientras se procesa la eliminación.
