<template>
  <div
    class="container mx-auto mt-2 p-3 my-1 border rounded-0 shadow-sm min-vh-75 bg-light"
  >
    <h3 class="text-center my-2 gestion-header">
      <i class="bi bi-people-fill"></i> Gestión de Clientes
    </h3>
    <!-- Formulario -->
    <form @submit.prevent="guardarCliente" class="mb-4">
      <!-- DNI con validación visual -->
      <div class="mb-3 row align-items-center">
        <!-- Columna DNI -->
        <div class="col-md-4 d-flex align-items-center">
          <label for="dni" class="form-label mb-0 w-25">DNI: </label>
          <div class="flex-grow-1 d-flex align-items-center">
            <input
              type="text"
              id="dni"
              v-model="nuevoCliente.dni"
              @blur="validarDniYCapitalizar"
              class="form-control w-auto w-25 text-center ms-0"
              :class="{ 'is-invalid': !dniValido }"
              required
              :disabled="editando"
              oninvalid="this.setCustomValidity('El DNI/NIE es obligatorio')"
              oninput="this.setCustomValidity('')"
            />
            <button
              type="button"
              class="btn btn btn-primary ms-3 border-0 shadow-none rounded-0"
              @click="buscarClientePorDNI(nuevoCliente.dni)"
              title="Buscar por DNI"
            >
              <i class="bi bi-search"></i>
            </button>
            <div v-if="!dniValido" class="invalid-feedback">
              DNI o NIE inválido.
            </div>
          </div>
        </div>
        <div class="col-md-4 d-flex align-items-center">
          <label>Tipo de Cliente: </label>
          <div class="ms-3">
            <label for="radio-empresa">Empresa:</label>
            <input
              type="radio"
              id="radio-empresa"
              name="radio"
              v-model="nuevoCliente.tipoCliente"
              class="ms-2"
            />
          </div>
          <div class="ms-3">
            <label for="radio-particular">Particular:</label>
            <input
              type="radio"
              id="radio-particular"
              name="radio"
              v-model="nuevoCliente.tipoCliente"
              class="ms-2"
            />
          </div>
        </div>
        <!-- Columna Fecha de Alta a la derecha -->
        <div class="col-md-3 d-flex align-items-center justify-content-end">
          <label for="fechaAlta" class="form-label me-2 mb-0 text-nowrap"
            >Fecha de Alta:</label
          >
          <input
            type="date"
            id="fechaAlta"
            v-model="nuevoCliente.fechaAlta"
            class="form-control w-auto me-5"
          />
          <button
            type="button"
            class="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center"
            @click="limpiarCampos"
            title="Reiniciar campos"
          >
            <i class="bi bi-arrow-clockwise fs-5"></i>
          </button>
        </div>
      </div>

      <!-- FILA Nombre y Apellidos -->
      <div class="mb-3 row g-3 align-items-center">
        <!-- Nombre -->
        <div class="col-md-5 d-flex align-items-center">
          <label for="nombre" class="form-label mb-0 text-nowrap w-25"
            >Nombre:</label
          >
          <input
            type="text"
            id="nombre"
            v-model="nuevoCliente.nombre"
            class="form-control flex-grow-1"
            @blur="capitalizarTexto('nombre')"
            required
          />
        </div>

        <!-- Apellidos -->
        <div class="col-md-6 d-flex align-items-center ms-5">
          <label for="apellidos" class="form-label me-4 mb-0 text-nowrap"
            >Apellidos:</label
          >
          <input
            type="text"
            id="apellidos"
            v-model="nuevoCliente.apellidos"
            class="form-control flex-grow-1"
            @blur="capitalizarTexto('apellidos')"
            required
          />
        </div>
      </div>

      <!-- FILA Email y Móvil -->
      <div class="mb-3 row g-3 align-items-center">
        <!-- Email -->
        <div class="col-md-5 d-flex align-items-center">
          <label for="email" class="form-label mb-0 text-nowrap w-25"
            >Email:</label
          >
          <input
            type="email"
            id="email"
            v-model="nuevoCliente.email"
            class="form-control flex-grow-1"
            @blur="validarEmail('email')"
            :class="{ 'is-invalid': !emailValido }"
            required
          />
        </div>

        <!-- Móvil -->
        <div class="col-md-3 d-flex align-items-center">
          <label for="movil" class="form-label me-5 ms-5 mb-0 text-nowrap"
            >Móvil:</label
          >
          <input
            type="tel"
            id="movil"
            v-model="nuevoCliente.movil"
            @blur="validarMovil('movil')"
            class="form-control flex-grow-1 text-center"
            :class="{ 'is-invalid': !movilValido }"
          />
          <button
            type="button"
            class="btn btn-primary ms-2 border-0 shadow-none rounded-0"
            @click="buscarClientePorMovil(nuevoCliente.movil)"
            title="Buscar por móvil"
          >
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>

      <!-- FILA Dirección, Provincia y Municipio -->
      <div class="mb-3 row g-3 align-items-center">
        <!-- Dirección -->
        <div class="col-md-5 d-flex align-items-center">
          <label for="direccion" class="form-label mb-0 w-25 text-nowrap"
            >Dirección:</label
          >
          <input
            type="text"
            id="direccion"
            v-model="nuevoCliente.direccion"
            @blur="capitalizarTexto('direccion')"
            class="form-control flex-grow-1"
          />
        </div>

        <!-- Provincia -->
        <div class="col-md-3 d-flex align-items-center">
          <label for="provincia" class="form-label me-4 ms-5 mb-0 text-nowrap"
            >Provincia:</label
          >
          <select
            id="provincia"
            v-model="nuevoCliente.provincia"
            class="form-select flex-grow-1 w-25"
            @change="filtrarMunicipios"
          >
            <option disabled value="">Seleccione provincia</option>
            <option v-for="prov in provincias" :key="prov.id" :value="prov.nm">
              {{ prov.nm }}
            </option>
          </select>
        </div>

        <!-- Municipio -->
        <div class="col-md-3 d-flex align-items-center">
          <label for="municipio" class="form-label me-2 ms-4 mb-0 text-nowrap"
            >Municipio:</label
          >
          <select
            id="municipio"
            v-model="nuevoCliente.municipio"
            class="form-select flex-grow-1 w-auto"
          >
            <option disabled value="">Seleccione municipio</option>
            <option
              v-for="mun in municipiosFiltrados"
              :key="mun.id"
              :value="mun.nm"
            >
              {{ mun.nm }}
            </option>
          </select>
        </div>
      </div>

      <!-- Aviso Legal -->
      <!-- Contraseña y Repetir contraseña -->
      <div class="mb-3 row g-3 align-items-center">
        <div class="col-md-5 d-flex align-items-center">
          <label for="password" class="form-label mb-0 text-nowrap w-25"
            >Contraseña:</label
          >
          <input
            type="password"
            id="password"
            v-model="nuevoCliente.password"
            class="form-control flex-grow-1"
            :required="!editando"
            :disabled="editando && !esPerfilPropio"
            :placeholder="editando && !esPerfilPropio ? 'No puede modificar password de otros usuarios' : 'Dejar vacío para no cambiar'"
          />
        </div>

        <div class="col-md-5 d-flex align-items-center ms-5">
          <label for="passwordConfirm" class="form-label me-4 mb-0 text-nowrap"
            >Repetir contraseña:</label
          >
          <input
            type="password"
            id="passwordConfirm"
            v-model="nuevoCliente.passwordConfirm"
            class="form-control flex-grow-1"
            :class="{
              'is-invalid':
                !passwordMatch &&
                (nuevoCliente.password !== '' ||
                  nuevoCliente.passwordConfirm !== ''),
            }"
            :required="!editando"
            :disabled="editando && !esPerfilPropio"
            :placeholder="editando && !esPerfilPropio ? 'No puede modificar password de otros usuarios' : 'Dejar vacío para no cambiar'"
          />
          <div
            v-if="
              !passwordMatch &&
              (nuevoCliente.password !== '' ||
                nuevoCliente.passwordConfirm !== '')
            "
            class="invalid-feedback ms-3"
          >
            Las contraseñas no coinciden.
          </div>
        </div>
      </div>

      <div class="text-center">
        <input
          type="checkbox"
          id="avisolegal"
          v-model="avisoLegal"
          class="form-check-input"
        />
        <span class="form-check-label ms-3 me-5 mb-0">
          Aceptar terminos y condiciones:
          <router-link to="/avisolegal" target="_blank"
            >Aviso Legal</router-link
          >
        </span>
      </div>
      <!-- Histórico -->
      <!-- Checkbox al final - solo visible para admin -->
      <div class="form-check form-switch ms-3" v-if="isAdmin">
        <input
          type="checkbox"
          id="historico"
          v-model="mostrarHistorico"
          class="form-check-input"
          @change="cargarClientes"
        />
        <label for="historico" class="form-check-label ms-2">Histórico</label>
      </div>

      <!-- Botones centrados -->
      <div class="text-center">
        <button
          type="submit"
          :disabled="!avisoLegal"
          class="btn btn-primary px-4"
        >
          {{ editando ? "Modificar" : "Guardar" }}
        </button>
        <button
          v-if="isAdmin && clientes.length > 0"
          type="button"
          class="btn btn-success px-4 ms-3"
          @click="imprimirListado"
          title="Imprimir listado de clientes"
        >
          <i class="bi bi-printer"></i> Imprimir
        </button>
      </div>
    </form>
    <!-- Lista de Clientes -->
    <div v-if="isAdmin" class="table-responsive">
      <h4 class="text-center w-100">Listado Clientes</h4>
      <table
        class="table table-bordered table-striped table-hover table-sm w-100 align-middle"
      >
        <thead class="table-primary">
          <tr>
            <th class="text-center">ID</th>
            <th class="text-center">Apellidos</th>
            <th class="text-center">Nombre</th>
            <th class="text-center">Móvil</th>
            <th class="text-center">Municipio</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cliente, index) in clientesPaginados" :key="index">
            <th scope="row" class="text-center">
              {{ (currentPage - 1) * clientesPorPage + index + 1 }}
            </th>
            <td>{{ cliente.apellidos }}</td>
            <td>{{ cliente.nombre }}</td>
            <td class="text-center">{{ cliente.movil }}</td>
            <td class="text-center">{{ cliente.municipio }}</td>
            <td class="align-middle text-center">
              <button
                @click="eliminarCliente(cliente.movil)"
                class="btn btn-danger btn-sm border-0 ms-4 me-2 shadow-none rounded-0"
                title="Eliminar cliente"
                aria-label="Eliminar cliente"
                :disabled="!cliente.historico"
                :aria-disabled="String(cliente.historico)"
              >
                <i class="bi bi-trash"></i>
              </button>
              <button
                @click="editarCliente(cliente.movil)"
                class="btn btn-warning btn-sm border-0 shadow-none rounded-0"
                title="Editar Cliente"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                v-if="cliente.historico === false"
                @click="activarCliente(cliente)"
                class="btn btn-secondary btn-sm ms-2 border-0 shadow-none rounded-0"
                title="Activar Cliente"
              >
                <i class="bi bi-person-check"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Navegación de página-->
      <div class="d-flex justify-content-center my-3">
        <button
          class="btn btn-outline-primary btn-sm me-2 rounded-0 border-1 shadow-none"
          @click="beforePagina"
          :disabled="currentPage <= 1"
        >
          <i class="bi bi-chevron-left"></i>
        </button>
        <span class="mx-3 align-self-center text-muted"
          >Página {{ currentPage }}</span
        >
        <button
          class="btn btn-outline-primary btn-sm rounded-0 border-1 shadow-none"
          @click="nextPagina"
          :disabled="currentPage >= totalPages"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import provmuniData from "@/data/provmuni.json";
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import bcrypt from "bcryptjs";
import {
  getClientes,
  deleteCliente,
  addCliente,
  updateCliente,
  getClientePorDni,
} from "@/api/clientes.js";
import Swal from "sweetalert2";
import AvisoLegal from "./AvisoLegal.vue";
import { jwtDecode } from "jwt-decode";

