<template>
  <div class="container-fluid my-4 p-4 border rounded-4 shadow-lg bg-white">
    <h4
      class="text-center mb-4 fw-semibold text-primary border-bottom pb-2 mt-2"
    >
      <i class="bi bi-car-front me-2"></i>Registro de Vehículos
    </h4>

    <form @submit.prevent="guardarVehiculo" class="mb-2 mt-1">
      <!-- FILA: Tipo, Marca, Modelo -->
      <div class="row g-3 align-items-center mt-1">
        <div class="col-12 col-md-3 d-flex align-items-center">
          <label class="form-label mb-0 me-3 text-nowrap">Tipo:</label>
          <div class="d-flex align-items-center">
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="tipo-coche"
                value="coche"
                v-model="vehiculo.tipo"
              />
              <label class="form-check-label" for="tipo-coche">Coche</label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="tipo-furgoneta"
                value="furgoneta"
                v-model="vehiculo.tipo"
              />
              <label class="form-check-label" for="tipo-furgoneta"
                >Furgoneta</label
              >
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="tipo-moto"
                value="moto"
                v-model="vehiculo.tipo"
              />
              <label class="form-check-label" for="tipo-moto">Moto</label>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center">
          <label for="marca" class="form-label mb-0 me-3 text-nowrap"
            >Marca:</label
          >
          <input
            type="text"
            id="marca"
            v-model="vehiculo.marca"
            @blur="capitalizarTexto('marca')"
            class="form-control rounded-0 shadow-none border"
            required
          />
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center">
          <label for="modelo" class="form-label mb-0 me-3 text-nowrap"
            >Modelo:</label
          >
          <input
            type="text"
            id="modelo"
            v-model="vehiculo.modelo"
            @blur="capitalizarTexto('modelo')"
            class="form-control rounded-0 shadow-none border"
            required
          />
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center">
          <label for="matricula" class="form-label mb-0 me-3 text-nowrap"
            >Matrícula:</label
          >
          <input
            type="text"
            id="matricula"
            v-model="vehiculo.matricula"
            @blur="convertirMatriculaMayusculas"
            class="form-control rounded-0 shadow-none border"
            :disabled="editando"
          />
          <button
            type="button"
            class="btn btn-primary ms-2 border-0 shadow-none rounded-0"
            @click="buscarPorMatricula(vehiculo.matricula)"
            title="Buscar por matrícula"
          >
            <i class="bi bi-search"></i>
          </button>
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center">
          <label for="anio" class="form-label mb-0 me-3 text-nowrap"
            >Año:</label
          >
          <select
            id="anio"
            v-model="vehiculo.anio"
            class="form-select rounded-0 shadow-none border"
            required
          >
            <option disabled value="">Seleccione</option>
            <option v-for="anio in aniosDisponibles" :key="anio" :value="anio">
              {{ anio }}
            </option>
          </select>
        </div>
      </div>

      <!-- FILA: Año, Kilómetros, Precio -->
      <div class="row g-3 align-items-center mt-2">
        <div class="col-12 col-md-2 d-flex align-items-center">
          <label for="kilometros" class="form-label mb-0 me-3 text-nowrap"
            >Kilómetros:</label
          >
          <input
            type="number"
            id="kilometros"
            v-model="vehiculo.kilometros"
            class="form-control rounded-0 shadow-none border text-end"
            required
          />
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center">
          <label for="precio" class="form-label mb-0 me-3 text-nowrap"
            >Precio (€):</label
          >
          <input
            type="number"
            id="precio"
            v-model="vehiculo.precio"
            class="form-control rounded-0 shadow-none border text-end"
            required
          />
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center">
          <label for="combustible" class="form-label mb-0 me-3 text-nowrap"
            >Combustible:</label
          >
          <select
            id="combustible"
            v-model="vehiculo.combustible"
            class="form-select rounded-0 shadow-none border"
          >
            <option disabled value="">Seleccione</option>
            <option>Gasolina</option>
            <option>Diésel</option>
            <option>Híbrido</option>
            <option>GLP</option>
            <option>Eléctrico</option>
          </select>
        </div>

        <div class="col-12 col-md-3 d-flex align-items-center">
          <label class="form-label mb-0 me-3 text-nowrap">Transmisión:</label>
          <div class="d-flex align-items-center">
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="transmision-manual"
                value="coche"
                v-model="vehiculo.transmision"
              />
              <label class="form-check-label" for="transmision-manual"
                >Manual</label
              >
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="transmision-automatica"
                value="automatica"
                v-model="vehiculo.transmision"
              />
              <label class="form-check-label" for="transmision-automatica"
                >Automática</label
              >
            </div>
          </div>
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center">
          <label for="potencia" class="form-label mb-0 me-3 text-nowrap"
            >Potencia (CV):</label
          >
          <input
            type="number"
            id="potencia"
            v-model="vehiculo.potencia_cv"
            class="form-control rounded-0 shadow-none border text-end"
          />
        </div>
      </div>
      <!-- FILA: Descripción -->
      <div class="col g-2 mt-3">
        <label for="descripcion" class="form-label">Descripción:</label>
        <textarea
          id="descripcion"
          v-model="vehiculo.descripcion"
          rows="3"
          class="form-control rounded shadow-none border mb-2"
          placeholder="Describe el estado, revisiones, etc."
        >
        </textarea>
      </div>

      <!-- FILA: Imagen del vehículo-->
      <div class="row g-3 align-items-center mb-3">
        <div class="col-12 col-md-3 d-flex align-items-center">
          <label for="foto" class="form-label mb-0 me-2 text-nowrap"
            >Imagen del Vehículo:</label
          >
          <input
            type="file"
            id="foto"
            accept="image/*"
            @change="onFileChange"
            class="form-control-file col-md-10 border rounded-0 shadow-none btn-file-azul"
          />
        </div>
      </div>

      <h6 class="text-center fw-semibold bg-primary-subtle py-1 rounded">
        <i class="bi bi-person me-2"></i>Cliente Ubicación
      </h6>
      <!-- FILA: Ubicación -->
      <div class="row g-3 align-items-center mt-3">
        <div class="col-12 col-md-4">
          <label for="provincia" class="form-label">Provincia:</label>
          <select
            id="provincia"
            v-model="vehiculo.ubicacion.provincia"
            class="form-select rounded shadow-none border"
            @change="filtrarCiudades"
          >
            <option disabled value="">Seleccione provincia</option>
            <option v-for="prov in provincias" :key="prov.id" :value="prov.nm">
              {{ prov.nm }}
            </option>
          </select>
        </div>

        <div class="col-12 col-md-4">
          <label for="ciudad" class="form-label">Ciudad:</label>
          <select
            id="ciudad"
            v-model="vehiculo.ubicacion.ciudad"
            class="form-select rounded shadow-none border"
          >
            <option disabled value="">Seleccione ciudad</option>
            <option
              v-for="mun in municipiosFiltrados"
              :key="mun.id"
              :value="mun.nm"
            >
              {{ mun.nm }}
            </option>
          </select>
        </div>

        <div class="col-12 col-md-4">
          <label for="fecha_publicacion" class="form-label"
            >Fecha Publicación:</label
          >
          <input
            type="date"
            id="fecha_publicacion"
            v-model="vehiculo.fecha_publicacion"
            class="form-control rounded shadow-none border"
          />
        </div>
      </div>

      <!-- FILA: Contacto -->
      <div class="row g-3 align-items-center mt-3">
        <div class="col-12 col-md-4">
          <label for="contacto_nombre" class="form-label"
            >Nombre Contacto:</label
          >
          <input
            type="text"
            id="contacto_nombre"
            v-model="vehiculo.contacto.nombre"
            @blur="capitalizarContacto('nombre')"
            class="form-control rounded shadow-none border"
          />
        </div>
        <div class="col-12 col-md-4">
          <label for="contacto_telefono" class="form-label">Teléfono:</label>
          <input
            type="tel"
            id="contacto_telefono"
            v-model="vehiculo.contacto.telefono"
            @blur="validarTelefono"
            class="form-control rounded shadow-none border text-center"
            :class="{ 'is-invalid': !telefonoValido }"
          />
          <div v-if="!telefonoValido" class="invalid-feedback">
            Teléfono inválido (debe empezar por 6 o 7 y tener 9 dígitos).
          </div>
        </div>
        <div class="col-12 col-md-4">
          <label for="contacto_email" class="form-label">Email:</label>
          <input
            type="email"
            id="contacto_email"
            v-model="vehiculo.contacto.email"
            @blur="validarEmail"
            class="form-control rounded shadow-none border"
            :class="{ 'is-invalid': !emailValido }"
          />
          <div v-if="!emailValido" class="invalid-feedback">
            Email inválido.
          </div>
        </div>
      </div>

      <!-- FILA: Estado -->
      <div class="row g-3 align-items-center mt-3">
        <div class="col-12 col-md-4">
          <label for="estado" class="form-label">Estado:</label>
          <select
            id="estado"
            v-model="vehiculo.estado"
            class="form-select rounded shadow-none border"
          >
            <option value="disponible">Disponible</option>
            <option value="vendido">Vendido</option>
            <option value="reservado">Reservado</option>
          </select>
        </div>
      </div>

      <!-- FILA: Botones centrados -->
      <div class="d-flex align-items-center justify-content-center gap-3 mt-4">
        <button
          class="btn btn-primary rounded border shadow-none px-4"
          type="submit"
        >
          {{ editando ? "Modificar" : "Guardar" }}
        </button>

        <button
          class="btn btn-secondary rounded border shadow-none px-4"
          type="button"
          @click="limpiarFormulario"
        >
          <i class="bi bi-arrow-clockwise me-2"></i>Limpiar
        </button>

        <button
          class="btn btn-success rounded border shadow-none px-4"
          type="button"
          @click="imprimirTabla"
        >
          <i class="bi bi-printer me-2"></i>Imprimir
        </button>
      </div>
    </form>

    <!-- TABLA DE VEHÍCULOS -->
    <div class="mt-5" v-if="vehiculos.length > 0">
      <h5 class="text-center mb-3 fw-semibold text-primary border-bottom pb-2">
        <i class="bi bi-table me-2"></i>Listado de Vehículos
      </h5>
      <div class="table-responsive">
        <table
          class="table table-bordered table-striped table-hover align-middle"
        >
          <thead class="table-primary">
            <tr>
              <th class="text-center">Matrícula</th>
              <th class="text-center">Marca</th>
              <th class="text-center">Modelo</th>
              <th class="text-center">Estado</th>
              <th class="text-center">Contacto</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in vehiculos" :key="index">
              <td class="text-center">{{ item.matricula || "N/A" }}</td>
              <td>{{ item.marca }}</td>
              <td>{{ item.modelo }}</td>
              <td class="text-center">
                <span
                  class="badge"
                  :class="{
                    'bg-success': item.estado === 'disponible',
                    'bg-danger': item.estado === 'vendido',
                    'bg-warning text-dark': item.estado === 'reservado',
                  }"
                >
                  {{ item.estado }}
                </span>
              </td>
              <td>
                {{ item.contacto.nombre }}<br />
                <small class="text-muted">{{ item.contacto.telefono }}</small>
              </td>
              <td class="text-center">
                <button
                  class="btn btn-sm btn-warning me-2"
                  @click="cargarVehiculo(item)"
                  title="Editar vehículo"
                >
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  @click="eliminarVehiculo(item._id)"
                  title="Eliminar vehículo"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import Swal from "sweetalert2";
