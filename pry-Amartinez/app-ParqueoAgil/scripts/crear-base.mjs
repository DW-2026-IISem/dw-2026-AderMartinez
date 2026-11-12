// Crea la base de datos si no existe, usando el mysql2 que ya trae el backend.
// Lee la conexión de variables de entorno (PQA_DB_*), así una contraseña
// vacía llega bien. Sale con 2 si la contraseña es incorrecta.
import { createRequire } from 'node:module';

const require = createRequire(new URL('../backend/package.json', import.meta.url));
const mysql = require('mysql2/promise');

const { PQA_DB_HOST = '127.0.0.1', PQA_DB_PORT = '3306', PQA_DB_USER = 'root', PQA_DB_PASS = '', PQA_DB_NAME = 'ParqueoAgil' } = process.env;

try {
  const conn = await mysql.createConnection({
    host: PQA_DB_HOST,
    port: Number(PQA_DB_PORT),
    user: PQA_DB_USER,
    password: PQA_DB_PASS,
  });
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${PQA_DB_NAME}\` CHARACTER SET utf8mb4`);
  await conn.end();
  console.log(`Base de datos ${PQA_DB_NAME} lista.`);
} catch (e) {
  console.error(e.message);
  process.exit(e.code === 'ER_ACCESS_DENIED_ERROR' ? 2 : 1);
}