// SCRIPTS CRUD //

// Obtener la ruta actual para detectar si viene de "Mi Perfil"
const route = useRoute();

// Objeto reactivo que almacena los datos del cliente actual en el formulario
const nuevoCliente = ref({
  dni: "",
  nombre: "",
  apellidos: "",
  email: "",
  movil: "",
  direccion: "",
  provincia: "",
  municipio: "",
  fechaAlta: "",
  historico: false, // luego lo cambiamos a true
  lopd: false, // aceptación del aviso legal (L.O.P.D.)
  password: "",
  passwordConfirm: "",
});

// Funcion lisar clientes con get

const editando = ref(false); // Modo edición activado o no
const clienteEditandoId = ref(null); // ID del cliente que se está editando
const mostrarHistorico = ref(false);
// Detectar si el usuario actual es admin (guardado en sessionStorage por el login)
const isAdmin = ref(sessionStorage.getItem("isAdmin") === "true");
// Controla si el usuario ha aceptado el Aviso Legal. Hasta que no sea true,
// la mayoría de campos y acciones estarán deshabilitados.
const avisoLegal = ref(false); // Si el aviso legal ha sido aceptado
const clientes = ref([]); // Array que almacena todos los clientes
// Variable para detectar si está viendo su propio perfil
const esPerfilPropio = ref(false);

