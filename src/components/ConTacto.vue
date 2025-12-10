<template>
  <div class="container mx-auto mt-3 p-4 border rounded-3 shadow-sm bg-light">
    <h3 class="text-center gestion-header mb-4">
      <i class="bi bi-envelope-paper me-2"></i> Formulario de Contacto
    </h3>

    <!-- Formulario de contacto -->
    <form @submit.prevent="enviarMensaje" class="mb-4">
      <div class="row g-3">
        <div class="col-md-6">
          <label for="nombre" class="form-label">Nombre:</label>
          <input
            type="text"
            id="nombre"
            v-model="form.nombre"
            class="form-control"
            required
          />
        </div>
        <div class="col-md-6">
          <label for="email" class="form-label">Email:</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            class="form-control"
            required
          />
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-md-12">
          <label for="asunto" class="form-label">Asunto:</label>
          <input
            type="text"
            id="asunto"
            v-model="form.asunto"
            class="form-control"
            placeholder="Asunto del mensaje"
          />
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-md-12">
          <label for="mensaje" class="form-label">Mensaje:</label>
          <textarea
            id="mensaje"
            v-model="form.mensaje"
            class="form-control"
            rows="5"
            required
          ></textarea>
        </div>
      </div>

      <div class="text-center mt-4">
        <button type="submit" class="btn btn-primary px-4" :disabled="enviando">
          <span v-if="enviando">
            <i class="bi bi-hourglass-split"></i> Enviando...
          </span>
          <span v-else> <i class="bi bi-send"></i> Enviar Mensaje </span>
        </button>
      </div>
    </form>
  </div>
  <div class="row justify-content-center mt-5">
    <div class="col-12 col-md-6">
      <div class="card shadow-sm border-0">
        <div class="card-header bg-primary text-white text-center py-3">
          <h5 class="mb-0">
            <i class="bi bi-geo-alt-fill me-2"></i>
            Nuestra Ubicación
          </h5>
        </div>
        <div class="card-body p-0">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2950.5865753883815!2d-8.692220923738883!3d42.25138037429632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd2f62e588cfce69%3A0x378485bfa6edd1be!2sAvenida%20de%20Galicia%2C%20101%2C%20Teis%2C%2036216%20Vigo%2C%20Pontevedra!5e0!3m2!1ses!2ses!4v1733847920000!5m2!1ses!2ses"
            width="100%"
            height="400"
            style="border: 0"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Ubicación Avenida de Galicia, 101, Teis"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const form = reactive({
  nombre: "",
  email: "",
  asunto: "",
  mensaje: "",
});

const enviando = ref(false);

async function enviarMensaje() {
  if (enviando.value) return;
  enviando.value = true;
  try {
    const response = await axios.post(
      "http://localhost:5000/api/contacto",
      form
    );

    if (response.data.ok) {
      Swal.fire({
        icon: "success",
        title: "Mensaje enviado correctamente",
        showConfirmButton: false,
        timer: 1500,
      });
      // Limpiar formulario
      form.nombre = "";
      form.email = "";
      form.asunto = "";
      form.mensaje = "";
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al enviar el mensaje",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    Swal.fire({
      icon: "error",
      title: "Error al enviar el mensaje",
      text: "Por favor, inténtalo de nuevo más tarde.",
      showConfirmButton: true,
    });
  } finally {
    enviando.value = false;
  }
}
</script>

<style scoped>
.gestion-header {
  background-color: #0d6efd;
  color: white;
  padding: 0.75rem;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
