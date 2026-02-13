<template>
  <h4
      class="text-center mx-2 my-1 bg-`primary-subtle py-1 bg-opacity-25 p-3 rounded text-primary"
    >
      <i class="bi bi-newspaper me-2"></i> Listado de Facturas
    </h4>
<table
      class="table table-bordered table-striped table-hover table-sm align-middle table-responsive"

      >
      <thead class="thead-dark table-primary text-center">
        <tr>
          <th>Factura</th>
          <th>Fecha</th>
          <th>Modelo</th>
          <th>Precio(€)</th>
          <th>Total(€)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="modelo in citasPaginadas"
          :key="modelo.id"
          class="text-center">
          <td>{{ modelo._id }}</td>
          <td>{{ formatearFecha(modelo.fecha) }}</td>
          <td>{{ modelo.cliente }}</td>
           <td>{{ modelo.total }}</td>
          <td>{{ modelo.total + (modelo.total/2)}}</td>
        </tr>
      </tbody>
    </table>

</template>

<script setup>
import { getFacturas } from "../api/facturas";
import Swal from "sweetalert2";
import { ref, computed, onMounted } from "vue";

const nuevaFactura = ref([]);
const currentPage = ref(1);
const facturasPorPage = 10; // por defecto seria ref(10) y asi con 20 y 30 que sea un boton de checkbox

async function cargarModelos() {
  try {
    nuevaFactura.value = await getFacturas();
  } catch (error) {
    console.error("Fallo al cargar los datos de la bbdd", error);
    Swal.fire({
      icon: "error",
      title: "Error al cargar",
      text: "No se pudieron cargar las facturas.",
      showConfirmButton: true,
    });
  }
}
const citasPaginadas = computed(() => {
  const start = (currentPage.value - 1) * facturasPorPage;
  const end = start + facturasPorPage;
  return nuevaFactura.value.slice(start, end);
});

onMounted(async () => {
  await cargarModelos();
});

const formatearFecha = (fecha) => {
  if (!fecha) return "N/A";
  const date = new Date(fecha);
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const anio = date.getFullYear();
  return `${dia}/${mes}/${anio}`;
};

const totalPrecio = () => {
    const sumaTotal = (nuevaFactura.value.total * (nuevaFactura.value.total*2)); 
    return sumaTotal;
};
</script>

<style scoped></style>