<template>
  <div class="container mt-4">
    <h2 class="text-center mb-4">
      <i class="bi bi-calendar-check me-2"></i>Gestión de Reservas
    </h2>

    <!-- Pestañas para cambiar entre el formulario y la lista de reservas -->
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <button 
          class="nav-link" 
          :class="{ active: vistaActual === 'formulario' }"
          @click="vistaActual = 'formulario'"
        >
          <i class="bi bi-plus-circle me-2"></i>Nueva Reserva
        </button>
      </li>
      <li class="nav-item">
        <button 
          class="nav-link" 
          :class="{ active: vistaActual === 'lista' }"
          @click="vistaActual = 'lista'; cargarReservas()"
        >
          <i class="bi bi-list-ul me-2"></i>Mis Reservas
        </button>
      </li>
    </ul>

    <!-- VISTA: Formulario de nueva reserva -->
    <div v-if="vistaActual === 'formulario'">
      <!-- Selector de vehículo -->
      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0"><i class="bi bi-car-front me-2"></i>Seleccionar Vehículo</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div 
              v-for="vehiculo in vehiculosDisponibles"
              :key="vehiculo._id"
              class="col-md-4 mb-3"
            >
              <div 
                class="card h-100 vehiculo-card" 
                :class="{ 'border-primary': formulario.vehiculoId === vehiculo._id }"
                @click="seleccionarVehiculo(vehiculo)"
                style="cursor: pointer;"
              >
                <img 
                  :src="urlImagen(vehiculo.imagen)" 
                  class="card-img-top" 
                  style="height: 150px; object-fit: cover;"
                  :alt="vehiculo.marca"
                >
                <div class="card-body">
                  <h6 class="card-title">{{ vehiculo.marca }} {{ vehiculo.modelo }}</h6>
                  <p class="text-success fw-bold">{{ vehiculo.precio.toLocaleString() }}€</p>
                  <span class="badge bg-success">{{ vehiculo.estado }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="vehiculosDisponibles.length === 0" class="alert alert-info">
            No hay vehículos disponibles para reservar en este momento.
          </div>
        </div>
      </div>

      <!-- Formulario de datos del cliente -->
      <div v-if="formulario.vehiculoId" class="card mb-4">
        <div class="card-header bg-info text-white">
          <h5 class="mb-0"><i class="bi bi-person-fill me-2"></i>Datos del Cliente</h5>
        </div>
        <div class="card-body">
          <form @submit.prevent="crearReserva">
            <div class="row">
              <!-- Nombre completo -->
              <div class="col-md-6 mb-3">
                <label class="form-label">Nombre Completo *</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formulario.usuarioNombre"
                  :class="{ 'is-invalid': errores.usuarioNombre }"
                  @blur="validarCampo('usuarioNombre')"
                  placeholder="Ej: Juan García Pérez"
                  required
                >
                <div v-if="errores.usuarioNombre" class="invalid-feedback">
                  {{ errores.usuarioNombre }}
                </div>
              </div>

              <!-- Email -->
              <div class="col-md-6 mb-3">
                <label class="form-label">Email *</label>
                <input
                  type="email"
                  class="form-control"
                  v-model="formulario.usuarioEmail"
                  :class="{ 'is-invalid': errores.usuarioEmail }"
                  @blur="validarCampo('usuarioEmail')"
                  placeholder="ejemplo@correo.com"
                  required
                >
                <div v-if="errores.usuarioEmail" class="invalid-feedback">
                  {{ errores.usuarioEmail }}
                </div>
              </div>

              <!-- Teléfono -->
              <div class="col-md-6 mb-3">
                <label class="form-label">Teléfono *</label>
                <input
                  type="tel"
                  class="form-control"
                  v-model="formulario.usuarioTelefono"
                  :class="{ 'is-invalid': errores.usuarioTelefono }"
                  @blur="validarCampo('usuarioTelefono')"
                  placeholder="123456789"
                  maxlength="9"
                  required
                >
                <div v-if="errores.usuarioTelefono" class="invalid-feedback">
                  {{ errores.usuarioTelefono }}
                </div>
              </div>

              <!-- DNI -->
              <div class="col-md-6 mb-3">
                <label class="form-label">DNI *</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formulario.usuarioDNI"
                  :class="{ 'is-invalid': errores.usuarioDNI }"
                  @blur="validarCampo('usuarioDNI')"
                  @input="formulario.usuarioDNI = formulario.usuarioDNI.toUpperCase()"
                  placeholder="12345678A"
                  maxlength="9"
                  required
                >
                <div v-if="errores.usuarioDNI" class="invalid-feedback">
                  {{ errores.usuarioDNI }}
                </div>
              </div>

              <!-- Dirección -->
              <div class="col-md-12 mb-3">
                <label class="form-label">Dirección *</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formulario.direccion"
                  :class="{ 'is-invalid': errores.direccion }"
                  @blur="validarCampo('direccion')"
                  placeholder="Calle, número, piso..."
                  required
                >
                <div v-if="errores.direccion" class="invalid-feedback">
                  {{ errores.direccion }}
                </div>
              </div>

              <!-- Ciudad -->
              <div class="col-md-6 mb-3">
                <label class="form-label">Ciudad *</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formulario.ciudad"
                  :class="{ 'is-invalid': errores.ciudad }"
                  @blur="validarCampo('ciudad')"
                  placeholder="Ej: Madrid"
                  required
                >
                <div v-if="errores.ciudad" class="invalid-feedback">
                  {{ errores.ciudad }}
                </div>
              </div>

              <!-- Código Postal -->
              <div class="col-md-6 mb-3">
                <label class="form-label">Código Postal *</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formulario.codigoPostal"
                  :class="{ 'is-invalid': errores.codigoPostal }"
                  @blur="validarCampo('codigoPostal')"
                  placeholder="28001"
                  maxlength="5"
                  required
                >
                <div v-if="errores.codigoPostal" class="invalid-feedback">
                  {{ errores.codigoPostal }}
                </div>
              </div>

              <!-- Fecha Inicio -->
              <div class="col-md-6 mb-3">
                <label class="form-label">Fecha Inicio Reserva *</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="formulario.fechaInicio"
                  :min="fechaMinima"
                  :class="{ 'is-invalid': errores.fechaInicio }"
                  @blur="validarCampo('fechaInicio')"
                  required
                >
                <div v-if="errores.fechaInicio" class="invalid-feedback">
                  {{ errores.fechaInicio }}
                </div>
              </div>

              <!-- Fecha Fin -->
              <div class="col-md-6 mb-3">
                <label class="form-label">Fecha Fin Reserva *</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="formulario.fechaFin"
                  :min="formulario.fechaInicio || fechaMinima"
                  :class="{ 'is-invalid': errores.fechaFin }"
                  @blur="validarCampo('fechaFin')"
                  required
                >
                <div v-if="errores.fechaFin" class="invalid-feedback">
                  {{ errores.fechaFin }}
                </div>
              </div>

              <!-- Observaciones -->
              <div class="col-md-12 mb-3">
                <label class="form-label">Observaciones (opcional)</label>
                <textarea
                  class="form-control"
                  v-model="formulario.observaciones"
                  rows="3"
                  maxlength="500"
                  placeholder="Información adicional sobre la reserva..."
                ></textarea>
                <small class="text-muted">{{ formulario.observaciones.length }}/500 caracteres</small>
              </div>
            </div>

            <!-- Botones -->
            <div class="text-end">
              <button 
                type="button" 
                class="btn btn-secondary me-2"
                @click="resetearFormulario"
              >
                <i class="bi bi-x-circle me-2"></i>Cancelar
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="!formularioValido || enviando"
              >
                <span v-if="enviando">
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  Procesando...
                </span>
                <span v-else>
                  <i class="bi bi-check-circle me-2"></i>Confirmar Reserva
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- VISTA: Lista de reservas -->
    <div v-if="vistaActual === 'lista'">
      <div class="card">
        <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
          <h5 class="mb-0"><i class="bi bi-list-check me-2"></i>Reservas {{ esAdmin ? 'Totales' : 'Personales' }}</h5>
          <button class="btn btn-light btn-sm" @click="cargarReservas">
            <i class="bi bi-arrow-clockwise"></i> Actualizar
          </button>
        </div>
        <div class="card-body">
          <div v-if="cargando" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>

          <div v-else-if="reservas.length === 0" class="alert alert-info">
            <i class="bi bi-info-circle me-2"></i>No tienes reservas registradas.
          </div>

          <div v-else class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Vehículo</th>
                  <th>Cliente</th>
                  <th>Contacto</th>
                  <th>Periodo</th>
                  <th>Estado</th>
                  <th v-if="esAdmin">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="reserva in reservas" :key="reserva._id">
                  <td>
                    <div class="d-flex align-items-center">
                      <img 
                        v-if="reserva.vehiculoInfo?.imagen"
                        :src="urlImagen(reserva.vehiculoInfo.imagen)" 
                        style="width: 50px; height: 50px; object-fit: cover;"
                        class="rounded me-2"
                        alt="Vehículo"
                      >
                      <div>
                        <strong>{{ reserva.vehiculoInfo?.marca }} {{ reserva.vehiculoInfo?.modelo }}</strong><br>
                        <small class="text-muted">{{ reserva.vehiculoInfo?.precio?.toLocaleString() }}€</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong>{{ reserva.usuarioNombre }}</strong><br>
                    <small>{{ reserva.usuarioDNI }}</small>
                  </td>
                  <td>
                    <small>
                      <i class="bi bi-envelope me-1"></i>{{ reserva.usuarioEmail }}<br>
                      <i class="bi bi-telephone me-1"></i>{{ reserva.usuarioTelefono }}
                    </small>
                  </td>
                  <td>
                    <small>
                      <strong>Desde:</strong> {{ formatearFecha(reserva.fechaInicio) }}<br>
                      <strong>Hasta:</strong> {{ formatearFecha(reserva.fechaFin) }}
                    </small>
                  </td>
                  <td>
                    <span 
                      class="badge"
                      :class="{
                        'bg-success': reserva.estado === 'activa',
                        'bg-danger': reserva.estado === 'cancelada',
                        'bg-secondary': reserva.estado === 'completada'
                      }"
                    >
                      {{ reserva.estado }}
                    </span>
                  </td>
                  <td v-if="esAdmin">
                    <button 
                      v-if="reserva.estado === 'activa'"
                      class="btn btn-sm btn-danger"
                      @click="confirmarCancelacion(reserva)"
                    >
                      <i class="bi bi-x-circle"></i> Cancelar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getArticulos } from '@/api/articulos.js';
