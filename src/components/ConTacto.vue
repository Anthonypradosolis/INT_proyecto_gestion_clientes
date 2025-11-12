<template>
  <div class="container mx-auto mt-3 p-4 border rounded-3 shadow-sm bg-light">
    <h3 class="text-center gestion-header mb-4">
      <i class="bi bi-envelope-paper"></i> Gestión de Contactos
    </h3>

    <!-- Formulario de contacto -->
    <form @submit.prevent="guardarContacto" class="mb-4">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="nombre" class="form-label">Nombre:</label>
          <input
            type="text"
            id="nombre"
            v-model="nuevoContacto.nombre"
            class="form-control"
            required
          />
        </div>
        <div class="col-md-4">
          <label for="email" class="form-label">Email:</label>
          <input
            type="email"
            id="email"
            v-model="nuevoContacto.email"
            class="form-control"
            required
          />
        </div>
        <div class="col-md-4">
          <label for="telefono" class="form-label">Teléfono:</label>
          <input
            type="tel"
            id="telefono"
            v-model="nuevoContacto.telefono"
            class="form-control"
            placeholder="Ej: 666777888"
          />
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-md-12">
          <label for="mensaje" class="form-label">Mensaje:</label>
          <textarea
            id="mensaje"
            v-model="nuevoContacto.mensaje"
            class="form-control"
            rows="3"
          ></textarea>
        </div>
      </div>

      <div class="text-center mt-4">
        <button type="submit" class="btn btn-primary px-4">
          {{ editando ? "Modificar" : "Guardar" }}
        </button>
      </div>
    </form>

    <!-- Tabla de contactos -->
    <div class="table-responsive">
      <h4 class="text-center">Listado de Contactos</h4>
      <table class="table table-bordered table-hover table-striped align-middle">
        <thead class="table-primary">
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Mensaje</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(contacto, index) in contactos" :key="contacto.id">
            <td>{{ index + 1 }}</td>
            <td>{{ contacto.nombre }}</td>
            <td>{{ contacto.email }}</td>
            <td>{{ contacto.telefono }}</td>
            <td>{{ contacto.mensaje }}</td>
            <td class="text-center">
              <button
                @click="editarContacto(contacto)"
                class="btn btn-warning btn-sm me-2 border-0"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                @click="eliminarContacto(contacto.id)"
                class="btn btn-danger btn-sm border-0"
              >
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import {
  getContactos,
  addContacto,
  updateContacto,
  deleteContacto,
} from "@/api/contactos.js";

// -----------------------------
// Variables reactivas
// -----------------------------
const contactos = ref([]); // lista completa de contactos
const nuevoContacto = ref({
  nombre: "",
  email: "",
  telefono: "",
  mensaje: "",
});
const editando = ref(false);
const contactoEditandoId = ref(null);

// -----------------------------
// Cargar contactos al montar
// -----------------------------
onMounted(async () => {
  contactos.value = await getContactos();
});

// -----------------------------
// Guardar contacto (nuevo o editar)
// -----------------------------
const guardarContacto = async () => {
  try {
    if (editando.value) {
      await updateContacto(contactoEditandoId.value, nuevoContacto.value);
      Swal.fire("Contacto modificado", "", "success");
    } else {
      await addContacto(nuevoContacto.value);
      Swal.fire("Contacto guardado", "", "success");
    }

    // Limpiar formulario
    nuevoContacto.value = {
      nombre: "",
      email: "",
      telefono: "",
      mensaje: "",
    };
    editando.value = false;
    contactoEditandoId.value = null;

    // Recargar contactos
    contactos.value = await getContactos();
  } catch (error) {
    console.error("Error al guardar contacto:", error);
    Swal.fire("Error", "No se pudo guardar el contacto", "error");
  }
};

// -----------------------------
// Editar contacto existente
// -----------------------------
const editarContacto = (contacto) => {
  nuevoContacto.value = { ...contacto };
  contactoEditandoId.value = contacto.id;
  editando.value = true;
};

// -----------------------------
// Eliminar contacto
// -----------------------------
const eliminarContacto = async (id) => {
  const confirmacion = await Swal.fire({
    title: "¿Eliminar contacto?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  });
  if (!confirmacion.isConfirmed) return;

  try {
    await deleteContacto(id);
    Swal.fire("Eliminado", "El contacto ha sido eliminado", "success");
    contactos.value = await getContactos();
  } catch (error) {
    console.error("Error eliminando contacto:", error);
    Swal.fire("Error", "No se pudo eliminar el contacto", "error");
  }
};
</script>

<style scoped>
.gestion-header {
  background-color: #b5caff;
  color: #03306b;
  padding: 0.75rem;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
