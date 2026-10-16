requiere("dotenv").config();
const mysql = require("mysql2");

// Configuracion de la conexión de la BD

const host = process.env.DB_HOST || "localhost";
const port = Number(process.env.DB_PORT) || 3306;
const user = process.env.DB_USER || "root";
const password = process.env.DB_PASSWORD || "";
const database = process.env.DB_NAME || "tienda";

// Opciones de configuracion
const configuracion = {
  host,
  port,
  user,
  password,
  database,
};



// Si el host es remoto (TiDB Cloud), se utiliza SSL
if (host !== "localhost" && host !== "127.0.0.1") {
  configuracion.ssl = {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  };
}


// Crear la conexion con MySQL O tIdb Cloud
const conexion = mysql.createConnection(configuracion);

// Comprobamos si la conexion fue exitosa
conexion.connect((error) => {
  if (error) {
    console.error("Error al conectar con la base de datos:", error);
  } 
    console.log(`Conexión exitosa con la base de datos} (${host}:${port})`);
});




// Exportar la conexion para reutilizarla en las rutas del servidor
module.exports = conexion;