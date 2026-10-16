require("dotenv").config();
const express = require("express");
const cors = require("cors");
const conexion = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

app.get("/productos", (req, res) => {
  const sql = "SELECT * FROM productos";

  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.error("Error al consultar:", error);
      return res.status(500).json({ mensaje: "Error al consultar los productos" });
    }
    res.json(resultados);
  });
});

app.post("/productos", (req, res) => {
  const { nombre, precio, stock } = req.body;

  const sql = "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)";
  const valores = [nombre, precio, stock];

  conexion.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al insertar:", error);
      return res.status(500).json({ mensaje: "Error al crear el producto" });
    }

    res.status(201).json({
      mensaje: "Producto creado correctamente",
      id: resultado.insertId,
    });
  });
});

app.put("/productos/:id", (req, res) => {
  const id = req.params.id;
  const { nombre, precio, stock } = req.body;

  const sql = "UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?";
  const valores = [nombre, precio, stock, id];

  conexion.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al actualizar:", error);
      return res.status(500).json({ mensaje: "Error al actualizar el producto" });
    }
    res.json({ mensaje: "Producto actualizado correctamente" });
  });
});

app.delete("/productos/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM productos WHERE id = ?";

  conexion.query(sql, [id], (error, resultado) => {
    if (error) {
      console.error("Error al eliminar:", error);
      return res.status(500).json({ mensaje: "Error al eliminar el producto" });
    }
    res.json({ mensaje: "Producto eliminado correctamente" });
  });
});

app.post("/contactos", (req, res) => {
  const { nombre, asunto, email, mensaje } = req.body;

  const sql = "INSERT INTO contactos (nombre, asunto, email, mensaje) VALUES (?, ?, ?, ?)";
  const valores = [nombre, asunto, email, mensaje];

  conexion.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al guardar contacto:", error);
      return res.status(500).json({ mensaje: "Error al guardar el mensaje" });
    }
    res.status(201).json({ mensaje: "Mensaje enviado correctamente" });
  });
});

app.get("/contactos", (req, res) => {
  const sql = "SELECT * FROM contactos ORDER BY id DESC";

  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.error("Error al consultar contactos:", error);
      return res.status(500).json({ mensaje: "Error al consultar los mensajes" });
    }
    res.json(resultados);
  });
});

app.delete("/contactos/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM contactos WHERE id = ?";

  conexion.query(sql, [id], (error, resultado) => {
    if (error) {
      console.error("Error al eliminar contacto:", error);
      return res.status(500).json({ mensaje: "Error al eliminar el mensaje" });
    }
    res.json({ mensaje: "Mensaje eliminado correctamente" });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});