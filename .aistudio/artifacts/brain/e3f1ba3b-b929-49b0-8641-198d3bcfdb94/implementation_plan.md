# Carta Real — Experiencia Web Interactiva y Sincronizador Milimétrico de Letras

Transformación de la experiencia interactiva **Carta Real** en una aplicación web completa que reproduce el audio real de *"Carta Real" - Miky Woodz* alojado en GitHub, sincroniza milimétricamente cada verso en español e inglés con `timeupdate` / `requestAnimationFrame`, e incluye un panel para inspeccionar, calibrar y copiar el código exacto del array `synchronizedLyrics`.

## User Review & Critical Decisions

> [!IMPORTANT]
> Se han incorporado tus respuestas para conectar directamente tu archivo MP3 de GitHub y estructurar los tiempos de referencia de la canción (3:45 / 225 segundos).

- **Fuente de Audio Confirmada**: Reproducción directa desde el repositorio de GitHub (`https://raw.githubusercontent.com/Cristian14og/Archivos-C7dev/main/Carta%20Real.mp3`, con respaldo automático vía CDN `jsdelivr` y opción de carga local por si se desea probar otro archivo).
- **Sincronización y Estructura `synchronizedLyrics`**: Uso de los tiempos exactos de referencia sobre la duración oficial de **3:45 (225 segundos)**, incluyendo los 4 fragmentos clave solicitados y la canción completa, con cálculo automático de `timeSeconds` (flotante con decimales), `timeLabel` (`min:seg / 3:45`), `progress` (`0` a `100`), `esPrimary`, `esSecondary`, `enPrimary` y `enSecondary`.
- **Doble Modo (Experiencia Romántica + Estudio de Código `synchronizedLyrics`)**: Conserva intacta toda la magia visual del diseño original (sobre animado inicial, partículas doradas en canvas, aurora nocturna, dedicatoria personal y efectos de corazones) y añade un modal/panel de **Código & Sincronización** donde puedes copiar con un clic el bloque exacto `const synchronizedLyrics = [...]` o ajustar cualquier marca de tiempo al milisegundo mientras escuchas el MP3.

---

## 1. Overview & Core Concept

- **What It Does**: Una experiencia musical y dedicatoria interactiva para *"Carta Real"* de Miky Woodz donde la letra principal y secundaria (con traducción ES/EN instantánea) se ilumina y actualiza con precisión milimétrica siguiendo el tiempo real del reproductor de audio HTML5 (`audio.currentTime`), acompañada de una herramienta integrada de inspección y exportación del array `synchronizedLyrics`.
- **Target Audience / Persona**: Diseñada tanto para sorprender a la persona especial que recibe la dedicatoria como para ofrecerte como desarrollador el control exacto del array `synchronizedLyrics` listo para copiar.
- **Key Value**: Une la presentación cinematográfica dorada de *Carta Real* con reproducción real del MP3 de Miky Woodz y generación exacta del código JavaScript solicitado.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Pantalla de Bienvenida (Sobre Real 💌)**: El usuario ve el sobre latiendo con brillo dorado sobre fondo negro abisal (`#050407`). Al hacer clic en *"Abrir Carta Real"*, el sobre se expande con efecto luminoso, suena el acorde cálido e inicia automáticamente la reproducción del MP3 real de *Carta Real*.
  2. **Experiencia Principal Sincronizada**: A medida que avanza el MP3 (`0:00` a `3:45`), el bucle de alta frecuencia (`requestAnimationFrame` + `timeupdate`) compara `audio.currentTime` con `timeSeconds` de cada objeto en `synchronizedLyrics`, realizando transiciones suaves entre versos y actualizando la barra de progreso dorada.
  3. **Controles Interactivos del Reproductor**: Play/Pause real del MP3, salto al verso anterior/siguiente (que posiciona `audio.currentTime = verse.timeSeconds`), búsqueda libre en la barra de progreso, control de volumen real, modo repetición, cambio de idioma `ES | EN`, explosión de corazones dorados y modal de *Carta Personal*.
  4. **Visor y Calibrador de Código (`synchronizedLyrics`)**: Un acceso discreto en la interfaz permite abrir el **Inspector de Código JS**, donde se muestra el código fuente exacto `const synchronizedLyrics = [...]` con los fragmentos solicitados, botón para copiar el código limpio y botones para capturar el segundo exacto (`currentTime.toFixed(2)`) en vivo si deseas afinar algún decimal.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Lujo nocturno cinematográfico y editorial romántico, fiel al diseño original adjunto.
  - *Color Palette & Mood*:
    - `--background`: `#050407` (Void Black, 60% lienzo dominante con viñeta profunda).
    - `--surface`: `rgba(20, 16, 12, 0.58)` con `backdrop-filter: blur(18px)` y bordes sutiles `rgba(255, 215, 0, 0.28)` (30% superficies estructurales).
    - `--primary` / `--accent`: `#FFD700` (Oro brillante), `#D4AF37` (Oro metálico) y `#FFF3B0` (Luz champán) para el 10% de acentos interactivos.
  - *Typography & Hierarchy*:
    - Display / Verso Principal: `Playfair Display` (serif editorial de alto contraste con degradado dorado luminoso).
    - UI y Verso Secundario: `Montserrat` (sans geométrica limpia con `tabular-nums` para los cronómetros `min:seg / 3:45`).
    - Detalles Manuscritos: `Caveat` para las notas flotantes (*"Nuestra canción"*, *"Mi Favorita"*).
    - Código Exportable: `JetBrains Mono` / `monospace` para visualizar el array `synchronizedLyrics`.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Carga Resiliente del Audio MP3 desde GitHub**
  - *Chosen Approach*: Conectar el elemento `<audio>` principal a la URL raw de tu repositorio (`https://raw.githubusercontent.com/Cristian14og/Archivos-C7dev/main/Carta%20Real.mp3`) con fallback automático a `https://cdn.jsdelivr.net/gh/Cristian14og/Archivos-C7dev@main/Carta%20Real.mp3` para garantizar encabezados CORS y `Accept-Ranges` óptimos al adelantar o atrasar la canción.
  - *Why*: Los enlaces `github.com/.../blob/...` devuelven una página HTML en lugar del flujo binario de audio; transformar la ruta a Raw / jsDelivr permite reproducción directa y scrubbing instantáneo en el navegador.

