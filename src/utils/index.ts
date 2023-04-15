export const isSameDate = (date1: Date, date2: Date) =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

export const isRecommendedPost = (like: number) =>
  like >= Number(process.env.RECOMMENDED_POST_LIKE);

export const clearQueryParams = () => {
  const currentUrl = new URL(window.location.href);
  currentUrl.search = '';
  window.history.replaceState(null, '', currentUrl.href);
};

export const stringEllipsis = (str: string, len: number) => {
  if (str.length <= len) return str;
  return `${str.slice(0, len)}...`;
};
