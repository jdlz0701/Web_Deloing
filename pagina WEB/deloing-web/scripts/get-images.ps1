# Genera/descarga las imagenes de la landing desde Pollinations.ai (IA, sin API key)
$ErrorActionPreference = "Stop"
$dest = "C:\Users\Equipo\pagina WEB\deloing-web\src\assets"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

$style = "cinematic, dramatic moody lighting, deep navy blue and cyan teal color grade, premium corporate, ultra detailed, 8k photography, dark background"

$images = @(
  @{ name = "hero-ship.jpg";     w = 1920; h = 1080; seed = 42;  prompt = "massive container cargo ship loaded with stacked colorful shipping containers sailing on open ocean at blue hour, aerial wide shot, $style" },
  @{ name = "truck.jpg";          w = 1280; h = 800;  seed = 17;  prompt = "modern semi truck with trailer driving on highway at dusk, motion, logistics fleet, $style" },
  @{ name = "international.jpg";   w = 1280; h = 800;  seed = 88;  prompt = "large cargo airplane being loaded with air freight pallets on tarmac at night, $style" },
  @{ name = "customs.jpg";        w = 1280; h = 800;  seed = 23;  prompt = "huge port container terminal with gantry cranes and stacked containers, customs inspection area, $style" },
  @{ name = "warehouse.jpg";      w = 1280; h = 800;  seed = 55;  prompt = "modern automated distribution warehouse interior with tall racking shelves and forklifts, $style" },
  @{ name = "world-network.jpg";  w = 1920; h = 1080; seed = 71;  prompt = "abstract glowing global logistics network, world map with connected cyan light routes and nodes across continents, dark navy background, $style" }
)

foreach ($img in $images) {
  $enc = [System.Uri]::EscapeDataString($img.prompt)
  $url = "https://image.pollinations.ai/prompt/$enc`?width=$($img.w)&height=$($img.h)&seed=$($img.seed)&nologo=true&model=flux"
  $out = Join-Path $dest $img.name
  Write-Host "Descargando $($img.name) ..."
  try {
    Invoke-WebRequest -Uri $url -OutFile $out -TimeoutSec 120 -UseBasicParsing
    $size = (Get-Item $out).Length
    Write-Host "  OK $($img.name) - $([math]::Round($size/1KB)) KB"
  } catch {
    Write-Host "  ERROR $($img.name): $($_.Exception.Message)"
  }
}
Write-Host "LISTO"
