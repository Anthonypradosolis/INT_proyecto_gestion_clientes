<template>
  <div class="container mt-4">
    <h2>Mi Cesta</h2>

    <div v-if="cesta.items.length === 0" class="alert alert-info">
      La cesta está vacía.
    </div>

    <!-- Mensaje de autenticación requerida -->
    <div
      v-if="!estaAutenticado && cesta.items.length > 0"
      class="alert alert-warning d-flex justify-content-between align-items-center"
    >
      <span>
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        Tienes que iniciar sesión para continuar con la compra
      </span>
      <router-link to="/login" class="btn btn-primary btn-sm">
        Iniciar Sesión
      </router-link>
    </div>

    <!-- Tabla de productos (se muestra siempre que haya items) -->
    <div v-if="cesta.items.length > 0">
      <table class="table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cesta.items" :key="item.id">
            <td>{{ item.nombre }}</td>
            <td>{{ item.precio }}</td>
            <td>
              <button
                class="btn btn-sm btn-outline-secondary me-1"
                @click="decrementar(item.id)"
              >
                -
              </button>
              {{ item.cantidad }}
              <button
                class="btn btn-sm btn-outline-secondary ms-1"
                @click="incrementar(item.id)"
              >
                +
              </button>
            </td>
            <td>{{ item.precio * item.cantidad }}</td>
            <td>
              <button
                class="btn btn-sm btn-danger"
                @click="removeProducto(item.id)"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="text-end">Subtotal:</td>
            <td colspan="2">{{ cesta.totalPrecio.toFixed(2) }}€</td>
          </tr>
          <tr v-if="cuponAplicado">
            <td colspan="3" class="text-end text-success">Descuento aplicado ({{ cuponValido }}):</td>
            <td colspan="2" class="text-success">-{{ descuentoAplicado.toFixed(2) }}€</td>
          </tr>
          <tr class="fw-bold">
            <td colspan="3" class="text-end">Total a pagar:</td>
            <td colspan="2">{{ totalConDescuento.toFixed(2) }}€</td>
          </tr>
        </tfoot>
      </table>

      <!-- Sección de cupón de descuento -->
      <div class="card mt-3">
        <div class="card-body">
          <h5 class="card-title">¿Tienes un cupón de descuento?</h5>
          <div class="row g-2">
            <div class="col-auto flex-grow-1">
              <input
                type="text"
                class="form-control"
                v-model="cuponIngresado"
                placeholder="Ingresa tu cupón"
                :disabled="cuponAplicado"
              />
            </div>
            <div class="col-auto">
              <button
                class="btn btn-primary"
                @click="aplicarCupon"
                :disabled="cuponAplicado || !cuponIngresado"
              >
                {{ cuponAplicado ? 'Cupón aplicado' : 'Aplicar' }}
              </button>
            </div>
          </div>
          <div v-if="mensajeCupon" class="mt-2" :class="cuponAplicado ? 'text-success' : 'text-danger'">
            {{ mensajeCupon }}
          </div>
        </div>
      </div>

      <!-- Botón de pago -->
      <div class="text-end mt-3">
        <button
          class="btn btn-success btn-lg"
          @click="iniciarPago"
        >
          <i class="bi bi-credit-card me-2"></i>Proceder al pago
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCestaStore } from "@/store/cesta.js";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { ref, computed } from "vue";

const cesta = useCestaStore();
const router = useRouter();

// Estado para el cupón de descuento
const cuponIngresado = ref("");
const cuponAplicado = ref(false);
const cuponValido = ref("");
const mensajeCupon = ref("");

// Cupones válidos y sus descuentos
const cuponesValidos = {
  "DESCUENTO10": 0.10, // 10% de descuento
};

// Computed para verificar si el usuario está autenticado
const estaAutenticado = computed(() => {
  return sessionStorage.getItem("token") !== null;
});

// Computed para calcular el descuento aplicado
const descuentoAplicado = computed(() => {
  if (cuponAplicado.value && cuponesValidos[cuponValido.value]) {
    return cesta.totalPrecio * cuponesValidos[cuponValido.value];
  }
  return 0;
});

// Computed para calcular el total con descuento
const totalConDescuento = computed(() => {
  return cesta.totalPrecio - descuentoAplicado.value;
});

const incrementar = (id) => cesta.incrementar(id);
const decrementar = (id) => cesta.decrementar(id);
const removeProducto = (id) => cesta.removeProducto(id);

// Función para aplicar el cupón
const aplicarCupon = () => {
  const cuponMayusculas = cuponIngresado.value.trim().toUpperCase();
  
  if (cuponesValidos[cuponMayusculas]) {
    cuponAplicado.value = true;
    cuponValido.value = cuponMayusculas;
    const porcentaje = cuponesValidos[cuponMayusculas] * 100;
    mensajeCupon.value = `¡Cupón aplicado! Has obtenido un ${porcentaje}% de descuento.`;
  } else {
    mensajeCupon.value = "Cupón inválido. Por favor, verifica el código.";
  }
};

const mostrarAlerta = (title, text, icon) => {
  Swal.fire({ title, text, icon });
};

// Iniciar pago con Stripe usando axios
const iniciarPago = async () => {
  if (!cesta.items.length) {
    mostrarAlerta("Aviso", "La cesta está vacía", "warning");
    return;
  }

  // Verificar si el usuario está registrado/autenticado
  const token = sessionStorage.getItem("token");
  if (!token) {
    Swal.fire({
      title: "Autenticación requerida",
      text: "Tienes que iniciar sesión para continuar con la compra",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Iniciar Sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/login");
      }
    });
    // No hacer nada, el mensaje ya se muestra en el template
    return;
  }

  try {
    // Calcular el total final con descuento
    const montoFinal = totalConDescuento.value;
    
    console.log('💰 Información de pago:');
    console.log('   Subtotal:', cesta.totalPrecio);
    console.log('   Cupón aplicado:', cuponAplicado.value);
    console.log('   Descuento:', descuentoAplicado.value);
    console.log('   Total final:', montoFinal);

    // GUARDAR los datos del carrito en localStorage ANTES de ir a Stripe
    localStorage.setItem(
      "ultimaCompra",
      JSON.stringify({
        items: cesta.items,
        subtotal: cesta.totalPrecio,
        descuento: descuentoAplicado.value,
        cupon: cuponAplicado.value ? cuponValido.value : null,
        total: montoFinal,
        fecha: new Date().toISOString(),
      }),
    );

    // Crear la sesión de pago en el backend
    const response = await axios.post(
      "http://localhost:5000/create-checkout-session",
      {
        items: cesta.items,
        amount: montoFinal,
      },
    );

    const session = response.data;

    if (!session.url) {
      console.error("❌ No se recibió URL de Stripe.");
      mostrarAlerta("Error", "No se pudo iniciar el pago", "error");
      return;
    }

    console.log('✅ Sesión de Stripe creada con monto:', montoFinal);
    
    // Redirigir directamente al checkout de Stripe
    window.location.href = session.url;
  } catch (error) {
    console.error("Error en iniciarPago:", error);
    mostrarAlerta("Error", "No se pudo iniciar el pago", "error");
  }
};
</script>

<style scoped></style>
