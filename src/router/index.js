import { createRouter, createWebHistory } from "vue-router";
import GestionClientes from "../components/GestionClientes.vue";
import NotFound from "../components/NotFound.vue";
import PaginaInicio from "../components/PaginaInicio.vue";
import NotiCias from '../components/NotiCias.vue'
import AvisoLegal from "../components/AvisoLegal.vue";
import PoliticaPrivacidad from "../components/PoliticaPrivacidad.vue";
import ModeLos from "../components/ModeLos.vue";
import PediDos from "../components/PediDos.vue";
import ListaModelos from "../components/ListaModelos.vue";
import ConTacto from "../components/ConTacto.vue";
import CitasTaller from "../components/CitasTaller.vue";
import TablaLogin from "../components/TablaLogin.vue";
import VenTas from "../components/VenTas.vue";
import { loginUsuario, esAdmin  } from "../api/authApi";


const routes = [
    {
        path: '/',
        name: 'Inicio',
        component: PaginaInicio
    },
    {
        path: '/clientes',
        name: 'GestionClientes',
        component: GestionClientes,
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
        meta: { requiresAdmin : true }
    },
    {
        path: '/pedidos',
        name: 'PediDos',
        component: PediDos,
    },
    {
        path: '/listamodelos',
        name: 'ListaModelos',
        component: ListaModelos,
    },
    {
        path: '/contacto',
        name: 'ConTacto',
        component: ConTacto,
    },        
    {
        path: '/taller',
        name: 'CitasTaller',
        component: CitasTaller,
        meta: { requiresAdmin: true }

    },
    {
        path: '/login',
        name: 'TablaLogin',
        component: TablaLogin,
    },
    {
        path: '/ventas',
        name: 'VenTas',
        component: VenTas,
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

router.beforeEach(async (to, from, next) => {
    const token = sessionStorage.getItem("token");

    // Si la ruta requiere ser admin
    if (to.meta.requiresAdmin) {

        // Si no hay token → al login
        if (!token) return next({ name: "TablaLogin" });

        // Consultar al backend si es admin
        const admin = await esAdmin();

        if (!admin) {
            return next({ name: "Inicio" }); // acceso denegado
        }
    }

    next();
});


export default router