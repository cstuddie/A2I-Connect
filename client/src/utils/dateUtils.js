// For DATE-only strings ("YYYY-MM-DD") — parse as local midnight to avoid day shift
export function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('T')[0].split('-').map(Number);
  return new Date(y, m - 1, d);
}

// For DATETIME strings from MySQL ("YYYY-MM-DD HH:MM:SS" or ISO) — treat as UTC
export function parseUTCDateTime(datetimeStr) {
  if (!datetimeStr) return null;
  const s = String(datetimeStr);
  const hasOffset = s.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(s);
  return new Date(hasOffset ? s : s.replace(' ', 'T') + 'Z');
}

export function formatLocalDate(dateStr) {
  const d = parseLocalDate(dateStr);
  return d ? d.toLocaleDateString() : 'N/A';
}

export function formatUTCDateTime(datetimeStr) {
  const d = parseUTCDateTime(datetimeStr);
  return d ? d.toLocaleString() : 'N/A';
}

export function formatUTCDate(datetimeStr) {
  const d = parseUTCDateTime(datetimeStr);
  return d ? d.toLocaleDateString() : 'N/A';
}
