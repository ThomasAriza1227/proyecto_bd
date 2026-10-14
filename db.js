const mysql = require("mysql2");

// Configuracion de la conexión a MySql
const conexion = mysql.createConnection({
  host: "localhost", // Servidor de la base de datos
  user: "root", // Usuario de MySQL (Por defecto XAMPP)
  database: "tienda", // Nombre de la base de datos
});

// Comprobar si la conexión fue exitosa
conexion.connect((error) => {
  if (error) {
    console.error("❌Error al conectar con Mysql❌", error);
    return;
  }
  console.log("Conexión exitosa con Mysql");
});

// Exportar la conexion para reutilizarla en las rutas del servidor
module.exports = conexion;