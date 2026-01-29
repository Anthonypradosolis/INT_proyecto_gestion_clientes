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
import logo from "../../public/dibujo.png"; // Logo de la empresa

const cesta = useCestaStore();
const cartItems = ref([]);
const totalPrice = ref(0);

// Obtener los ítems del carrito desde localStorage (guardados antes del pago)
onMounted(() => {
  // Intentar recuperar los datos de la última compra desde localStorage
  const ultimaCompra = localStorage.getItem("ultimaCompra");

  if (ultimaCompra) {
    const compraData = JSON.parse(ultimaCompra);
    cartItems.value = compraData.items;
    totalPrice.value = compraData.total;

    console.log("✅ Items recuperados de la compra:", cartItems.value);
    console.log("✅ Total de la compra:", totalPrice.value);
  } else if (cesta.items.length > 0) {
    // Fallback: si aún hay items en el store (no se vació)
    cartItems.value = JSON.parse(JSON.stringify(cesta.items));
    totalPrice.value = cesta.totalPrecio;
    console.log("✅ Items obtenidos del store:", cartItems.value);
  } else {
    console.warn("⚠️ No se encontraron datos de compra");
  }

  // Vaciar el carrito ahora que ya tenemos los datos guardados
  cesta.vaciarCesta();
});

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

    // Total de la compra (alineado a la derecha)
    const total = cartItems.value.reduce(
      (acc, item) =>
        acc + (item.precio || item.precio_unitario || 0) * (item.cantidad || 1),
      0,
    );
    const totalText = `Total: ${total.toFixed(2)} €`;

    // Obtener el ancho de la página
    const pageWidth = doc.internal.pageSize.width;

    // Calcular el ancho del texto del total para posicionarlo
    const totalWidth = doc.getTextWidth(totalText);
    const positionX = pageWidth - totalWidth - 14;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(totalText, positionX - 9, doc.lastAutoTable.finalY + 10);

    // Descargar el archivo PDF
    doc.save("factura.pdf");
    console.log("✅ PDF generado correctamente");
  } catch (error) {
    console.error("❌ Error al generar el PDF:", error);
    alert("Error al generar el PDF. Revisa la consola para más detalles.");
  }
};

onBeforeUnmount(() => {
  // El carrito ya se vació en onMounted
  // Solo limpiar localStorage si el usuario sale sin descargar la factura
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