- **Decision 2: Sincronización por `timeSeconds` con Precisión de Decimales**
  - *Chosen Approach*: Alimentar el motor de letras con el array `synchronizedLyrics` donde cada objeto incluye `timeSeconds`, `timeLabel`, `progress`, `esPrimary`, `esSecondary`, `enPrimary` y `enSecondary` calculados sobre 225 segundos (`3:45`), e incluir tanto la vista interactiva como el bloque de código JS listo para copiar.
  - *Why*: Cumple tanto con tu objetivo de tener la experiencia web interactiva funcionando al milisegundo con la canción real como con el requisito de obtener el código exacto del array `synchronizedLyrics`.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:
```
┌─────────────────────────────────────────────────────────────────────────┐
│                    App State & HTML5 Audio Engine                       │
│  • MP3 Stream (GitHub Raw / jsDelivr CDN: "Carta Real.mp3")             │
│  • High-Precision Sync Loop (requestAnimationFrame + timeupdate)        │
│  • synchronizedLyrics Store (timeSeconds, progress, timeLabel, ES/EN)   │
└───────────────┬─────────────────────────────────────────┬───────────────┘
                │                                         │
                ▼                                         ▼
┌───────────────────────────────────────┐ ┌───────────────────────────────┐
│   Cinematic Interactive Experience    │ │  Code & Sync Studio Drawer    │
│  • Landing Envelope Reveal (💌)       │ │  • Exact JS Array Output      │
│  • Golden Bokeh Particle Canvas       │ │    (const synchronizedLyrics) │
│  • Bilingual Lyric Stage (ES / EN)    │ │  • 1-Click Copy Raw JS Code   │
│  • Glass Player Bar (Scrub, Vol, Nav) │ │  • Live Timestamp Fine-Tuner  │
│  • Personal Dedication Letter Modal   │ │    (Capture currentTime.xx)   │
└───────────────────────────────────────┘ └───────────────────────────────┘
```

- **Data Model & State (`synchronizedLyrics`)**:
  Cada elemento del array cumple estrictamente la estructura solicitada:
  - `timeSeconds`: Número flotante con el segundo exacto donde inicia el fragmento.
  - `timeLabel`: Cadena con formato `"m:ss / 3:45"`.
  - `progress`: Porcentaje numérico (`0` a `100`) calculado como `Number(((timeSeconds / 225) * 100).toFixed(1))`.
  - `esPrimary` / `esSecondary`: Fragmento principal y secundario en español.
  - `enPrimary` / `enSecondary`: Traducción fiel y poética al inglés de ambas partes.

- **Interactive Component & State Mapping**:
  - **Sincronización en Vivo**: Al reproducirse el audio, el índice activo se determina buscando el último verso cuyo `timeSeconds <= currentTime`.
  - **Barra de Progreso Interactiva**: Hacer clic o arrastrar actualiza `audio.currentTime = ratio * duration` y sincroniza de inmediato el verso correspondiente.
  - **Exportador de Código**: Permite ver y copiar únicamente el bloque JavaScript `const synchronizedLyrics = [...]` con formato idéntico al especificado.