import { getReservas, addReserva, cancelarReserva } from '@/api/reservas.js';
import Swal from 'sweetalert2';

const route = useRoute();
const vistaActual = ref('formulario');
const vehiculos = ref([]);
const reservas = ref([]);
const cargando = ref(false);
const enviando = ref(false);

// Estado del formulario
const formulario = ref({
  vehiculoId: '',
  usuarioNombre: '',
  usuarioEmail: '',
  usuarioTelefono: '',
  usuarioDNI: '',
  direccion: '',
  ciudad: '',
  codigoPostal: '',
  fechaInicio: '',
  fechaFin: '',
  observaciones: ''
});

const errores = ref({});

// Computed
const esAdmin = computed(() => sessionStorage.getItem('rol') === 'admin');

const vehiculosDisponibles = computed(() => {
  return vehiculos.value.filter(v => v.estado === 'disponible');
});

const fechaMinima = computed(() => {
  const hoy = new Date();
  return hoy.toISOString().split('T')[0];
});

const formularioValido = computed(() => {
  return formulario.value.vehiculoId &&
         formulario.value.usuarioNombre &&
         formulario.value.usuarioEmail &&
         formulario.value.usuarioTelefono &&
         formulario.value.usuarioDNI &&
         formulario.value.direccion &&
         formulario.value.ciudad &&
         formulario.value.codigoPostal &&
         formulario.value.fechaInicio &&
         formulario.value.fechaFin &&
         Object.keys(errores.value).length === 0;
});

