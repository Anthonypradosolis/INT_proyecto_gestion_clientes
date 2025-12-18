  <template>
  <div
    class="container mx-auto mt-2 p-3 my-1 border rounded-0 shadow-sm bg-light"
  >
    <h3 class="text-center my-2">
      <i class="bi bi-newspaper"> </i> Gestión de Noticias
    </h3>

    <form v-if="isAdmin" @submit.prevent="agregarNoticia" class="mb-4">
      <div class="mb-3 row align-items-center">
        <div class="col-md-4 d-flex align-items-center">
          <label for="titulo" class="form-label ms-3 mb-0 w-25">Título:</label>
          <input
            id="titulo"
            v-model="nuevo.titulo"
            type="text"
            maxlength="128"
            placeholder="Máximo 128 caracteres"
            class="form-control flex-grow-1"
          />
        </div>
        <div
          class="col-md-4 ms-auto d-flex align-items-center justify-content-end"
        >
          <small class="text-muted"
            >Noticias guardadas: {{ noticias.length }}</small
          >
        </div>
      </div>

      <div class="mb-3 row">
        <div class="d-flex align-items-start">
          <label
            for="contenido"
            class="form-label mb-0 me-3"
            style="width: 80px"
            >Contenido:</label
          >
          <textarea
            id="contenido"
            v-model="nuevo.contenido"
            maxlength="1024"
            rows="4"
            class="form-control flex-grow-1"
            placeholder="Máximo 1024 caracteres"
          ></textarea>
        </div>
      </div>

      <div class="mb-3 d-flex justify-content-center">
        <button type="submit" class="btn btn-outline-primary me-2">
          <i class="bi bi-plus-lg"></i> Publicar
        </button>
      </div>
    </form>

    <!-- Lista de noticias en tabla (Bootstrap) -->
    <div class="table-responsive">
      <table class="table noticias-table mt-3">
        <thead class="table-primary">
          <tr>
            <th>Título</th>
            <th>Contenido</th>
            <th style="width: 160px">Fecha</th>
            <th v-if="isAdmin" style="width: 140px">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="noticia in noticias" :key="noticia.id">
            <td class="align-middle">
              <strong class="text-primary">{{ noticia.titulo }}</strong>
            </td>
            <td class="align-middle">
              <div class="contenido">
                <span v-if="isExpanded[noticia.id]">{{
                  noticia.contenido
                }}</span>
                <span v-else>{{
                  noticia.contenido.length > 200
                    ? noticia.contenido.slice(0, 200) + "..."
                    : noticia.contenido
                }}</span>
                <a
                  href="#"
                  @click.prevent="toggleExpand(noticia.id)"
                  class="ms-2 text-decoration-none small"
                >
                  {{
                    isExpanded[noticia.id] ? "Mostrar menos" : "Seguir leyendo"
                  }}
                </a>
              </div>
            </td>
            <td class="align-middle">
              <small class="text-muted">{{ noticia.fecha }}</small>
            </td>
            <td v-if="isAdmin" class="align-middle text-center">
              <button
                @click="eliminarNoticia(noticia.id)"
                class="btn btn-danger btn-sm me-2"
                title="Eliminar Noticia"
              >
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="noticias.length === 0">
            <td :colspan="isAdmin ? 4 : 3" class="text-center text-muted">
              No hay noticias aún.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import {
  getNoticias,
  addNoticia,
  updateNoticia,
  deleteNoticia,
} from "@/api/noticias.js";
import { esAdmin } from "@/api/authApi.js";

// datos cargados desde /api/noticias (server local)
const noticias = ref([]);
const isAdmin = ref(false);

// Formulario
const nuevo = reactive({ titulo: "", contenido: "" });
const editingId = ref(null);

// Control de expansión por id
const isExpanded = reactive({});

const loadNoticias = async () => {
  try {
    noticias.value = await getNoticias();
  } catch (e) {
    console.error("error al cargar noticias", e);
    noticias.value = [];
  }
};

const checkAdmin = async () => {
  try {
    const result = await esAdmin();
    isAdmin.value = result.isAdmin;
  } catch (e) {
    console.error("error verificando admin", e);
    isAdmin.value = false;
  }
};

onMounted(async () => {
  await checkAdmin();
  await loadNoticias();
});

const toggleExpand = (id) => {
  isExpanded[id] = !isExpanded[id];
};

const agregarNoticia = async () => {
  if (!nuevo.titulo.trim() || !nuevo.contenido.trim()) return;

  const payload = {
    titulo: nuevo.titulo.trim(),
    contenido: nuevo.contenido.trim(),
    fecha: new Date().toLocaleDateString(),
  };

  try {
    let res, json;
    if (editingId.value) {
      await updateNoticia(editingId.value, payload);
      await loadNoticias();
      editingId.value = null;
    } else {
      const created = await addNoticia(payload);
      noticias.value.unshift(created);
    }

    // reset
    nuevo.titulo = "";
    nuevo.contenido = "";
  } catch (e) {
    console.error("error guardando noticia", e);
  }
};

const limpiarFormulario = () => {
  nuevo.titulo = "";
  nuevo.contenido = "";
  editingId.value = null;
};

const eliminarNoticia = async (id) => {
  try {
    await deleteNoticia(id);
    const idx = noticias.value.findIndex((n) => n.id === id);
    if (idx !== -1) noticias.value.splice(idx, 1);
  } catch (e) {
    console.error("error eliminando noticia", e);
  }
};

const editarNoticia = (id) => {
  const n = noticias.value.find((n) => n.id === id);
  if (!n) return;
  nuevo.titulo = n.titulo;
  nuevo.contenido = n.contenido;
  editingId.value = n.id;
};
</script>

<style scoped>
.form-table th {
  vertical-align: middle;
  width: 160px;
  color: #2c3e50;
}
.noticias-table tbody tr td {
  vertical-align: middle;
}
.noticias-table .contenido {
  max-width: 60ch;
  word-wrap: break-word;
}
.noticias-table thead th {
  font-weight: 700;
}
.noticias-table tbody tr:hover {
  background: rgba(0, 0, 0, 0.03);
}
.btn i.bi {
  vertical-align: -0.125em;
}
.table .text-primary {
  color: #0d6efd !important;
}
</style>