import { ref, computed, onMounted } from "vue";
import { addArticulo, getArticulos, updateArticulo, deleteArticulo } from "@/api/articulos.js";
import provmuniData from "@/data/provmuni.json";
import jsPDF from "jspdf";
import "jspdf-autotable";

const vehiculo = ref({
  tipo: "",
  matricula: "",
  marca: "",
  modelo: "",
  anio: "",
  estado: "",
  kilometros: "",
  precio: "",
  combustible: "",
  transmision: "",
  potencia_cv: "",
  descripcion: "",
  ubicacion: {
    provincia: "",
    ciudad: "",
  },
  contacto: {
    nombre: "",
    telefono: "",
    email: "",
  },
  fecha_publicacion: "",
  estado: "disponible",
});

const editando = ref(false);
const vehiculoEditandoId = ref(null);
const vehiculos = ref([]);

// Generar array de años desde 1990 hasta el año actual + 1
const aniosDisponibles = computed(() => {
  const anioActual = new Date().getFullYear();
  const anios = [];
  for (let i = anioActual + 1; i >= 1990; i--) {
    anios.push(i);
  }
  return anios;
});

// Cargar vehículos al montar el componente
onMounted(async () => {
  await cargarVehiculos();
});

// Función para cargar todos los vehículos
const cargarVehiculos = async () => {
  try {
    const data = await getArticulos();
    vehiculos.value = data;
  } catch (error) {
    console.error("Error al cargar vehículos:", error);
  }
};

