export function getFallbackCover(categoryId?: number, width = 1200, height = 800) {
  const baseIds = [1011, 1027, 1031, 1043, 1050, 1067, 1074, 1084, 109, 110];
  const idx = typeof categoryId === "number" ? Math.abs(categoryId) % baseIds.length : 0;
  const id = baseIds[idx];
  return `https://picsum.photos/id/${id}/${width}/${height}.webp`;
}
