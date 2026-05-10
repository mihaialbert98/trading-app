export function isMarketHours(): boolean {
  const now = new Date();
  const dayOfWeek = now.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return false;

  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const year = now.getFullYear();
  const marchDate = new Date(year, 2, 1);
  marchDate.setDate(marchDate.getDate() + ((7 - marchDate.getDay()) % 7) + 7);
  const novDate = new Date(year, 10, 1);
  novDate.setDate(novDate.getDate() + ((7 - novDate.getDay()) % 7));
  const isDST = now >= marchDate && now < novDate;
  const etOffset = isDST ? -4 : -5;
  const etDate = new Date(utcMs + etOffset * 3600000);

  const etTime = etDate.getHours() * 60 + etDate.getMinutes();
  return etTime >= 9 * 60 + 30 && etTime < 16 * 60;
}
