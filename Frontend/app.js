const API_URL = "https://proyectobd-3sys.onrender.com";

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
const listaMensajes = document.getElementById("listaMensajes");
const nombreContacto = document.getElementById("nombre");
const correoContacto = document.getElementById("correo");
const mensajeContacto = document.getElementById("mensaje");
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
        // MODO ACTUALIZAR (PUT)
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

// 4. Eliminar un producto (DELETE)
async function eliminarProducto(id) {
  const confirmar = confirm("¿Deseas eliminar este producto de la base de datos?");
  if (!confirmar) return;

  try {
    await fetch(`${API_URL}/productos/${id}`, {
      method: "DELETE",
    });

    // Si estábamos editando ese mismo producto, cancelamos la edición
    if (productoId.value == id) {
      cancelarEdicion();
    }

    cargarProductos(); // Refrescar la lista en pantalla
  } catch (error) {
    console.error("Error al eliminar producto:", error);
  }
}

// 5. Formulario de contacto (demostrativo en contacto.html)
if (formContacto) {
    formContacto.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nombre = nombreContacto.value.trim();
        const correo = correoContacto.value.trim();
        const mensaje = mensajeContacto.value.trim();

        try {
            const respuesta = await fetch(`${API_URL}/mensajes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre,
                    correo,
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
        const respuesta = await fetch(`${API_URL}/mensajes`);

        if (!respuesta.ok) {
            throw new Error("Error al consultar los mensajes");
        }

        const mensajes = await respuesta.json();

        listaMensajes.innerHTML = "";

        if (mensajes.length === 0) {
            listaMensajes.textContent = "No hay mensajes registrados.";
            return;
        }

        mensajes.forEach((mensaje) => {
            const elemento = document.createElement("div");
            elemento.classList.add("producto");
            elemento.style.position = "relative";

            const nombre = document.createElement("h3");
            nombre.textContent = mensaje.nombre_completo;

            const correo = document.createElement("p");
            correo.textContent = `Correo: ${mensaje.correo}`;

            const contenido = document.createElement("p");
            contenido.textContent = `Mensaje: ${mensaje.asunto}`;

            const fecha = document.createElement("p");
            fecha.textContent = `Fecha: ${new Date(mensaje.fecha_mensaje).toLocaleString()}`;

            const btnEliminar = document.createElement("button");
            btnEliminar.textContent = "Eliminar";
            btnEliminar.classList.add("btn-eliminar");
            btnEliminar.style.position = "absolute";
            btnEliminar.style.top = "10px";
            btnEliminar.style.right = "10px";

            btnEliminar.addEventListener("click", () => {
                eliminarMensaje(mensaje.id);
            });

            elemento.appendChild(nombre);
            elemento.appendChild(correo);
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
        const respuesta = await fetch(`${API_URL}/mensajes/${id}`, {
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

// Llamado inicial al cargar la página
cargarProductos();
cargarMensajes();