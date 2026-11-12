# Arranca ParqueoÁgil completo en Windows: MySQL, backend, panel web y app.
# Se ejecuta con INICIAR.bat. La primera vez tarda (descargas e instalación);
# las siguientes solo arranca lo que no esté corriendo.
# 'Continue' y no 'Stop': en PowerShell 5.1 cualquier línea que un programa
# escriba en stderr (mysqld, npm, curl) cuenta como error y lo detendría.
# Los fallos se revisan con $LASTEXITCODE.
$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'
[Console]::OutputEncoding = [Text.Encoding]::UTF8

$Root    = Split-Path $PSScriptRoot -Parent
$Local   = Join-Path $Root '.local'
$Backend = Join-Path $Root 'backend'
$Web     = Join-Path $Root 'web'
$MySqlVersion = '8.4.8'
$MySqlDir = Join-Path $Local "mysql-$MySqlVersion-winx64"
$MySqlData = Join-Path $Local 'mysql-data'

function Paso($texto)  { Write-Host ''; Write-Host "==> $texto" -ForegroundColor Cyan }
function Ok($texto)    { Write-Host "    $texto" -ForegroundColor Green }
function Aviso($texto) { Write-Host "    $texto" -ForegroundColor Yellow }
function Falla($texto) {
  Write-Host ''
  Write-Host "ERROR: $texto" -ForegroundColor Red
  Write-Host 'Revisa la seccion "Problemas comunes" de GUIA_RAPIDA.md.' -ForegroundColor Red
  exit 1
}

# Por el estado del puerto y no conectándose a 127.0.0.1: ng serve escucha
# solo en ::1 (localhost IPv6).
function Puerto-Abierto([int]$puerto) {
  return [bool](Get-NetTCPConnection -LocalPort $puerto -State Listen -ErrorAction SilentlyContinue)
}

function Esperar-Puerto([int]$puerto, [int]$segundos, $nombre) {
  for ($i = 0; $i -lt $segundos; $i++) {
    if (Puerto-Abierto $puerto) { return }
    Start-Sleep -Seconds 1
  }
  Falla "$nombre no respondio en el puerto $puerto despues de $segundos s. Mira su ventana para ver el error."
}

# UTF-8 sin BOM (Set-Content -Encoding utf8 de PowerShell 5.1 agrega BOM).
function Guardar-Lineas($ruta, $lineas) {
  [IO.File]::WriteAllLines($ruta, [string[]]$lineas, (New-Object Text.UTF8Encoding $false))
}

function Recargar-Path {
  $env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')
}

function Node-Sirve {
  if (-not (Get-Command node -ErrorAction SilentlyContinue)) { return $false }
  $v = [version]((node -v).TrimStart('v'))
  # Angular 22 pide Node ^22.22.3, ^24.15.0 o >= 26.
  return ($v.Major -eq 22 -and $v -ge [version]'22.22.3') -or ($v.Major -eq 24 -and $v -ge [version]'24.15.0') -or $v.Major -ge 26
}

