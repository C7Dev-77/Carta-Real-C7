# 💌 Carta Real — Experiencia Musical Interactiva (Miky Woodz)

![Vista Previa de Carta Real](./public/assets/aistudio/carta_real_OG_ef0c69ed.png)

Una experiencia web interactiva, cinematográfica y romántica diseñada alrededor de la canción **"Carta Real"** de **Miky Woodz** (*Los 90 Piketes*). Combina un reproductor de audio HTML5 sincronizado milimétricamente con traducción simultánea (Español + Inglés), partículas doradas interactivas en Canvas y una estética nocturna con **Glassmorphism**.

---

## ✨ Características Principales

- **🎵 Sincronización Milimétrica con Adelanto de Lectura (`+1s`)**: Las letras de la canción completa (`0:00` a `4:17`) están sincronizadas con el audio MP3 real mostrando cada verso **1 segundo antes** de que se cante para una experiencia visual fluida.
- **🌎 Estructura Bilingüe Simultánea**:
  - **Español arriba (`textoEs`)**: Tipografía editorial `Playfair Display` con brillo dorado metálico (`#FFD700` / `#D4AF37`).
  - **Inglés abajo (`textoEn`)**: Traducción poética en tipografía `Montserrat` blanca de alto contraste.
- **💎 Diseño Full-Screen (`100vh`) & Glassmorphism**:
  - Escenario nocturno inmersivo con tarjeta central de cristal esmerilado (`backdrop-filter: blur(14px)`).
  - Notas manuscritas flotantes en inglés (*"Our Song"*, *"My Favorite"*, *"My Love"*, *"Always Yours"*) en tono **celeste cian luminoso (`#A5F3FC` / `#00FFFF`)**.
- **✨ Sistema de Partículas en Tiempo Real (`HTML5 Canvas`)**: Polvo de estrellas dorado y orbes bokeh que reaccionan sutilmente al movimiento del cursor.
- **🎹 Efectos Sonoros Web Audio**: Acorde cálido sintetizado (`Fmaj7`) al abrir el sobre de la carta inicial y al lanzar corazones flotantes (`💛`).
- **📱 Diseño 100% Responsive**: Adaptado para pantallas de escritorio, tablets y teléfonos móviles, con modal de *Carta Personal* scrolleable.
- **🔍 Optimizado para Motores de Búsqueda (SEO)**: Incluye metadatos OpenGraph, Twitter Cards, datos estructurados **Schema.org (`JSON-LD`)**, `robots.txt` y `sitemap.xml`.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Propósito |
| :--- | :--- |
| **React 19 + TypeScript** | Arquitectura de componentes e interfaz reactiva de alta precisión |
| **Tailwind CSS v4** | Sistema de estilos responsivos, efectos de cristal y animaciones |
| **HTML5 Audio + Web Audio API** | Reproducción del flujo MP3 (`requestAnimationFrame`) y efectos armónicos |
| **HTML5 Canvas 2D** | Motor de partículas doradas y efecto bokeh interactivo |
| **Vite** | Empaquetado rápido y compilación optimizada para producción (`GitHub Pages`) |

---

## 🚀 Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Cristian14og/Carta-Real.git
   cd Carta-Real
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre tu navegador en `http://localhost:3000`.

4. **Compilar para producción:**
   ```bash
   npm run build
   ```

---

## 🌐 Despliegue en GitHub Pages

Este repositorio incluye un flujo de trabajo automatizado en `.github/workflows/deploy.yml`:

1. Ve a **Settings > Pages** en tu repositorio de GitHub.
2. En **Build and deployment > Source**, selecciona **GitHub Actions**.
3. Cada vez que hagas `git push` a la rama `main`, GitHub compilará y publicará automáticamente el sitio web.

---

## 🔎 Cómo Indexar tu Página en Google (Google Search Console)

El proyecto ya tiene integradas las etiquetas **SEO**, **OpenGraph**, **Schema.org JSON-LD**, `robots.txt` y `sitemap.xml`. Para que aparezca inmediatamente en las búsquedas de Google:

1. Entra a [Google Search Console](https://search.google.com/search-console).
2. En **Prefijo de la URL**, pega el enlace público de tu GitHub Pages (ej. `https://cristian14og.github.io/nombre-de-tu-repo/`).
3. Elige el método de verificación **Etiqueta HTML** y copia la etiqueta `<meta name="google-site-verification" content="..." />` dentro del `<head>` de `index.html` (o verifica mediante tu cuenta de Google Analytics).
4. En el menú izquierdo de Search Console, ve a **Sitemaps** e ingresa `sitemap.xml`.
5. Haz clic en **Inspección de URLs** arriba, pega tu enlace y pulsa **"Solicitar indexación"**.

---

## 💛 Créditos y Autoría

- **Desarrollado por:** [Cristian14og (C7dev)](https://github.com/Cristian14og)
- **Canción:** *Carta Real* — Miky Woodz (*Los 90 Piketes*)
