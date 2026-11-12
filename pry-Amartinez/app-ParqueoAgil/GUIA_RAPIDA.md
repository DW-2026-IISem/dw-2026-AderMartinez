# Guía rápida: probar ParqueoÁgil en tu computador

Con esta guía corres todo el sistema (base de datos, backend, panel web y app del conductor) con **un doble clic**. No necesitas instalar MySQL ni Flutter, ni configurar nada a mano.

## Qué necesitas

- Windows 10 u 11.
- Internet la primera vez. El script descarga Node.js si no lo tienes, MySQL portable (unos 250 MB) y las librerías del proyecto.
- Unos 2 GB libres en disco.
- Google Chrome o Microsoft Edge.

## Paso 1. Descargar el proyecto

**Opción A, sin Git:**

1. Entra a https://github.com/47tho/dw-2026-AderMartinez.
2. Haz clic en el botón verde **Code** y luego en **Download ZIP**.
3. Haz clic derecho en el ZIP y elige **Extraer todo...**. Extráelo en una carpeta corta, por ejemplo `C:\proyectos`. Evita carpetas muy largas o dentro de OneDrive.

**Opción B, con Git:**

```bash
git clone https://github.com/47tho/dw-2026-AderMartinez.git
```

## Paso 2. Ejecutar INICIAR.bat

Entra a la carpeta `pry-Amartinez\app-ParqueoAgil` y haz **doble clic en `INICIAR.bat`**.

- Si Windows muestra "Windows protegió su PC", haz clic en **Más información** y luego en **Ejecutar de todas formas**.
- Si pide permiso de administrador para instalar Node.js, acepta.
- **La primera vez tarda entre 5 y 15 minutos**, según tu internet. Las siguientes veces tarda menos de 1 minuto.

El script te va diciendo qué está haciendo. Cuando termina muestra **"Todo listo"** y abre dos pestañas en el navegador. Se abren también tres ventanas minimizadas (Backend, Panel web y App): **no las cierres mientras pruebas**.

| Qué | Dirección |
|---|---|
| Panel web (administrador y portería) | http://localhost:4200 |
| App del conductor y del lector de QR | http://localhost:8765 |
| API con Swagger | http://localhost:3003/api/docs |

## Paso 3. Iniciar sesión

| Rol | Dónde | Correo | Contraseña |
|---|---|---|---|
| Conductor | App (8765) | `conductor@parqueoagil.local` | `Conductor123!` |
| Lector de QR (vigilante) | App (8765) | `lector@parqueoagil.local` | `Lector123!` |
| Administrador | Panel (4200) | `admin@parqueoagil.local` | `Admin123!` |
| Vendedor / portería | Panel (4200) | `seller@parqueoagil.local` | `Seller123!` |

En la app, deja la dirección de la API como está (`http://localhost:3003/api`). También puedes crear tu propia cuenta de conductor con **Crear cuenta**.

## Paso 4. Recorrido de prueba (5 minutos)

1. **App, como conductor.** Entra con el conductor. Revisa **Vehículos** (ya trae 3), **Mi QR** (cambia cada 30 segundos) y el **Mapa** del parqueadero.
2. **Panel, como administrador.** En otra pestaña, entra a http://localhost:4200 con el admin y abre **Portería**.
3. **Registrar la entrada.** Tienes tres formas:
   - **Por placa:** en "Sin app (por placa)", escribe `XYZ789`, elige *Automóvil* y haz clic en **Registrar entrada**. Si dice que ya está adentro, usa otra placa del conductor (`ABC123` o `QWE12F`) o registra primero la salida.
   - **Con la cámara:** tómale una foto al QR de la app con tu celular y muéstrasela a la cámara del computador.
   - **Con dos computadores:** el QR en uno y la cámara en el otro.
4. **Ver la ventana emergente.** Vuelve a la pestaña de la app: aparece una ventana con el espacio asignado. **Ver en el mapa** te lleva al espacio, marcado en amarillo.
5. **Registrar la salida.** En el panel, escribe la misma placa en "Placa que sale" y haz clic en **Registrar salida**. La app muestra el valor a pagar.
6. **Probar el lector de QR.** Cierra sesión en la app y entra con el usuario `lector`. Ahora la app muestra el lector de QR del vigilante, en lugar de las pantallas del conductor.

## Paso 5. Apagar

Haz **doble clic en `DETENER.bat`**. Apaga la app, el panel, el backend y el MySQL del proyecto. Para volver a usarlo, abre otra vez `INICIAR.bat`. Tus datos se guardan entre sesiones.

## Problemas comunes

| Qué pasa | Qué hacer |
|---|---|
| La ventana se cierra sola o dice que no se puede ejecutar | Haz clic derecho en `INICIAR.bat` y elige **Ejecutar como administrador**. |
| "Node.js se instaló pero esta ventana no lo ve" | Cierra la ventana y abre `INICIAR.bat` otra vez. |
| Te pide la contraseña de root de MySQL | Ya tienes un MySQL instalado (por ejemplo XAMPP) y el script va a usar ese. En XAMPP la contraseña suele estar vacía: presiona Enter. Si no sabes la contraseña, apaga ese MySQL y vuelve a ejecutar el script; así usa el suyo propio. |
| "El backend no respondió en el puerto 3003" | Abre la ventana minimizada **ParqueoAgil - Backend** y mira el error. Lo más común es que otro programa use el puerto 3003. Ejecuta `DETENER.bat` y prueba de nuevo. |
| "npm install falló" | Casi siempre es el internet. Vuelve a ejecutar `INICIAR.bat`. Si sigue fallando, borra la carpeta `node_modules` dentro de `backend` o de `web` y repite. |
| La app se queda en blanco | Recarga la página con **Ctrl + F5**. Usa Chrome o Edge. |
| La app dice que no puede conectar con el servidor | El backend está apagado. Ejecuta `INICIAR.bat` otra vez. |
| Quiero empezar con la base de datos vacía | Ejecuta `DETENER.bat`, borra la carpeta `.local` dentro de `app-ParqueoAgil` y vuelve a ejecutar `INICIAR.bat`. |

## Qué hace INICIAR.bat por dentro

Esto es para quien tenga curiosidad. El código está en `scripts\iniciar.ps1`.

1. Revisa que haya Node.js 22.22+ o 24.15+, como pide Angular. Si no lo hay, lo instala con `winget`.
2. Si ya hay un MySQL en el puerto 3306, usa ese. Si no, descarga MySQL 8.4 portable en `.local\` (sin instalar nada en Windows) y lo arranca con el usuario `root` sin contraseña.
3. Hace `npm install` en `backend` y en `web`, solo si falta.
4. Crea la base `ParqueoAgil` y el archivo `backend\.env`, con una clave JWT aleatoria.
5. Arranca el backend (3003), que crea las tablas y carga los datos de ejemplo. Después arranca el panel Angular (4200) y la app Flutter ya compilada (`mobile\web-build`, servida en 8765 por `scripts\servir-app.mjs`).

Si cambias el código de la app Flutter, vuelve a compilarla con `flutter build web` en `mobile\` y copia `build\web` a `mobile\web-build`.
