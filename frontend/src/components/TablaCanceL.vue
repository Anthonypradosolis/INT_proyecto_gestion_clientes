<template>
  <div class="container mt-5 text-center">
    <div class="cancel-card p-5">
      <div class="mb-4">
        <i class="bi bi-x-circle-fill text-danger" style="font-size: 5rem;"></i>
      </div>
      <h1 class="text-danger mb-3">Pago Cancelado</h1>
      <p class="lead mb-4">Has cancelado el proceso de pago. Tus artículos siguen en la cesta.</p>
      <div class="d-flex gap-3 justify-content-center">
        <router-link to="/cesta" class="btn btn-primary btn-lg">
          Volver a la cesta
        </router-link>
        <router-link to="/" class="btn btn-outline-secondary btn-lg">
          Ir a la tienda
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// No necesitamos lógica adicional, solo mostrar el mensaje
</script>

<style scoped>
.cancel-card {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #f8f9fa;
}

.bi-x-circle-fill {
  animation: shake 0.5s ease-out;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}
</style>
