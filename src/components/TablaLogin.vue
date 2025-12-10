<template>
  <div
    class="d-flex flex-column justify-content-center align-items-center vh-75 mt-5"
  >
    <!-- Título -->
    <div class="text-center mb-4">
      <h5
        class="fw-bold text-uppercase text-primary position-relative d-inline-block"
      >
        <i class="bi bi-people-fill me-2 fs-3"></i>
        <!-- Icono decorativo con tamaño -->
        Iniciar sesión
        <span class="underline-effect"></span>
        <!-- Línea decorativa -->
      </h5>
    </div>

    <!-- Formulario -->
    <div class="border p-4 shadow-sm rounded w-100" style="max-width: 400px">
      <form @submit.prevent="iniciarSesion">
        <!-- Campo DNI -->
        <div class="mb-3">
          <label for="dni" class="form-label fw-bold">DNI:</label>
          <input
            type="text"
            id="dni"
            class="form-control text-center"
            v-model="dni"
          />
        </div>

        <!-- Campo Contraseña -->
        <div class="mb-3">
          <label for="pass" class="form-label fw-bold">Contraseña:</label>
          <input
            type="password"
            id="pass"
            class="form-control"
            v-model="pass"
          />
        </div>

        <!-- Botón de login -->
        <div class="text-center">
          <button type="submit" class="btn btn-primary w-50">
            Iniciar sesión
          </button>
        </div>
      </form>

      <!-- Mensaje de error -->
      <div v-if="errorMessage" class="alert alert-danger mt-3 text-center">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
// DEBE QUEDAR CLARO QUE ESTA É UNHA SIMULACIÓN DE LOGIN PARA FINS DIDÁCTICOS CON JSON-SERVER
// EN NINGÚN CASO DEBE USARSE ESTA IMPLEMENTACIÓN EN PRODUCCIÓN
// PARA UNHA APLICACIÓN REAL, O LOGIN DEBE XESTIONARSE NO LADO DO SERVIDOR CON HTTPS Y JWT SEGURO

import Swal from "sweetalert2";
import { loginUsuario } from "@/api/authApi.js";
import { jwtDecode } from "jwt-decode";

export default {
  name: "TablaLogin",
  data() {
    return {
      dni: "",
      pass: "",
      dniError: "",
      passError: "",
      cargando: false,
    };
  },

  methods: {
    async iniciarSesion() {
      try {

        this.dni = this.dni.trim().toUpperCase();
        this.pass = this.pass.trim();
        if(this.dni === "" || this.pass === "") {
          Swal.fire({
            title: "Campos incompletos",
            text: "Por favor, completa todos los campos.",
            icon: "warning",
            confirmButtonText: "Aceptar",
          });
          return;
        }

        const data = await loginUsuario(this.dni, this.pass);

        // Guardar token y datos del usuario en sessionStorage
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("userName", data.nombre);
        sessionStorage.setItem("isLogueado", "true");

        const decoded = jwtDecode(data.token);

        if (decoded.tipo === "admin") {
          sessionStorage.setItem("isAdmin", "true");
          sessionStorage.setItem("userName", decoded.nombre);
          sessionStorage.setItem("isUser", "false");
        } else {
          sessionStorage.setItem("isAdmin", "false");
          sessionStorage.setItem("userName", decoded.nombre);
          sessionStorage.setItem("isUser", "true");
        }

        if (data.tipo === "admin") {
          sessionStorage.setItem("isAdmin", "true");
          // Asegurar que la bandera de usuario normal queda desactivada
          sessionStorage.setItem("isUsuario", "false");
        } else {
          sessionStorage.setItem("isUsuario", "true");
          // Asegurar que la bandera admin queda desactivada
          sessionStorage.setItem("isAdmin", "false");
        }

        Swal.fire({
          title: "Bienvenido",
          text: `Hola ${data.nombre}`,
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
        // Redirigir a la página de inicio y recargar con $router
        // $router se usa para evitar problemas de historial en SPA
        // window.location.reload() recarga la página para reflejar el estado autenticado
        this.$router
          .push({ name: "Inicio" })
          .then(() => window.location.reload());
      } catch (error) {
        console.error("Error en iniciarSesion:", error);
        Swal.fire({
          title: "Error de autenticación",
          text: "Error usuario o contraseña. Verifica tus credenciales.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    },
    // Función única: capitaliza y asigna en el mismo paso
    capitalizarTexto() {
      this.dni = this.dni.toUpperCase().trim();
    },
  },
};
</script>

<style>
/* Ajustes adicionales si Bootstrap no cubre todo */
.form-label {
  background-color: transparent !important;
  margin-bottom: 0.5rem;
}
</style>
