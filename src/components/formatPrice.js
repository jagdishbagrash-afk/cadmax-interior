export const formatPrice = (price) => {
  if (!price) return "0";

  return Math.floor(Number(price)).toLocaleString("en-IN");
};