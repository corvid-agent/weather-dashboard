export interface MoonPhaseInfo {
  phase: string;
  illumination: number;
  emoji: string;
}

export function getMoonPhase(date: Date): MoonPhaseInfo {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let c = 0;
  let e = 0;
  let jd = 0;
  let b = 0;

  if (month < 3) {
    c = year - 1;
    e = month + 12;
  } else {
    c = year;
    e = month;
  }

  jd = Math.floor(365.25 * (c + 4716)) + Math.floor(30.6001 * (e + 1)) + day - 1524.5;
  b = jd - 2451550.1;

  const phase = ((b / 29.530588853) % 1 + 1) % 1;
  const illumination = Math.round((1 - Math.cos(phase * 2 * Math.PI)) / 2 * 100);

  if (phase < 0.0625) return { phase: 'New Moon', illumination, emoji: '🌑' };
  if (phase < 0.1875) return { phase: 'Waxing Crescent', illumination, emoji: '🌒' };
  if (phase < 0.3125) return { phase: 'First Quarter', illumination, emoji: '🌓' };
  if (phase < 0.4375) return { phase: 'Waxing Gibbous', illumination, emoji: '🌔' };
  if (phase < 0.5625) return { phase: 'Full Moon', illumination, emoji: '🌕' };
  if (phase < 0.6875) return { phase: 'Waning Gibbous', illumination, emoji: '🌖' };
  if (phase < 0.8125) return { phase: 'Last Quarter', illumination, emoji: '🌗' };
  if (phase < 0.9375) return { phase: 'Waning Crescent', illumination, emoji: '🌘' };
  return { phase: 'New Moon', illumination, emoji: '🌑' };
}
