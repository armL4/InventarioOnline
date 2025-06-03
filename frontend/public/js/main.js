const API = 'http://localhost:3000/api/v1/productos';

async function cargarProductos() {
  const res = await fetch(API);
  const data = await res.json();
  const container = document.getElementById("resultado");
  container.innerHTML = "";

  data.productos.forEach(producto => {
    container.innerHTML += crearTarjeta(producto);
  });
}


async function buscarProducto() {
  const id = document.getElementById("buscarId").value;
  const res = await fetch(`${API}/${id}`);
  const producto = await res.json();
  const container = document.getElementById("resultado");
  container.innerHTML = crearTarjeta(producto);
  limpiarTodosLosInputs();
}


async function agregarProducto() {
  const nombre = document.getElementById("nombre").value;
  const marca = document.getElementById("marca").value;
  const precio = parseFloat(document.getElementById("precio").value);
  const stock = parseInt(document.getElementById("stock").value);
  const nuevoProducto = { nombre, marca, precio, stock };

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevoProducto)
  });
  limpiarTodosLosInputs();
  cargarProductos();
}

async function modificarProducto() {
  const id = document.getElementById("mod-id").value;
  const data = {
    id: parseInt(id),
    nombre: document.getElementById("mod-nombre").value,
    marca: document.getElementById("mod-marca").value,
    precio: parseFloat(document.getElementById("mod-precio").value),
    stock: parseInt(document.getElementById("mod-stock").value)
  };
  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  limpiarTodosLosInputs();
  cargarProductos();
}

async function eliminarProducto() {
  const id = document.getElementById("del-id").value;
  await fetch(`${API}/${id}`, {
    method: "DELETE"
  });
  limpiarTodosLosInputs();
  cargarProductos();
}

function limpiarTodosLosInputs() {
  document.querySelectorAll("input").forEach(input => {
    input.value = "";
  });
}
function crearTarjeta(producto) {
  return `
    <div class="tarjeta">
      <h3>${producto.nombre}</h3>
      <p><strong>Marca:</strong> ${producto.marca}</p>
      <p><strong>Precio:</strong> $${producto.precio}</p>
      <p><strong>Stock:</strong> ${producto.stock}</p>
      <p><strong>ID:</strong> ${producto.id}</p>
    </div>
  `;
}


