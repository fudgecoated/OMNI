/**
 * Normalize punctuation for student-facing outreach copy.
 * Avoids en/em dashes and similar characters that read awkwardly in short DMs.
 */
function sanitizeLine(line: string): string {
  return line
    .replace(/\s*[\u2012\u2013\u2014\u2015]\s*/g, ", ")
    .replace(/\s+-\s+/g, ", ")
    .replace(/\s+,/g, ",")
    .replace(/,\s*,+/g, ", ")
    .replace(/,\s+\./g, ".")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export function sanitizeOutreachCopy(text: string): string {
  return text
    .split("\n")
    .map((line) => sanitizeLine(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
