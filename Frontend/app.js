const API_URL = "https://proyecto-bd-iola.onrender.com";

// Elementos del DOM (Productos)
const listaProductos = document.getElementById("listaProductos");
const formulario = document.getElementById("formularioProducto");
const productoId = document.getElementById("productoId");
const nombreInput = document.getElementById("nombre");
const precioInput = document.getElementById("precio");
const stockInput = document.getElementById("stock");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const tituloFormulario = document.getElementById("tituloFormulario");

// Elementos del DOM (Contactos)
const formContacto = document.getElementById("formularioContacto");
const listaMensajes = document.getElementById("listaMensajes");
const nombreContacto = document.getElementById("nombreContacto");
const asuntoContacto = document.getElementById("asuntoContacto");
const mensajeContacto = document.getElementById("mensajeContacto");
const emailContacto = document.getElementById("emailContacto");

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

// 2. Cargar datos del producto en el formulario para editar (UPDATE)
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

// 3. Guardar o Actualizar producto (CREATE / UPDATE)
if (formulario) {
  formulario.addEventListener("submit", async (event) => {
    event.preventDefault();

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
        await fetch(`${API_URL}/productos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, precio, stock }),
        });
      }

      cancelarEdicion();
      cargarProductos();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  });
}

// 4. Eliminar producto (DELETE)
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

// 5. Enviar mensaje de contacto (POST)
if (formContacto) {
  formContacto.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nombre = nombreContacto.value.trim();
    const asunto = asuntoContacto.value.trim();
    const mensaje = mensajeContacto.value.trim();
    const email = emailContacto.value.trim();

    try {
      const respuesta = await fetch(`${API_URL}/contactos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre,
          email,
          asunto,
          mensaje
        })
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo guardar el mensaje");
      }

      alert("¡Mensaje guardado correctamente!");
      formContacto.reset();
      cargarMensajes();

    } catch (error) {
      console.error("Error al guardar el mensaje:", error);
      alert("Error al guardar el mensaje en la base de datos.");
    }
  });
}

// 6. Consultar los mensajes (READ)
async function cargarMensajes() {
  if (!listaMensajes) return;

  try {
    const respuesta = await fetch(`${API_URL}/contactos`);

    if (!respuesta.ok) {
      throw new Error("Error al consultar los mensajes");
    }

    const mensajes = await respuesta.json();

    listaMensajes.innerHTML = "";

    if (mensajes.length === 0) {
      listaMensajes.textContent = "No hay mensajes registrados.";
      return;
    }

    mensajes.forEach((msg) => {
      const elemento = document.createElement("div");
      elemento.classList.add("producto");
      elemento.style.position = "relative";

      const nombre = document.createElement("h3");
      nombre.textContent = msg.nombre;

      const correo = document.createElement("p");
      correo.textContent = `Correo: ${msg.email}`;

      const asunto = document.createElement("p");
      asunto.textContent = `Asunto: ${msg.asunto}`;

      const contenido = document.createElement("p");
      contenido.textContent = `Mensaje: ${msg.mensaje}`;

      const fecha = document.createElement("p");
      fecha.textContent = `Fecha: ${new Date(msg.fecha_registro).toLocaleString()}`;

      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "Eliminar";
      btnEliminar.classList.add("btn-eliminar");
      btnEliminar.style.position = "absolute";
      btnEliminar.style.top = "10px";
      btnEliminar.style.right = "10px";

      btnEliminar.addEventListener("click", () => {
        eliminarMensaje(msg.id);
      });

      elemento.appendChild(nombre);
      elemento.appendChild(correo);
      elemento.appendChild(asunto);
      elemento.appendChild(contenido);
      elemento.appendChild(fecha);
      elemento.appendChild(btnEliminar);

      listaMensajes.appendChild(elemento);
    });

  } catch (error) {
    console.error("Error al cargar los mensajes:", error);
    listaMensajes.textContent = "No se pudieron cargar los mensajes.";
  }
}

// 7. Eliminar un mensaje (DELETE)
async function eliminarMensaje(id) {
  const confirmar = confirm("¿Deseas eliminar este mensaje de la base de datos?");

  if (!confirmar) return;

  try {
    const respuesta = await fetch(`${API_URL}/contactos/${id}`, {
      method: "DELETE"
    });

    if (!respuesta.ok) {
      throw new Error("No se pudo eliminar el mensaje");
    }

    alert("Mensaje eliminado correctamente");
    await cargarMensajes();

  } catch (error) {
    console.error("Error al eliminar el mensaje:", error);
    alert("Error al eliminar el mensaje.");
  }
}

// Inicialización
cargarProductos();
cargarMensajes();