import MediaAsset from "@/models/MediaAsset";

export class MediaReferenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MediaReferenceError";
  }
}

export async function incrementMediaReference(mediaId: string, amount = 1) {
  if (!mediaId || amount <= 0) {
    return null;
  }

  return MediaAsset.findByIdAndUpdate(
    mediaId,
    { $inc: { referenceCount: amount } },
    { new: true },
  ).lean();
}

export async function decrementMediaReference(mediaId: string, amount = 1) {
  if (!mediaId || amount <= 0) {
    return null;
  }

  const asset = await MediaAsset.findById(mediaId);
  if (!asset) {
    return null;
  }

  asset.referenceCount = Math.max(0, (asset.referenceCount ?? 0) - amount);
  await asset.save();
  return asset.toObject();
}

export async function syncMediaReferences(
  previousIds: string[],
  nextIds: string[],
): Promise<void> {
  const previous = new Set(previousIds.filter(Boolean));
  const next = new Set(nextIds.filter(Boolean));

  const added = [...next].filter((id) => !previous.has(id));
  const removed = [...previous].filter((id) => !next.has(id));

  await Promise.all([
    ...added.map((id) => incrementMediaReference(id)),
    ...removed.map((id) => decrementMediaReference(id)),
  ]);
}

export async function assertMediaCanBeDeleted(mediaId: string): Promise<void> {
  const asset = await MediaAsset.findById(mediaId).lean();
  if (!asset) {
    throw new MediaReferenceError("Media asset not found");
  }

  if ((asset.referenceCount ?? 0) > 0) {
    throw new MediaReferenceError(
      "This image is still in use and cannot be deleted",
    );
  }
}

export function extractMediaIdsFromImageRefs(
  images: Array<{ mediaId?: string | null } | null | undefined> | undefined,
): string[] {
  if (!images?.length) {
    return [];
  }

  return images
    .map((image) => image?.mediaId)
    .filter((id): id is string => Boolean(id));
}

export async function getMediaReferenceCount(mediaId: string): Promise<number> {
  const asset = await MediaAsset.findById(mediaId).select("referenceCount").lean();
  return asset?.referenceCount ?? 0;
}
