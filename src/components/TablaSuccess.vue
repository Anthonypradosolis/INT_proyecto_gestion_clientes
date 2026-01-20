<template>
  <div class="container mt-5 text-center">
    <div class="success-card p-5">
      <div class="mb-4">
        <i class="bi bi-check-circle-fill text-success" style="font-size: 5rem;"></i>
      </div>
      <h1 class="text-success mb-3">¡Pago Completado! 🎉</h1>
      <p class="lead mb-4">Gracias por tu compra. Te hemos enviado un correo con los detalles.</p>
      <router-link to="/" class="btn btn-primary btn-lg">
        Volver a la tienda
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCestaStore } from '@/store/cesta.js'

const cesta = useCestaStore()

// Vaciar la cesta al confirmar el pago
onMounted(() => {
  cesta.vaciarCesta()
})
</script>

<style scoped>
.success-card {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #f8f9fa;
}

.bi-check-circle-fill {
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
</style>
