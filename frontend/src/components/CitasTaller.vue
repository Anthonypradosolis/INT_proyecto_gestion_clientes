<template>
<div class="container-fluid my-1 p-3 border rounded-3 shadow-sm bg-light">
    <!-- Título principal -->
    <h4
      class="text-center mx-2 my-1 bg-`primary-subtle py-1 bg-opacity-25  p-3 rounded text-primary" 
    >
      <i class="bi bi-person-gear me-2 "></i>Citas Taller
    </h4>

    <!-- Botón para limpiar formulario -->
    <div class="d-flex justify-content-end">
      <button
        type="button"
        class="btn border border-primary border-2 rounded-0 text-primary shadow-none mt-2 me-2"
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
          >
        </div>

        <!-- Campo fecha -->
        <div class="col-md-4">
          <label class="form-label">Fecha Cita</label>
          <input
            type="date"
            class="form-control"
            v-model="nuevoModelo.fechaAlta"
            required
          />
        </div>

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

        <div class="col-md-4 d-flex ">
          <label for="marca" class="form-label">Estado Cita: </label>
          <div class="ms-3">
            <label for="combustible1"
              >Pendiente:
              <input
                type="radio"
                v-model="nuevoModelo.combustible"
                value="Pendiente"
                class="form-input"
            /></label>
          </div>
          <div class="ms-3">
            <label for="combustible2"
              >Finalizado:
              <input
                type="radio"
              v-model="nuevoModelo.combustible"
              value="Finalizado"
              class="form-input"
            /></label>
          </div>

        </div>
      </div>
      
      <div
        class="form-check d-flex align-items-center mt-2 me-2"
      >
        <label for="ITV"
          >Acepta Presupuesto
          <input
            type="checkbox"
            v-model="nuevoModelo.acepta"
            class="form-check-input" 
            required
        /></label>
      </div>
      <!-- Botón de acción: Añadir o Modificar -->
      <button
        type="submit"
        class="btn btn-primary mt-3"
      >
        {{ editando ? "Modificar" : "Añadir" }}
      </button>
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
        <tr v-for="modelo in nuevaCita" :key="modelo.id" class="text-center">
          <td>{{ modelo.id}}</td>
          <td>{{ modelo.fechaAlta }}</td>
          <td>{{ modelo.matricula }}</td>
          <td>{{ modelo.movilCliente }}</td>
          <td>{{ modelo.servicioTaller }}</td>
          <td>{{ modelo.estadoCita }}</td>
          <td class="align-middle text-center">
            <!-- Botón para eliminar un modelo -->
            <button
              class="btn btn-danger btn-sm border-0 ms-4 me-2 shadow-none rounded-0"
              @click="borrarModelo(modelo.id)"
            >
              <i class="bi bi-trash"></i>
            </button>

            <!-- Botón para editar un modelo -->
            <button
              class="btn btn-warning btn-sm shadow-none rounded-0"
              @click="editarModelo(modelo.id)"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <button
              v-if="modelo.roto === true"
              @click="rotoModelo(modelo)"
              class="btn btn-secondary btn-sm ms-2 border-0 shadow-none rounded-0"
              title="Activar cliente"
            >
              <i class="bi bi-unlock"></i>
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

</template>
<script setup>
import { ref,computed ,  onMounted} from "vue";
import Swal from "sweetalert2";
import { getCitas, addCita, updateCita, deleteCita } from "../api/taller";

const nuevaCita = ref([]);
const nuevoModelo = ref({
    matricula: "",
    movilCliente: "",
    fechaAlta: "",
    servicioTaller: "",
    estadoCita: "Pendiente",
    acepta: false,
});


// --- PAGINACIÓN ---
const currentPage = ref(1);
const pedidosPorPage = 5;
const pedidosPaginados = computed(() => {
  const start = (currentPage.value - 1) * pedidosPorPage;
  const end = start + pedidosPorPage;
  return pedidos.value.slice(start, end);
});
const totalPages = computed(() => Math.ceil(nuevaCita.value.length / pedidosPorPage));
const beforePage = () => { if (currentPage.value > 1) currentPage.value--; };
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };



