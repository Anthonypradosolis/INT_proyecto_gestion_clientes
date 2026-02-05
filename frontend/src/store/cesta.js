// Importamos la función defineStore de Pinia
// lo que nos permite crear un store que puede ser usado en cualquier componente
import { defineStore } from 'pinia'

// Función auxiliar para cargar la cesta desde localStorage
const cargarCestaDesdeLocalStorage = () => {
    try {
        const cestaGuardada = localStorage.getItem('cesta')
        return cestaGuardada ? JSON.parse(cestaGuardada) : []
    } catch (error) {
        console.error('Error al cargar la cesta desde localStorage:', error)
        return []
    }
}

// Función auxiliar para guardar la cesta en localStorage
const guardarCestaEnLocalStorage = (items) => {
    try {
        localStorage.setItem('cesta', JSON.stringify(items))
    } catch (error) {
        console.error('Error al guardar la cesta en localStorage:', error)
    }
}

// Creamos el store de la cesta
// 'cesta' es el id del store, usado internamente por Pinia
export const useCestaStore = defineStore('cesta', {

    // -------------------
    // STATE IMPORTANTE
    // -------------------
    state: () => ({
        // Array que contendrá los productos que el usuario añada a la cesta
        // Se carga desde localStorage si existe
        items: cargarCestaDesdeLocalStorage()
    }),

    //
    // GETTERS
    // -------------------
    getters: {
        // Calcula el total de productos en la cesta
        // Reduce va sumando la 'cantidad' de cada producto
        totalItems(state) {
            return state.items.reduce((total, item) => total + item.cantidad, 0)
        },

        // Calcula el precio total de la cesta
        // Suma el precio de cada producto multiplicado por su cantidad
        // AQUÍ SE PODRÍA AÑADIR LÓGICA DE DESCUENTOS, IMPUDIR Etc.
        totalPrecio(state) {
            return state.items.reduce(
                (total, item) => total + item.precio * item.cantidad,
                0
            )
        }
    },

// -------------------
// ACTIONS 2ª imagen
// -------------------
    actions: {
        // Añade un producto a la cesta
        addProducto(producto) {
            // Buscamos si el producto ya está en la cesta
            const existente = this.items.find(item => item.id === producto.id)

            if (existente) {
                // Si ya existe, incrementamos la cantidad del mismo producto
                existente.cantidad++
            } else {
                // Si no existe, lo añadimos con cantidad inicial 1
                this.items.push({
                    ...producto, // copiamos todas las propiedades del producto
                    cantidad: 1
                })
            }
            
            // Guardamos en localStorage después de cada cambio
            guardarCestaEnLocalStorage(this.items)
        },

        // Elimina un producto de la cesta por su id
        removeProducto(id) {
            this.items = this.items.filter(item => item.id !== id)
            // Guardamos en localStorage después de cada cambio
            guardarCestaEnLocalStorage(this.items)
        },

        // Incrementa la cantidad de un producto
        incrementar(id) {
            const item = this.items.find(item => item.id === id)
            if (item) {
                item.cantidad++
                // Guardamos en localStorage después de cada cambio
                guardarCestaEnLocalStorage(this.items)
            }
        },

        // Decrementa la cantidad de un producto, sin permitir que sea menor que 1
        decrementar(id) {
            const item = this.items.find(item => item.id === id && item.cantidad > 1)
            if (item) {
                item.cantidad--
                // Guardamos en localStorage después de cada cambio
                guardarCestaEnLocalStorage(this.items)
            }
        },

        // Vacía toda la cesta
        clearCesta() {
            this.items = []
            // Guardamos en localStorage después de cada cambio
            guardarCestaEnLocalStorage(this.items)
        },

        // Alias para vaciar la cesta
        vaciarCesta() {
            this.clearCesta()
        }
    }
})
