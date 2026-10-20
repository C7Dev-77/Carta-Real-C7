export interface LyricVerse {
  id: string;
  timeSeconds: number;
  timeLabel: string;
  progress: number;
  textoEs: string;
  textoEn: string;
}

export const SONG_DURATION_SECONDS = 257.6; // 4:17 duración real del MP3

export function formatTimeLabel(seconds: number, totalSeconds = SONG_DURATION_SECONDS): string {
  const safeSec = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safeSec / 60);
  const secs = String(safeSec % 60).padStart(2, '0');

  const totalMins = Math.floor(totalSeconds / 60);
  const totalSecs = String(Math.floor(totalSeconds % 60)).padStart(2, '0');
  return `${mins}:${secs} / ${totalMins}:${totalSecs}`;
}

export function calculateProgress(seconds: number, totalSeconds = SONG_DURATION_SECONDS): number {
  const pct = (seconds / totalSeconds) * 100;
  return Number(Math.max(0, Math.min(100, pct)).toFixed(1));
}

/**
 * Letra completa sincronizada con 1 segundo de adelanto:
 * textoEs (arriba en dorado) y textoEn (abajo en blanco).
 */
export const synchronizedLyrics: LyricVerse[] = [
  {
    id: 'verse-0',
    timeSeconds: 0.0,
    timeLabel: '0:00 / 4:17',
    progress: 0.0,
    textoEs: 'Carta Real — Miky Woodz',
    textoEn: 'Royal Letter — Especially for you ✨',
  },
  {
    id: 'verse-1',
    timeSeconds: 12.2,
    timeLabel: '0:12 / 4:17',
    progress: 4.7,
    textoEs: 'Te hablo claro, no sé ni por dónde comenzar, es que mi corazón no sabe expresarse',
    textoEn: 'I’ll be honest with you, I don’t even know where to start, my heart doesn’t know how to express itself',
  },
  {
    id: 'verse-2',
    timeSeconds: 19.2,
    timeLabel: '0:19 / 4:17',
    progress: 7.5,
    textoEs: 'Tomé la iniciativa y me senté a pensar, aunque fue complicado nunca fue una opción quitarse',
    textoEn: 'I took the initiative and sat down to think, even though it was hard, giving up was never an option',
  },
  {
    id: 'verse-3',
    timeSeconds: 26.5,
    timeLabel: '0:26 / 4:17',
    progress: 10.3,
    textoEs: 'Todo fluyó, comencé a escribir lo que sentía, que tú eras mía',
    textoEn: 'Everything flowed, I began to write what I felt, that you were mine',
  },
  {
    id: 'verse-4',
    timeSeconds: 33.5,
    timeLabel: '0:33 / 4:17',
    progress: 13.0,
    textoEs: 'Estás conmigo desde que en mí nadie creía, tú eras la bendición que a Dios le pedía',
    textoEn: 'You’ve been with me since no one believed in me, you were the blessing I asked God for',
  },
  {
    id: 'verse-5',
    timeSeconds: 40.5,
    timeLabel: '0:40 / 4:17',
    progress: 15.7,
    textoEs: 'Y no hay ninguna igual a ti, ninguna se parece a ti, solo tú puedes controlarme a mí',
    textoEn: 'And there is no one like you, no one compares to you, only you can keep me under control',
  },
  {
    id: 'verse-6',
    timeSeconds: 49.0,
    timeLabel: '0:49 / 4:17',
    progress: 19.0,
    textoEs: 'Es que eres perfecta, baby, por siempre te quiero aquí',
    textoEn: 'Because you are perfect, baby, I want you right here forever',
  },
  {
    id: 'verse-7',
    timeSeconds: 54.2,
    timeLabel: '0:54 / 4:17',
    progress: 21.0,
    textoEs: 'No hay ninguna igual a ti, más que cualquier fortuna, es tu valor',
    textoEn: 'There is no one else like you, more than any fortune is your worth',
  },
  {
    id: 'verse-8',
    timeSeconds: 62.2,
    timeLabel: '1:02 / 4:17',
    progress: 24.1,
    textoEs: 'Gracias a ti conocí el amor, sin ti soy como un carro del año sin motor',
    textoEn: 'Thanks to you I discovered love, without you I’m like a brand-new car without an engine',
  },
  {
    id: 'verse-9',
    timeSeconds: 69.8,
    timeLabel: '1:09 / 4:17',
    progress: 27.1,
    textoEs: 'Yo te prometí que iba a hacer lo imposible por ti',
    textoEn: 'I promised you that I would do the impossible for you',
  },
  {
    id: 'verse-10',
    timeSeconds: 76.2,
    timeLabel: '1:16 / 4:17',
    progress: 29.6,
    textoEs: 'Nos rodea mucha maldad, por eso adentro de un cofre te metí',
    textoEn: 'So much envy surrounds us, that’s why I kept you safe inside a treasure chest',
  },
  {
    id: 'verse-11',
    timeSeconds: 82.8,
    timeLabel: '1:22 / 4:17',
    progress: 32.1,
    textoEs: 'Tú eres mi tesoro, baby, más que a mí mismo te valoro',
    textoEn: 'You are my treasure, baby, I value you even more than myself',
  },
  {
    id: 'verse-12',
    timeSeconds: 86.3,
    timeLabel: '1:26 / 4:17',
    progress: 33.5,
    textoEs: 'Por ti yo vuelo como una chiringa en el morro, ya ni camino ni corro, no te amo, te adoro',
    textoEn: 'For you I fly like a kite over El Morro, I don’t just love you, I adore you',
  },
  {
    id: 'verse-13',
    timeSeconds: 92.5,
    timeLabel: '1:32 / 4:17',
    progress: 35.9,
    textoEs: 'Y eso que no me enamoro, pero contigo es distinto, tú eres la melodía de mis coros',
    textoEn: 'And I’m not one to fall in love, but with you it’s different, you are the melody of my choruses',
  },
  {
    id: 'verse-14',
    timeSeconds: 97.0,
    timeLabel: '1:37 / 4:17',
    progress: 37.7,
    textoEs: 'Y no es un secreto que siempre pa’ dormir luces una de mis camisas',
    textoEn: 'And it’s no secret that to sleep you always wear one of my shirts',
  },
  {
    id: 'verse-15',
    timeSeconds: 104.0,
    timeLabel: '1:44 / 4:17',
    progress: 40.4,
    textoEs: 'La piel se me eriza, me alegras el día con ver tu sonrisa',
    textoEn: 'I get goosebumps on my skin, you brighten up my whole day just by seeing your smile',
  },
  {
    id: 'verse-16',
    timeSeconds: 107.5,
    timeLabel: '1:47 / 4:17',
    progress: 41.7,
    textoEs: "Y sé que este amor es real porque no está' pendiente si es que alguno avisa",
    textoEn: 'And I know this love is real because you are not waiting to see if someone warns us',
  },
  {
    id: 'verse-17',
    timeSeconds: 111.0,
    timeLabel: '1:51 / 4:17',
    progress: 43.1,
    textoEs: 'Todo fluyó, comencé a escribir lo que sentía, que tú eras mía',
    textoEn: 'Everything flowed, I began to write what I felt, that you were mine',
  },
  {
    id: 'verse-18',
    timeSeconds: 117.2,
    timeLabel: '1:57 / 4:17',
    progress: 45.5,
    textoEs: 'Estás conmigo desde que en mí nadie creía, tú eras la bendición que a Dios le pedía',
    textoEn: 'You’ve been with me since no one believed in me, you were the blessing I asked God for',
  },
  {
    id: 'verse-19',
    timeSeconds: 124.5,
    timeLabel: '2:04 / 4:17',
    progress: 48.3,
    textoEs: 'Y no hay ninguna igual a ti, ninguna se parece a ti, solo tú puedes controlarme a mí',
    textoEn: 'And there is no one like you, no one compares to you, only you can keep me under control',
  },
  {
    id: 'verse-20',
    timeSeconds: 133.0,
    timeLabel: '2:13 / 4:17',
    progress: 51.6,
    textoEs: 'Es que eres perfecta, baby, por siempre te quiero aquí',
    textoEn: 'Because you are perfect, baby, I want you right here forever',
  },
  {
    id: 'verse-21',
    timeSeconds: 138.2,
    timeLabel: '2:18 / 4:17',
    progress: 53.6,
    textoEs: 'No hay ninguna igual a ti, más que cualquier fortuna, es tu valor',
    textoEn: 'There is no one else like you, more than any fortune is your worth',
  },
  {
    id: 'verse-22',
    timeSeconds: 146.2,
    timeLabel: '2:26 / 4:17',
    progress: 56.8,
    textoEs: 'Gracias a ti conocí el amor, sin ti soy como un carro del año sin motor',
    textoEn: 'Thanks to you I discovered love, without you I’m like a brand-new car without an engine',
  },
  {
    id: 'verse-23',
    timeSeconds: 154.0,
    timeLabel: '2:34 / 4:17',
    progress: 59.8,
    textoEs: 'No le bajé, seguí escribiendo to’ lo que me salía, desahogándome en un papel',
    textoEn: 'I didn’t hold back, I kept writing everything that came out, pouring my heart out on paper',
  },
  {
    id: 'verse-24',
    timeSeconds: 160.2,
    timeLabel: '2:40 / 4:17',
    progress: 62.2,
    textoEs: 'Pero quién diría que desde el primer día me enamoré y solo guardo fotos tuyas en mi galería',
    textoEn: 'Who would have thought that from the very first day I fell in love and only keep your photos in my gallery',
  },
  {
    id: 'verse-25',
    timeSeconds: 167.8,
    timeLabel: '2:47 / 4:17',
    progress: 65.1,
    textoEs: 'Si no eres mi reina no quiero ser rey, no existe mujer que te iguale',
    textoEn: 'If you’re not my queen I don’t want to be king, there is no woman who equals you',
  },
  {
    id: 'verse-26',
    timeSeconds: 175.0,
    timeLabel: '2:55 / 4:17',
    progress: 67.9,
    textoEs: 'El motivo de esta carta es dejarte claro que te amo y darte las gracias por siempre aquí estar',
    textoEn: 'The reason for this letter is to make it clear that I love you and thank you for always being here',
  },
  {
    id: 'verse-27',
    timeSeconds: 181.5,
    timeLabel: '3:01 / 4:17',
    progress: 70.5,
    textoEs: 'Te hablo claro, no sé ni por dónde comenzar, es que mi corazón no sabe expresarse',
    textoEn: 'I’ll be honest with you, I don’t even know where to start, my heart doesn’t know how to express itself',
  },
  {
    id: 'verse-28',
    timeSeconds: 188.0,
    timeLabel: '3:08 / 4:17',
    progress: 73.0,
    textoEs: 'Tomé la iniciativa y me senté a pensar, aunque fue complicado nunca fue una opción quitarse',
    textoEn: 'I took the initiative and sat down to think, even though it was hard, giving up was never an option',
  },
  {
    id: 'verse-29',
    timeSeconds: 195.0,
    timeLabel: '3:15 / 4:17',
    progress: 75.7,
    textoEs: 'Todo fluyó, comencé a escribir lo que sentía, que tú eras mía',
    textoEn: 'Everything flowed, I began to write what I felt, that you were mine',
  },
  {
    id: 'verse-30',
    timeSeconds: 201.2,
    timeLabel: '3:21 / 4:17',
    progress: 78.1,
    textoEs: 'Estás conmigo desde que en mí nadie creía, tú eras la bendición que a Dios le pedía',
    textoEn: 'You’ve been with me since no one believed in me, you were the blessing I asked God for',
  },
  {
    id: 'verse-31',
    timeSeconds: 208.5,
    timeLabel: '3:28 / 4:17',
    progress: 80.9,
    textoEs: 'Y no hay ninguna igual a ti, ninguna se parece a ti, solo tú puedes controlarme a mí',
    textoEn: 'And there is no one like you, no one compares to you, only you can keep me under control',
  },
  {
    id: 'verse-32',
    timeSeconds: 217.0,
    timeLabel: '3:37 / 4:17',
    progress: 84.2,
    textoEs: 'Es que eres perfecta, baby, por siempre te quiero aquí',
    textoEn: 'Because you are perfect, baby, I want you right here forever',
  },
  {
    id: 'verse-33',
    timeSeconds: 222.2,
    timeLabel: '3:42 / 4:17',
    progress: 86.3,
    textoEs: 'No hay ninguna igual a ti, más que cualquier fortuna, es tu valor',
    textoEn: 'There is no one else like you, more than any fortune is your worth',
  },
  {
    id: 'verse-34',
    timeSeconds: 230.2,
    timeLabel: '3:50 / 4:17',
    progress: 89.4,
    textoEs: 'Gracias a ti conocí el amor, sin ti soy como un carro del año sin motor',
    textoEn: 'Thanks to you I discovered love, without you I’m like a brand-new car without an engine',
  },
  {
    id: 'verse-35',
    timeSeconds: 241.0,
    timeLabel: '4:01 / 4:17',
    progress: 93.6,
    textoEs: 'Esta carta es real, como lo que siento por ti...',
    textoEn: 'This letter is real, just like what I feel for you • You are my queen ✨',
  },
];
