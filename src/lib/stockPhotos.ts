/**
 * Temporary representative photography from Unsplash for sections without a
 * shop-uploaded image. Replace these with the shop's own photos when ready.
 * Unsplash license: https://unsplash.com/license
 */
const dateBowlPhotos = [
  '/images/stock/dates-bowl-01.jpg',
  '/images/stock/dates-bowl-02.jpg',
  '/images/stock/dates-bowl-03.jpg',
];

const datePalmGrove = '/images/stock/date-palm-grove.jpg';

const sectionPhotos: Record<string, string> = {
  hero: dateBowlPhotos[1],
  grove: datePalmGrove,
  wholesale: dateBowlPhotos[2],
  about: datePalmGrove,
};

/** Choose a stable photo per variety so cards remain consistent between visits. */
export function getStockPhoto(variant = ''): string {
  if (sectionPhotos[variant]) return sectionPhotos[variant];

  if (!variant) return dateBowlPhotos[0];

  const hash = [...variant].reduce((value, character) => value + character.charCodeAt(0), 0);
  return dateBowlPhotos[hash % dateBowlPhotos.length];
}
