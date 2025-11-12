import { createRouter, createWebHistory } from "vue-router";
import GestionClientes from "../components/GestionClientes.vue";
import NotFound from "../components/NotFound.vue";
import PaginaInicio from "../components/PaginaInicio.vue";
import NotiCias from '../components/NotiCias.vue'
import AvisoLegal from "../components/AvisoLegal.vue";
import PoliticaPrivacidad from "../components/PoliticaPrivacidad.vue";
import ModeLos from "../components/ModeLos.vue";

const routes = [
    {
        path: '/',
        name: 'Inicio',
        component: PaginaInicio
    },
    {
        path: '/clientes',
        name: 'GestionClientes',
        component: GestionClientes
    },
    {
        path: '/noticias',
        name: 'NotiCias',
        component: NotiCias,
    },
    {
        path: '/avisolegal',
        name: 'AvisoLegal',
        component: AvisoLegal,
    },
    {
        path:'/politicaprivacidad',
        name:'PoliticaPrivacidad',
        component: PoliticaPrivacidad,
    },
    {
        path: '/modelos',
        name: 'ModeLos',
        component: ModeLos,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    },

]
const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router