// Variables para paginación
const numClientes = ref(0);
const currentPage = ref(1);
const clientesPorPage = 10; // por defecto seria ref(10) y asi con 20 y 30 que sea un boton de checkbox

// Cargar clientes al montar el componente

// Función auxiliar para cargar datos según el contexto
const cargarDatosSegunContexto = async () => {
  // Leer estado de admin desde sessionStorage
  isAdmin.value = sessionStorage.getItem("isAdmin") === "true";
  const isUsuario = sessionStorage.getItem("isUsuario") === "true";

  // Verificar si viene del enlace "Mi Perfil"
  const verPerfil = route.query.perfil === "true";

  // Si viene de "Mi Perfil", cargar el perfil del usuario actual (admin o usuario normal)
  if (verPerfil) {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const dniUsuario = decoded.dni;
        if (dniUsuario) {
          await buscarClientePorDNI(dniUsuario);
          // Marcar el aviso legal como aceptado ya que el usuario ya está registrado
          avisoLegal.value = nuevoCliente.value.lopd || true;
          // Marcar que está viendo su propio perfil
          esPerfilPropio.value = true;
        }
      } catch (error) {
        console.error("Error al decodificar token:", error);
      }
    }
  }
  // Si es admin y NO viene de "Mi Perfil", mostrar el histórico completo
  else if (isAdmin.value) {
    limpiarCampos(); // Limpiar formulario antes de mostrar lista
    mostrarHistorico.value = true;
    cargarClientes();
    // No está viendo su propio perfil
    esPerfilPropio.value = false;
  }
  // Si es usuario normal y NO viene de "Mi Perfil", cargar su perfil directamente
  else if (isUsuario) {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const dniUsuario = decoded.dni;
        if (dniUsuario) {
          await buscarClientePorDNI(dniUsuario);
          // Marcar el aviso legal como aceptado ya que el usuario ya está registrado
          avisoLegal.value = nuevoCliente.value.lopd || true;
          // Usuario normal siempre ve su propio perfil
          esPerfilPropio.value = true;
        }
      } catch (error) {
        console.error("Error al decodificar token:", error);
      }
    }
  }
};

