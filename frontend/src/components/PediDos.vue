<template>
  <div class="container mx-auto mt-3 p-3 border rounded-0 shadow-sm min-vh-75 bg-light">
    <h3 class="text-center my-2 gestion-header">
      <i class="bi bi-receipt"></i> Gestión de Pedidos
    </h3>

    <form @submit.prevent="guardarPedido" class="mb-4">
      <div class="row g-3 mb-3">
        <div class="col-md-3">
          <label class="form-label">Cliente</label>
          <input
            type="text"
            v-model="nuevoPedido.cliente"
            class="form-control"
            placeholder="Nombre del cliente"
            required
          />
        </div>

        <div class="col-md-3">
          <label class="form-label">Modelo</label>
          <input
            type="text"
            v-model="nuevoPedido.modelo"
            class="form-control"
            placeholder="Modelo de cartel"
            required
          />
        </div>

        <div class="col-md-2">
          <label class="form-label">Cantidad</label>
          <input
            type="number"
            v-model.number="nuevoPedido.cantidad"
            min="1"
            class="form-control"
            required
          />
        </div>

        <div class="col-md-2">
          <label class="form-label">Entrega</label>
          <input
            type="date"
            v-model="nuevoPedido.entrega"
            class="form-control"
            required
          />
        </div>

        <div class="col-md-2">
          <label class="form-label">Estado</label>
          <select v-model="nuevoPedido.estado" class="form-select">
            <option>Pendiente</option>
            <option>En producción</option>
            <option>Listo</option>
            <option>Entregado</option>
            <option>Cancelado</option>
          </select>
        </div>
      </div>

      <div class="row g-3 mb-3">
        <div class="col-md-3">
          <label class="form-label">Tamaño</label>
          <select v-model="nuevoPedido.tamano" class="form-select">
            <option>A4</option>
            <option>A3</option>
            <option>A2</option>
            <option>A1</option>
          </select>
        </div>

        <div class="col-md-3">
          <label class="form-label">Precio (€)</label>
          <input
            type="number"
            v-model.number="nuevoPedido.precio"
            min="0"
            class="form-control text-end"
            required
          />
        </div>

        <div class="col-md-6">
          <label class="form-label">Observaciones</label>
          <input
            type="text"
            v-model="nuevoPedido.observaciones"
            class="form-control"
            placeholder="Detalles o notas adicionales"
          />
        </div>
      </div>

      <!-- Botón Guardar -->
      <div class="text-center">
        <button type="submit" class="btn btn-primary px-4">
          {{ editando ? "Modificar Pedido" : "Guardar Pedido" }}
        </button>
      </div>
    </form>

    <div class="table-responsive">
      <h4 class="text-center w-100">Listado de Pedidos</h4>
      <table class="table table-bordered table-striped table-hover table-sm align-middle">
        <thead class="table-primary text-center">
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Modelo</th>
            <th>Cantidad</th>
            <th>Entrega</th>
            <th>Estado</th>
            <th>Precio (€)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(pedido, index) in pedidosPaginados" :key="pedido.id">
            <td class="text-center">{{ pedido.id }}</td>
            <td>{{ pedido.cliente }}</td>
            <td>{{ pedido.modelo }}</td>
            <td class="text-center">{{ pedido.cantidad }}</td>
            <td class="text-center">{{ pedido.entrega }}</td>
            <td class="text-center">
              <span :class="badgeEstado(pedido.estado)" class="badge px-2 py-1">{{ pedido.estado }}</span>
            </td>
            <td class="text-end">{{ pedido.precio.toFixed(2) }}</td>
            <td class="text-center">
              <button
                @click="editarPedido(pedido)"
                class="btn btn-warning btn-sm me-1 border-0 shadow-none"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                @click="cancelar(pedido.id)"
                class="btn btn-secondary btn-sm me-1 border-0 shadow-none"
              >
                <i class="bi bi-x-circle"></i>
              </button>
              <button
                @click="eliminarPedido(pedido.id)"
                class="btn btn-danger btn-sm border-0 shadow-none"
              >
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Navegación -->
      <div class="d-flex justify-content-center my-3">
        <button
          class="btn btn-outline-primary btn-sm me-2"
          @click="beforePage"
          :disabled="currentPage <= 1"
        >
          <i class="bi bi-chevron-left"></i>
        </button>
        <span class="mx-2 align-self-center text-muted">Página {{ currentPage }}</span>
        <button
          class="btn btn-outline-primary btn-sm"
          @click="nextPage"
          :disabled="currentPage >= totalPages"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import {
  getPedidos,
  addPedido,
  updatePedido,
  cancelarPedido,
  deletePedido
} from "@/api/pedidos.js";

