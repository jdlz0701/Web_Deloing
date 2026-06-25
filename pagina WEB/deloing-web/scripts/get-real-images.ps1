# Descarga fotos REALES desde Wikimedia Commons (licencia libre, sin API key)
$ErrorActionPreference = "Continue"
$dest = "C:\Users\Equipo\pagina WEB\deloing-web\src\assets\_uploads"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

function Get-CommonsImage($query, $outName, $minW = 1500) {
  $api = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=$([uri]::EscapeDataString($query))&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1920&format=json"
  try {
    $r = Invoke-RestMethod -Uri $api -UseBasicParsing -TimeoutSec 60
  } catch { Write-Host "  query FAIL $query"; return }
  $cands = $r.query.pages.PSObject.Properties.Value |
    Where-Object { $_.imageinfo[0].mime -eq 'image/jpeg' -and $_.imageinfo[0].width -ge $minW -and $_.imageinfo[0].width -gt $_.imageinfo[0].height } |
    Sort-Object { $_.index }
  if (-not $cands) { Write-Host "  sin candidatos para $query"; return }
  $pick = $cands[0]
  $url = $pick.imageinfo[0].thumburl
  $out = Join-Path $dest $outName
  try {
    Invoke-WebRequest -Uri $url -OutFile $out -TimeoutSec 90 -UseBasicParsing -Headers @{ 'User-Agent' = 'DeloingSite/1.0 (contacto@deloing.com)' }
    Write-Host "  OK $outName <- $($pick.title) [$([math]::Round((Get-Item $out).Length/1KB))KB]"
  } catch { Write-Host "  download FAIL $outName : $($_.Exception.Message)" }
}

Write-Host "truck..."        ; Get-CommonsImage "semi trailer truck highway road" "truck.jpg"
Write-Host "international..." ; Get-CommonsImage "cargo aircraft loading freight airport" "international.jpg"
Write-Host "customs..."      ; Get-CommonsImage "container terminal gantry crane port" "customs.jpg"
Write-Host "warehouse..."    ; Get-CommonsImage "warehouse interior shelves distribution logistics" "warehouse.jpg"
Write-Host "network..."      ; Get-CommonsImage "Earth at night city lights from space" "world-network.jpg"
Write-Host "ship (fallback)."; Get-CommonsImage "container ship aerial ocean" "hero-ship.jpg"
Write-Host "LISTO"