# Abre una ventana con título fijo (DETENER.bat la cierra por ese título).
function Abrir-Ventana($titulo, $carpeta, $comando) {
  Start-Process cmd.exe -ArgumentList "/k title ParqueoAgil - $titulo && cd /d `"$carpeta`" && $comando" -WindowStyle Minimized
}

Write-Host '=============================================' -ForegroundColor Cyan
Write-Host '   ParqueoAgil - arranque automatico' -ForegroundColor Cyan
Write-Host '=============================================' -ForegroundColor Cyan

# ── 1. Node.js ─────────────────────────────────────────────────
Paso 'Revisando Node.js'
if (-not (Node-Sirve)) {
  if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Falla 'No hay Node.js 24 ni winget. Instala Node.js LTS desde https://nodejs.org y vuelve a ejecutar INICIAR.bat.'
  }
  Aviso 'Instalando Node.js LTS con winget (puede pedir permiso de administrador)...'
  winget install -e --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements --silent
  Recargar-Path
  if (-not (Node-Sirve)) { Falla 'Node.js se instalo pero esta ventana no lo ve. Cierra esta ventana y abre INICIAR.bat otra vez.' }
}
Ok "Node.js $(node -v)"

# ── 2. MySQL ───────────────────────────────────────────────────
Paso 'Revisando MySQL (puerto 3306)'
$dbPass = ''
$mysqlPropio = Test-Path (Join-Path $MySqlDir 'bin\mysqld.exe')
if (Puerto-Abierto 3306) {
  if ($mysqlPropio) {
    Ok 'MySQL del proyecto ya esta corriendo.'
  } else {
    Ok 'Hay un MySQL corriendo en este equipo (XAMPP u otro); se usara ese.'
    $guardada = Join-Path $Local 'db-pass.txt'
    if (Test-Path $guardada) { $dbPass = (Get-Content $guardada -Raw).Trim() }
    else {
      Write-Host '    Escribe la contrasena del usuario root de ese MySQL.' -ForegroundColor Yellow
      $dbPass = Read-Host '    (en XAMPP normalmente esta vacia: solo presiona Enter)'
    }
  }
} else {
  if (-not $mysqlPropio) {
    Aviso "Descargando MySQL $MySqlVersion portable (unos 250 MB, solo la primera vez)..."
    New-Item -ItemType Directory -Force $Local | Out-Null
    $zip = Join-Path $Local 'mysql.zip'
    $urls = @(
      "https://cdn.mysql.com/archives/mysql-8.4/mysql-$MySqlVersion-winx64.zip",
      "https://cdn.mysql.com/Downloads/MySQL-8.4/mysql-$MySqlVersion-winx64.zip"
    )
    $bajo = $false
    foreach ($u in $urls) {
      & curl.exe -L --fail --progress-bar -o $zip $u
      if ($LASTEXITCODE -eq 0) { $bajo = $true; break }
    }
    if (-not $bajo) { Falla 'No se pudo descargar MySQL. Revisa la conexion a internet.' }
    Aviso 'Descomprimiendo...'
    & tar.exe -xf $zip -C $Local
    if ($LASTEXITCODE -ne 0) { Falla 'No se pudo descomprimir MySQL.' }
    Remove-Item $zip
  }
  $ini = Join-Path $Local 'my.ini'
  @"
[mysqld]
basedir=$($MySqlDir -replace '\\','/')
datadir=$($MySqlData -replace '\\','/')
port=3306
bind-address=127.0.0.1
character-set-server=utf8mb4
"@ | Set-Content -Encoding ascii $ini
  $mysqld = Join-Path $MySqlDir 'bin\mysqld.exe'
  # El marcador solo se escribe si la inicialización terminó bien; una
  # carpeta de datos sin marcador quedó a medias y se rehace.
  $marcador = Join-Path $Local 'mysql-inicializado.txt'
  if (-not (Test-Path $marcador)) {
    Aviso 'Preparando la base de datos por primera vez...'
    if (Test-Path $MySqlData) { Remove-Item -Recurse -Force $MySqlData }
    & $mysqld "--defaults-file=$ini" --initialize-insecure --console 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
      # Lo más común: falta el Visual C++ Redistributable.
      Aviso 'Falto un componente de Windows (Visual C++). Instalandolo...'
      if (Test-Path $MySqlData) { Remove-Item -Recurse -Force $MySqlData }
      winget install -e --id Microsoft.VCRedist.2015+.x64 --accept-source-agreements --accept-package-agreements --silent
      & $mysqld "--defaults-file=$ini" --initialize-insecure --console 2>&1 | Out-Null
      if ($LASTEXITCODE -ne 0) { Falla 'MySQL no pudo inicializarse.' }
    }
    Set-Content -Encoding ascii $marcador (Get-Date -Format s)
  }
  Start-Process $mysqld -ArgumentList "--defaults-file=`"$ini`"", '--console' -WindowStyle Hidden `
    -RedirectStandardError (Join-Path $Local 'mysql.log') -RedirectStandardOutput (Join-Path $Local 'mysql-out.log')
  Esperar-Puerto 3306 60 'MySQL'
  Ok 'MySQL del proyecto corriendo (usuario root, sin contrasena).'
}

# ── 3. Dependencias ────────────────────────────────────────────
foreach ($p in @(@{ n = 'backend'; d = $Backend }, @{ n = 'panel web'; d = $Web })) {
  if (-not (Test-Path (Join-Path $p.d 'node_modules'))) {
    Paso "Instalando dependencias del $($p.n) (solo la primera vez, unos minutos)"
    Push-Location $p.d
    & npm.cmd install --no-audit --no-fund --loglevel=error
    $code = $LASTEXITCODE
    Pop-Location
    if ($code -ne 0) { Falla "npm install fallo en $($p.n)." }
  }
}