// --- REFS Y ESTADOS ---
const pedidos = ref([]);
const nuevoPedido = ref({
  cliente: "",
  modelo: "",
  cantidad: 1,
  entrega: "",
  estado: "Pendiente",
  tamano: "A3",
  precio: 0,
  observaciones: ""
});
const editando = ref(false);
const pedidoEditandoId = ref(null);

// --- PAGINACIÓN ---
const currentPage = ref(1);
const pedidosPorPage = 6;
const pedidosPaginados = computed(() => {
  const start = (currentPage.value - 1) * pedidosPorPage;
  const end = start + pedidosPorPage;
  return pedidos.value.slice(start, end);
});
const totalPages = computed(() => Math.ceil(pedidos.value.length / pedidosPorPage));
const beforePage = () => { if (currentPage.value > 1) currentPage.value--; };
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };

// --- CARGAR DATOS ---
onMounted(async () => {
  pedidos.value = await getPedidos();
});

// --- GUARDAR PEDIDO ---
const guardarPedido = async () => {
  if (!nuevoPedido.value.cliente || !nuevoPedido.value.modelo || nuevoPedido.value.precio <= 0) {
    Swal.fire({ icon: "warning", title: "Campos obligatorios incompletos", timer: 1500, showConfirmButton: false });
    return;
  }

  const confirmar = await Swal.fire({
    title: editando.value ? "¿Guardar cambios del pedido?" : "¿Registrar nuevo pedido?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: editando.value ? "Modificar" : "Guardar"
  });

  if (!confirmar.isConfirmed) return;

  try {
    if (editando.value) {
      await updatePedido(pedidoEditandoId.value, nuevoPedido.value);
      Swal.fire({ icon: "success", title: "Pedido modificado", timer: 1500, showConfirmButton: false });
    } else {
      await addPedido(nuevoPedido.value);
      Swal.fire({ icon: "success", title: "Pedido guardado", timer: 1500, showConfirmButton: false });
    }

    resetFormulario();
    pedidos.value = await getPedidos();
  } catch (e) {
    Swal.fire({ icon: "error", title: "Error al guardar pedido", text: e.message });
  }
};

// --- EDITAR PEDIDO ---
const editarPedido = (pedido) => {
  nuevoPedido.value = { ...pedido };
  pedidoEditandoId.value = pedido.id;
  editando.value = true;
  Swal.fire({ icon: "info", title: "Editando pedido", timer: 1200, showConfirmButton: false });
};

// --- CANCELAR PEDIDO ---
const cancelar = async (id) => {
  const confirmar = await Swal.fire({ title: "¿Cancelar pedido?", icon: "warning", showCancelButton: true });
  if (!confirmar.isConfirmed) return;
  await cancelarPedido(id);
  pedidos.value = await getPedidos();
  Swal.fire({ icon: "success", title: "Pedido cancelado", timer: 1200, showConfirmButton: false });
};

// --- ELIMINAR PEDIDO ---
const eliminarPedido = async (id) => {
  const confirmar = await Swal.fire({ title: "¿Eliminar definitivamente?", icon: "error", showCancelButton: true });
  if (!confirmar.isConfirmed) return;
  await deletePedido(id);
  pedidos.value = await getPedidos();
  Swal.fire({ icon: "success", title: "Pedido eliminado", timer: 1200, showConfirmButton: false });
};

// --- RESETEAR FORMULARIO ---
const resetFormulario = () => {
  nuevoPedido.value = {
    cliente: "",
    modelo: "",
    cantidad: 1,
    entrega: "",
    estado: "Pendiente",
    tamano: "A3",
    precio: 0,
    observaciones: ""
  };
  editando.value = false;
  pedidoEditandoId.value = null;
};

// --- BADGES DE ESTADO ---
const badgeEstado = (estado) => {
  return {
    "bg-secondary text-white": estado === "Pendiente",
    "bg-warning text-dark": estado === "En producción",
    "bg-success text-white": estado === "Listo" || estado === "Entregado",
    "bg-danger text-white": estado === "Cancelado"
  };
};
</script>

<style scoped>
.gestion-header {
  background-color: #b5caff;
  color: #03306b;
  font-weight: 600;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}
</style>
