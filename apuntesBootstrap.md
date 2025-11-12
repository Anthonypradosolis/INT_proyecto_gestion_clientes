# 🧩 Apuntes de **Bootstrap en Componente Vue – Gestión de Clientes**

> Basado en el componente Vue `<GestionClientes>` compartido.  
> Se analizan las clases de **Bootstrap** aplicadas a la estructura, formularios, tablas y botones.

---

## 📦 1. Estructura General del Contenedor

```html
<div class="container mx-auto mt-2 p-3 my-1 border rounded-0 shadow-sm min-vh-75 bg-light">
```

### 🔹 Explicación de clases
| Clase | Función |
|--------|----------|
| `container` | Contenedor central de Bootstrap que ajusta márgenes laterales automáticamente. |
| `mx-auto` | Centra horizontalmente el contenedor. |
| `mt-2` / `my-1` / `p-3` | Margen superior, márgenes verticales y padding interno. |
| `border` | Añade un borde fino alrededor del contenedor. |
| `rounded-0` | Elimina los bordes redondeados. |
| `shadow-sm` | Aplica una sombra ligera. |
| `min-vh-75` | Altura mínima del 75% del viewport. *(útil para pantallas grandes)* |
| `bg-light` | Fondo gris claro. |

---

## 🧾 2. Cabecera del Componente

```html
<h3 class="text-center my-2 gestion-header">
  <i class="bi bi-people-fill"></i> Gestión de Clientes
</h3>
```

| Clase | Descripción |
|--------|-------------|
| `text-center` | Centra el texto horizontalmente. |
| `my-2` | Margen vertical pequeño. |
| `bi bi-people-fill` | Icono de Bootstrap Icons. |

> 🧠 *Tip:* Para usar `Bootstrap Icons`, se incluye el paquete o el CDN:  
> ```html
> <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
> ```

---

## 🧍 3. Formularios en Bootstrap

### 🧱 Estructura de filas y columnas

Bootstrap utiliza un sistema **grid de 12 columnas** con las clases:
```html
<div class="row align-items-center">
  <div class="col-md-4">...</div>
  <div class="col-md-4">...</div>
  <div class="col-md-4">...</div>
</div>
```

| Clase | Función |
|--------|----------|
| `row` | Agrupa columnas. |
| `col-md-*` | Divide el ancho en 12 partes según el tamaño (`md`=≥768px). |
| `align-items-center` | Alinea verticalmente los elementos al centro. |

---

### 🧾 Campos de Formulario

#### 🟢 Entrada con validación visual

```html
<input type="text" class="form-control w-auto text-center ms-0" :class="{ 'is-invalid': !dniValido }">
<div v-if="!dniValido" class="invalid-feedback">DNI o NIE inválido.</div>
```

| Clase | Función |
|--------|----------|
| `form-control` | Estilo base de Bootstrap para inputs. |
| `w-auto` | Ancho automático según contenido. |
| `text-center` | Centra el texto dentro del input. |
| `ms-0` | “Margin start”: margen izquierdo 0. |
| `is-invalid` | (Condicional) Muestra borde rojo si no es válido. |
| `invalid-feedback` | Texto de error visible cuando el campo es inválido. |

---

### 🧩 Botones con Bootstrap

```html
<button class="btn btn-primary ms-3 border-0 shadow-none rounded-0">
  <i class="bi bi-search"></i>
</button>
```

| Clase | Función |
|--------|----------|
| `btn` | Clase base para botones. |
| `btn-primary` | Botón azul principal. |
| `ms-3` | Margen izquierdo. |
| `border-0` | Quita el borde. |
| `shadow-none` | Elimina la sombra. |
| `rounded-0` | Sin bordes redondeados. |

> 💡 Puedes cambiar colores con:  
> `btn-success`, `btn-danger`, `btn-warning`, `btn-secondary`, `btn-outline-primary`, etc.

---

## 🧰 4. Radio Buttons y Checkboxes

```html
<input type="radio" class="ms-2" v-model="nuevoCliente.tipoCliente">
<input type="checkbox" class="form-check-input">
<label class="form-check-label">Aviso Legal</label>
```

| Clase | Descripción |
|--------|--------------|
| `form-check-input` | Da estilo Bootstrap a los radio y checkbox. |
| `form-check-label` | Alinea y da formato al texto asociado. |
| `form-switch` | Convierte un checkbox en un **interruptor** visual. |

---

## 🧮 5. Selects y Listas Desplegables

```html
<select class="form-select flex-grow-1 w-25">
  <option>Seleccione provincia</option>
</select>
```

| Clase | Función |
|--------|----------|
| `form-select` | Estilo moderno para `<select>`. |
| `flex-grow-1` | Hace que el select crezca para ocupar el espacio disponible. |
| `w-25` | Limita el ancho al 25% del contenedor. |

---

## 🪣 6. Tablas Responsivas

