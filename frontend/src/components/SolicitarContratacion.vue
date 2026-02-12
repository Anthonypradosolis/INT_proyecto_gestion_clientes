<template>
  <div class="container-fluid my-4 p-4">
    <div class="bg-white rounded-4 shadow-lg p-4">
      <h4 class="text-center mb-4 fw-semibold text-primary border-bottom pb-2">
        <i class="bi bi-briefcase me-2"></i>Solicitud de Empleo
      </h4>

      <!-- FORMULARIO -->
      <form @submit.prevent="enviarSolicitud" class="mb-5">
        <div class="row g-3">
          <!-- Nombre -->
          <div class="col-md-6">
            <label for="nombre" class="form-label fw-bold">Nombre <span class="text-danger">*</span></label>
            <input
              type="text"
              id="nombre"
              v-model="solicitud.nombre"
              class="form-control"
              required
            />
          </div>

          <!-- Apellidos -->
          <div class="col-md-6">
            <label for="apellidos" class="form-label fw-bold">Apellidos <span class="text-danger">*</span></label>
            <input
              type="text"
              id="apellidos"
              v-model="solicitud.apellidos"
              class="form-control"
              required
            />
          </div>

          <!-- DNI -->
          <div class="col-md-6">
            <label for="dni" class="form-label fw-bold">DNI <span class="text-danger">*</span></label>
            <input
              type="text"
              id="dni"
              v-model="solicitud.dni"
              @blur="validarDNI"
              class="form-control"
              :class="{ 'is-invalid': dniTocado && !dniValido }"
              placeholder="12345678A"
              maxlength="9"
              required
            />
            <div v-if="dniTocado && !dniValido" class="invalid-feedback">DNI inválido (8 números y 1 letra mayúscula)</div>
          </div>

          <!-- Teléfono -->
          <div class="col-md-6">
            <label for="telefono" class="form-label fw-bold">Teléfono <span class="text-danger">*</span></label>
            <input
              type="tel"
              id="telefono"
              v-model="solicitud.telefono"
              @blur="validarTelefono"
              class="form-control"
              :class="{ 'is-invalid': telefonoTocado && !telefonoValido }"
              placeholder="612345678"
              maxlength="9"
              required
            />
            <div v-if="telefonoTocado && !telefonoValido" class="invalid-feedback">Teléfono inválido (debe empezar por 6 o 7)</div>
          </div>

          <!-- Correo -->
          <div class="col-md-6">
            <label for="correo" class="form-label fw-bold">Correo Electrónico <span class="text-danger">*</span></label>
            <input
              type="email"
              id="correo"
              v-model="solicitud.correo"
              class="form-control"
              required
            />
          </div>

          <!-- Fecha de Nacimiento -->
          <div class="col-md-6">
            <label for="fechaNacimiento" class="form-label fw-bold">Fecha de Nacimiento <span class="text-danger">*</span></label>
            <input
              type="date"
              id="fechaNacimiento"
              v-model="solicitud.fechaNacimiento"
              class="form-control"
              :max="fechaMaxima"
              required
            />
          </div>

          <!-- Código Postal -->
          <div class="col-md-6">
            <label for="codigoPostal" class="form-label fw-bold">Código Postal <span class="text-danger">*</span></label>
            <input
              type="text"
              id="codigoPostal"
              v-model="solicitud.codigoPostal"
              @blur="validarCodigoPostal"
              class="form-control"
              :class="{ 'is-invalid': codigoPostalTocado && !codigoPostalValido }"
              placeholder="28001"
              maxlength="5"
              required
            />
            <div v-if="codigoPostalTocado && !codigoPostalValido" class="invalid-feedback">Código postal inválido (5 dígitos)</div>
          </div>

          <!-- Puesto Solicitado -->
          <div class="col-md-6">
            <label for="puesto" class="form-label fw-bold">Puesto Solicitado <span class="text-danger">*</span></label>
            <select
              id="puesto"
              v-model="solicitud.puesto"
              class="form-select"
              required
            >
              <option value="">Selecciona un puesto</option>
              <option value="Vendedor">Vendedor</option>
              <option value="Mecánico">Mecánico</option>
              <option value="Administrativo">Administrativo</option>
              <option value="Asesor Comercial">Asesor Comercial</option>
              <option value="Gerente">Gerente</option>
            </select>
          </div>

          <!-- Dirección -->
          <div class="col-12">
            <label for="direccion" class="form-label fw-bold">Dirección <span class="text-danger">*</span></label>
            <input
              type="text"
              id="direccion"
              v-model="solicitud.direccion"
              class="form-control"
              placeholder="Calle, número, piso..."
              required
            />
          </div>

          <!-- Provincia -->
          <div class="col-md-6">
            <label for="provincia" class="form-label fw-bold">Provincia <span class="text-danger">*</span></label>
            <select
              id="provincia"
              v-model="solicitud.provincia"
              class="form-select"
              @change="filtrarMunicipios"
              required
            >
              <option value="">Selecciona una provincia</option>
              <option v-for="prov in provincias" :key="prov.id" :value="prov.nm">
                {{ prov.nm }}
              </option>
            </select>
          </div>

          <!-- Municipio -->
          <div class="col-md-6">
            <label for="municipio" class="form-label fw-bold">Municipio <span class="text-danger">*</span></label>
            <select
              id="municipio"
              v-model="solicitud.municipio"
              class="form-select"
              :disabled="!solicitud.provincia"
              required
            >
              <option value="">Selecciona un municipio</option>
              <option v-for="mun in municipiosFiltrados" :key="mun.id" :value="mun.nm">
                {{ mun.nm }}
              </option>
            </select>
          </div>

          <!-- Experiencia -->
          <div class="col-12">
            <label for="experiencia" class="form-label fw-bold">Experiencia Laboral</label>
            <textarea
              id="experiencia"
              v-model="solicitud.experiencia"
              class="form-control"
              rows="3"
              placeholder="Describe tu experiencia laboral relevante..."
            ></textarea>
          </div>

          <!-- Foto -->
          <div class="col-12">
            <label for="foto" class="form-label fw-bold">
              Fotografía (Rostro) <span class="text-danger">*</span>
            </label>
            <input
              type="file"
              id="foto"
              @change="handleFileChange"
              class="form-control"
              accept="image/png, image/jpeg, image/jpg"
              :required="!editando"
            />
            <small class="text-muted">Formatos permitidos: PNG, JPG, JPEG. Tamaño máximo: 5MB</small>
            <div v-if="previewFoto" class="mt-2">
              <img :src="previewFoto" alt="Preview" class="img-thumbnail" style="max-width: 200px; max-height: 200px;">
            </div>
          </div>
        </div>

        <!-- Botones -->
        <div class="d-flex justify-content-center gap-3 mt-4">
          <button type="button" class="btn btn-secondary px-4" @click="limpiarFormulario">
            <i class="bi bi-arrow-clockwise me-2"></i>Limpiar
          </button>
          <button type="submit" class="btn btn-success px-4">
            <i class="bi bi-send me-2"></i>{{ editando ? 'Actualizar' : 'Enviar Solicitud' }}
          </button>
        </div>
      </form>

      <!-- CARDS DE SOLICITUDES (solo visible para admin) -->
      <div v-if="esAdmin" class="mt-5">
        <h5 class="text-center mb-4 fw-semibold text-primary border-bottom pb-2">
          <i class="bi bi-file-earmark-text me-2"></i>Solicitudes Recibidas
        </h5>

        <div v-if="solicitudes.length === 0" class="alert alert-info text-center">
          No hay solicitudes registradas
        </div>

        <div class="row g-4">
          <div v-for="sol in solicitudes" :key="sol._id" class="col-md-6 col-lg-4">
            <div class="card h-100 shadow-sm border-0">
              <div class="card-header text-white" :class="getEstadoClass(sol.estado)">
                <small class="fw-bold">{{ sol.puesto }}</small>
                <span class="badge bg-white text-dark float-end">{{ formatEstado(sol.estado) }}</span>
              </div>
              <div class="card-body">
                <div class="text-center mb-3">
                  <img
                    :src="getFotoUrl(sol.foto)"
                    alt="Foto"
                    class="rounded-circle"
                    style="width: 100px; height: 100px; object-fit: cover;"
                  />
                </div>
                <h6 class="card-title fw-bold">{{ sol.nombre }} {{ sol.apellidos }}</h6>
                <p class="card-text mb-1"><small><strong>DNI:</strong> {{ sol.dni }}</small></p>
                <p class="card-text mb-1"><small><strong>Teléfono:</strong> {{ sol.telefono }}</small></p>
                <p class="card-text mb-1"><small><strong>Email:</strong> {{ sol.correo }}</small></p>
                <p class="card-text mb-1">
                  <small><strong>Fecha:</strong> {{ formatFecha(sol.fechaSolicitud) }}</small>
                </p>
              </div>
              <div class="card-footer bg-transparent border-0">
                <div class="d-flex flex-wrap gap-2 justify-content-center">
                  <button
                    @click="verDetalle(sol)"
                    class="btn btn-sm btn-info text-white"
                    title="Ver detalles"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <button
                    @click="editarSolicitud(sol)"
                    class="btn btn-sm btn-warning text-white"
                    title="Editar"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    @click="descargarPDF(sol)"
                    class="btn btn-sm btn-success"
                    title="Descargar PDF"
                  >
                    <i class="bi bi-file-pdf"></i>
                  </button>
                  <button
                    @click="eliminarSolicitud(sol._id)"
                    class="btn btn-sm btn-danger"
                    title="Eliminar"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL DETALLE -->
    <div
      class="modal fade"
      id="modalDetalle"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="bi bi-person-lines-fill me-2"></i>Detalle de Solicitud
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body" v-if="solicitudDetalle">
            <div class="row">
              <div class="col-md-4 text-center mb-3">
                <img
                  :src="getFotoUrl(solicitudDetalle.foto)"
                  alt="Foto"
                  class="img-fluid rounded"
                  style="max-height: 250px;"
                />
              </div>
              <div class="col-md-8">
                <h5 class="fw-bold">{{ solicitudDetalle.nombre }} {{ solicitudDetalle.apellidos }}</h5>
                <hr>
                <p><strong>DNI:</strong> {{ solicitudDetalle.dni }}</p>
                <p><strong>Teléfono:</strong> {{ solicitudDetalle.telefono }}</p>
                <p><strong>Correo:</strong> {{ solicitudDetalle.correo }}</p>
                <p><strong>Fecha Nacimiento:</strong> {{ formatFecha(solicitudDetalle.fechaNacimiento) }}</p>
                <p><strong>Dirección:</strong> {{ solicitudDetalle.direccion }}</p>
                <p><strong>Provincia:</strong> {{ solicitudDetalle.provincia }}</p>
                <p><strong>Municipio:</strong> {{ solicitudDetalle.municipio }}</p>
                <p><strong>Código Postal:</strong> {{ solicitudDetalle.codigoPostal }}</p>
                <p><strong>Puesto:</strong> {{ solicitudDetalle.puesto }}</p>
                <p><strong>Estado:</strong> <span :class="'badge ' + getEstadoBadgeClass(solicitudDetalle.estado)">
                  {{ formatEstado(solicitudDetalle.estado) }}
                </span></p>
                <p><strong>Fecha de Solicitud:</strong> {{ formatFecha(solicitudDetalle.fechaSolicitud) }}</p>
                <hr>
                <p><strong>Experiencia:</strong></p>
                <p class="text-muted">{{ solicitudDetalle.experiencia || 'Sin experiencia especificada' }}</p>
                
                <!-- Cambiar estado -->
                <div class="mt-3">
                  <label class="form-label fw-bold">Cambiar Estado:</label>
                  <select
                    v-model="nuevoEstado"
                    class="form-select"
                    @change="cambiarEstado(solicitudDetalle._id)"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="revisada">Revisada</option>
                    <option value="aceptada">Aceptada</option>
                    <option value="rechazada">Rechazada</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import provmuniData from '@/data/provmuni.json';
