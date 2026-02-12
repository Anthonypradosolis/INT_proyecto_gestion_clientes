<template>
  <div class="container mt-5 text-center">
    <div class="success-card p-5">
      <div class="mb-4">
        <i
          class="bi bi-check-circle-fill text-success"
          style="font-size: 5rem"
        ></i>
      </div>
      <h1 class="text-success mb-3">¡Pago Completado! 🎉</h1>
      <p class="lead mb-4">
        Gracias por tu compra. Te hemos enviado un correo con los detalles.
      </p>

      <div class="invoice-container mb-4">
        <button @click="generarFacturaPDF" class="btn btn-primary">
          <i class="bi bi-filetype-pdf"></i> Descargar Factura
        </button>
      </div>

      <router-link to="/ventas" class="back-link">
        <i class="bi bi-arrow-left"></i> Volver a la tienda
      </router-link>
    </div>
  </div>
</template>

<script setup>
import jsPDF from "jspdf";
import "jspdf-autotable";
import { onMounted, onBeforeUnmount, ref } from "vue";
import { useCestaStore } from "@/store/cesta.js";
import { addFactura } from "@/api/facturas.js";
import { updateEstadoArticulo } from "@/api/articulos.js";
import logo from "../../public/dibujo.png"; // Logo de la empresa

const cesta = useCestaStore();
const cartItems = ref([]);
const subtotalPrice = ref(0);
const descuentoAplicado = ref(0);
const cuponAplicado = ref(null);
const totalPrice = ref(0);
const numeroFactura = ref(Math.floor(Math.random() * 1000000));

// Obtener los ítems del carrito desde localStorage (guardados antes del pago)
onMounted(async () => {
  // Intentar recuperar los datos de la última compra desde localStorage
  const ultimaCompra = localStorage.getItem("ultimaCompra");

  if (ultimaCompra) {
    const compraData = JSON.parse(ultimaCompra);
    cartItems.value = compraData.items;
    subtotalPrice.value = compraData.subtotal || compraData.total;
    descuentoAplicado.value = compraData.descuento || 0;
    cuponAplicado.value = compraData.cupon || null;
    totalPrice.value = compraData.total;

    console.log("✅ Items recuperados de la compra:", cartItems.value);
    console.log("✅ Subtotal:", subtotalPrice.value);
    console.log("✅ Descuento aplicado:", descuentoAplicado.value);
    console.log("✅ Total de la compra:", totalPrice.value);

    // Guardar factura en la base de datos
    await guardarFacturaEnBD();
  } else if (cesta.items.length > 0) {
    // Fallback: si aún hay items en el store (no se vació)
    cartItems.value = JSON.parse(JSON.stringify(cesta.items));
    subtotalPrice.value = cesta.totalPrecio;
    totalPrice.value = cesta.totalPrecio;
    console.log("✅ Items obtenidos del store:", cartItems.value);

    // Guardar factura en la base de datos
    await guardarFacturaEnBD();
  } else {
    console.warn("⚠️ No se encontraron datos de compra");
  }

  // Actualizar el estado de los vehículos comprados a "vendido"
  await actualizarEstadoVehiculos();

  // Vaciar el carrito ahora que ya tenemos los datos guardados
  cesta.vaciarCesta();
  
  // Limpiar también ultimaCompra del localStorage
  localStorage.removeItem("ultimaCompra");
});

// Función para actualizar el estado de los vehículos a "vendido"
const actualizarEstadoVehiculos = async () => {
  try {
    // Recorrer todos los items de la compra y actualizar su estado
    const promesas = cartItems.value.map((item) =>
      updateEstadoArticulo(item.id, "vendido")
    );

    await Promise.all(promesas);
    console.log("✅ Estados de vehículos actualizados a 'vendido'");
  } catch (error) {
    console.error("❌ Error al actualizar estados de vehículos:", error);
  }
};

// Función para guardar la factura en la base de datos MongoDB
const guardarFacturaEnBD = async () => {
  try {
    // Obtener información del usuario si está disponible
    const usuario = sessionStorage.getItem("nombre") || "Cliente";

    // Crear el objeto de factura para MongoDB
    const factura = {
      numeroFactura: numeroFactura.value,
      fecha: new Date().toISOString(),
      cliente: usuario,
      items: cartItems.value.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
        total: item.precio * item.cantidad,
      })),
      subtotal: subtotalPrice.value,
      descuento: descuentoAplicado.value,
      cupon: cuponAplicado.value,
      total: totalPrice.value,
      estado: "Completado",
    };

    // Guardar en MongoDB (colección facturas)
    const resultado = await addFactura(factura);
    console.log(
      "✅ Factura guardada en MongoDB (colección facturas):",
      resultado,
    );
  } catch (error) {
    console.error("❌ Error al guardar la factura en MongoDB:", error);
  }
};