// Cargar provincias y municipios desde JSON
const provincias = ref(provmuniData.provincias);
const municipios = ref(provmuniData.municipios);
const municipiosFiltrados = ref([]);

// Filtrar municipios según provincia seleccionada
const filtrarCiudades = () => {
  const nombreProv = vehiculo.value.ubicacion.provincia;
  const prov = provincias.value.find((p) => p.nm === nombreProv);
  if (!prov) {
    municipiosFiltrados.value = [];
    return;
  }
  const codigoProv = prov.id.slice(0, 2);
  municipiosFiltrados.value = municipios.value.filter((m) =>
    m.id.startsWith(codigoProv)
  );
  vehiculo.value.ubicacion.ciudad = "";
};

const capitalizarTexto = (campo) => {
  const texto = vehiculo.value[campo] ?? "";
  if (texto.trim() === "") return;
  vehiculo.value[campo] = texto
    .toLowerCase()
    .split(" ")
    .map((palabra) => {
      if (!palabra) return "";
      return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    })
    .join(" ");
};

const capitalizarContacto = (campo) => {
  const texto = vehiculo.value.contacto[campo] ?? "";
  if (texto.trim() === "") return;
  vehiculo.value.contacto[campo] = texto
    .toLowerCase()
    .split(" ")
    .map((palabra) => {
      if (!palabra) return "";
      return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    })
    .join(" ");
};