import {
  getSolicitudes,
  addSolicitud,
  updateSolicitud,
  deleteSolicitud,
  getFotoUrl
} from '@/api/solicitudes.js';

// Estado del formulario
const solicitud = ref({
  nombre: '',
  apellidos: '',
  dni: '',
  direccion: '',
  provincia: '',
  municipio: '',
  codigoPostal: '',
  telefono: '',
  correo: '',
  fechaNacimiento: '',
  experiencia: '',
  puesto: '',
  foto: null
});

const solicitudes = ref([]);
const editando = ref(false);
const solicitudEditandoId = ref(null);
const previewFoto = ref(null);
const solicitudDetalle = ref(null);
const nuevoEstado = ref('');
let modalDetalleInstance = null;

// Validaciones
const dniValido = ref(true);
const telefonoValido = ref(true);
const codigoPostalValido = ref(true);

// Estados para saber si el campo ha sido tocado
const dniTocado = ref(false);
const telefonoTocado = ref(false);
const codigoPostalTocado = ref(false);

// Provincias y municipios
const provincias = ref(provmuniData.provincias);
const municipios = ref(provmuniData.municipios);
const municipiosFiltrados = ref([]);

// Fecha máxima (18 años atrás)
const fechaMaxima = computed(() => {
  const hoy = new Date();
  hoy.setFullYear(hoy.getFullYear() - 18);
  return hoy.toISOString().split('T')[0];
});

