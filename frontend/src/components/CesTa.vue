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
          <tr class="fw-bold">
            <td colspan="3" class="text-end">Total:</td>
            <td>{{ cesta.totalPrecio.toFixed(2) }}€</td>
            <td>
              <button
                class="btn btn-success btn-sm justify-content-end mx-3"
                @click="iniciarPago"
              >
                Pago
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
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

// Computed para verificar si el usuario está autenticado
const estaAutenticado = computed(() => {
  return sessionStorage.getItem("token") !== null;
});

const incrementar = (id) => cesta.incrementar(id);
const decrementar = (id) => cesta.decrementar(id);
const removeProducto = (id) => cesta.removeProducto(id);

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
    // GUARDAR los datos del carrito en localStorage ANTES de ir a Stripe
    localStorage.setItem(
      "ultimaCompra",
      JSON.stringify({
        items: cesta.items,
        total: cesta.totalPrecio,
        fecha: new Date().toISOString(),
      }),
    );

    // Crear la sesión de pago en el backend
    const response = await axios.post(
      "http://localhost:5000/create-checkout-session",
      {
        items: cesta.items,
        amount: cesta.totalPrecio,
      },
    );

    const session = response.data;

    if (!session.url) {
      console.error("❌ No se recibió URL de Stripe.");
      mostrarAlerta("Error", "No se pudo iniciar el pago", "error");
      return;
    }

    // Redirigir directamente al checkout de Stripe
    window.location.href = session.url;
  } catch (error) {
    console.error("Error en iniciarPago:", error);
    mostrarAlerta("Error", "No se pudo iniciar el pago", "error");
  }
};
</script>

<style scoped></style>