// Convertir matrícula a mayúsculas al salir del campo
const convertirMatriculaMayusculas = () => {
  const m = vehiculo.value.matricula ?? "";
  if (m.trim() === "") return;
  vehiculo.value.matricula = m.toUpperCase();
};

// Validar teléfono
const telefonoValido = ref(true);
const telefonoRegex = /^[67]\d{8}$/;

const validarTelefono = () => {
  const telefono = vehiculo.value.contacto.telefono.trim();

  if (telefono === "") {
    telefonoValido.value = true; // Vacío = válido (opcional)
    return true;
  }

  if (telefono.charAt(0) === "6" || telefono.charAt(0) === "7") {
    telefonoValido.value = telefonoRegex.test(telefono);
    return telefonoValido.value;
  } else {
    telefonoValido.value = false;
    return false;
  }
};

// Validar email
const emailValido = ref(true);
const validarEmail = () => {
  const email = vehiculo.value.contacto.email.trim();
  if (email === "") {
    emailValido.value = true; // Vacío = válido (opcional)
    return true;
  }
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  emailValido.value = regex.test(email);
};

// Enviar datos al backend
const guardarVehiculo = async () => {
  // Validar campos obligatorios
  if (!vehiculo.value.tipo) {
    Swal.fire({
      icon: "error",
      title: "Campo obligatorio",
      text: "Debe seleccionar el tipo de vehículo.",
      showConfirmButton: true,
    });
    return;
  }

  if (!vehiculo.value.marca || !vehiculo.value.modelo || !vehiculo.value.anio) {
    Swal.fire({
      icon: "error",
      title: "Campos obligatorios",
      text: "Marca, modelo y año son campos obligatorios.",
      showConfirmButton: true,
    });
    return;
  }

  if (!vehiculo.value.kilometros || !vehiculo.value.precio) {
    Swal.fire({
      icon: "error",
      title: "Campos obligatorios",
      text: "Kilómetros y precio son campos obligatorios.",
      showConfirmButton: true,
    });
    return;
  }

  if (!vehiculo.value.combustible) {
    Swal.fire({
      icon: "error",
      title: "Campo obligatorio",
      text: "Debe seleccionar el tipo de combustible.",
      showConfirmButton: true,
    });
    return;
  }

  if (!vehiculo.value.transmision) {
    Swal.fire({
      icon: "error",
      title: "Campo obligatorio",
      text: "Debe seleccionar el tipo de transmisión.",
      showConfirmButton: true,
    });
    return;
  }

  if (!vehiculo.value.ubicacion.provincia || !vehiculo.value.ubicacion.ciudad) {
    Swal.fire({
      icon: "error",
      title: "Campos obligatorios",
      text: "Provincia y ciudad son campos obligatorios.",
      showConfirmButton: true,
    });
    return;
  }

  if (
    !vehiculo.value.contacto.nombre ||
    !vehiculo.value.contacto.telefono ||
    !vehiculo.value.contacto.email
  ) {
    Swal.fire({
      icon: "error",
      title: "Datos de contacto incompletos",
      text: "Nombre, teléfono y email de contacto son obligatorios.",
      showConfirmButton: true,
    });
    return;
  }

  // Validar teléfono antes de guardar
  if (!telefonoValido.value) {
    Swal.fire({
      icon: "error",
      title: "Teléfono inválido",
      text: "El teléfono debe empezar por 6 o 7 y tener 9 dígitos.",
      showConfirmButton: true,
    });
    return;
  }

  // Validar email antes de guardar
  if (!emailValido.value) {
    Swal.fire({
      icon: "error",
      title: "Email inválido",
      text: "Por favor, introduce un email válido.",
      showConfirmButton: true,
    });
    return;
  }

  // Validar que la matrícula no esté duplicada
  if (!editando.value) {
    // Al crear nuevo vehículo, verificar que la matrícula no exista
    const matriculaDuplicada = vehiculos.value.find(
      (v) => v.matricula && v.matricula.toUpperCase() === vehiculo.value.matricula.toUpperCase()
    );
    if (matriculaDuplicada) {
      Swal.fire({
        icon: "error",
        title: "Matrícula duplicada",
        text: "Ya existe un vehículo con esa matrícula.",
        showConfirmButton: true,
      });
      return;
    }
  } else {
    // Al editar, verificar que la matrícula no esté duplicada en otros vehículos
    const matriculaDuplicada = vehiculos.value.find(
      (v) => 
        v._id !== vehiculoEditandoId.value &&
        v.matricula && 
        v.matricula.toUpperCase() === vehiculo.value.matricula.toUpperCase()
    );
    if (matriculaDuplicada) {
      Swal.fire({
        icon: "error",
        title: "Matrícula duplicada",
        text: "Ya existe otro vehículo con esa matrícula.",
        showConfirmButton: true,
      });
      return;
    }
  }

  try {
    const formData = new FormData();

    if (archivo.value) {
      formData.append("imagen", archivo.value);
    }

    formData.append("vehiculo", JSON.stringify(vehiculo.value));

    let resultado;
    if (editando.value && vehiculoEditandoId.value) {
      // Modificar vehículo existente
      resultado = await updateArticulo(vehiculoEditandoId.value, formData);
      Swal.fire({
        icon: "success",
        title: "Vehículo modificado",
        text: "El vehículo ha sido actualizado correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      // Agregar nuevo vehículo
      resultado = await addArticulo(formData);
      Swal.fire({
        icon: "success",
        title: "Vehículo guardado",
        text: "El vehículo ha sido guardado correctamente y aparecerá en Ventas.",
        timer: 2000,
        showConfirmButton: false,
      });
    }

    if (!resultado) {
      console.error("Error al guardar el vehículo");
      return;
    }

    limpiarFormulario();

    // Recargar la tabla
    await cargarVehiculos();
  } catch (error) {
    console.error("Error al guardar:", error);
    Swal.fire({
      icon: "error",
      title: "Error al guardar",
      text: "Hubo un problema al guardar el vehículo. Inténtelo de nuevo.",
      showConfirmButton: true,
    });
  }
};

const archivo = ref(null);

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    archivo.value = file;
  }
};

