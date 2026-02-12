<template>
  <div class="container-fluid my-4 p-4">
    <div class="bg-white rounded-4 shadow-lg p-4">
      <h4 class="text-center mb-4 fw-semibold text-primary border-bottom pb-2">
        <i class="bi bi-car-front-fill me-2"></i>Catálogo de Vehículos
      </h4>

      <!-- FILTROS -->
      <div class="row g-3 mb-4">
        <!-- Filtrar por Provincia -->
        <div class="col-md-3">
          <label class="form-label fw-bold">
            <i class="bi bi-geo-alt me-1"></i>Provincia:
          </label>
          <select class="form-select" v-model="filtros.provincia">
            <option value="">Todas las provincias</option>
            <option v-for="prov in provinciasUnicas" :key="prov" :value="prov">
              {{ prov }}
            </option>
          </select>
        </div>

        <!-- Filtrar por Estado -->
        <div class="col-md-3">
          <label class="form-label fw-bold">
            <i class="bi bi-circle-fill me-1"></i>Estado:
          </label>
          <select class="form-select" v-model="filtros.estado">
            <option value="">Todos los estados</option>
            <option value="disponible">Disponible</option>
            <option value="reservado">Reservado</option>
            <option value="vendido">Vendido</option>
          </select>
        </div>

        <!-- Filtrar por Precio -->
        <div class="col-md-3">
          <label class="form-label fw-bold">
            <i class="bi bi-cash me-1"></i>Rango de Precio:
          </label>
          <select class="form-select" v-model="filtros.rangoPrecio">
            <option value="">Todos los precios</option>
            <option value="0-10000">Hasta 10.000 €</option>
            <option value="10000-20000">10.000 € - 20.000 €</option>
            <option value="20000-30000">20.000 € - 30.000 €</option>
            <option value="30000-50000">30.000 € - 50.000 €</option>
            <option value="50000-999999">Más de 50.000 €</option>
          </select>
        </div>

        <!-- Ordenar por -->
        <div class="col-md-3">
          <label class="form-label fw-bold">
            <i class="bi bi-sort-down me-1"></i>Ordenar por:
          </label>
          <select class="form-select" v-model="filtros.ordenamiento">
            <option value="provincia-az">Provincia (A-Z)</option>
            <option value="provincia-za">Provincia (Z-A)</option>
            <option value="marca-az">Marca (A-Z)</option>
            <option value="marca-za">Marca (Z-A)</option>
            <option value="precio-menor">Precio (Menor a Mayor)</option>
            <option value="precio-mayor">Precio (Mayor a Menor)</option>
            <option value="año-reciente">Año (Más Reciente)</option>
            <option value="año-antiguo">Año (Más Antiguo)</option>
            <option value="km-menor">Kilómetros (Menor)</option>
            <option value="km-mayor">Kilómetros (Mayor)</option>
          </select>
        </div>
      </div>

      <!-- Botón Limpiar Filtros -->
      <div class="text-center mb-4">
        <button class="btn btn-outline-secondary" @click="limpiarFiltros">
          <i class="bi bi-arrow-clockwise me-2"></i>Limpiar Filtros
        </button>
      </div>

      <!-- Contador de resultados -->
      <div class="alert alert-info text-center" v-if="vehiculosFiltrados.length > 0">
        <strong>{{ vehiculosFiltrados.length }}</strong> vehículo(s) encontrado(s)
      </div>

      <div class="alert alert-warning text-center" v-if="vehiculosFiltrados.length === 0 && vehiculos.length > 0">
        No hay vehículos que coincidan con los filtros seleccionados
      </div>

      <div class="alert alert-info text-center" v-if="vehiculos.length === 0">
        <i class="bi bi-info-circle me-2"></i>No hay vehículos disponibles en este momento
      </div>

      <!-- CARDS DE VEHÍCULOS -->
      <div class="row g-4" v-if="vehiculosFiltrados.length > 0">
        <div
          v-for="vehiculo in vehiculosFiltrados"
          :key="vehiculo._id"
          class="col-12 col-md-6 col-lg-4"
        >
          <div class="card h-100 shadow-sm border-0">
            <!-- Imagen -->
            <div class="position-relative">
              <img
                :src="urlImagen(vehiculo.imagen)"
                class="card-img-top"
                :alt="vehiculo.marca + ' ' + vehiculo.modelo"
                style="height: 250px; object-fit: cover; cursor: pointer;"
                @click="verDetalles(vehiculo)"
              />
              <!-- Badge de Estado -->
              <span
                class="position-absolute top-0 end-0 m-2 badge"
                :class="getBadgeEstado(vehiculo.estado)"
              >
                {{ formatEstado(vehiculo.estado) }}
              </span>
              <!-- Badge de Precio -->
              <span class="position-absolute bottom-0 start-0 m-2 badge bg-dark fs-6">
                {{ formatPrecio(vehiculo.precio) }}
              </span>
            </div>

            <!-- Cuerpo de la card -->
            <div class="card-body">
              <h5 class="card-title fw-bold text-primary">
                {{ vehiculo.marca }} {{ vehiculo.modelo }}
              </h5>
              <p class="card-text mb-2">
                <small class="text-muted">
                  <i class="bi bi-calendar me-1"></i>Año: {{ vehiculo.anio }}
                </small>
              </p>
              <p class="card-text mb-2">
                <small class="text-muted">
                  <i class="bi bi-speedometer2 me-1"></i>{{ formatKilometros(vehiculo.kilometros) }}
                </small>
              </p>
              <p class="card-text mb-2">
                <small class="text-muted">
                  <i class="bi bi-geo-alt-fill me-1"></i>{{ vehiculo.ubicacion.provincia }}
                </small>
              </p>
              <p class="card-text">
                <small>
                  <i class="bi bi-fuel-pump me-1"></i>{{ vehiculo.combustible }} |
                  <i class="bi bi-gear me-1"></i>{{ vehiculo.transmision }}
                </small>
              </p>
            </div>

            <!-- Footer con botones -->
            <div class="card-footer bg-transparent border-0 d-flex gap-2 justify-content-center">
              <button
                class="btn btn-sm btn-primary"
                @click="verDetalles(vehiculo)"
              >
                <i class="bi bi-eye me-1"></i>Ver Detalles
              </button>
              <button
                class="btn btn-sm btn-success"
                @click="descargarPDF(vehiculo)"
              >
                <i class="bi bi-file-pdf me-1"></i>PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL DE DETALLES -->
    <div
      class="modal fade"
      id="modalDetalles"
      tabindex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="bi bi-info-circle me-2"></i>Detalles del Vehículo
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body" v-if="vehiculoSeleccionado">
            <div class="row">
              <!-- Columna izquierda: Imagen -->
              <div class="col-md-6">
                <img
                  :src="urlImagen(vehiculoSeleccionado.imagen)"
                  class="img-fluid rounded mb-3"
                  :alt="vehiculoSeleccionado.marca + ' ' + vehiculoSeleccionado.modelo"
                />
              </div>

              <!-- Columna derecha: Información -->
              <div class="col-md-6">
                <h3 class="fw-bold text-primary mb-3">
                  {{ vehiculoSeleccionado.marca }} {{ vehiculoSeleccionado.modelo }}
                </h3>

                <div class="mb-3">
                  <h4 class="text-success">{{ formatPrecio(vehiculoSeleccionado.precio) }}</h4>
                  <span
                    class="badge"
                    :class="getBadgeEstado(vehiculoSeleccionado.estado)"
                  >
                    {{ formatEstado(vehiculoSeleccionado.estado) }}
                  </span>
                </div>

                <hr>

                <h5 class="fw-bold mb-3">Características Técnicas</h5>
                <div class="row g-3">
                  <div class="col-6">
                    <p><strong><i class="bi bi-calendar me-1"></i>Año:</strong> {{ vehiculoSeleccionado.anio }}</p>
                  </div>
                  <div class="col-6">
                    <p><strong><i class="bi bi-speedometer2 me-1"></i>Kilómetros:</strong> {{ formatKilometros(vehiculoSeleccionado.kilometros) }}</p>
                  </div>
                  <div class="col-6">
                    <p><strong><i class="bi bi-fuel-pump me-1"></i>Combustible:</strong> {{ vehiculoSeleccionado.combustible }}</p>
                  </div>
                  <div class="col-6">
                    <p><strong><i class="bi bi-gear me-1"></i>Transmisión:</strong> {{ vehiculoSeleccionado.transmision }}</p>
                  </div>
                  <div class="col-6">
                    <p><strong><i class="bi bi-lightning me-1"></i>Potencia:</strong> {{ vehiculoSeleccionado.potencia_cv }} CV</p>
                  </div>
                  <div class="col-6">
                    <p><strong><i class="bi bi-car-front me-1"></i>Tipo:</strong> {{ vehiculoSeleccionado.tipo }}</p>
                  </div>
                  <div class="col-6">
                    <p><strong><i class="bi bi-hash me-1"></i>Matrícula:</strong> {{ vehiculoSeleccionado.matricula || 'N/A' }}</p>
                  </div>
                </div>

                <hr>

                <h5 class="fw-bold mb-3">Ubicación</h5>
                <p>
                  <i class="bi bi-geo-alt-fill me-1"></i>
                  {{ vehiculoSeleccionado.ubicacion.ciudad }}, {{ vehiculoSeleccionado.ubicacion.provincia }}
                </p>

                <hr>

                <h5 class="fw-bold mb-3">Descripción</h5>
                <p class="text-muted">
                  {{ vehiculoSeleccionado.descripcion || 'Sin descripción disponible' }}
                </p>

                <hr>

                <h5 class="fw-bold mb-3">Contacto</h5>
                <p><strong>Nombre:</strong> {{ vehiculoSeleccionado.contacto.nombre }}</p>
                <p><strong>Teléfono:</strong> {{ vehiculoSeleccionado.contacto.telefono }}</p>
                <p><strong>Email:</strong> {{ vehiculoSeleccionado.contacto.email }}</p>

                <hr>

                <p class="text-muted">
                  <small>
                    <i class="bi bi-calendar-event me-1"></i>
                    Publicado: {{ formatFecha(vehiculoSeleccionado.fecha_publicacion) }}
                  </small>
                </p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cerrar
            </button>
            <button
              type="button"
              class="btn btn-success"
              @click="descargarPDF(vehiculoSeleccionado)"
            >
              <i class="bi bi-file-pdf me-2"></i>Descargar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getArticulos } from '@/api/articulos.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Estado
