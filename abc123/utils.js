// utils.js

// ✅ Utility to compute SHA-256 checksum
export async function generateChecksum(content) {
  const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(content));
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ✅ Extract obfuscated 5-character checksum (used in filenames)
export function getObfuscatedChecksum(checksum) {
  const halfLength = Math.floor(checksum.length / 2);
  const secondHalf = checksum.slice(halfLength);
  return secondHalf.slice(0, 5).split("").reverse().join("");
}

// ✅ Format timestamp as MMDDYY_HH_MM_SS
export function getFormattedTimestamp() {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${month}${day}${year}_${hours}_${minutes}_${seconds}`;
}

// ✅ Save a blob of content as a downloadable file
export function saveFile(content, filename) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  console.log(`✅ File saved as: ${filename}`);
}

// ✅ Convert group indices to frequency sum
export function sumColumns(counts, indices) {
  return indices.reduce((sum, idx) => sum + (counts[idx] || 0), 0);
}