// Verificar si es admin
const esAdmin = computed(() => {
  return sessionStorage.getItem('rol') === 'admin';
});

// Verificar si está autenticado
const estaAutenticado = computed(() => {
  return sessionStorage.getItem('token') !== null;
});

// Validar DNI
const validarDNI = () => {
  dniTocado.value = true;
  if (!solicitud.value.dni) {
    dniValido.value = true; // Campo vacío no muestra error
    return;
  }
  const dniRegex = /^[0-9]{8}[A-Z]$/;
  dniValido.value = dniRegex.test(solicitud.value.dni);
};

// Validar teléfono
const validarTelefono = () => {
  telefonoTocado.value = true;
  if (!solicitud.value.telefono) {
    telefonoValido.value = true; // Campo vacío no muestra error
    return;
  }
  const telefonoRegex = /^[67]\d{8}$/;
  telefonoValido.value = telefonoRegex.test(solicitud.value.telefono);
};

// Validar código postal
const validarCodigoPostal = () => {
  codigoPostalTocado.value = true;
  if (!solicitud.value.codigoPostal) {
    codigoPostalValido.value = true; // Campo vacío no muestra error
    return;
  }
  const cpRegex = /^[0-9]{5}$/;
  codigoPostalValido.value = cpRegex.test(solicitud.value.codigoPostal);
};