async function cargarModelos() {
    try {
        Swal.fire({
        icon: 'success',
        title: "Listando Modelos...",
        showConfirmButton: false,
        timer: 1500
        });
        nuevaCita.value = await getCitas()
    } catch (error) {
        console.error("Fallo al cargar los datos de la bbdd", error)
    }
}

const opcionesTipo= [
    "revision",
    "preITV",
    "neumaticos",
    "frenos",
    "cambios de aceite"
];

const editando = ref(false);
const modeloEditandoId = ref("");

onMounted(async () =>  {
    await cargarModelos();
})

async function guardarModelo() {
    if (!nuevoModelo.value.matricula.trim() || !nuevoModelo.value.movilCliente.trim()) {
        alert("Debes rellenar todos los campos")
        return;   
    }
    const result = 
        await Swal.fire({
        title: editando.value
        ? "¿Desea modificar este modelo?"
        : "¿Desea guardar este modelo?",
        icon: "warning",
        showCancelButton: true,
        showConfirmButton: editando.value ? "Modificar" : "Añadir" ,
        cancelButtonText : "Cancelar"
        });
        if (!result.isConfirmed){return}  //el return hace que se pare el método actual

        if (editando.value) {
            const index = nuevaCita.value.findIndex((modelo) => modelo.id === modeloEditandoId.value)
            if (index !== -1) {
                nuevaCita.value[index] = {...nuevoModelo.value}
                
            }
            try {
                await updateCita(modeloEditandoId.value, nuevoModelo.value)
                Swal.fire({
                    icon: "success",
                    title: "Modelo actualizado exitosamente",
                    showConfirmButton: false,
                    timer: 1500
                });
                limpiarPagina();
                
            } catch (error) {
                console.error("Error al actualizar el modelo", error)
                Swal.fire({
                    icon: "error",
                    title: "Error al actualizar el modelo",
                    text: "Inténtelo de nuevo más tarde.",
                    showConfirmButton: false,
                    timer: 1500
                });
            }

        }else{
            const modeloNuevo = {
                id:String(nuevaCita.value.length > 0 ? nuevaCita.value.length + 1 : 1),
                matricula: nuevoModelo.value.matricula,
                movilCliente: nuevoModelo.value.movilCliente,
                fechaAlta: nuevoModelo.value.fechaAlta,
                servicioTaller: nuevoModelo.value.servicioTaller,
                estadoCita:nuevoModelo.value.estadoCita,
                acepta:nuevoModelo.value.acepta,
            }

            try {
                await addCita(modeloNuevo)
                nuevaCita.value.push(modeloNuevo)
                Swal.fire({
                    icon: "success",
                    title: "Modelo agregado exitosamente",
                    showConfirmButton: false,
                    timer: 1500
                });
            } catch (error) {
                console.error("Error al agregar el modelo", error)
                Swal.fire({
                    icon: "error",
                    title: "Error al agregar el modelo",
                    text: "Inténtelo de nuevo más tarde.",
                    showConfirmButton: false,
                    timer: 1500
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
            cancelButtonText: "Cancelar"
        });

        if (!result.isConfirmed) { return; }

        await deleteCita(id);
        nuevaCita.value = nuevaCita.value.filter((modelo) => modelo.id !== id);
        Swal.fire({
            icon: "success",
            title: "Modelo eliminado exitosamente",
            showConfirmButton: false,
            timer: 1500
        });
    } catch (error) {
        console.error("Error al eliminar la cita", error)
        Swal.fire({
            icon: "error",
            title: "Error al eliminar el modelo",
            text: "Inténtelo de nuevo más tarde.",
            showConfirmButton: false,
            timer: 1500
        });
    }
    
}

async function editarModelo(id) {
    editando.value = true;
    nuevoModelo.value = {...nuevaCita.value.find((modelo) => modelo.id === id)};
    modeloEditandoId.value = id;
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
}

// Validaciones básicas de email y móvil
const emailValido = ref(true);
const validarEmail = () => {
  const email = nuevoModelo.value.movilCliente.trim();
  // Expresión simple para email válido
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  emailValido.value = regex.test(email);
};


</script>
<style scoped>


</style>