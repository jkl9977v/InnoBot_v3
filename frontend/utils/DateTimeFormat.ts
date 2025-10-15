// 예) utils/format.ts
export const formatDate = (raw?: Date | string) => {
  if (!raw) return '-';

  const d = raw instanceof Date ? raw : new Date(raw);
  if (isNaN(d.getTime())) return '-';

  const datePart = d.toLocaleDateString('ko-KR', {
    year:  'numeric',
    month: '2-digit',
    day:   '2-digit',
  }).replace(/\./g, '-').replace(/\s+/g, '');

  const timePart = d.toLocaleTimeString('ko-KR', {
    hour:   '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return `${datePart} ${timePart}`;  // 2025-07-02 16:22
};