// Filtrar municipios según provincia
const filtrarMunicipios = () => {
  const nombreProv = solicitud.value.provincia;
  
  const prov = provincias.value.find(p => p.nm === nombreProv);
  if (!prov) {
    municipiosFiltrados.value = [];
    return;
  }
  
  const codigoProv = prov.id.slice(0, 2);
  municipiosFiltrados.value = municipios.value.filter(m => m.id.startsWith(codigoProv));
  
  // Resetear municipio si ya no corresponde
  solicitud.value.municipio = '';
};

// Manejar cambio de archivo
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Archivo muy grande',
        text: 'La imagen no debe superar los 5MB'
      });
      event.target.value = '';
      return;
    }
    solicitud.value.foto = file;
    
    // Preview
    const reader = new FileReader();
    reader.onload = (e) => {
      previewFoto.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Enviar solicitud
const enviarSolicitud = async () => {
  // Verificar autenticación
  if (!estaAutenticado.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Inicia sesión',
      text: 'Necesitas iniciar sesión para enviar una solicitud de empleo.',
      confirmButtonText: 'Entendido'
    });
    return;
  }

  // Forzar validación de todos los campos
  validarDNI();
  validarTelefono();
  validarCodigoPostal();

  // Validaciones
  if (!dniValido.value || !telefonoValido.value || !codigoPostalValido.value) {
    Swal.fire({
      icon: 'error',
      title: 'Datos inválidos',
      text: 'Por favor, revisa los campos marcados en rojo.'
    });
    return;
  }

  try {
    const formData = new FormData();
    formData.append('nombre', solicitud.value.nombre);
    formData.append('apellidos', solicitud.value.apellidos);
    formData.append('dni', solicitud.value.dni);
    formData.append('direccion', solicitud.value.direccion);
    formData.append('provincia', solicitud.value.provincia);
    formData.append('municipio', solicitud.value.municipio);
    formData.append('codigoPostal', solicitud.value.codigoPostal);
    formData.append('telefono', solicitud.value.telefono);
    formData.append('correo', solicitud.value.correo);
    formData.append('fechaNacimiento', solicitud.value.fechaNacimiento);
    formData.append('experiencia', solicitud.value.experiencia);
    formData.append('puesto', solicitud.value.puesto);
    
    if (solicitud.value.foto) {
      formData.append('foto', solicitud.value.foto);
    }

    if (editando.value) {
      await updateSolicitud(solicitudEditandoId.value, formData);
      Swal.fire({
        icon: 'success',
        title: 'Solicitud actualizada',
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      await addSolicitud(formData);
      Swal.fire({
        icon: 'success',
        title: 'Solicitud enviada',
        text: 'Tu solicitud ha sido enviada correctamente. Te contactaremos pronto.',
        timer: 2000,
        showConfirmButton: false
      });
    }

    limpiarFormulario();
    if (esAdmin.value) {
      await cargarSolicitudes();
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Error al procesar la solicitud'
    });
  }
};