const vehiculos = ref([]);
const vehiculoSeleccionado = ref(null);
let modalDetallesInstance = null;

// Filtros
const filtros = ref({
  provincia: '',
  estado: '',
  rangoPrecio: '',
  ordenamiento: 'provincia-az'
});

// Obtener provincias únicas
const provinciasUnicas = computed(() => {
  const provincias = vehiculos.value.map(v => v.ubicacion?.provincia).filter(Boolean);
  return [...new Set(provincias)].sort();
});

// Aplicar filtros y ordenamiento
const vehiculosFiltrados = computed(() => {
  let resultado = [...vehiculos.value];

  // Filtrar por provincia
  if (filtros.value.provincia) {
    resultado = resultado.filter(v => v.ubicacion?.provincia === filtros.value.provincia);
  }

  // Filtrar por estado
  if (filtros.value.estado) {
    resultado = resultado.filter(v => v.estado === filtros.value.estado);
  }

  // Filtrar por rango de precio
  if (filtros.value.rangoPrecio) {
    const [min, max] = filtros.value.rangoPrecio.split('-').map(Number);
    resultado = resultado.filter(v => {
      const precio = parseFloat(v.precio);
      return precio >= min && precio <= max;
    });
  }

  // Ordenar
  switch (filtros.value.ordenamiento) {
    case 'provincia-az':
      resultado.sort((a, b) => 
        (a.ubicacion?.provincia || '').localeCompare(b.ubicacion?.provincia || '')
      );
      break;
    case 'provincia-za':
      resultado.sort((a, b) => 
        (b.ubicacion?.provincia || '').localeCompare(a.ubicacion?.provincia || '')
      );
      break;
    case 'marca-az':
      resultado.sort((a, b) => a.marca.localeCompare(b.marca));
      break;
    case 'marca-za':
      resultado.sort((a, b) => b.marca.localeCompare(a.marca));
      break;
    case 'precio-menor':
      resultado.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
      break;
    case 'precio-mayor':
      resultado.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
      break;
    case 'año-reciente':
      resultado.sort((a, b) => parseInt(b.anio) - parseInt(a.anio));
      break;
    case 'año-antiguo':
      resultado.sort((a, b) => parseInt(a.anio) - parseInt(b.anio));
      break;
    case 'km-menor':
      resultado.sort((a, b) => parseInt(a.kilometros) - parseInt(b.kilometros));
      break;
    case 'km-mayor':
      resultado.sort((a, b) => parseInt(b.kilometros) - parseInt(a.kilometros));
      break;
  }

  return resultado;
});

