const API_URL = "https://proyecto-bd-4e6q.onrender.com";
// Elementos del DOM
const listaProductos = document.getElementById("listaProductos");
const formulario = document.getElementById("formularioProducto");
const productoId = document.getElementById("productoId");
const nombreInput = document.getElementById("nombre");
const precioInput = document.getElementById("precio");
const stockInput = document.getElementById("stock");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const tituloFormulario = document.getElementById("tituloFormulario");
const formContacto = document.getElementById("formularioContacto");

// 1. Función para consultar los productos y mostrarlos en el DOM (READ)
async function cargarProductos() {
  if (!listaProductos) return;

  try {
    const respuesta = await fetch(`${API_URL}/productos`);
    const productos = await respuesta.json();

    listaProductos.innerHTML = "";

    if (productos.length === 0) {
      listaProductos.innerHTML = "<p style='color: #64748b;'>No hay productos registrados.</p>";
      return;
    }

    productos.forEach((producto) => {
      const elemento = document.createElement("div");
      elemento.classList.add("producto");

      elemento.innerHTML = `
        <div>
          <h3>${producto.nombre}</h3>
          <p class="producto-precio">Precio: $${producto.precio}</p>
          <p>Stock: ${producto.stock} unidades</p>
        </div>
        <div class="acciones">
          <button class="btn-editar" onclick="cargarEnFormulario(${producto.id}, '${producto.nombre}', ${producto.precio}, ${producto.stock})">Editar</button>
          <button class="btn-eliminar" onclick="eliminarProducto(${producto.id})">Eliminar</button>
        </div>
      `;

      listaProductos.appendChild(elemento);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

// 2. Cargar datos del producto en el formulario para editar (UPDATE - Paso 1)
function cargarEnFormulario(id, nombre, precio, stock) {
  productoId.value = id;
  nombreInput.value = nombre;
  precioInput.value = precio;
  stockInput.value = stock;

  tituloFormulario.textContent = "Editar Producto";
  btnGuardar.textContent = "Actualizar Producto";
  btnCancelar.style.display = "block";
  nombreInput.focus();
}

// Cancelar edición y restaurar formulario
function cancelarEdicion() {
  formulario.reset();
  productoId.value = "";
  tituloFormulario.textContent = "Registrar Producto";
  btnGuardar.textContent = "Guardar Producto";
  btnCancelar.style.display = "none";
}

if (btnCancelar) {
  btnCancelar.addEventListener("click", cancelarEdicion);
}

// 3. Guardar o Actualizar según si hay un ID seleccionado (CREATE o UPDATE)
if (formulario) {
  formulario.addEventListener("submit", async (event) => {
    event.preventDefault(); // Evitar que la página se recargue

    const id = productoId.value;
    const nombre = nombreInput.value;
    const precio = precioInput.value;
    const stock = stockInput.value;

    try {
      if (id) {
        
        await fetch(`${API_URL}/productos/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, precio, stock }),
        });
      } else {
        // MODO CREAR (POST)
        await fetch(`${API_URL}/productos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, precio, stock }),
        });
      }

      cancelarEdicion(); // Limpiar formulario y restaurar botones
      cargarProductos(); // Refrescar la lista en pantalla
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  });
}

async function eliminarProducto(id) {
  const confirmar = confirm("¿Deseas eliminar este producto de la base de datos?");
  if (!confirmar) return;

  try {
    await fetch(`${API_URL}/productos/${id}`, {
      method: "DELETE",
    });

    if (productoId.value == id) {
      cancelarEdicion();
    }

    cargarProductos(); 
  } catch (error) {
    console.error("Error al eliminar producto:", error);
  }
}

if (formContacto) {
  formContacto.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombreContacto").value;
    const asunto = document.getElementById("asuntoContacto").value;
    const correo = document.getElementById("correoContacto").value;
    const mensaje = document.getElementById("mensajeContacto").value;

    try {
      await fetch(`${API_URL}/contactos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, asunto, correo, mensaje }),
      });

      formContacto.reset();
      cargarMensajes(); 
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  });
}

async function cargarMensajes() {
  const listaMensajes = document.getElementById("listaMensajes");
  if (!listaMensajes) return; 

  try {
    const respuesta = await fetch(`${API_URL}/contactos`);
    const mensajes = await respuesta.json();

    listaMensajes.innerHTML = "";

    if (mensajes.length === 0) {
      listaMensajes.innerHTML = "<p style='color: #64748b;'>No hay mensajes recibidos.</p>";
      return;
    }

    mensajes.forEach((msg) => {
      const elemento = document.createElement("div");
      elemento.classList.add("producto");

      const fechaObj = new Date(msg.fecha);
      const fechaFormateada = fechaObj.toLocaleString();

      elemento.innerHTML = `
        <div>
          <h3>${msg.asunto}</h3>
          <p><strong>De:</strong> ${msg.nombre} (${msg.correo})</p>
          <p>${msg.mensaje}</p>
          <p style="font-size: 0.8rem; color: #94a3b8;">Recibido: ${fechaFormateada}</p>
        </div>
        <div class="acciones">
          <button class="btn-eliminar" onclick="eliminarMensaje(${msg.id})">Eliminar</button>
        </div>
      `;

      listaMensajes.appendChild(elemento);
    });
  } catch (error) {
    console.error("Error al cargar mensajes:", error);
  }
}

async function eliminarMensaje(id) {
  const confirmar = confirm("¿Deseas eliminar este mensaje?");
  if (!confirmar) return;

  try {
    await fetch(`${API_URL}/contactos/${id}`, {
      method: "DELETE",
    });
    cargarMensajes(); 
  } catch (error) {
    console.error("Error al eliminar mensaje:", error);
  }
}
cargarProductos();
cargarMensajes();