// Cargar solicitudes
const cargarSolicitudes = async () => {
  if (!esAdmin.value) return;
  
  try {
    const data = await getSolicitudes();
    solicitudes.value = data;
  } catch (error) {
    console.error('Error al cargar solicitudes:', error);
  }
};

// Limpiar formulario
const limpiarFormulario = () => {
  solicitud.value = {
    nombre: '',
    apellidos: '',
    dni: '',
    direccion: '',
    provincia: '',
    municipio: '',
    codigoPostal: '',
    telefono: '',
    correo: '',
    fechaNacimiento: '',
    experiencia: '',
    puesto: '',
    foto: null
  };
  previewFoto.value = null;
  editando.value = false;
  solicitudEditandoId.value = null;
  
  // Resetear estados de validación
  dniValido.value = true;
  telefonoValido.value = true;
  codigoPostalValido.value = true;
  dniTocado.value = false;
  telefonoTocado.value = false;
  codigoPostalTocado.value = false;
  
  // Limpiar input file
  const fileInput = document.getElementById('foto');
  if (fileInput) fileInput.value = '';
};

// Ver detalle
const verDetalle = (sol) => {
  solicitudDetalle.value = sol;
  nuevoEstado.value = sol.estado;
  if (modalDetalleInstance) {
    modalDetalleInstance.show();
  }
};

// Editar solicitud
const editarSolicitud = (sol) => {
  editando.value = true;
  solicitudEditandoId.value = sol._id;
  
  solicitud.value = {
    nombre: sol.nombre,
    apellidos: sol.apellidos,
    dni: sol.dni,
    direccion: sol.direccion,
    provincia: sol.provincia,
    municipio: sol.municipio,
    codigoPostal: sol.codigoPostal,
    telefono: sol.telefono,
    correo: sol.correo,
    fechaNacimiento: sol.fechaNacimiento.split('T')[0],
    experiencia: sol.experiencia,
    puesto: sol.puesto,
    foto: null
  };
  
  // Filtrar municipios según la provincia
  if (sol.provincia) {
    filtrarMunicipios();
  }
  
  previewFoto.value = getFotoUrl(sol.foto);
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Eliminar solicitud
const eliminarSolicitud = async (id) => {
  const result = await Swal.fire({
    title: '¿Eliminar solicitud?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    try {
      await deleteSolicitud(id);
      Swal.fire({
        icon: 'success',
        title: 'Eliminada',
        timer: 1500,
        showConfirmButton: false
      });
      await cargarSolicitudes();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la solicitud'
      });
    }
  }
};

// Cambiar estado
const cambiarEstado = async (id) => {
  try {
    const formData = new FormData();
    formData.append('estado', nuevoEstado.value);
    
    await updateSolicitud(id, formData);
    
    Swal.fire({
      icon: 'success',
      title: 'Estado actualizado',
      timer: 1500,
      showConfirmButton: false
    });
    
    await cargarSolicitudes();
    solicitudDetalle.value.estado = nuevoEstado.value;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo actualizar el estado'
    });
  }
};

