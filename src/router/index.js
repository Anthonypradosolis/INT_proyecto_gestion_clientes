import { createRouter, createWebHistory } from "vue-router";
import GestionClientes from "../components/GestionClientes.vue";
import NotFound from "../components/NotFound.vue";
import PaginaInicio from "../components/PaginaInicio.vue";
import NotiCias from '../components/NotiCias.vue'

const routes = [
    {
    path: '/' ,
    name: 'Inicio',
    component: PaginaInicio
},
{
    path: '/clientes',
    name: 'GestionClientes',
    component: GestionClientes
},
{
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
},
{
    path: '/noticas',
    name: 'NotiCias',
    compoment: NotiCias,
},
]
const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router