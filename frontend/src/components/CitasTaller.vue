<template>
  <div class="container-fluid my-1 p-3 border rounded-3 shadow-sm bg-light">
    <!-- Título principal -->
    <h4
      class="text-center mx-2 my-1 bg-`primary-subtle py-1 bg-opacity-25 p-3 rounded text-primary"
    >
      <i class="bi bi-person-gear me-2"></i>Citas Taller
    </h4>

    <!-- Botones de acción -->
    <div class="d-flex justify-content-end gap-2">
      <button
        type="button"
        class="btn btn-success rounded-0 shadow-none mt-2"
        @click="imprimirCitas"
        title="Imprimir listado de citas"
        :disabled="nuevaCita.length === 0"
      >
        <i class="bi bi-printer me-2"></i>Imprimir
      </button>
      <button
        type="button"
        class="btn border border-primary border-2 rounded-0 text-primary shadow-none mt-2"
        style="--bs-btn-hover-bg: var(--bs-primary-bg-subtle)"
        @click="limpiarPagina"
        title="Limpiar formulario"
      >
        <i class="bi bi-arrow-counterclockwise"></i>
      </button>
    </div>

    <!-- Formulario para añadir o modificar modelos -->
    <form @submit.prevent="guardarModelo" class="mb-4">
      <div class="row g-3 align-items-end">
        <!-- Campo de matricula -->
        <div class="col-md-4">
          <label for="matricula" class="form-label">Matricula</label>
          <input
            type="text"
            class="form-control"
            id="matricula"
            pattern="[0-9]{4}[A-Za-z]{3}"
            v-model="nuevoModelo.matricula"
            required
          />
        </div>

        <!-- Selector de email -->
        <div class="col-md-4">
          <label for="email" class="form-label">Email:</label>
          <input
            type="email"
            class="form-control"
            id="email"
            v-model="nuevoModelo.movilCliente"
            @blur="validarEmail('email')"
            :class="{ 'is-invalid': !emailValido }"
            required
          />
        </div>

        <!-- Campo fecha -->
        <div class="col-md-4">
          <label for="fechaCita" class="form-label">Fecha Cita</label>
          <input
            type="date"
            id="fechaCita"
            class="form-control"
            v-model="nuevoModelo.fechaAlta"
            required
          />
        </div>
        <!-- Servicio Taller-->
        <div class="col-md-4">
          <label for="servicio" class="form-label">Servicio Taller</label>
          <select
            id="servicio"
            v-model="nuevoModelo.servicioTaller"
            class="form-select"
            required
          >
            <option disabled value="">Seleccione un tipo</option>
            <option
              v-for="option in opcionesTipo"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>
        <!-- Estado cita -->
        <div class="col-md-4 d-flex">
          <label class="form-label">Estado Cita: </label>
          <div class="ms-3">
            <label for="estadoCita1"
              >Pendiente:
              <input
                type="radio"
                id="estadoCita1"
                v-model="nuevoModelo.estadoCita"
                value="Pendiente"
                class="form-input"
            /></label>
          </div>
          <div class="ms-3">
            <label for="estadoCita2"
              >Finalizado:
              <input
                type="radio"
                id="estadoCita2"
                v-model="nuevoModelo.estadoCita"
                value="Finalizado"
                class="form-input"
            /></label>
          </div>
        </div>
      </div>
      <!--Aceptar presupuesto-->
      <div class="form-check d-flex align-items-center mt-2 me-2">
        <label for="acepta"
          >Acepta Presupuesto
          <input
            type="checkbox"
            id="acepta"
            v-model="nuevoModelo.acepta"
            class="form-check-input"
            required
        /></label>
      </div>
      <!-- Botón de acción: Añadir o Modificar -->
      <button type="submit" class="btn btn-primary mt-3 me-2" >
        {{ editando ? "Modificar" : "Añadir" }}
      </button>
      
      <label for="estadoCitas" class="btn btn-warning">Pendientes</label>
    </form>

    <!-- Tabla que muestra la lista de Modelos cargados -->
    <table
      class="table table-bordered table-striped table-hover table-sm align-middle table-responsive"

      >
      <thead class="thead-dark table-primary text-center">
        <tr>
          <th>ID</th>
          <th>FechaCita</th>
          <th>Matricula</th>
          <th>MovilEmail</th>
          <th>ServicioTaller</th>
          <th>EstadoCita</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="modelo in citasPaginadas"
          :key="modelo.id"
          class="text-center"
        >
          <td>{{ modelo.id }}</td>
          <td>{{ formatearFecha(modelo.fechaAlta) }}</td>
          <td>{{ modelo.matricula }}</td>
          <td>{{ modelo.movilCliente }}</td>
          <td>{{ modelo.servicioTaller }}</td>
          <td>
            <span
              class="badge"
              :class="{
                'bg-warning text-dark': modelo.estadoCita === 'Pendiente',
                'bg-success': modelo.estadoCita === 'Finalizado',
              }"
            >
              {{ modelo.estadoCita }}
            </span>
          </td>
          <td class="align-middle text-center">
            <!-- Botón para editar un modelo -->
            <button
              class="btn btn-warning btn-sm shadow-none rounded-0 me-2"
              @click="editarModelo(modelo.id)"
              title="Editar cita"
            >
              <i class="bi bi-pencil"></i>
            </button>

            <!-- Botón para eliminar un modelo -->
            <button
              class="btn btn-danger btn-sm border-0 shadow-none rounded-0"
              @click="borrarModelo(modelo.id)"
              title="Eliminar cita"
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
      <span class="mx-2 align-self-center text-muted"
        >Página {{ currentPage }}</span
      >
      <button
        class="btn btn-outline-primary btn-sm"
        @click="nextPage"
        :disabled="currentPage >= totalPages"
      >
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import { getCitas, addCita, updateCita, deleteCita } from "../api/taller";
import jsPDF from "jspdf";
import "jspdf-autotable";

