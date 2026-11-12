# Apaga lo que arrancó INICIAR.bat: app, panel, backend y el MySQL del proyecto.
# Un MySQL externo (XAMPP u otro) no se toca.
[Console]::OutputEncoding = [Text.Encoding]::UTF8
$Local = Join-Path (Split-Path $PSScriptRoot -Parent) '.local'

# Sube desde el proceso que usa el puerto hasta la ventana cmd que lo abrió
# (npm le cambia el título, así que no sirve buscarla por título).
function Raiz-Ventana([int]$procId) {
  $actual = Get-CimInstance Win32_Process -Filter "ProcessId=$procId"
  while ($actual) {
    $padre = Get-CimInstance Win32_Process -Filter "ProcessId=$($actual.ParentProcessId)"
    if (-not $padre -or $padre.Name -notin 'cmd.exe', 'node.exe') { break }
    $actual = $padre
  }
  return $actual.ProcessId
}

foreach ($puerto in 8765, 4200, 3003) {
  $conexiones = Get-NetTCPConnection -LocalPort $puerto -State Listen -ErrorAction SilentlyContinue
  foreach ($procId in ($conexiones.OwningProcess | Sort-Object -Unique)) {
    & taskkill.exe /PID (Raiz-Ventana $procId) /T /F 2>&1 | Out-Null
    Write-Host "Puerto $puerto liberado."
  }
}

# Ventanas que abrió INICIAR.bat y que quedaron con su título original.
& taskkill.exe /FI 'WINDOWTITLE eq ParqueoAgil - *' /T /F 2>&1 | Out-Null

Get-Process mysqld -ErrorAction SilentlyContinue |
  Where-Object { $_.Path -and $_.Path.StartsWith($Local, [StringComparison]::OrdinalIgnoreCase) } |
  ForEach-Object { Stop-Process -Id $_.Id -Force; Write-Host 'MySQL del proyecto apagado.' }

Write-Host ''
Write-Host 'Todo apagado.' -ForegroundColor Green
