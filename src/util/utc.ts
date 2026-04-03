export function getUtcOffsetString(date: Date): string {
  const offsetMinutes: number = date.getTimezoneOffset();
  const sign: string = offsetMinutes >= 0 ? '-' : '+';
  const absOffsetMinutes: number = Math.abs(offsetMinutes);
  const hours: number = Math.floor(absOffsetMinutes / 60);
  const minutes: number = absOffsetMinutes % 60;

  const formattedHours: string = hours.toString().padStart(2, '0');
  const formattedMinutes: string = minutes.toString().padStart(2, '0');

  return `${sign}${formattedHours}:${formattedMinutes}`;
}
