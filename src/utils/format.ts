const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

export function formatTime(ms: number): string {
  if (typeof ms !== "number" || Number.isNaN(ms) || ms <= 0) {
    return "00:00";
  }
  const hour = Math.floor(ms / HOUR);
  ms = ms % HOUR;
  const minute = Math.floor(ms / MINUTE);
  ms = ms % MINUTE;
  const second = Math.floor(ms / SECOND);
  if (hour) {
    return `${padZero(hour)}:${padZero(minute)}:${padZero(second)}`;
  }
  return `${padZero(minute)}:${padZero(second)}`;
}

function padZero(num: number, len = 2): string {
  let str = String(num);
  const threshold = Math.pow(10, len - 1);
  if (num < threshold) {
    while (String(threshold).length > str.length) {
      str = `0${num}`;
    }
  }
  return str;
}

export function formatBytes(bytes: number, fractionDigits = 2) {
  if (bytes < 1024) {
    return bytes + " bytes";
  } else if (bytes < Math.pow(1024, 2)) {
    return (bytes / Math.pow(1024, 1)).toFixed(fractionDigits) + " KB";
  } else if (bytes < Math.pow(1024, 3)) {
    return (bytes / Math.pow(1024, 2)).toFixed(fractionDigits) + " MB";
  } else if (bytes < Math.pow(1024, 4)) {
    return (bytes / Math.pow(1024, 3)).toFixed(fractionDigits) + " GB";
  } else if (bytes < Math.pow(1024, 5)) {
    return (bytes / Math.pow(1024, 4)).toFixed(fractionDigits) + " TB";
  } else if (bytes < Math.pow(1024, 6)) {
    return (bytes / Math.pow(1024, 5)).toFixed(fractionDigits) + " PB";
  } else {
    return (bytes / Math.pow(1024, 6)).toFixed(fractionDigits) + " EB";
  }
}