// Función para cargar datos de un vehículo en el formulario
const cargarVehiculo = (item) => {
  vehiculo.value = { ...item };
  editando.value = true;
  vehiculoEditandoId.value = item._id;

  // Filtrar municipios según la provincia del vehículo
  filtrarCiudades();

  // Scroll al inicio del formulario
  window.scrollTo({ top: 0, behavior: "smooth" });

  Swal.fire({
    icon: "info",
    title: "Vehículo cargado",
    text: "Puede modificar los datos y guardar los cambios.",
    timer: 2000,
    showConfirmButton: false,
  });
};

// Función para eliminar un vehículo definitivamente
const eliminarVehiculo = async (id) => {
  const result = await Swal.fire({
    title: "¿Eliminar vehículo?",
    text: "Esta acción es definitiva y no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;

  try {
    await deleteArticulo(id);
    
    Swal.fire({
      icon: "success",
      title: "Vehículo eliminado",
      text: "El vehículo ha sido eliminado definitivamente.",
      timer: 2000,
      showConfirmButton: false,
    });

    // Recargar la tabla
    await cargarVehiculos();
  } catch (error) {
    console.error("Error al eliminar vehículo:", error);
    Swal.fire({
      icon: "error",
      title: "Error al eliminar",
      text: "No se pudo eliminar el vehículo. Inténtelo de nuevo.",
      showConfirmButton: true,
    });
  }
};

// Función para buscar vehículo por matrícula
const buscarPorMatricula = async (matricula) => {
  if (!matricula || matricula.trim() === "") {
    Swal.fire({
      icon: "warning",
      title: "Debe introducir una matrícula",
      timer: 1500,
      showConfirmButton: false,
    });
    return;
  }

  try {
    await cargarVehiculos();
    
    const vehiculoEncontrado = vehiculos.value.find(
      (v) => v.matricula && v.matricula.toUpperCase() === matricula.toUpperCase()
    );

    if (!vehiculoEncontrado) {
      Swal.fire({
        icon: "info",
        title: "Vehículo no encontrado",
        text: "No existe ningún vehículo con esa matrícula.",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    // Cargar los datos en el formulario
    cargarVehiculo(vehiculoEncontrado);
    
    Swal.fire({
      icon: "success",
      title: "Vehículo encontrado",
      text: "Los datos han sido cargados en el formulario.",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Error al buscar vehículo:", error);
    Swal.fire({
      icon: "error",
      title: "Error al buscar",
      text: "Hubo un problema al buscar el vehículo.",
      showConfirmButton: true,
    });
  }
};

// Función para limpiar el formulario
const limpiarFormulario = () => {
  Object.assign(vehiculo.value, {
    tipo: "",
    matricula: "",
    marca: "",
    modelo: "",
    anio: "",
    estado: "disponible",
    kilometros: "",
    precio: "",
    combustible: "",
    transmision: "",
    potencia_cv: "",
    descripcion: "",
    ubicacion: {
      provincia: "",
      ciudad: "",
    },
    contacto: {
      nombre: "",
      telefono: "",
      email: "",
    },
    fecha_publicacion: "",
  });
  
  archivo.value = null;
  editando.value = false;
  vehiculoEditandoId.value = null;
  
  // Limpiar validaciones
  telefonoValido.value = true;
  emailValido.value = true;
  
  // Limpiar municipios filtrados
  municipiosFiltrados.value = [];
  
  // Limpiar input de archivo
  const fileInput = document.getElementById("foto");
  if (fileInput) {
    fileInput.value = "";
  }
};

// Función para imprimir la tabla en PDF
const imprimirTabla = () => {
  if (vehiculos.value.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Sin datos",
      text: "No hay vehículos para imprimir.",
      showConfirmButton: true,
    });
    return;
  }

  const doc = new jsPDF();

  // Título
  doc.setFontSize(16);
  doc.text("Listado de Vehículos", 105, 15, { align: "center" });

  // Preparar datos para la tabla
  const tableData = vehiculos.value.map((v) => [
    v.matricula || "N/A",
    v.marca,
    v.modelo,
    v.estado,
    `${v.contacto.nombre}\n${v.contacto.telefono}`,
  ]);

  // Generar tabla
  doc.autoTable({
    startY: 25,
    head: [["Matrícula", "Marca", "Modelo", "Estado", "Contacto"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [13, 110, 253] },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { halign: "center" },
      3: { halign: "center" },
    },
  });

  // Guardar PDF
  doc.save("listado-vehiculos.pdf");

  Swal.fire({
    icon: "success",
    title: "PDF generado",
    text: "La tabla se ha exportado correctamente.",
    timer: 2000,
    showConfirmButton: false,
  });
};
</script>