const nuevaCita = ref([]);
const nuevoModelo = ref({
  matricula: "",
  movilCliente: "",
  fechaAlta: "",
  servicioTaller: "",
  estadoCita: "Pendiente",
  acepta: false,
});

const filtros = ref({
  estadoCita: "",
})


const citasFiltrados = computed(()=>{
  let resultado = [...nuevaCita.value];

  if(filtros.value.estadoCita){
    resultado = resultado.filter(v=> v.estadoCita === filtros.value.estadoCita);
  }
  return resultado;
})

// --- PAGINACIÓN ---
const currentPage = ref(1);
const citasPorPage = 5;
const citasPaginadas = computed(() => {
  const start = (currentPage.value - 1) * citasPorPage;
  const end = start + citasPorPage;
  return nuevaCita.value.slice(start, end);
});
const totalPages = computed(() =>
  Math.ceil(nuevaCita.value.length / citasPorPage),
);
const beforePage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

async function cargarModelos() {
  try {
    nuevaCita.value = await getCitas();
  } catch (error) {
    console.error("Fallo al cargar los datos de la bbdd", error);
    Swal.fire({
      icon: "error",
      title: "Error al cargar",
      text: "No se pudieron cargar las citas del taller.",
      showConfirmButton: true,
    });
  }
}

const opcionesTipo = [
  "revision",
  "preITV",
  "neumaticos",
  "frenos",
  "cambios de aceite",
];

const editando = ref(false);
const modeloEditandoId = ref("");

onMounted(async () => {
  await cargarModelos();
});

