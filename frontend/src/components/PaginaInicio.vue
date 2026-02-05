<template>
    <div class="video-bg">
        <video autoplay muted loop playsinline class="bg-video">
            <source src="@/assets/views/coche.mp4" type="video/mp4" />
            Tu navegador no soporta el video.
        </video>
        <div class="content">
            <transition name="fade">
                <h1 v-if="showHeader" class="bienvenida-titulo">Bienvenido a CarTeis</h1>
            </transition>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";

// Controla la visibilidad del título de bienvenida
const showHeader = ref(true);
// Tiempo en ms antes de ocultar el h1 (ajústalo si quieres)
const HIDE_DELAY = 3000;

onMounted(() => {
    setTimeout(() => {
        showHeader.value = false;
    }, HIDE_DELAY);
});

</script>
<style scoped>
.video-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: 0;
}
.bg-video {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 100vw;
    min-height: 100vh;
    width: auto;
    height: auto;
    transform: translate(-50%, -50%);
    object-fit: contain;
    z-index: 1;
    background: #000;
}
.content {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    text-align: center;
}
body, html {
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
}

.bienvenida-titulo {
    color: #fff;
    font-size: 3.5rem;
    font-weight: bold;
    text-shadow: 0 4px 24px #000, 0 1px 0 #444;
    letter-spacing: 2px;
    background: rgba(0,0,0,0.35);
    border-radius: 20px;
    padding: 1.2rem 2.5rem;
    box-shadow: 0 8px 32px 0 rgba(0,0,0,0.37);
    border: 2px solid #fff3;
    margin-bottom: 0;
    text-align: center;
    transition: transform 0.2s;
}
.bienvenida-titulo:hover {
    transform: scale(1.04) rotate(-1deg);
    box-shadow: 0 12px 40px 0 rgba(0,0,0,0.45);
    background: rgba(0,0,0,0.5);
}
body, html {
    overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.6s ease, transform 0.6s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
}
.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}

</style>

<!-- Apuntes de noticias.json
    id => json lo añade
    titulo => 128 caracteres
    contenido => 256 caracteres
    fecha => formato fecha, la toma del sistema
    bonus => muestra solo 1 noticia en la pagina al hacer click sobre ello
-->
