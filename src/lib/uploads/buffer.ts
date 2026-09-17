export function uploadDataToBuffer(data: unknown): Buffer | null {
  if (!data) return null;
  if (Buffer.isBuffer(data)) return data;
  if (data instanceof Uint8Array) return Buffer.from(data);
  if (typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (record.type === "Buffer" && Array.isArray(record.data)) {
      return Buffer.from(record.data as number[]);
    }
    if (record.buffer instanceof ArrayBuffer) {
      return Buffer.from(record.buffer);
    }
    if (record.buffer instanceof Uint8Array) {
      return Buffer.from(record.buffer);
    }
  }
  try {
    return Buffer.from(data as Uint8Array);
  } catch {
    return null;
  }
}
