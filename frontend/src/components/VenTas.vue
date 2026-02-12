<template>
    <div class="container-fluid mt-2">
        <div class="row g-4">
            <div 
            v-for="car in vehiculos"
            :key="car._id"
            class="col-12 col-md-6 col-lg-3"
            >
                <div class="card h-80 shadow-sm">
                    <img
                        :src="urlImagen(car.imagen)"
                        class="card-img-top"
                        alt="vehiculo"
                        style="height: 200px; object-fit: cover; cursor: pointer;"
                        @click="abrirDetalles(car._id)"
                    ></img>

                    <div class="card-body">
                        <h5 class="card-title">{{ car.marca }} {{ car.modelo }}</h5>
                        <p class="card-text">
                            <strong>Año:</strong>{{ car.anio }}<br>
                            <strong>Km:</strong>{{ car.kilometros }}<br>
                            <strong>Precio:</strong>{{ car.precio }}<br>
                        </p>   
                    </div>

                    <div class="card-footer text-end bg-white">
                        <span 
                            class="badge"
                            :class="{
                                'bg-danger': car.estado === 'vendido',
                                'bg-warning': car.estado === 'reservado',
                                'bg-success': car.estado === 'disponible'
                            }"
                        >
                            {{ car.estado }}
                        </span>
                        
                        <!-- Botón de Reservar (solo si está autenticado) -->
                        <button
                            v-if="estaAutenticado && car.estado === 'disponible'"
                            class="btn badge btn-sm btn-warning ms-2"
                            @click.stop="irAReservar(car._id)"
                        >
                            <i class="bi bi-calendar-check me-1"></i> 
                            Reservar
                        </button>
                        
                        <!-- Botón de Agregar a Cesta -->
                        <button
                            class="btn badge btn-sm btn-success ms-2"
                            :disabled="car.estado === 'vendido' || car.estado === 'reservado'"
                            @click.stop="agregarACesta(car)">
                            <i class="bi bi-cart3 me-1"></i> 
                            {{ car.estado === 'vendido' ? 'Vendido' : car.estado === 'reservado' ? 'Reservado' : 'Agregar Cesta' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de detalles del vehículo -->
        <div 
            v-if="mostrarModal" 
            class="modal fade show" 
            style="display: block; background-color: rgba(0,0,0,0.5);" 
            tabindex="-1"
            @click.self="cerrarModal"
        >
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-car-front-fill me-2"></i>
                            Detalles del Vehículo
                        </h5>
                        <button type="button" class="btn-close btn-close-white" @click="cerrarModal"></button>
                    </div>
                    <div class="modal-body" v-if="vehiculoSeleccionado">
                        <!-- Imagen del vehículo -->
                        <div class="text-center mb-4">
                            <img 
                                :src="urlImagen(vehiculoSeleccionado.imagen)" 
                                class="img-fluid rounded" 
                                style="max-height: 300px; object-fit: cover;"
                                alt="Vehículo"
                            >
                        </div>

                        <!-- Información en secciones -->
                        <div class="row">
                            <!-- Información General -->
                            <div class="col-md-6">
                                <div class="card mb-3">
                                    <div class="card-header bg-light">
                                        <strong><i class="bi bi-info-circle me-2"></i>Información General</strong>
                                    </div>
                                    <div class="card-body">
                                        <p><strong>Tipo:</strong> {{ vehiculoSeleccionado.tipo }}</p>
                                        <p><strong>Marca:</strong> {{ vehiculoSeleccionado.marca }}</p>
                                        <p><strong>Modelo:</strong> {{ vehiculoSeleccionado.modelo }}</p>
                                        <p><strong>Año:</strong> {{ vehiculoSeleccionado.anio }}</p>
                                        <p><strong>Matrícula:</strong> {{ vehiculoSeleccionado.matricula }}</p>
                                        <p>
                                            <strong>Estado:</strong> 
                                            <span 
                                                class="badge" 
                                                :class="vehiculoSeleccionado.estado === 'vendido' ? 'bg-danger' : 'bg-success'"
                                            >
                                                {{ vehiculoSeleccionado.estado }}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Especificaciones Técnicas -->
                            <div class="col-md-6">
                                <div class="card mb-3">
                                    <div class="card-header bg-light">
                                        <strong><i class="bi bi-gear me-2"></i>Especificaciones Técnicas</strong>
                                    </div>
                                    <div class="card-body">
                                        <p><strong>Kilometraje:</strong> {{ vehiculoSeleccionado.kilometros?.toLocaleString() }} km</p>
                                        <p><strong>Combustible:</strong> {{ vehiculoSeleccionado.combustible }}</p>
                                        <p><strong>Transmisión:</strong> {{ vehiculoSeleccionado.transmision }}</p>
                                        <p v-if="vehiculoSeleccionado.potencia_cv">
                                            <strong>Potencia:</strong> {{ vehiculoSeleccionado.potencia_cv }} CV
                                        </p>
                                        <p class="text-success fw-bold fs-5">
                                            <strong>Precio:</strong> {{ vehiculoSeleccionado.precio?.toLocaleString() }}€
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Descripción -->
                            <div class="col-12" v-if="vehiculoSeleccionado.descripcion">
                                <div class="card mb-3">
                                    <div class="card-header bg-light">
                                        <strong><i class="bi bi-file-text me-2"></i>Descripción</strong>
                                    </div>
                                    <div class="card-body">
                                        <p>{{ vehiculoSeleccionado.descripcion }}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Ubicación -->
                            <div class="col-md-6">
                                <div class="card mb-3">
                                    <div class="card-header bg-light">
                                        <strong><i class="bi bi-geo-alt me-2"></i>Ubicación</strong>
                                    </div>
                                    <div class="card-body">
                                        <p><strong>Provincia:</strong> {{ vehiculoSeleccionado.ubicacion?.provincia }}</p>
                                        <p><strong>Ciudad:</strong> {{ vehiculoSeleccionado.ubicacion?.ciudad }}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Contacto -->
                            <div class="col-md-6">
                                <div class="card mb-3">
                                    <div class="card-header bg-light">
                                        <strong><i class="bi bi-person-lines-fill me-2"></i>Contacto</strong>
                                    </div>
                                    <div class="card-body">
                                        <p><strong>Nombre:</strong> {{ vehiculoSeleccionado.contacto?.nombre }}</p>
                                        <p><strong>Teléfono:</strong> {{ vehiculoSeleccionado.contacto?.telefono }}</p>
                                        <p><strong>Email:</strong> {{ vehiculoSeleccionado.contacto?.email }}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Fecha de publicación -->
                            <div class="col-12">
                                <div class="card mb-3">
                                    <div class="card-body text-center text-muted">
                                        <small>
                                            <i class="bi bi-calendar-event me-2"></i>
                                            Publicado el: {{ formatearFecha(vehiculoSeleccionado.fecha_publicacion) }}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" @click="descargarPDF">
                            <i class="bi bi-file-pdf me-2"></i>Descargar PDF
                        </button>
                        <button type="button" class="btn btn-secondary" @click="cerrarModal">
                            <i class="bi bi-x-circle me-2"></i>Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getArticulos, getArticulosById } from "@/api/articulos.js";
import { useCestaStore } from "@/store/cesta.js";
import jsPDF from "jspdf";
import "jspdf-autotable";

const cestaStore = useCestaStore(); 
const router = useRouter();

const vehiculos = ref([]);
const mostrarModal = ref(false);
const vehiculoSeleccionado = ref(null);

// Computed para verificar si está autenticado
const estaAutenticado = computed(() => {
    return sessionStorage.getItem("token") !== null;
});

onMounted(async () => {
    vehiculos.value = await getArticulos();
});

const urlImagen = (ruta) => {
    if (!ruta) return "/no-image.png";
    return `http://localhost:5000${ruta}`
};

const agregarACesta = (vehiculos) => {
    cestaStore.addProducto({
        id: vehiculos._id,
        nombre: `${vehiculos.marca} ${vehiculos.modelo}`,
        precio: vehiculos.precio,
        imagen: urlImagen(vehiculos.imagen),
    });
}

// Función para redirigir a página de reservas
const irAReservar = (vehiculoId) => {
    router.push({ name: 'Reservas', query: { vehiculoId } });
}

// Función para abrir el modal con los detalles del vehículo
const abrirDetalles = async (id) => {
    try {
        vehiculoSeleccionado.value = await getArticulosById(id);
        mostrarModal.value = true;
        // Bloquear scroll del body
        document.body.style.overflow = 'hidden';
    } catch (error) {
        console.error('Error al cargar detalles del vehículo:', error);
    }
}

// Función para cerrar el modal
const cerrarModal = () => {
    mostrarModal.value = false;
    vehiculoSeleccionado.value = null;
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
}

// Función para formatear fecha
const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Función para descargar PDF con la información del vehículo
const descargarPDF = () => {
    if (!vehiculoSeleccionado.value) return;

    const doc = new jsPDF();
    const vehiculo = vehiculoSeleccionado.value;

    // Título
    doc.setFontSize(20);
    doc.setTextColor(0, 51, 153);
    doc.text('Ficha Técnica del Vehículo', 105, 20, { align: 'center' });

    // Línea separadora
    doc.setDrawColor(0, 51, 153);
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    let yPosition = 35;

    // Información General
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Información General', 20, yPosition);
    yPosition += 7;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Tipo: ${vehiculo.tipo || 'N/A'}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Marca: ${vehiculo.marca || 'N/A'}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Modelo: ${vehiculo.modelo || 'N/A'}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Año: ${vehiculo.anio || 'N/A'}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Matrícula: ${vehiculo.matricula || 'N/A'}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Estado: ${vehiculo.estado || 'N/A'}`, 20, yPosition);
    yPosition += 10;

    // Especificaciones Técnicas
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Especificaciones Técnicas', 20, yPosition);
    yPosition += 7;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Kilometraje: ${vehiculo.kilometros?.toLocaleString() || '0'} km`, 20, yPosition);
    yPosition += 6;
    doc.text(`Combustible: ${vehiculo.combustible || 'N/A'}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Transmisión: ${vehiculo.transmision || 'N/A'}`, 20, yPosition);
    yPosition += 6;
    if (vehiculo.potencia_cv) {
        doc.text(`Potencia: ${vehiculo.potencia_cv} CV`, 20, yPosition);
        yPosition += 6;
    }
    doc.setTextColor(0, 128, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(`Precio: ${vehiculo.precio?.toLocaleString() || '0'}€`, 20, yPosition);
    yPosition += 10;

    // Descripción
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Descripción', 20, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const descripcionTexto = vehiculo.descripcion || 'Sin descripción';
    const lineasDescripcion = doc.splitTextToSize(descripcionTexto, 170);
    doc.text(lineasDescripcion, 20, yPosition);
    yPosition += (lineasDescripcion.length * 5) + 5;

    // Verificar si necesitamos una nueva página
    if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
    }

    // Ubicación
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Ubicación', 20, yPosition);
    yPosition += 7;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Provincia: ${vehiculo.ubicacion?.provincia || 'N/A'}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Ciudad: ${vehiculo.ubicacion?.ciudad || 'N/A'}`, 20, yPosition);
    yPosition += 10;

    // Contacto
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Información de Contacto', 20, yPosition);
    yPosition += 7;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${vehiculo.contacto?.nombre || 'N/A'}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Teléfono: ${vehiculo.contacto?.telefono || 'N/A'}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Email: ${vehiculo.contacto?.email || 'N/A'}`, 20, yPosition);
    yPosition += 10;

    // Fecha de publicación
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Publicado el: ${formatearFecha(vehiculo.fecha_publicacion)}`, 20, yPosition);

    // Pie de página
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            `Página ${i} de ${totalPages} - Generado el ${new Date().toLocaleDateString('es-ES')}`,
            105,
            285,
            { align: 'center' }
        );
    }

    // Descargar el PDF
    const nombreArchivo = `Vehiculo_${vehiculo.marca}_${vehiculo.modelo}_${vehiculo.matricula}.pdf`;
    doc.save(nombreArchivo);
}

</script>

<style scoped>
.card-title{
    font-weight: bold;
    text-transform: capitalize;
}

/* Estilo para botón deshabilitado */
button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Estilos para el modal */
.modal.show {
    display: block;
}

.modal-dialog {
    max-width: 900px;
}

.modal-body p {
    margin-bottom: 0.5rem;
}

.modal-body p:last-child {
    margin-bottom: 0;
}

.card-header {
    font-weight: 600;
    padding: 0.5rem 1rem;
}

.card-body {
    padding: 1rem;
}

/* Animación suave para el modal */
.modal-dialog {
    animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
    from {
        transform: translateY(-50px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* Efecto hover en la imagen */
.card-img-top {
    transition: transform 0.3s ease;
}

.card-img-top:hover {
    transform: scale(1.05);
}
</style>