# ── 4. Base de datos y .env ────────────────────────────────────
Paso 'Creando la base de datos ParqueoAgil'
while ($true) {
  $env:PQA_DB_PASS = $dbPass
  & node (Join-Path $PSScriptRoot 'crear-base.mjs')
  if ($LASTEXITCODE -eq 0) { break }
  if ($LASTEXITCODE -eq 2) {
    Aviso 'Contrasena incorrecta.'
    $dbPass = Read-Host '    Escribe la contrasena de root otra vez'
    continue
  }
  Falla 'No se pudo conectar a MySQL.'
}
if (-not $mysqlPropio -and (Puerto-Abierto 3306) -and $dbPass -ne '') {
  New-Item -ItemType Directory -Force $Local | Out-Null
  Set-Content -Encoding ascii (Join-Path $Local 'db-pass.txt') $dbPass
}

$envFile = Join-Path $Backend '.env'
if (-not (Test-Path $envFile)) {
  Copy-Item (Join-Path $Backend '.env.example') $envFile
  $bytes = New-Object byte[] 32
  [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
  $secreto = -join ($bytes | ForEach-Object { $_.ToString('x2') })
  Guardar-Lineas $envFile ((Get-Content $envFile) -replace '^JWT_SECRET=.*', "JWT_SECRET=$secreto")
  Ok 'Archivo backend/.env creado con una clave JWT nueva.'
}
# La conexión siempre se ajusta a lo que se detectó arriba.
Guardar-Lineas $envFile ((Get-Content $envFile) `
  -replace '^DB_MYSQL_HOST=.*', 'DB_MYSQL_HOST=127.0.0.1' `
  -replace '^DB_MYSQL_PORT=.*', 'DB_MYSQL_PORT=3306' `
  -replace '^DB_MYSQL_USERNAME=.*', 'DB_MYSQL_USERNAME=root' `
  -replace '^DB_MYSQL_PASSWORD=.*', "DB_MYSQL_PASSWORD=$dbPass")

# ── 5. Backend, panel y app ────────────────────────────────────
Paso 'Arrancando el backend (puerto 3003)'
if (Puerto-Abierto 3003) { Ok 'Ya estaba corriendo.' }
else {
  Abrir-Ventana 'Backend' $Backend 'npm run start'
  Aviso 'Compilando y creando tablas (la primera vez tarda hasta 2 minutos)...'
  Esperar-Puerto 3003 240 'El backend'
  Ok 'Backend listo.'
}

Paso 'Arrancando el panel web (puerto 4200)'
if (Puerto-Abierto 4200) { Ok 'Ya estaba corriendo.' }
else {
  $env:NG_CLI_ANALYTICS = 'false'
  Abrir-Ventana 'Panel web' $Web 'npm start'
  Aviso 'Compilando el panel (hasta 2 minutos)...'
  Esperar-Puerto 4200 240 'El panel web'
  Ok 'Panel listo.'
}

Paso 'Arrancando la app del conductor (puerto 8765)'
if (Puerto-Abierto 8765) { Ok 'Ya estaba corriendo.' }
else {
  Abrir-Ventana 'App' $Root 'node scripts\servir-app.mjs 8765'
  Esperar-Puerto 8765 30 'La app'
  Ok 'App lista.'
}

Start-Process 'http://localhost:4200'
Start-Process 'http://localhost:8765'

Write-Host ''
Write-Host '=============================================' -ForegroundColor Green
Write-Host '   Todo listo. Se abrieron dos pestanas:' -ForegroundColor Green
Write-Host '=============================================' -ForegroundColor Green
Write-Host '  Panel web (admin y porteria): http://localhost:4200'
Write-Host '  App del conductor/lector:     http://localhost:8765'
Write-Host '  API y Swagger:                http://localhost:3003/api/docs'
Write-Host ''
Write-Host '  Usuarios de prueba:'
Write-Host '    Conductor (app):    conductor@parqueoagil.local  /  Conductor123!'
Write-Host '    Lector QR (app):    lector@parqueoagil.local     /  Lector123!'
Write-Host '    Administrador:      admin@parqueoagil.local      /  Admin123!'
Write-Host '    Vendedor/porteria:  seller@parqueoagil.local     /  Seller123!'
Write-Host ''
Write-Host '  Para apagar todo: doble clic en DETENER.bat'
Write-Host ''
