type ChunkOptions = {
  maxChars?: number;
  overlapChars?: number;
};

export function chunkText(text: string, options: ChunkOptions = {}) {
  const maxChars = options.maxChars ?? 2000;
  const overlapChars = options.overlapChars ?? 180;
  const normalized = text.replace(/\r\n/g, "\n").trim();

  if (!normalized) return [];
  if (normalized.length <= maxChars) return [normalized];

  const chunks: string[] = [];
  let start = 0;

  while (start < normalized.length) {
    const hardEnd = Math.min(start + maxChars, normalized.length);
    const slice = normalized.slice(start, hardEnd);
    const softBreak = Math.max(slice.lastIndexOf("\n\n"), slice.lastIndexOf(". "), slice.lastIndexOf("\n"));
    const end = softBreak > maxChars * 0.55 ? start + softBreak + 1 : hardEnd;
    chunks.push(normalized.slice(start, end).trim());
    start = end >= normalized.length ? end : Math.max(end - overlapChars, start + 1);
  }

  return chunks.filter(Boolean);
}
