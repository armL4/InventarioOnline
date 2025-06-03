import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import productosRouter from "./routes/productos.routes.mjs";

// Configurar ruta absoluta (requerido al usar ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear instancia de la app
const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (HTML, CSS, JS) desde /frontend/public
app.use(express.static(path.join(__dirname, "../frontend/public")));

// Rutas de la API
app.use("/api/v1/productos", productosRouter);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en: http://localhost:${PORT}`);
});
 