// Zona Cargar clientes Al Montar el componente
// Al montar el componente, se cargan los clientes y se reinicia la página actual.
onMounted(async () => {
  await cargarDatosSegunContexto();
  currentPage.value = 1;
});

// Watch para detectar cambios en la ruta (cuando navegas entre /clientes y /clientes?perfil=true)
watch(
  () => route.query.perfil,
  async (newVal, oldVal) => {
    // Solo recargar si el valor cambió
    if (newVal !== oldVal) {
      await cargarDatosSegunContexto();
      currentPage.value = 1;
    }
  }
);
///avanzar y retroceder

// Métodos de paginación
const beforePagina = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPagina = () => {
  //redondear hacia arriba para mostrar la última página aunque no esté completa
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// Propiedad computada para obtener los clientes en la página actual
// computed crea una propiedad reactiva que se actualiza automáticamente
// cuando cambian las dependencias (currentPage o clientes)
// es decir paso pagina o vuelvo atrás cargando los clientes de esa página
// slice extrae una sección del array clientes
// start es el índice inicial y end el índice final (no incluido)

// Propiedad computada: obtiene los clientes visibles en la página actual
// computed → se actualiza automáticamente si cambia currentPage o clientes
const clientesPaginados = computed(() => {
  const start = (currentPage.value - 1) * clientesPorPage;
  const end = start + clientesPorPage;
  return clientes.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(numClientes.value / clientesPorPage);
});

const cargarClientes = () => {
  // llama a la API
  getClientes(mostrarHistorico.value).then((data) => {
    clientes.value = data;
    numClientes.value = data.length; // actualizar total de clientes
  });
  Swal.fire({
    icon: "success",
    title: "Listando Clientes",
    showConfirmButton: false,
    timer: 1500,
  });
};

const guardarCliente = async () => {
  // Validar contraseñas solo si se están modificando
  if (nuevoCliente.value.password || nuevoCliente.value.passwordConfirm) {
    if (nuevoCliente.value.password !== nuevoCliente.value.passwordConfirm) {
      Swal.fire({
        icon: "error",
        title: "Error en contraseña",
        text: "Las contraseñas no coinciden.",
        showConfirmButton: true,
      });
      return;
    }
  }

  // Antes de guardar, el usuario debe haber aceptado el Aviso Legal
  if (!avisoLegal.value) {
    Swal.fire({
      icon: "warning",
      title: "Debes aceptar el Aviso Legal antes de guardar",
      showConfirmButton: false,
      timer: 2000,
    });
    return;
  }

  // Evita duplicados si estamos creando un nuevo cliente o editando
  // Refrescar lista completa antes de validar
  await cargarClientes();

  if (!editando.value) {
    // Al crear un nuevo cliente, la contraseña es obligatoria
    if (!nuevoCliente.value.password) {
      Swal.fire({
        icon: "error",
        title: "La contraseña es obligatoria",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    // Verificar duplicados al crear
    const duplicado = clientes.value.find(
      (cliente) =>
        cliente.dni === nuevoCliente.value.dni ||
        cliente.movil === nuevoCliente.value.movil ||
        cliente.email === nuevoCliente.value.email
    );
    if (duplicado) {
      Swal.fire({
        icon: "error",
        title: "Datos duplicados",
        text: "Ya existe un cliente con ese DNI, móvil o email.",
        showConfirmButton: true,
        timer: 3000,
      });
      return;
    }
  } else {
    // Al editar, verificar que no haya duplicados con otros clientes (excluyendo el actual)
    const duplicado = clientes.value.find(
      (cliente) =>
        cliente.id !== clienteEditandoId.value &&
        (cliente.dni === nuevoCliente.value.dni ||
          cliente.movil === nuevoCliente.value.movil ||
          cliente.email === nuevoCliente.value.email)
    );
    if (duplicado) {
      Swal.fire({
        icon: "error",
        title: "Datos duplicados",
        text: "Ya existe otro cliente con ese DNI, móvil o email.",
        showConfirmButton: true,
        timer: 3000,
      });
      return;
    }
  }

  // Confirmación visual antes de guardar o modificar
  const result = await Swal.fire({
    title: editando.value
      ? "¿Desea modificar este cliente?"
      : "¿Desea grabar este cliente?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: editando.value ? "Modificar" : "Guardar",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;

  try {
    // Preparar datos del cliente
    const datosCliente = { ...nuevoCliente.value };

    // Solo hashear y actualizar la contraseña si:
    // 1. Es un nuevo cliente (no editando) O
    // 2. Es su propio perfil Y ha ingresado una nueva contraseña
    if (
      !editando.value ||
      (esPerfilPropio.value && nuevoCliente.value.password)
    ) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(nuevoCliente.value.password, salt);
      datosCliente.password = hash;
    } else {
      // Si está editando pero NO cambió la contraseña, eliminar del objeto
      delete datosCliente.password;
      delete datosCliente.passwordConfirm;
    }

    // modo edicion
    if (editando.value) {
      // Validar campos
      // Modificar cliente (PUT)+

      // Asegurarnos de guardar el estado de aceptación LOPD según el checkbox
      datosCliente.lopd = avisoLegal.value;
      // Actualiza el cliente en la API
      const clienteActualizado = await updateCliente(
        clienteEditandoId.value,
        datosCliente
      );

      // Reemplaza el cliente modificado en la lista local
      const index = clientes.value.findIndex(
        (c) => c.id === clienteEditandoId.value
      );
      if (index !== -1) clientes.value[index] = clienteActualizado;
      Swal.fire({
        icon: "success",
        title: "Cliente modificado",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      // Agregar cliente (POST)

      // Asegurarnos de guardar el estado de aceptación LOPD según el checkbox
      datosCliente.lopd = avisoLegal.value;

      const clienteAgregado = await addCliente(datosCliente);
      clientes.value.push(clienteAgregado);
      Swal.fire({
        icon: "success",
        title: "Cliente agregado",
        showConfirmButton: false,
        timer: 1500,
      });
    }

    // Limpieza Reset formulario y estado
    limpiarCampos();

    // Refrescar lista completa (opcional)
    clientes.value = await getClientes();
  } catch (error) {
    console.error("Error al guardar cliente:", error);
    Swal.fire({
      icon: "error",
      title: "Error al guardar cliente",
      text: "Inténtelo de nuevo o contacte con el administrador.",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

// Función para activar cliente (poner historico en true)
const activarCliente = async (cliente) => {
  const confirmacion = await Swal.fire({
    title: `¿Activar cliente ${cliente.nombre} ${cliente.apellidos}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Activar",
    cancelButtonText: "Cancelar",
  });

  if (!confirmacion.isConfirmed) return;

  try {
    // Crear una copia del cliente con historico en true
    const clienteActivado = { ...cliente, historico: true };

    // Llamar a la API para actualizar
    const actualizado = await updateCliente(cliente.id, clienteActivado);

    // Actualizar la lista local (opcional, también puedes volver a cargar todo)
    const index = clientes.value.findIndex((c) => c.id === cliente.id);
    if (index !== -1) {
      clientes.value[index] = actualizado;
    }

    Swal.fire({
      icon: "success",
      title: "Cliente reactivado",
      showConfirmButton: false,
      timer: 1500,
    });

    // Recargar lista actualizada
    cargarClientes();
  } catch (error) {
    console.error("Error al reactivar cliente:", error);
    Swal.fire({
      icon: "error",
      title: "Error al activar cliente",
      text: "Por favor, intenta de nuevo.",
      timer: 1500,
    });
  }
};

const agregarCliente = () => {
  clientes.value.push({ ...nuevoCliente.value });
  // Reiniciar el formulario
  nuevoCliente.value = {
    dni: "",
    nombre: "",
    apellidos: "",
    email: "",
    movil: "",
    direccion: "",
    provincia: "",
    municipio: "",
    fechaAlta: "",
    historico: false,
  };
};

// Funcion Eliminar Cliente con patch (histórico a false)
const eliminarCliente = async (movil) => {
  // Refrescar lista desde la API

  clientes.value = await getClientes();
  // Buscar cliente completo (que incluye el ID)
  // Busca el cliente por movil
  const clienteAEliminar = clientes.value.find(
    (cliente) => cliente.movil === movil
  );

  if (!clienteAEliminar) {
    Swal.fire({
      icon: "error",
      title: "Cliente no encontrado",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  // Pedir confirmación antes de eliminar
  const result = await Swal.fire({
    title: `¿Eliminar al cliente ${clienteAEliminar.nombre} ${clienteAEliminar.apellidos}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  // Si no confirma, salir
  if (!result.isConfirmed) return;

  // Si confirma, eliminar cliente usando la API y movil como ID
  // En lugar de borrar, marcamos el histórico como false (eliminado)
  await deleteCliente(clienteAEliminar.id);
  // Refrescar la lista desde la "API"
  clientes.value = await getClientes();

  Swal.fire({
    icon: "success",
    title: "Cliente eliminado",
    showConfirmButton: false,
    timer: 1500,
  });
};
// añadir que cuando editamos editamos a un usuario no se pueda editar el dni
// Función Editar Cliente (carga datos en el formulario)
const editarCliente = (movil) => {
  const cliente = clientes.value.find((c) => c.movil === movil);
  if (!cliente) {
    Swal.fire({
      icon: "error",
      title: "Cliente no encontrado",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  // Cargar datos al formulario (sin contraseña por seguridad)
  nuevoCliente.value = { ...cliente }; // 🔁 Aquí cargas el formulario con los datos
  // No mostrar la contraseña al editar
  nuevoCliente.value.password = "";
  nuevoCliente.value.passwordConfirm = "";
  editando.value = true;
  // Formatear fecha para el input type="date"
  nuevoCliente.value.fechaAlta = formatearFechaParaInput(cliente.fechaAlta);
  // Actualiza municipios filtrados según la provincia seleccionada
  filtrarMunicipios();
  nuevoCliente.value.municipio = cliente.municipio; // 🟢 Ahora estamos en modo edición
  clienteEditandoId.value = cliente.id;

  // Verificar si está editando su propio perfil
  const token = sessionStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      esPerfilPropio.value = decoded.dni === cliente.dni;
    } catch (error) {
      console.error("Error al decodificar token:", error);
      esPerfilPropio.value = false;
    }
  } else {
    esPerfilPropio.value = false;
  }
};

///CODIGO BUSQUEDA COMPONENTES

const buscarClientePorDNI = async (dni) => {
  if (!dni || dni.trim() === "") {
    Swal.fire({
      icon: "warning",
      title: "Debe introducir un DNI antes de buscar.",
      timer: 1500,
      showConfirmButton: false,
    });
    return;
  }

  try {
    const cliente = await getClientePorDni(dni.trim().toUpperCase());

    if (!cliente) {
      Swal.fire({
        icon: "info",
        title: "Cliente no encontrado",
        text: "No existe ningún cliente con ese DNI.",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    // Cargar los datos encontrados en el formulario (sin contraseña por seguridad)
    nuevoCliente.value = { ...cliente };
    // No mostrar la contraseña al editar
    nuevoCliente.value.password = "";
    nuevoCliente.value.passwordConfirm = "";
    nuevoCliente.value.fechaAlta = formatearFechaParaInput(cliente.fechaAlta);

    // Actualiza lista de municipios si cambia la provincia
    filtrarMunicipios();
    //opcional
    editando.value = true;
    clienteEditandoId.value = cliente.id;

    // Verificar si está editando su propio perfil
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        esPerfilPropio.value = decoded.dni === cliente.dni;
      } catch (error) {
        console.error("Error al decodificar token:", error);
        esPerfilPropio.value = false;
      }
    } else {
      esPerfilPropio.value = false;
    }

    Swal.fire({
      icon: "success",
      title: "Cliente encontrado y cargado",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Error buscando cliente por DNI:", error);
    Swal.fire({
      icon: "error",
      title: "Error al buscar cliente",
      text: "Verifique la conexión o contacte con el administrador.",
      timer: 2000,
      showConfirmButton: false,
    });
  }
};

// Función para buscar cliente por móvil
const buscarClientePorMovil = async (movil) => {
  if (!movil || movil.trim() === "") {
    Swal.fire({
      icon: "warning",
      title: "Debe introducir un móvil antes de buscar.",
      timer: 1500,
      showConfirmButton: false,
    });
    return;
  }

  try {
    // Refrescar lista desde la API
    await cargarClientes();
    
    // Buscar en la lista local
    const cliente = clientes.value.find((c) => c.movil === movil.trim());

    if (!cliente) {
      Swal.fire({
        icon: "info",
        title: "Cliente no encontrado",
        text: "No existe ningún cliente con ese móvil.",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    // Cargar los datos encontrados en el formulario
    nuevoCliente.value = { ...cliente };
    nuevoCliente.value.password = "";
    nuevoCliente.value.passwordConfirm = "";
    nuevoCliente.value.fechaAlta = formatearFechaParaInput(cliente.fechaAlta);

    // Actualiza lista de municipios si cambia la provincia
    filtrarMunicipios();
    editando.value = true;
    clienteEditandoId.value = cliente.id;

    // Verificar si está editando su propio perfil
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        esPerfilPropio.value = decoded.dni === cliente.dni;
      } catch (error) {
        console.error("Error al decodificar token:", error);
        esPerfilPropio.value = false;
      }
    } else {
      esPerfilPropio.value = false;
    }

    Swal.fire({
      icon: "success",
      title: "Cliente encontrado y cargado",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Error buscando cliente por móvil:", error);
    Swal.fire({
      icon: "error",
      title: "Error al buscar cliente",
      text: "Verifique la conexión o contacte con el administrador.",
      timer: 2000,
      showConfirmButton: false,
    });
  }
};
// SCRIPS AUXILIARES

// Estado de validez del DNI/NIE si la estructura de datos es más compleja se usa reactive
const dniValido = ref(true); // Por defecto es válido y no muestra error al iniciar

// Función para validar DNI y NIE
const validarDniNie = (valor) => {
  // Defensa: asegurar que valor es una cadena
  if (valor === undefined || valor === null) return false;
  const str = String(valor).toUpperCase();
  const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
  const dniRegex = /^[0-9]{8}[A-Z]$/;
  const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;

  if (dniRegex.test(str)) {
    const numero = parseInt(str.slice(0, 8), 10);
    const letra = str.charAt(8);
    return letra === letras[numero % 23]; // true si es válido
  } else if (nieRegex.test(str)) {
    const nie = str.replace("X", "0").replace("Y", "1").replace("Z", "2");
    const numero = parseInt(nie.slice(0, 8), 10);
    const letra = str.charAt(8);
    return letra === letras[numero % 23]; // true si es válido
  }
  return false;
};

// Función única: capitaliza y asigna en el mismo paso
// Convierte texto a formato capitalizado (Primera letra en mayúscula)
const capitalizarTexto = (campo) => {
  const texto = nuevoCliente.value[campo] ?? "";
  nuevoCliente.value[campo] = texto
    .toLowerCase()
    .split(" ")
    .map((palabra) => {
      if (!palabra) return "";
      return palabra.charAt(0).toLocaleUpperCase() + palabra.slice(1);
    })
    .join(" ");
};

// control email

// Validaciones básicas de email y móvil
const emailValido = ref(true);
const validarEmail = () => {
  const email = nuevoCliente.value.email.trim();
  // Expresión simple para email válido
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  emailValido.value = regex.test(email);
};

// Comprueba si las contraseñas coinciden
const passwordMatch = computed(() => {
  return (
    (nuevoCliente.value.password || "") ===
    (nuevoCliente.value.passwordConfirm || "")
  );
});

// Provincias y municipios
// Filtrado de municipios según la provincia seleccionada
const provincias = ref(provmuniData.provincias); // Array de provincias
const municipios = ref(provmuniData.municipios); // Array de municipios para filtrarlos
const municipiosFiltrados = ref([]); // vacío pero contendrá los municipios filtrados

const filtrarMunicipios = () => {
  // nombre de la provincia elegida en el <select>
  const nombreProv = nuevoCliente.value.provincia;

  // 1️⃣ buscar en provincias el objeto con ese nombre
  const prov = provincias.value.find((p) => p.nm === nombreProv);
  if (!prov) {
    municipiosFiltrados.value = [];
    return;
  }

  // 2️⃣ los dos primeros dígitos del id de la provincia
  const codigoProv = prov.id.slice(0, 2);

  // 3️⃣ filtrar los municipios cuyo id empiece por esos dos dígitos
  municipiosFiltrados.value = municipios.value.filter((m) =>
    m.id.startsWith(codigoProv)
  );

  // 4️⃣ opcional: resetear el municipio si ya no corresponde
  nuevoCliente.value.municipio = "";
};

const movilValido = ref(true);
// Validar al salir del campo
const validarDni = () => {
  // Asegurarse de que el campo existe y es cadena
  nuevoCliente.value.dni = (nuevoCliente.value.dni || "")
    .toString()
    .trim()
    .toUpperCase();
  dniValido.value = validarDniNie(nuevoCliente.value.dni);
};

// Función combinada: capitalizar DNI y validar
const validarDniYCapitalizar = () => {
  // Capitalizar primero
  nuevoCliente.value.dni = (nuevoCliente.value.dni || "")
    .toString()
    .trim()
    .toUpperCase();
  // Luego validar
  dniValido.value = validarDniNie(nuevoCliente.value.dni);
};

const validarMovil = () => {
  const movil = nuevoCliente.value.movil.trim();
  // Expresión para móvil español (9 dígitos, empieza por 6, 7, 8 o 9)
  const regex = /^[6789]\d{8}$/;
  movilValido.value = regex.test(movil) || movil === "";
};

// conversor fecha
// Conversor de fechas (de dd/mm/yyyy a yyyy-mm-dd)
function formatearFechaParaInput(fecha) {
  if (!fecha) return "";

  // Detecta formato dd/mm/yyyy
  if (fecha.includes("/")) {
    const [dd, mm, yyyy] = fecha.split("/");
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }

  // Detecta formato yyyy-mm-dd
  if (fecha.includes("-")) {
    const partes = fecha.split("-");
    if (partes.length === 3) return fecha; // ya formato ISO
  }
  return "";
}

// Limpia todos los campos del formulario
const limpiarCampos = () => {
  nuevoCliente.value = {
    dni: "",
    nombre: "",
    apellidos: "",
    email: "",
    movil: "",
    direccion: "",
    provincia: "",
    municipio: "",
    fechaAlta: "",
    historico: true,
    lopd: false,
    tipoCliente: "",
    password: "",
    passwordConfirm: "",
  };
  //Salimos del modo edición → el DNI vuelve a ser editable
  editando.value = false;
  clienteEditandoId.value = null;
  esPerfilPropio.value = false;

  // Limpiar validaciones visuales
  dniValido.value = true;
  emailValido.value = true;
  movilValido.value = true;
  
  // Resetear checkbox de aviso legal (solo si no está logueado o es admin)
  if (isAdmin.value || !sessionStorage.getItem("token")) {
    avisoLegal.value = false;
  }
  
  // Limpiar municipios filtrados
  municipiosFiltrados.value = [];
};

// Función para imprimir el listado de clientes
const imprimirListado = () => {
  if (!clientes.value || clientes.value.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "No hay clientes para imprimir",
      timer: 1500,
      showConfirmButton: false,
    });
    return;
  }

  // Crear ventana de impresión
  const ventanaImpresion = window.open("", "_blank");
  
  // Generar HTML para imprimir
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Listado de Clientes</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
        }
        h1 {
          text-align: center;
          color: #0d6efd;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #0d6efd;
          color: white;
        }
        tr:nth-child(even) {
          background-color: #f2f2f2;
        }
        .fecha-impresion {
          text-align: right;
          font-size: 0.9em;
          color: #666;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <h1>Listado de Clientes</h1>
      <p class="fecha-impresion">Fecha de impresión: ${new Date().toLocaleString('es-ES')}</p>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>DNI</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Móvil</th>
            <th>Municipio</th>
            <th>Provincia</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
  `;

  // Añadir filas de clientes
  clientes.value.forEach((cliente, index) => {
    htmlContent += `
      <tr>
        <td>${index + 1}</td>
        <td>${cliente.dni || ''}</td>
        <td>${cliente.nombre || ''}</td>
        <td>${cliente.apellidos || ''}</td>
        <td>${cliente.email || ''}</td>
        <td>${cliente.movil || ''}</td>
        <td>${cliente.municipio || ''}</td>
        <td>${cliente.provincia || ''}</td>
        <td>${cliente.historico ? 'Activo' : 'Inactivo'}</td>
      </tr>
    `;
  });

  htmlContent += `
        </tbody>
      </table>
    </body>
    </html>
  `;

  // Escribir contenido y lanzar impresión
  ventanaImpresion.document.write(htmlContent);
  ventanaImpresion.document.close();
  
  // Esperar a que se cargue el contenido y luego imprimir
  ventanaImpresion.onload = () => {
    ventanaImpresion.print();
  };
};
</script>

<style scoped>
.is-invalid {
  border-color: #f28b82 !important;
  background-color: #ffe6e6;
}

.invalid-feedback {
  display: block;
}

.gestion-clientes {
  width: 95%;
  max-width: none;
  margin: 0 auto;
  padding: 2rem 0;
}

.form-control {
  width: 100%;
}

.gestion-header {
  /* Ocupa todo el ancho del contenedor */
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin: 0 0 0.5rem 0;
  padding: 0.75rem 1rem;
  border-radius: 6px 6px 6px 6px; /* opcional: redondeo en los bordes superiores */

  background-color: #b5caff;
  color: #03306b;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  font-weight: 600;
}
</style>
