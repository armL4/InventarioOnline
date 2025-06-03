import { readFile, writeFile } from "fs/promises";
const productosJSON = "./backend/data/productos.json";

// Obtener todos los productos
export async function obtenerProductos(req, res) {
  try {
    const datos = await readFile(productosJSON, "utf-8");
    res.end(datos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener productos--asdas" });
  }
}

// Obtener un producto por ID
export async function obtenerProductoPorId(req, res) {
  try {
    const datos = await readFile(productosJSON, "utf-8");
    const data = JSON.parse(datos);
    const id = parseInt(req.params.id);
    const producto = data.productos.find(p => p.id === id);

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener producto" });
  }
}

// Crear un nuevo producto
export async function crearProducto(req, res) {
  try {
    const datos = await readFile(productosJSON, "utf-8");
    const data = JSON.parse(datos);
    const ultimoID = data.ultimo_id;
    const nuevoID = ultimoID + 1;

    const nuevoProducto = req.body;
    const nuevoProductoEstructurado = {
      id: nuevoID,
      nombre: nuevoProducto.nombre,
      marca: nuevoProducto.marca,
      precio: nuevoProducto.precio,
      stock: nuevoProducto.stock
    };

    data.productos.push(nuevoProductoEstructurado);
    data.ultimo_id = nuevoID;

    await writeFile(productosJSON, JSON.stringify(data, null, 2), "utf-8");
    res.json(nuevoProductoEstructurado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear producto" });
  }
}

// Actualizar un producto existente
export async function actualizarProducto(req, res) {
  try {
    const datos = await readFile(productosJSON, "utf-8");
    const data = JSON.parse(datos);
    const id = parseInt(req.params.id);
    const productoModificado = req.body;

    const index = data.productos.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    const productoActual = data.productos[index];

    // Usamos funciones para comprobar que los valores enviados sean válidos
    const productoActualizado = {
      id: id,
      nombre: valorTextoValido(productoModificado.nombre) ? productoModificado.nombre : productoActual.nombre,
      marca: valorTextoValido(productoModificado.marca) ? productoModificado.marca : productoActual.marca,
      precio: valorNumeroValido(productoModificado.precio) ? productoModificado.precio : productoActual.precio,
      stock: valorNumeroValido(productoModificado.stock) ? productoModificado.stock : productoActual.stock
    };

    data.productos[index] = productoActualizado;

    await writeFile(productosJSON, JSON.stringify(data, null, 2), "utf-8");
    res.json(productoActualizado);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ mensaje: "Error al actualizar producto" });
  }
}

// Funciones auxiliares
function valorTextoValido(valor) {
  return typeof valor === "string" && valor.trim() !== "";
}

function valorNumeroValido(valor) {
  return typeof valor === "number" && !isNaN(valor);
}



// Eliminar un producto por ID
export async function eliminarProducto(req, res) {
  try {
    const datos = await readFile(productosJSON, "utf-8");
    const data = JSON.parse(datos);
    const id = parseInt(req.params.id);

    const existe = data.productos.some(p => p.id === id);
    if (!existe) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    data.productos = data.productos.filter(p => p.id !== id);

    // Reasignar IDs secuencialmente (opcional)
    data.productos.forEach((producto, index) => {
      producto.id = index + 1;
    });
    data.ultimo_id = data.productos.length;

    await writeFile(productosJSON, JSON.stringify(data, null, 2), "utf-8");
    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar producto" });
  }
}
