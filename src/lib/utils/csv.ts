const FORMULA_PREFIXES = ["=", "+", "-", "@", "\t", "\r"];

function needsFormulaGuard(value: string): boolean {
  if (!value) {
    return false;
  }
  const first = value.charAt(0);
  return FORMULA_PREFIXES.includes(first);
}

function guardFormulaInjection(value: string): string {
  if (!needsFormulaGuard(value)) {
    return value;
  }
  return `'${value}`;
}

function escapeCsvField(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = guardFormulaInjection(String(value));
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export function toCsvRow(values: unknown[]): string {
  return values.map(escapeCsvField).join(",");
}

export function toCsv(headers: string[], rows: unknown[][]): string {
  const lines = [toCsvRow(headers), ...rows.map((row) => toCsvRow(row))];
  return `${lines.join("\r\n")}\r\n`;
}

export function toCsvDownload(
  filename: string,
  headers: string[],
  rows: unknown[][],
): { filename: string; content: string; mimeType: string } {
  const safeName = filename.replace(/[^\w.-]+/g, "_");
  return {
    filename: safeName.endsWith(".csv") ? safeName : `${safeName}.csv`,
    content: toCsv(headers, rows),
    mimeType: "text/csv; charset=utf-8",
  };
}
