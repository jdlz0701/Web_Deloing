# PROGRESO — Página DELOING SAS

> Archivo de checkpoint. Si se acaban los créditos, retomar desde la primera sección sin completar.

## Stack
- Vite + React + TypeScript
- TanStack Router (rutas en `src/routes/`)
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Framer Motion, Sonner (toasts), Lucide (iconos)
- Alias `@` → `src/`
- Carpeta del proyecto: `C:\Users\Equipo\pagina WEB\deloing-web`
- Node en: `C:\Program Files\nodejs\` (usar npm.cmd con PATH del registro)

## Comando para correr
```
$env:PATH = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
Set-Location "C:\Users\Equipo\pagina WEB\deloing-web"
& "C:\Program Files\nodejs\npm.cmd" run dev
```

## SECCIONES

### [x] 1. Setup del proyecto
- Vite scaffold, dependencias instaladas
- vite.config.ts (tailwind + router + alias)
- tsconfig paths `@/*`
- src/index.css (tema oscuro, glass, gradientes, animaciones)
- src/main.tsx (RouterProvider)
- src/routes/__root.tsx (Outlet + Toaster)
- src/routes/index.tsx (landing completa, sección 03 ScrollStory añadida)

### [x] 2. Imágenes (7 assets en src/assets/)
- ACTUALIZADO: al usuario NO le gustaron las imágenes IA. Reemplazadas por FOTOS REALES:
  - hero-ship, truck, international(avión noche), customs(puerto atardecer), warehouse
    = stock profesional de PEXELS (URLs https://images.pexels.com/photos/{id}/...)
  - world-network = Tierra de noche NASA (Wikimedia Commons)
  - script de referencia: scripts/get-real-images.ps1 (Wikimedia, dio fotos amateur)
  - Pexels se obtuvo vía WebFetch de páginas de búsqueda -> URLs CDN -> Invoke-WebRequest
- PENDIENTE DEL USUARIO: los 2 LOGOS reales de la empresa (globo+flecha). No puedo
  extraer imágenes pegadas en el chat; debe guardarlas como archivo en src/assets/_uploads/.
  Por ahora el logo es el SVG propio (monograma "D").
- Logo + favicon SVG propios (monograma "D" como ruta logística) — provisional
- Tipografía: Space Grotesk (display), Inter (body), Space Mono (etiquetas)
- index.html: título, meta, fuentes Google, theme-color

### [x] 3. Verificar que corre sin errores
- Corre en http://localhost:5173, sin errores de consola
- Preview vía `.claude/launch.json` (usa node.exe directo + vite.js, evita problema de PATH con npm)
- Para arrancar manual: stop procesos node vite, luego preview_start "deloing"
- HERO VERIFICADO con screenshot: se ve premium, barco cinematográfico OK

### [x] 4. Mejoras creativas (frontend-design skill)
- Fuentes con personalidad (Space Grotesk + Space Mono manifiesto)
- ELEMENTO FIRMA: mapa de rutas animado en vivo (componente RouteMap en index.tsx)
  - SVG con nodos de hubs, arcos bezier, cargas viajando (animateMotion+mpath)
  - Bogotá = hub central pulsante (empresa colombiana, ref DIAN)
  - Integrado en GlobalNetwork, verificado con screenshot: se ve premium
- Métricas, Servicios verificados visualmente: excelentes

### [x] 5. Verificación final — COMPLETA
- FIX IMPORTANTE: el `<div>` raíz del Landing tenía `overflow-hidden` que rompía
  el `position: sticky` de la sección 03 (imagen quedaba en top:-1824, fuera de viewport).
  Cambiado a `overflow-x-clip` → sticky funciona.
- VERIFICADO con screenshots: Hero, Métricas, Servicios, Modal (shared-layout),
  Sección 03 ScrollStory, Mapa de rutas (RouteMap), CTA, Footer.
- Responsive móvil (375px): nav colapsa, sin overflow horizontal, mapa escala, cards 2x2.
- Sin errores de consola.
- BUILD DE PRODUCCIÓN OK: `tsc -b && vite build` pasa. 475KB JS (149KB gzip). Desplegable.
- NOTA: el smooth-scroll global interfiere al posicionar por JS para screenshots;
  desactivar con document.documentElement.style.scrollBehavior='auto' antes de medir.

### [~] 6. REDISEÑO CREATIVO (en progreso) — solicitado por el usuario
- Quejas/pedidos: (a) navy "demasiado azul" -> añadir beige/crema/blanco anclado en #010B40;
  (b) el mapa de RouteMap no coincide con la ubicación real de las ciudades -> mapa mundial real alineado;
  (c) elevar TODO a calidad keynote de Apple, muy creativo, que invite a volver.
- Mandato: usar skill frontend-design (invocado) + ultracode (workflows).
- Logo REAL integrado: src/assets/deloing-logo.jpg (150x150, del _uploads). Falta barco hi-res y 2º logo del usuario.
- Workflow de dirección creativa lanzado (panel de 3 direcciones + solución de mapa + síntesis).
- Paleta objetivo: navy #010B40 + beige/crema + blanco. Ritmo de secciones claro/oscuro estilo Apple.

## ESTADO: v1 TERMINADA ✅ — ahora en REDISEÑO v2 (Apple-quality)
Posibles extras futuros (opcionales): conectar el formulario a un backend/email real,
añadir página de términos/privacidad, SEO/OpenGraph tags, deploy (Vercel/Netlify).

## NOTAS DE DISEÑO (frontend-design skill)
- Evitar los 3 defaults de IA: crema+serif+terracota / negro+verde-ácido / broadsheet
- Tipografía con personalidad (display + body deliberados)
- Un solo elemento "firma" memorable; lo demás disciplinado
- Numeración 01/02/03 solo si el contenido es secuencia real
- Respetar reduced-motion, focus visible, responsive móvil
