<template>
  <nav class="navbar navbar-dark bg-primary sticky-top navbar-expand-lg">

    <div class="container-fluid">
      <!-- Marca o logo -->
      <a class="navbar-brand d-flex align-items-center" href="/" >
        <img src="/dibujo.svg" alt="Logo EmpresaTeis" class="brand-logo me-2" />
      </a>

      <!-- Botón de hamburguesa en pantallas pequeñas -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Links de navegación -->
      <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
      <ul class="navbar-nav d-flex justify-content-center w-100">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Inicio</router-link>
          </li>
          <li class="nav-item" v-if="isAdmin">
            <router-link class="nav-link" to="/clientes">Clientes</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/noticias">Noticias</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/modelos">Modelos</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/ventas">Ventas</router-link>
          </li>
          <!--          <li class="nav-item">
            <router-link class="nav-link" to="/pedidos">Pedidos</router-link>
          </li>
          -->          
          <!--          <li class="nav-item">
            <router-link class="nav-link" to="/listamodelos">Lista Modelos</router-link>
          </li>  
          -->
        <!--          <li class="nav-item">
            <router-link class="nav-link" to="/taller">Taller</router-link>
          </li>  
          -->
          <li class="nav-item">
            <router-link class="nav-link" to="/contacto">Contacto</router-link>
          </li>
        </ul>
                <!-- Dropdown de acceso/registro -->
        <div class="dropdown ms-auto">
          <span v-if="!isLogueado" class="navbar-text me-2 text-white">{{ userName }}</span>
          <button
            class="btn btn-primary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-person fs-2"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <!-- Mostra “Acceso/Registro” se NON hai usuario logueado -->
            <li v-if="!isLogueado"><router-link class="dropdown-item" to="/login">Acceso</router-link></li>
            <li v-if="!isLogueado"><router-link class="dropdown-item" to="/clientes">Registro</router-link></li>
            <!-- Mostra “Cerrar Sesión” se está logueado -->
            <li v-if="isLogueado">
              <a class="dropdown-item" href="#" @click.prevent="logout">Cerrar Sesión</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>


<script setup>
import { ref, onMounted } from 'vue'

// Estado do login
const isLogueado = ref(false)
const isAdmin = ref(false)
const isUsuario = ref(false)
const userName = ref('')

// Cando o componente se monta, le localStorage (para cando montes a autenticación)
onMounted(() => {
  isLogueado.value = sessionStorage.getItem('isLogueado') === 'true'
  isAdmin.value = sessionStorage.getItem('isAdmin') === 'true'
  isUsuario.value = sessionStorage.getItem('isUsuario') === 'true'
  userName.value = sessionStorage.getItem('userName') || ''
})

// Logout
function logout() {
  // Borra datos de sesión do sessionStorage
  sessionStorage.removeItem('isLogueado')
  sessionStorage.removeItem('userName')
  sessionStorage.removeItem('isAdmin')
  sessionStorage.removeItem('isUsuario')
  sessionStorage.removeItem('token')
  // Actualiza estado
  isLogueado.value = false
  userName.value = ''

  // Redirixe ao inicio recargando a páxina
  window.location.href = '/'
}
</script>

<style>

.navbar-dark .nav-link {
  color: rgba(255,255,255,0.9); /* blanco suave */
}

.navbar-dark .nav-link:hover,
.navbar-dark .nav-link:focus {
  color: #fff; /* blanco intenso al pasar el ratón */
}

.brand-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

</style>