// Métodos
onMounted(async () => {
  await cargarVehiculos();
  
  // Si hay un vehiculoId en la query, seleccionarlo automáticamente
  if (route.query.vehiculoId) {
    formulario.value.vehiculoId = route.query.vehiculoId;
  }
});

const cargarVehiculos = async () => {
  try {
    vehiculos.value = await getArticulos();
  } catch (error) {
    console.error('Error cargando vehículos:', error);
    Swal.fire('Error', 'No se pudieron cargar los vehículos', 'error');
  }
};

const cargarReservas = async () => {
  cargando.value = true;
  try {
    const email = esAdmin.value ? null : sessionStorage.getItem('email');
    reservas.value = await getReservas(email);
  } catch (error) {
    console.error('Error cargando reservas:', error);
    Swal.fire('Error', 'No se pudieron cargar las reservas', 'error');
  } finally {
    cargando.value = false;
  }
};

const urlImagen = (ruta) => {
  if (!ruta) return "/no-image.png";
  return `http://localhost:5000${ruta}`;
};

const seleccionarVehiculo = (vehiculo) => {
  formulario.value.vehiculoId = vehiculo._id;
};

const validarCampo = (campo) => {
  const valor = formulario.value[campo];
  
  switch(campo) {
    case 'usuarioNombre':
      if (!valor || valor.length < 3) {
        errores.value[campo] = 'El nombre debe tener al menos 3 caracteres';
      } else if (valor.length > 100) {
        errores.value[campo] = 'El nombre no puede exceder 100 caracteres';
      } else {
        delete errores.value[campo];
      }
      break;
      
    case 'usuarioEmail':
      const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!regexEmail.test(valor)) {
        errores.value[campo] = 'Email inválido';
      } else {
        delete errores.value[campo];
      }
      break;
      
    case 'usuarioTelefono':
      const regexTelefono = /^[0-9]{9}$/;
      if (!regexTelefono.test(valor)) {
        errores.value[campo] = 'El teléfono debe tener 9 dígitos';
      } else {
        delete errores.value[campo];
      }
      break;
      
    case 'usuarioDNI':
      const regexDNI = /^[0-9]{8}[A-Z]$/;
      if (!regexDNI.test(valor)) {
        errores.value[campo] = 'DNI inválido (formato: 12345678A)';
      } else {
        delete errores.value[campo];
      }
      break;
      
    case 'direccion':
      if (!valor || valor.length < 5) {
        errores.value[campo] = 'La dirección debe tener al menos 5 caracteres';
      } else {
        delete errores.value[campo];
      }
      break;
      
    case 'ciudad':
      if (!valor || valor.length < 2) {
        errores.value[campo] = 'La ciudad es requerida';
      } else {
        delete errores.value[campo];
      }
      break;
      
    case 'codigoPostal':
      const regexCP = /^[0-9]{5}$/;
      if (!regexCP.test(valor)) {
        errores.value[campo] = 'El código postal debe tener 5 dígitos';
      } else {
        delete errores.value[campo];
      }
      break;
      
    case 'fechaInicio':
      if (!valor) {
        errores.value[campo] = 'La fecha de inicio es requerida';
      } else if (new Date(valor) < new Date()) {
        errores.value[campo] = 'La fecha de inicio no puede ser anterior a hoy';
      } else {
        delete errores.value[campo];
      }
      break;
      
    case 'fechaFin':
      if (!valor) {
        errores.value[campo] = 'La fecha de fin es requerida';
      } else if (new Date(valor) <= new Date(formulario.value.fechaInicio)) {
        errores.value[campo] = 'La fecha de fin debe ser posterior a la fecha de inicio';
      } else {
        delete errores.value[campo];
      }
      break;
  }
};