const generarFacturaPDF = () => {
  try {
    if (cartItems.value.length === 0) {
      console.error(
        "⚠️ No hay productos en el carrito. No se puede generar la factura.",
      );
      return;
    }

    console.log("Generando PDF con items:", cartItems.value);

    const doc = new jsPDF();
    const cart = cartItems.value;

    // Logo en la parte superior izquierda
    doc.addImage(logo, "PNG", 10, 10, 30, 30);

    // Título de la factura (a la derecha del logo)
    doc.setFontSize(18);
    doc.text("Factura de Compra", 50, 25);
    doc.setFontSize(11);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 50, 34);
    // Usar el número de factura guardado
    doc.text(`Factura Nº: ${numeroFactura.value}`, 50, 40);

    // Información del cliente
    doc.setFontSize(9);
    doc.text("Razón Social: Regalos Teis", 110, 50);
    doc.text("Dirección: Avenida Galicia 101, Vigo - 36216", 110, 55);
    doc.text("Tlfo: 986 666 333 - Email: regalos@example.com", 110, 60);

    // Crear la tabla con los productos del carrito
    const headers = [
      ["ID", "Producto", "Cantidad", "Precio Unitario", "Total"],
    ];
    const data = cart.map((item) => [
      item.id || "N/A",
      item.nombre || item.name || "Producto",
      item.cantidad || 1,
      `${(item.precio || item.precio_unitario || 0).toFixed(2)} €`,
      `${((item.cantidad || 1) * (item.precio || item.precio_unitario || 0)).toFixed(2)} €`,
    ]);

    // Generar la tabla en el PDF
    doc.autoTable({
      startY: 80,
      head: headers,
      body: data,
      theme: "striped",
      columnStyles: {
        0: { halign: "center" },
        2: { halign: "center" },
        3: { halign: "right" },
        4: { halign: "right" },
      },
      styles: { fontSize: 10 },
    });

    // Total de la compra con descuento (alineado a la derecha)
    const subtotal = subtotalPrice.value;
    const descuento = descuentoAplicado.value;
    const total = totalPrice.value;

    // Obtener el ancho de la página
    const pageWidth = doc.internal.pageSize.width;
    let currentY = doc.lastAutoTable.finalY + 10;

    // Subtotal
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const subtotalText = `Subtotal: ${subtotal.toFixed(2)} €`;
    const subtotalWidth = doc.getTextWidth(subtotalText);
    const subtotalX = pageWidth - subtotalWidth - 14;
    doc.text(subtotalText, subtotalX - 9, currentY);
    currentY += 7;

    // Descuento (si aplica)
    if (descuento > 0) {
      doc.setTextColor(0, 128, 0); // Verde
      const descuentoText = `Descuento (${cuponAplicado.value}): -${descuento.toFixed(2)} €`;
      const descuentoWidth = doc.getTextWidth(descuentoText);
      const descuentoX = pageWidth - descuentoWidth - 14;
      doc.text(descuentoText, descuentoX - 9, currentY);
      currentY += 7;
      doc.setTextColor(0, 0, 0); // Volver a negro
    }

    // Total
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const totalText = `Total: ${total.toFixed(2)} €`;
    const totalWidth = doc.getTextWidth(totalText);
    const positionX = pageWidth - totalWidth - 14;
    doc.text(totalText, positionX - 9, currentY);

    // Descargar el archivo PDF
    doc.save("factura.pdf");
    console.log("✅ PDF generado correctamente");
  } catch (error) {
    console.error("❌ Error al generar el PDF:", error);
    alert("Error al generar el PDF. Revisa la consola para más detalles.");
  }
};

onBeforeUnmount(() => {
  // Limpiar localStorage por si acaso
  if (localStorage.getItem("ultimaCompra")) {
    localStorage.removeItem("ultimaCompra");
  }
});
</script>

<style scoped>
.success-card {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #f8f9fa;
}

.bi-check-circle-fill {
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
</style>
