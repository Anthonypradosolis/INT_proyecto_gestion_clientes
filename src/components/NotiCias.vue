<template>
  <div>
    <h1>Titulo:</h1>
    <input type="text" id="titulo" maxlength="128" placeholder="Máximo 128 caracteres" class="form-control flex-grow-1" required />
  </div>
  <div>
    <h2>Contenido:</h2>
    <!-- Cuando veamos autentificacion esta parte solo sera visible para el administracion -->
    <input type="text" id="titulo" maxlength="256" placeholder="Máximo 256 caracteres" class="form-control flex-grow-1" required />
  </div>
  <div>
    <br />
      <div>
        <h3>Noticia 1</h3>
        <input type="text" id="noticia" class="form-control flex-grow-1" required />
        <button @click="eliminarNoticia(noticia.id)" class="btn btn-danger btn-sm border-0 shadow-none rounded-0" title="Eliminar Noticia"> <i class="bi bi-trash"></i> </button>
        <button @click="editarNoticia(noticia.id)" class="btn btn-secondary btn-sm ms-2 border-0 shadow-none rounded-0" title="Editar Noticia"> <i class="bi bi-pencil"></i> </button>
        
      </div>
      <div>
        <h3>Noticia 2</h3>
        <input type="text" id="noticia" class="form-control flex-grow-1" required />
      </div>
      <div>
        <h3>Noticia 3</h3>
        <input type="text" id="noticia" class="form-control flex-grow-1" required />
      </div>
  </div>
</template>

<script setup></script>

<style></style>