```html
<div class="table-responsive">
  <table class="table table-bordered table-striped table-hover table-sm align-middle">
    ...
  </table>
</div>
```

| Clase | Función |
|--------|----------|
| `table` | Clase base para tablas. |
| `table-bordered` | Añade bordes a las celdas. |
| `table-striped` | Alterna color de filas. |
| `table-hover` | Sombrea fila al pasar el mouse. |
| `table-sm` | Reduce el padding de las filas. |
| `align-middle` | Centra verticalmente el contenido. |
| `table-responsive` | Hace que la tabla sea desplazable horizontalmente en pantallas pequeñas. |

---

## 📄 7. Paginación Manual con Botones

```html
<div class="d-flex justify-content-center my-3">
  <button class="btn btn-outline-primary btn-sm me-2 rounded-0 border-1 shadow-none">
    <i class="bi bi-chevron-left"></i>
  </button>
</div>
```

| Clase | Función |
|--------|----------|
| `d-flex` | Activa el contenedor **flexbox**. |
| `justify-content-center` | Centra los elementos hijos horizontalmente. |
| `btn-outline-primary` | Botón con borde azul y fondo transparente. |
| `btn-sm` | Tamaño pequeño. |
| `me-2` | Margen derecho. |

---

## 🎨 8. Estilos Personalizados en `<style scoped>`

```css
.is-invalid {
  border-color: #f28b82 !important;
  background-color: #ffe6e6;
}
.gestion-header {
  background-color: #b5caff;
  color: #03306b;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}
```

> Bootstrap te da una base, pero aquí personalizas:
> - Colores de error.  
> - Fondo y sombra del encabezado.  
> - Bordes y márgenes más suaves.

---

## ⚙️ 9. Integración Vue + Bootstrap

| Elemento Vue                                                                    | Descripción                                                                                                                                                                                              | Ejemplo con Bootstrap                                                                                                                                                        |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`v-model`**                                                                   | Conecta (bindea) el valor de un campo de formulario con una variable reactiva en el componente. Cada cambio en el input actualiza automáticamente el dato en Vue.                                        | `html<br><input type="text" v-model="nuevoCliente.nombre" class="form-control" placeholder="Nombre del cliente">`                                                            |
| **`:class="{ 'is-invalid': !dniValido }"`**                                     | Aplica dinámicamente una clase CSS (de Bootstrap o personalizada) según una condición booleana.                                                                                                          | `html<br><input type="text" v-model="dni" class="form-control" :class="{ 'is-invalid': !dniValido }"><br><div v-if="!dniValido" class="invalid-feedback">DNI inválido</div>` |
| **`v-if` / `v-for`**                                                            | `v-if` muestra o esconde elementos del DOM según una condición.                                                                                                                                          |                                                                                                                                                                              |
| `v-for` repite un bloque HTML para renderizar listas (como filas en una tabla). | `html<br><tr v-for="cliente in clientes" :key="cliente.id"><td>{{ cliente.nombre }}</td></tr>`<br>`html<br><div v-if="clientes.length === 0" class="alert alert-info">No hay clientes registrados</div>` |                                                                                                                                                                              |
| **`@blur`, `@change`, `@click`**                                                | Escuchan eventos del usuario (salir del campo, cambiar valor, hacer clic) y ejecutan funciones del script Vue.                                                                                           | `html<br><input type="email" v-model="email" @blur="validarEmail" class="form-control"><br><button @click="guardarCliente" class="btn btn-primary">Guardar</button>`         |


## Ejemplo Practica

``` html
<template>
  <div class="mb-3">
    <label for="dni" class="form-label">DNI</label>
    <input
      type="text"
      id="dni"
      v-model="dni"
      @blur="validarDni"
      class="form-control"
      :class="{ 'is-invalid': !dniValido }"
      placeholder="Introduce tu DNI"
    />
    <div v-if="!dniValido" class="invalid-feedback">
      DNI inválido. Debe tener 8 números y una letra.
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const dni = ref("");
const dniValido = ref(true);

const validarDni = () => {
  const regex = /^[0-9]{8}[A-Z]$/i;
  dniValido.value = regex.test(dni.value);
};
</script>


```

> ⚡ *Bootstrap se usa solo para diseño visual; Vue maneja toda la lógica reactiva y los datos.*

---

## 🧠 10. Buenas Prácticas con Bootstrap + Vue

✅ Usa `form-control`, `form-select` y `btn` siempre dentro de `form` o `div.row`.  
✅ Usa `table-responsive` para evitar que se rompa el diseño en móviles.  
✅ Aprovecha clases utilitarias (`mt-2`, `p-3`, `w-50`, `text-center`, etc.) para evitar CSS innecesario.  
✅ Evita `!important` salvo en casos justificados (como sobrescribir Bootstrap).  
✅ Si repites estilos, crea clases personalizadas y agrégalas al final del archivo `.vue`.