const crearReserva = async () => {
  // Validar todos los campos antes de enviar
  Object.keys(formulario.value).forEach(campo => {
    if (campo !== 'observaciones' && campo !== 'vehiculoId') {
      validarCampo(campo);
    }
  });
  
  if (!formularioValido.value) {
    Swal.fire('Error', 'Por favor, complete correctamente todos los campos', 'error');
    return;
  }
  
  // Verificar autenticación antes de enviar
  const token = sessionStorage.getItem('token');
  console.log('🔐 Estado de autenticación antes de crear reserva:');
  console.log('   Token existe:', !!token);
  console.log('   isLogueado:', sessionStorage.getItem('isLogueado'));
  console.log('   rol:', sessionStorage.getItem('rol'));
  console.log('   email:', sessionStorage.getItem('email'));
  
  if (!token) {
    Swal.fire('Error', 'Debes iniciar sesión para crear una reserva', 'warning');
    return;
  }
  
  enviando.value = true;
  try {
    console.log('📤 Enviando reserva con datos:', formulario.value);
    await addReserva(formulario.value);
    
    Swal.fire({
      title: '¡Reserva completada!',
      text: 'Tu reserva ha sido registrada exitosamente',
      icon: 'success',
      confirmButtonText: 'Ver mis reservas'
    }).then((result) => {
      if (result.isConfirmed) {
        vistaActual.value = 'lista';
        cargarReservas();
      }
    });
    
    resetearFormulario();
    await cargarVehiculos();
  } catch (error) {
    console.error('Error creando reserva:', error);
    const mensaje = error.response?.data?.error || 'No se pudo crear la reserva';
    Swal.fire('Error', mensaje, 'error');
  } finally {
    enviando.value = false;
  }
};

const confirmarCancelacion = (reserva) => {
  Swal.fire({
    title: '¿Cancelar reserva?',
    text: `¿Estás seguro de cancelar la reserva de ${reserva.usuarioNombre}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, cancelar',
    cancelButtonText: 'No'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await cancelarReserva(reserva._id);
        Swal.fire('Cancelada', 'La reserva ha sido cancelada', 'success');
        await cargarReservas();
        await cargarVehiculos();
      } catch (error) {
        console.error('Error cancelando reserva:', error);
        Swal.fire('Error', 'No se pudo cancelar la reserva', 'error');
      }
    }
  });
};

const resetearFormulario = () => {
  formulario.value = {
    vehiculoId: '',
    usuarioNombre: '',
    usuarioEmail: '',
    usuarioTelefono: '',
    usuarioDNI: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    fechaInicio: '',
    fechaFin: '',
    observaciones: ''
  };
  errores.value = {};
};

const formatearFecha = (fecha) => {
  if (!fecha) return 'N/A';
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<style scoped>
.vehiculo-card {
  transition: all 0.3s ease;
}

.vehiculo-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.vehiculo-card.border-primary {
  border-width: 3px !important;
}

.nav-link {
  cursor: pointer;
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
}
</style>