// Descargar PDF
const descargarPDF = (sol) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(18);
  doc.setTextColor(13, 110, 253);
  doc.text('Solicitud de Empleo', 105, 20, { align: 'center' });

  // Línea separadora
  doc.setDrawColor(13, 110, 253);
  doc.setLineWidth(0.5);
  doc.line(20, 25, 190, 25);

  // Datos personales
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  let y = 35;

  doc.setFont(undefined, 'bold');
  doc.text('Datos Personales', 20, y);
  doc.setFont(undefined, 'normal');
  y += 8;

  doc.text(`Nombre completo: ${sol.nombre} ${sol.apellidos}`, 20, y);
  y += 6;
  doc.text(`DNI: ${sol.dni}`, 20, y);
  y += 6;
  doc.text(`Fecha de nacimiento: ${formatFecha(sol.fechaNacimiento)}`, 20, y);
  y += 6;
  doc.text(`Teléfono: ${sol.telefono}`, 20, y);
  y += 6;
  doc.text(`Correo: ${sol.correo}`, 20, y);
  y += 6;
  doc.text(`Dirección: ${sol.direccion}`, 20, y);
  y += 6;
  doc.text(`Código Postal: ${sol.codigoPostal}`, 20, y);
  y += 10;

  // Puesto
  doc.setFont(undefined, 'bold');
  doc.text('Puesto Solicitado', 20, y);
  doc.setFont(undefined, 'normal');
  y += 8;
  doc.text(sol.puesto, 20, y);
  y += 10;

  // Experiencia
  doc.setFont(undefined, 'bold');
  doc.text('Experiencia Laboral', 20, y);
  doc.setFont(undefined, 'normal');
  y += 8;
  
  const experienciaTexto = sol.experiencia || 'Sin experiencia especificada';
  const splitExperiencia = doc.splitTextToSize(experienciaTexto, 170);
  doc.text(splitExperiencia, 20, y);
  y += splitExperiencia.length * 6 + 10;

  // Estado y fecha
  doc.setFont(undefined, 'bold');
  doc.text(`Estado: `, 20, y);
  doc.setFont(undefined, 'normal');
  doc.text(formatEstado(sol.estado), 40, y);
  y += 6;
  doc.setFont(undefined, 'bold');
  doc.text(`Fecha de solicitud: `, 20, y);
  doc.setFont(undefined, 'normal');
  doc.text(formatFecha(sol.fechaSolicitud), 60, y);

  // Guardar
  doc.save(`solicitud-${sol.dni}.pdf`);
};

// Formatear fecha
const formatFecha = (fecha) => {
  if (!fecha) return '-';
  return new Date(fecha).toLocaleDateString('es-ES');
};

// Formatear estado
const formatEstado = (estado) => {
  const estados = {
    pendiente: 'Pendiente',
    revisada: 'Revisada',
    aceptada: 'Aceptada',
    rechazada: 'Rechazada'
  };
  return estados[estado] || estado;
};

// Clase de estado para header
const getEstadoClass = (estado) => {
  const clases = {
    pendiente: 'bg-warning',
    revisada: 'bg-info',
    aceptada: 'bg-success',
    rechazada: 'bg-danger'
  };
  return clases[estado] || 'bg-secondary';
};

// Clase badge estado
const getEstadoBadgeClass = (estado) => {
  const clases = {
    pendiente: 'bg-warning',
    revisada: 'bg-info',
    aceptada: 'bg-success',
    rechazada: 'bg-danger'
  };
  return clases[estado] || 'bg-secondary';
};

// Al montar
onMounted(async () => {
  await cargarSolicitudes();
  
  // Inicializar modal
  const modalElement = document.getElementById('modalDetalle');
  if (modalElement) {
    const { Modal } = await import('bootstrap');
    modalDetalleInstance = new Modal(modalElement);
  }
});
</script>

<style scoped>
.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.is-invalid {
  border-color: #dc3545 !important;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875em;
  margin-top: 0.25rem;
}
</style>
