import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  synchronizedLyrics,
  formatTimeLabel,
  calculateProgress,
  SONG_DURATION_SECONDS,
} from './data/synchronizedLyrics';
import { GoldParticlesCanvas } from './components/GoldParticlesCanvas';

const AUDIO_SOURCES = [
  './Carta_Real.mp3',
  'https://raw.githubusercontent.com/Cristian14og/Archivos-C7dev/main/Carta%20Real.mp3',
  'https://cdn.jsdelivr.net/gh/Cristian14og/Archivos-C7dev@main/Carta%20Real.mp3',
];

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
}

export default function App() {
  // Envelope Landing State
  const [isLandingVisible, setIsLandingVisible] = useState<boolean>(true);
  const [isExploding, setIsExploding] = useState<boolean>(false);

  // Active Playback & Audio State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(SONG_DURATION_SECONDS);
  const [volume, setVolume] = useState<number>(78);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(true);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [audioSourceIndex, setAudioSourceIndex] = useState<number>(0);

  // Active Verse Index & Transition
  const [activeVerseId, setActiveVerseId] = useState<string>(synchronizedLyrics[0].id);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Dedication Modal & Floating Hearts
  const [isLetterModalOpen, setIsLetterModalOpen] = useState<boolean>(false);
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const activeVerseIdRef = useRef<string>(synchronizedLyrics[0].id);

  const currentVerse =
    synchronizedLyrics.find((v) => v.id === activeVerseId) ||
    synchronizedLyrics[0];

  // Web Audio Chime Effect
  const playRomanticChime = useCallback(() => {
    if (isMuted) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const notes = [349.23, 440.0, 523.25, 659.25];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.03, ctx.currentTime + 0.25 + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.05);
        osc.stop(ctx.currentTime + 2.5);
      });
    } catch {
      // Ignore browser autoplay restrictions
    }
  }, [isMuted]);

  // Synchronize active verse from currentTime (with 1s lead built into timestamps)
  const syncVerseWithTime = useCallback((timeSec: number) => {
    let matched = synchronizedLyrics[0];
    for (let i = 0; i < synchronizedLyrics.length; i++) {
      if (timeSec >= synchronizedLyrics[i].timeSeconds) {
        matched = synchronizedLyrics[i];
      } else {
        break;
      }
    }

    if (matched && matched.id !== activeVerseIdRef.current) {
      activeVerseIdRef.current = matched.id;
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveVerseId(matched.id);
        setIsTransitioning(false);
      }, 140);
    }
  }, []);

  // High-precision requestAnimationFrame loop while playing
  useEffect(() => {
    const updateLoop = () => {
      if (audioRef.current && !audioRef.current.paused) {
        const now = audioRef.current.currentTime;
        setCurrentTime(now);
        syncVerseWithTime(now);
      }
      rafRef.current = requestAnimationFrame(updateLoop);
    };

    if (isPlaying) {
      rafRef.current = requestAnimationFrame(updateLoop);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, syncVerseWithTime]);

  // Sync volume & mute to audio element
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume / 100;
    audioRef.current.muted = isMuted;
  }, [volume, isMuted]);

  // Envelope Open Handler
  const handleOpenEnvelope = () => {
    setIsExploding(true);
    playRomanticChime();

    setTimeout(() => {
      setIsLandingVisible(false);
      setIsExploding(false);
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }, 600);
  };

  // Play / Pause Toggle
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  // Seek to specific time in seconds
  const seekToSeconds = (targetSeconds: number, autoPlay = true) => {
    const audio = audioRef.current;
    const effectiveMax = duration || SONG_DURATION_SECONDS;
    const clamped = Math.max(0, Math.min(effectiveMax, targetSeconds));
    setCurrentTime(clamped);
    syncVerseWithTime(clamped);

    if (audio) {
      audio.currentTime = clamped;
      if (autoPlay && audio.paused) {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    }
  };

  // Prev / Next Verse Navigation
  const handlePrevVerse = () => {
    const idx = synchronizedLyrics.findIndex((v) => v.id === currentVerse.id);
    const prevIdx =
      (idx - 1 + synchronizedLyrics.length) % synchronizedLyrics.length;
    const target = synchronizedLyrics[prevIdx];
    activeVerseIdRef.current = target.id;
    setActiveVerseId(target.id);
    seekToSeconds(target.timeSeconds, isPlaying);
  };

  const handleNextVerse = () => {
    if (isShuffle) {
      const randomIdx = Math.floor(Math.random() * synchronizedLyrics.length);
      const target = synchronizedLyrics[randomIdx];
      activeVerseIdRef.current = target.id;
      setActiveVerseId(target.id);
      seekToSeconds(target.timeSeconds, isPlaying);
      return;
    }
    const idx = synchronizedLyrics.findIndex((v) => v.id === currentVerse.id);
    const nextIdx = (idx + 1) % synchronizedLyrics.length;
    const target = synchronizedLyrics[nextIdx];
    activeVerseIdRef.current = target.id;
    setActiveVerseId(target.id);
    seekToSeconds(target.timeSeconds, isPlaying);
  };

  // Progress Bar Scrubbing
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const effectiveDuration = duration || SONG_DURATION_SECONDS;
    seekToSeconds(clickRatio * effectiveDuration, isPlaying);
  };

  // Volume Bar Click
  const handleVolumeBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const pct = Math.round(ratio * 100);
    setVolume(pct);
    if (pct > 0 && isMuted) setIsMuted(false);
  };

  // Floating Hearts Burst
  const triggerHeartBurst = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newHearts: FloatingHeart[] = Array.from({ length: 4 }, (_, i) => ({
      id: Date.now() + i,
      x: rect.left + (Math.random() * 24 - 8),
      y: rect.top - 6,
    }));
    setHearts((prev) => [...prev, ...newHearts]);
    playRomanticChime();
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
    }, 1250);
  };

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const effectiveDuration = duration || SONG_DURATION_SECONDS;
  const progressPercentage = calculateProgress(currentTime, effectiveDuration);
  const formattedTimeLabel = formatTimeLabel(currentTime, effectiveDuration);

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-[#050407]">
      {/* Audio Real de Carta Real */}
      <audio
        ref={audioRef}
        src={AUDIO_SOURCES[audioSourceIndex]}
        loop={isRepeat}
        preload="auto"
        onTimeUpdate={(e) => {
          const t = e.currentTarget.currentTime;
          setCurrentTime(t);
          syncVerseWithTime(t);
        }}
        onLoadedMetadata={(e) => {
          if (e.currentTarget.duration && isFinite(e.currentTarget.duration)) {
            setDuration(e.currentTarget.duration);
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          if (audioSourceIndex < AUDIO_SOURCES.length - 1) {
            setAudioSourceIndex((prev) => prev + 1);
          }
        }}
      />

      {/* Corazones flotantes */}
      {hearts.map((h) => (
        <div
          key={h.id}
          className="floating-heart-burst text-amber-300 text-lg"
          style={{ left: `${h.x}px`, top: `${h.y}px` }}
        >
          💛
        </div>
      ))}

      {/* ==========================================
          FASE 1: PANTALLA DE BIENVENIDA (LANDING)
          ========================================== */}
      {isLandingVisible && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050407] transition-opacity duration-1000 px-4 text-center">
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          <button
            onClick={handleOpenEnvelope}
            aria-label="Abrir Carta Real"
            className="group relative flex flex-col items-center justify-center focus:outline-none cursor-pointer p-6 sm:p-8"
          >
            <div
              className={`envelope-landing text-7xl sm:text-8xl md:text-9xl select-none ${
                isExploding ? 'envelope-explode' : ''
              }`}
            >
              💌
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col items-center space-y-2 transition-all duration-500 opacity-85 group-hover:opacity-100 group-hover:translate-y-1">
              <span className="font-serif-luxury italic text-base sm:text-xl tracking-widest gold-header-text">
                Tienes una Carta Real pendiente...
              </span>
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-amber-200/50 font-sans-clean">
                Haz clic para abrir
              </span>
            </div>
          </button>
        </div>
      )}

      {/* ==========================================
          CONTENEDOR PRINCIPAL 100VH (SIN HEADER)
          ========================================== */}
      <div
        className={`relative w-full h-screen flex flex-col justify-between transition-all duration-1000 ease-out ${
          isLandingVisible ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
        }`}
      >
        {/* 1. Fondo base con la imagen carta real OG */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="./assets/aistudio/carta_real_OG_ef0c69ed.png"
            alt="Escena nocturna Carta Real"
            className="w-full h-full object-cover object-center opacity-90"
          />

          <div className="aurora-layer absolute inset-0 opacity-60" />

          {/* Bokeh decorativo sutil */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="vignette-overlay absolute inset-0 opacity-75" />
        </div>

        {/* 2. Partículas */}
        <GoldParticlesCanvas />

        {/* ==========================================
            ESCENARIO CENTRAL DE CRISTAL EXPANDIDO HACIA ARRIBA
            ========================================== */}
        <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-3 sm:px-8 pt-6 pb-4 pointer-events-none">
          <div className="relative w-full max-w-5xl flex items-center justify-center pointer-events-auto">
            {/* 1. Frase Flotante Superior Izquierda: "Our Song" (Celeste Cian / Plateado) */}
            <div className="hidden sm:flex flex-col items-center absolute -left-2 md:left-2 lg:left-4 -top-14 md:-top-12 z-30 animate-float-left select-none pointer-events-none">
              <div className="flex items-center space-x-1.5 -rotate-12 mb-1.5">
                <span className="font-handwritten text-2xl md:text-3xl floating-cyan-note tracking-wide">
                  Our Song
                </span>
                <svg
                  className="w-5 h-5 neon-cyan-icon animate-pulse"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 1L14.5 9.5L23 12L14.5 14.5L12 23L9.5 14.5L1 12L9.5 9.5L12 1Z" />
                </svg>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FFFF] shadow-[0_0_8px_#00FFFF]" />
              </div>
              <div className="neon-cyan-icon transform -rotate-12">
                <svg
                  className="w-7 h-7 md:w-9 md:h-9"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* 2. Frase Flotante Superior Derecha: "My Favorite" (Celeste Cian / Plateado) */}
            <div className="hidden sm:flex flex-col items-center absolute -right-2 md:right-2 lg:right-4 -top-14 md:-top-12 z-30 animate-float-right select-none pointer-events-none">
              <div className="flex items-center space-x-1.5 rotate-12 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FFFF] shadow-[0_0_8px_#00FFFF]" />
                <span className="font-handwritten text-2xl md:text-3xl floating-cyan-note tracking-wide">
                  My Favorite
                </span>
                <svg
                  className="w-4 h-4 neon-cyan-icon animate-ping"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 1L14.5 9.5L23 12L14.5 14.5L12 23L9.5 14.5L1 12L9.5 9.5L12 1Z" />
                </svg>
              </div>
              <div className="neon-cyan-icon transform rotate-12">
                <svg
                  className="w-7 h-7 md:w-9 md:h-9"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* 3. Frase Flotante Inferior Izquierda: "My Love" (Celeste Cian / Plateado) */}
            <div className="hidden sm:flex flex-col items-center absolute left-2 md:left-8 lg:left-10 -bottom-12 md:-bottom-11 z-30 animate-float-right select-none pointer-events-none">
              <div className="flex items-center space-x-1.5 -rotate-6">
                <svg
                  className="w-4 h-4 neon-cyan-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span className="font-handwritten text-2xl md:text-3xl floating-cyan-note tracking-wide">
                  My Love
                </span>
              </div>
            </div>

            {/* 4. Frase Flotante Inferior Derecha: "Always Yours" (Celeste Cian / Plateado) */}
            <div className="hidden sm:flex flex-col items-center absolute right-2 md:right-8 lg:right-10 -bottom-12 md:-bottom-11 z-30 animate-float-left select-none pointer-events-none">
              <div className="flex items-center space-x-1.5 rotate-6">
                <span className="font-handwritten text-2xl md:text-3xl floating-cyan-note tracking-wide">
                  Always Yours
                </span>
                <svg
                  className="w-4 h-4 neon-cyan-icon animate-pulse"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 1L14.5 9.5L23 12L14.5 14.5L12 23L9.5 14.5L1 12L9.5 9.5L12 1Z" />
                </svg>
              </div>
            </div>

            {/* Tarjeta Central de Cristal Expandida */}
            <div className="glass-lyric-backdrop relative w-full max-w-4xl min-h-[240px] sm:min-h-[310px] md:min-h-[360px] flex flex-col items-center justify-center rounded-3xl px-5 py-8 sm:px-12 sm:py-12 md:px-16 md:py-14 text-center transition-all duration-500">
              {/* Frases superiores compactas en móvil (Celeste Cian) */}
              <div className="flex sm:hidden w-full justify-between items-center mb-4 px-1">
                <span className="font-handwritten text-lg -rotate-3 floating-cyan-note flex items-center gap-1">
                  Our Song ✦
                </span>
                <span className="font-handwritten text-lg rotate-3 floating-cyan-note flex items-center gap-1">
                  My Favorite ✦
                </span>
              </div>

              {/* Español Arriba (Dorado) */}
              <h2
                id="primaryLyricText"
                className={`font-serif-luxury text-xl sm:text-3xl md:text-5xl font-semibold leading-snug sm:leading-tight tracking-wide gold-glow-text mb-3 sm:mb-5 transition-all duration-300 ${
                  isTransitioning
                    ? 'opacity-0 translate-y-2 scale-98'
                    : 'opacity-100 translate-y-0 scale-100'
                }`}
              >
                {currentVerse.textoEs}
              </h2>

              {/* Inglés Abajo (Blanco) */}
              <p
                id="secondaryLyricText"
                className={`font-sans-clean text-xs sm:text-base md:text-xl font-normal tracking-wide text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] transition-all duration-300 ${
                  isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                }`}
              >
                {currentVerse.textoEn}
              </p>

              {/* Frases inferiores compactas en móvil (Celeste Cian) */}
              <div className="flex sm:hidden w-full justify-between items-center mt-4 px-1">
                <span className="font-handwritten text-lg rotate-2 floating-cyan-note">
                  My Love ✦
                </span>
                <span className="font-handwritten text-lg -rotate-2 floating-cyan-note">
                  Always Yours ✦
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* ==========================================
            BARRA DE REPRODUCTOR INFERIOR (RESPONSIVE)
            ========================================== */}
        <footer className="relative z-30 w-full px-2.5 sm:px-8 pb-2.5 sm:pb-5">
          <div className="glass-player-bar w-full max-w-[1400px] mx-auto rounded-2xl px-3.5 py-2.5 sm:px-7 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-2.5 md:gap-6">
            {/* Izquierda (Artista) */}
            <div className="w-full md:w-[28%] flex items-center justify-between md:justify-start space-x-3">
              <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0">
                <div
                  onClick={() => setIsLetterModalOpen(true)}
                  className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-amber-400/50 shadow-[0_0_15px_rgba(255,215,0,0.25)] shrink-0 group cursor-pointer"
                >
                  <img
                    src="./assets/aistudio/carta_real_miky_db47513c.png"
                    alt="Portada Carta Real"
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="font-sans-clean text-xs sm:text-base font-semibold text-white tracking-wide truncate">
                    Carta Real - Miky Woodz
                  </span>
                  <div className="flex items-center space-x-1.5 mt-0.5 sm:mt-1">
                    <button
                      onClick={triggerHeartBurst}
                      aria-label="Marcar como favorito"
                      className="text-[#FFD700] hover:scale-125 active:scale-95 transition-transform focus:outline-none drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] cursor-pointer"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                    <span className="text-[11px] text-amber-200/70">Dedicada a ti</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsLetterModalOpen(true)}
                aria-label="Leer carta"
                className="md:hidden px-2.5 py-1 rounded-lg border border-amber-400/40 bg-amber-500/10 text-[11px] text-[#FFE89E] font-medium shrink-0 cursor-pointer"
              >
                Leer Carta 💌
              </button>
            </div>

            {/* Centro (Controles y Progreso) */}
            <div className="w-full md:w-[46%] flex flex-col items-center justify-center space-y-1.5 sm:space-y-2">
              <div className="flex items-center space-x-4 sm:space-x-6">
                {/* Shuffle */}
                <button
                  onClick={() => setIsShuffle((s) => !s)}
                  aria-label="Aleatorio"
                  className={`transition-all focus:outline-none cursor-pointer ${
                    isShuffle
                      ? 'text-[#FFD700] scale-110 drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]'
                      : 'text-[#D4AF37] hover:text-[#FFD700] hover:scale-110'
                  }`}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="16 3 21 3 21 8" />
                    <line x1="4" y1="20" x2="21" y2="3" />
                    <polyline points="21 16 21 21 16 21" />
                    <line x1="15" y1="15" x2="21" y2="21" />
                    <line x1="4" y1="4" x2="9" y2="9" />
                  </svg>
                </button>

                {/* Anterior */}
                <button
                  onClick={handlePrevVerse}
                  aria-label="Verso anterior"
                  className="text-[#FFD700] hover:text-white hover:scale-110 transition-all focus:outline-none drop-shadow-[0_0_6px_rgba(255,215,0,0.4)] cursor-pointer"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
                  </svg>
                </button>

                {/* Play / Pause */}
                <button
                  onClick={togglePlayPause}
                  aria-label="Reproducir o Pausar"
                  className="gold-circle-btn w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-[#120E07] focus:outline-none cursor-pointer"
                >
                  {!isPlaying ? (
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  )}
                </button>

                {/* Siguiente */}
                <button
                  onClick={handleNextVerse}
                  aria-label="Siguiente verso"
                  className="text-[#FFD700] hover:text-white hover:scale-110 transition-all focus:outline-none drop-shadow-[0_0_6px_rgba(255,215,0,0.4)] cursor-pointer"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
                  </svg>
                </button>

                {/* Repeat */}
                <button
                  onClick={() => setIsRepeat((r) => !r)}
                  aria-label="Repetir siempre"
                  className={`transition-all focus:outline-none cursor-pointer ${
                    isRepeat
                      ? 'text-[#FFD700] hover:scale-110 drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]'
                      : 'text-[#D4AF37]/50 hover:text-[#FFD700]'
                  }`}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="17 1 21 5 17 9" />
                    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                    <polyline points="7 23 3 19 7 15" />
                    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                  </svg>
                </button>
              </div>

              {/* Barra de Progreso */}
              <div className="w-full flex items-center space-x-2.5 sm:space-x-3">
                <span className="font-sans-clean text-[10px] sm:text-xs text-white/90 font-medium tracking-wider shrink-0 tabular-nums">
                  {formattedTimeLabel}
                </span>

                <div
                  onClick={handleProgressBarClick}
                  role="slider"
                  aria-label="Progreso de la canción"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progressPercentage}
                  tabIndex={0}
                  className="group relative flex-1 h-2 flex items-center cursor-pointer py-2"
                >
                  <div className="gold-slider-track w-full h-1.5 rounded-full overflow-hidden">
                    <div
                      className="gold-slider-fill h-full rounded-full transition-all duration-150"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <div
                    className="gold-slider-thumb absolute w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full -ml-1.5"
                    style={{ left: `${progressPercentage}%` }}
                  />
                </div>

                <span className="font-sans-clean text-[10px] sm:text-xs text-white/90 font-medium tracking-wider shrink-0 tabular-nums">
                  {formattedTimeLabel}
                </span>
              </div>
            </div>

            {/* Derecha (Volumen y Pantalla) */}
            <div className="hidden md:flex md:w-[26%] flex-col items-end justify-center space-y-2.5">
              <div className="flex items-center space-x-2.5">
                <button
                  onClick={() => setIsLetterModalOpen(true)}
                  aria-label="Abrir carta personal"
                  className="px-3.5 py-1.5 rounded-lg border border-amber-400/45 bg-gradient-to-b from-amber-500/15 to-amber-900/20 text-xs font-sans-clean font-medium text-[#FFF3B0] hover:border-[#FFD700] hover:shadow-[0_0_15px_rgba(255,215,0,0.35)] transition-all cursor-pointer"
                >
                  Carta Personal 💌
                </button>
                <button
                  onClick={toggleFullscreen}
                  aria-label="Pantalla completa"
                  className="px-3.5 py-1.5 rounded-lg border border-amber-400/45 bg-black/40 text-xs font-sans-clean font-medium text-white/90 hover:border-[#FFD700] hover:text-[#FFD700] transition-all cursor-pointer"
                >
                  Pantalla Completa
                </button>
              </div>

              {/* Control de Volumen */}
              <div className="flex items-center space-x-2.5 w-36">
                <button
                  onClick={() => setIsMuted((m) => !m)}
                  aria-label="Volumen"
                  className="text-[#FFD700] hover:scale-110 transition-transform focus:outline-none cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                </button>
                <div
                  onClick={handleVolumeBarClick}
                  role="slider"
                  aria-label="Control de volumen"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={isMuted ? 0 : volume}
                  tabIndex={0}
                  className="group relative flex-1 h-2 flex items-center cursor-pointer"
                >
                  <div className="gold-slider-track w-full h-1.5 rounded-full overflow-hidden">
                    <div
                      className="gold-slider-fill h-full rounded-full"
                      style={{ width: `${isMuted ? 0 : volume}%` }}
                    />
                  </div>
                  <div
                    className="gold-slider-thumb absolute w-3 h-3 rounded-full -ml-1.5"
                    style={{ left: `${isMuted ? 0 : volume}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* ==========================================
          MODAL DE DEDICATORIA PERSONAL (SCROLLABLE EN MÓVIL)
          ========================================== */}
      {isLetterModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsLetterModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        >
          <div className="glass-player-bar relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl p-5 sm:p-10 border border-amber-400/60 text-center shadow-[0_0_60px_rgba(255,215,0,0.25)]">
            <button
              onClick={() => setIsLetterModalOpen(false)}
              aria-label="Cerrar carta"
              className="sticky top-0 float-right text-amber-200/70 hover:text-[#FFD700] text-2xl focus:outline-none cursor-pointer"
            >
              &times;
            </button>

            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-500/15 border border-amber-400/50 mb-3 sm:mb-4 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
              <span className="text-2xl sm:text-3xl">💌</span>
            </div>

            <h3 className="font-serif-luxury text-xl sm:text-3xl gold-header-text mb-1.5 sm:mb-2">
              Mi Carta Real Para Ti
            </h3>
            <p className="font-handwritten text-lg sm:text-xl text-amber-200/90 mb-4 sm:mb-5">
              "No hay ninguna igual a ti..."
            </p>

            <div className="text-left font-sans-clean text-xs sm:text-base text-white/90 space-y-3 leading-relaxed bg-black/40 p-4 sm:p-5 rounded-2xl border border-amber-500/20">
              <p>
                Esta experiencia y esta canción son un recordatorio de que lo nuestro está por encima de cualquier momento difícil.
              </p>
              <p>
                Eres mi reina, mi cómplice y mi aliada en todo. Gracias por caminar conmigo, por tu lealtad y por hacer que cada día valga la pena.
              </p>
              <p className="text-right font-handwritten text-xl sm:text-2xl text-[#FFD700] pt-2">
                Con todo mi amor ✨
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