// Limpiar filtros
const limpiarFiltros = () => {
  filtros.value = {
    provincia: '',
    estado: '',
    rangoPrecio: '',
    ordenamiento: 'provincia-az'
  };
};

// Cargar vehículos
const cargarVehiculos = async () => {
  try {
    const data = await getArticulos();
    vehiculos.value = data;
  } catch (error) {
    console.error('Error al cargar vehículos:', error);
  }
};

// Ver detalles
const verDetalles = (vehiculo) => {
  vehiculoSeleccionado.value = vehiculo;
  if (modalDetallesInstance) {
    modalDetallesInstance.show();
  }
};

// Descargar PDF
const descargarPDF = (vehiculo) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(20);
  doc.setTextColor(13, 110, 253);
  doc.text(`${vehiculo.marca} ${vehiculo.modelo}`, 105, 20, { align: 'center' });

  // Línea
  doc.setDrawColor(13, 110, 253);
  doc.setLineWidth(0.5);
  doc.line(20, 25, 190, 25);

  // Precio y Estado
  doc.setFontSize(16);
  doc.setTextColor(0, 150, 0);
  doc.text(formatPrecio(vehiculo.precio), 105, 35, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Estado: ${formatEstado(vehiculo.estado)}`, 105, 42, { align: 'center' });

  // Tabla de características
  doc.autoTable({
    startY: 50,
    head: [['Característica', 'Valor']],
    body: [
      ['Tipo', vehiculo.tipo],
      ['Año', vehiculo.anio],
      ['Kilómetros', formatKilometros(vehiculo.kilometros)],
      ['Combustible', vehiculo.combustible],
      ['Transmisión', vehiculo.transmision],
      ['Potencia', `${vehiculo.potencia_cv} CV`],
      ['Matrícula', vehiculo.matricula || 'N/A'],
      ['Provincia', vehiculo.ubicacion.provincia],
      ['Ciudad', vehiculo.ubicacion.ciudad]
    ],
    theme: 'grid',
    headStyles: { fillColor: [13, 110, 253] },
    styles: { fontSize: 10 }
  });

  // Descripción
  let finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Descripción:', 20, finalY);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  const descripcionTexto = vehiculo.descripcion || 'Sin descripción disponible';
  const splitDescripcion = doc.splitTextToSize(descripcionTexto, 170);
  doc.text(splitDescripcion, 20, finalY + 6);

  finalY += splitDescripcion.length * 5 + 12;

  // Contacto
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Información de Contacto:', 20, finalY);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.text(`Nombre: ${vehiculo.contacto.nombre}`, 20, finalY + 6);
  doc.text(`Teléfono: ${vehiculo.contacto.telefono}`, 20, finalY + 12);
  doc.text(`Email: ${vehiculo.contacto.email}`, 20, finalY + 18);

  // Guardar
  doc.save(`${vehiculo.marca}-${vehiculo.modelo}.pdf`);
};

// Formatear precio
const formatPrecio = (precio) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0
  }).format(precio);
};

// Formatear kilómetros
const formatKilometros = (km) => {
  return new Intl.NumberFormat('es-ES').format(km) + ' km';
};

// Formatear fecha
const formatFecha = (fecha) => {
  if (!fecha) return 'N/A';
  return new Date(fecha).toLocaleDateString('es-ES');
};

// Formatear estado
const formatEstado = (estado) => {
  const estados = {
    disponible: 'Disponible',
    reservado: 'Reservado',
    vendido: 'Vendido'
  };
  return estados[estado] || estado;
};

// Clase badge según estado
const getBadgeEstado = (estado) => {
  const clases = {
    disponible: 'bg-success',
    reservado: 'bg-warning text-dark',
    vendido: 'bg-danger'
  };
  return clases[estado] || 'bg-secondary';
};

// Obtener URL de imagen
const urlImagen = (ruta) => {
  if (!ruta) return '/no-image.png';
  return `http://localhost:5000${ruta}`;
};

// Al montar el componente
onMounted(async () => {
  await cargarVehiculos();
  
  // Inicializar modal
  const modalElement = document.getElementById('modalDetalles');
  if (modalElement) {
    const { Modal } = await import('bootstrap');
    modalDetallesInstance = new Modal(modalElement);
  }
});
</script>

<style scoped>
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.card-img-top {
  transition: transform 0.3s ease;
}

.card:hover .card-img-top {
  transform: scale(1.05);
}

.badge {
  font-size: 0.85rem;
  padding: 0.5em 0.75em;
}
</style>