async function guardarModelo() {
  if (
    !nuevoModelo.value.matricula.trim() ||
    !nuevoModelo.value.movilCliente.trim()
  ) {
    Swal.fire({
      icon: "error",
      title: "Campos incompletos",
      text: "Debes rellenar todos los campos obligatorios.",
      showConfirmButton: true,
    });
    return;
  }

  // Validar email antes de guardar
  validarEmail();
  if (!emailValido.value) {
    Swal.fire({
      icon: "error",
      title: "Email inválido",
      text: "Por favor, introduce un email válido.",
      showConfirmButton: true,
    });
    return;
  }

  // Validar que se haya seleccionado una fecha
  if (!nuevoModelo.value.fechaAlta) {
    Swal.fire({
      icon: "error",
      title: "Fecha requerida",
      text: "Debes seleccionar una fecha para la cita.",
      showConfirmButton: true,
    });
    return;
  }

  // Validar que la matrícula sea única
  const matriculaExistente = nuevaCita.value.find(
    (cita) =>
      cita.matricula.toUpperCase() ===
        nuevoModelo.value.matricula.toUpperCase() &&
      cita.id !== modeloEditandoId.value,
  );

  if (matriculaExistente) {
    Swal.fire({
      icon: "error",
      title: "Matrícula duplicada",
      text: "La matrícula no se puede repetir. Ya existe una cita con esta matrícula.",
      showConfirmButton: true,
    });
    return;
  }

  const result = await Swal.fire({
    title: editando.value
      ? "¿Desea modificar este modelo?"
      : "¿Desea guardar este modelo?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: editando.value ? "Modificar" : "Añadir",
    cancelButtonText: "Cancelar",
  });
  if (!result.isConfirmed) {
    return;
  } //el return hace que se pare el método actual

  if (editando.value) {
    try {
      await updateCita(modeloEditandoId.value, nuevoModelo.value);

      // Recargar citas desde el servidor
      await cargarModelos();

      Swal.fire({
        icon: "success",
        title: "Cita actualizada exitosamente",
        showConfirmButton: false,
        timer: 1500,
      });
      limpiarPagina();
    } catch (error) {
      console.error("Error al actualizar la cita", error);
      Swal.fire({
        icon: "error",
        title: "Error al actualizar la cita",
        text: "Inténtelo de nuevo más tarde.",
        showConfirmButton: true,
      });
    }
  } else {
    const modeloNuevo = {
      id: String(
        nuevaCita.value.length > 0
          ? Math.max(...nuevaCita.value.map((c) => parseInt(c.id) || 0)) + 1
          : 1,
      ),
      matricula: nuevoModelo.value.matricula,
      movilCliente: nuevoModelo.value.movilCliente,
      fechaAlta: nuevoModelo.value.fechaAlta,
      servicioTaller: nuevoModelo.value.servicioTaller,
      estadoCita: nuevoModelo.value.estadoCita,
      acepta: nuevoModelo.value.acepta,
    };

    try {
      await addCita(modeloNuevo);

      // Recargar citas desde el servidor
      await cargarModelos();

      Swal.fire({
        icon: "success",
        title: "Cita agregada exitosamente",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error al agregar la cita", error);
      Swal.fire({
        icon: "error",
        title: "Error al agregar la cita",
        text: "Inténtelo de nuevo más tarde.",
        showConfirmButton: true,
      });
    }
  }
  limpiarPagina();
}

async function borrarModelo(id) {
  try {
    const result = await Swal.fire({
      title: "¿Está seguro de que desea eliminar esta cita?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) {
      return;
    }

    await deleteCita(id);

    // Recargar citas desde el servidor
    await cargarModelos();

    Swal.fire({
      icon: "success",
      title: "Cita eliminada exitosamente",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    console.error("Error al eliminar la cita", error);
    Swal.fire({
      icon: "error",
      title: "Error al eliminar la cita",
      text: "Inténtelo de nuevo más tarde.",
      showConfirmButton: true,
    });
  }
}

async function editarModelo(id) {
  const citaEncontrada = nuevaCita.value.find((modelo) => modelo.id === id);

  if (!citaEncontrada) {
    Swal.fire({
      icon: "error",
      title: "Cita no encontrada",
      text: "No se pudo encontrar la cita seleccionada.",
      showConfirmButton: true,
    });
    return;
  }

  editando.value = true;
  nuevoModelo.value = { ...citaEncontrada };
  modeloEditandoId.value = id;

  // Scroll al inicio del formulario
  window.scrollTo({ top: 0, behavior: "smooth" });

  Swal.fire({
    icon: "info",
    title: "Cita cargada",
    text: "Puede modificar los datos y guardar los cambios.",
    timer: 2000,
    showConfirmButton: false,
  });
}

function limpiarPagina() {
  nuevoModelo.value = {
    matricula: "",
    movilCliente: "",
    fechaAlta: "",
    servicioTaller: "",
    estadoCita: "Pendiente",
    acepta: false,
  };
  editando.value = false;
  modeloEditandoId.value = "";
  emailValido.value = true; // Resetear validación de email
}

// Validaciones básicas de email
const emailValido = ref(true);
const validarEmail = () => {
  const email = nuevoModelo.value.movilCliente.trim();
  if (email === "") {
    emailValido.value = true;
    return;
  }
  // Expresión simple para email válido
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  emailValido.value = regex.test(email);
};

// Función para formatear la fecha
const formatearFecha = (fecha) => {
  if (!fecha) return "N/A";
  const date = new Date(fecha);
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const anio = date.getFullYear();
  return `${dia}/${mes}/${anio}`;
};

// Función para imprimir el listado de citas
const imprimirCitas = () => {
  if (nuevaCita.value.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Sin datos",
      text: "No hay citas para imprimir.",
      showConfirmButton: true,
    });
    return;
  }

  const doc = new jsPDF();

  // Título
  doc.setFontSize(16);
  doc.text("Listado de Citas del Taller", 105, 15, { align: "center" });

  // Fecha actual
  doc.setFontSize(10);
  const fechaActual = new Date().toLocaleDateString("es-ES");
  doc.text(`Fecha de impresión: ${fechaActual}`, 105, 22, { align: "center" });

  // Preparar datos para la tabla
  const tableData = nuevaCita.value.map((cita) => [
    cita.id,
    formatearFecha(cita.fechaAlta),
    cita.matricula,
    cita.movilCliente,
    cita.servicioTaller,
    cita.estadoCita,
  ]);

  // Generar tabla
  doc.autoTable({
    startY: 28,
    head: [["ID", "Fecha Cita", "Matrícula", "Email", "Servicio", "Estado"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [13, 110, 253] },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { halign: "center", cellWidth: 15 },
      1: { halign: "center", cellWidth: 28 },
      2: { halign: "center", cellWidth: 25 },
      3: { cellWidth: 50 },
      4: { cellWidth: 35 },
      5: { halign: "center", cellWidth: 25 },
    },
  });

  // Guardar PDF
  doc.save(`citas-taller-${new Date().getTime()}.pdf`);

  Swal.fire({
    icon: "success",
    title: "PDF generado",
    text: "El listado de citas se ha exportado correctamente.",
    timer: 2000,
    showConfirmButton: false,
  });
};
</script>
<style scoped></style>
